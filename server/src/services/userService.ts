import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory.js";
import { s3Instance, pictureToSignedUrl, PictureFolder } from "../cloud/s3Client.js"
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import crypto from "crypto";


const getUserData = async (userId: string, username: string) => {
    try {
        const data = await pictureToSignedUrl(await db.users.findById({id: userId}));

        return {
            success: true,
            data
        };
    } catch (err) {
        // If no data is returned, add the user to the database
        if (err.code === pgp.errors.queryResultErrorCode.noData) {
            const data = await db.users.add({id: userId, username: username});
            data.picture = null;
            return {
                success: true,
                data
            };
        } else {
            throw errorFactory('500', 'Error retrieving user data');
        }
    }
}

const getVisitedUserData = (userId: string, visitedUserId: string) => {
    return db.task(async t => {
        const visitedUser = await pictureToSignedUrl(await t.users.findById({id: visitedUserId}));
        const visitedUserFriends = await pictureToSignedUrl(await t.user_relationships.findFriendsByUserId({id: visitedUserId}));
        const visitedUserGroups = await pictureToSignedUrl(await t.users.findGroupsByUserId({id: visitedUserId}));
        const userRelationship = await t.user_relationships.checkRelationship({user1_id: userId, user2_id: visitedUserId});
        return {
            success: true,
            user: visitedUser,
            friends: visitedUserFriends,
            groups: visitedUserGroups,
            relationship: userRelationship
        }
    })
}

const deleteUser = async (userId: string) => {
    const deletedUser = await db.users.delete({id: userId});
    if (deletedUser.picture) {
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: deletedUser.picture
        };
        await s3Instance.send(new DeleteObjectCommand(deleteParams));
    }

    return {
        success: true,
        data: deletedUser
    };
}

const deleteProfilePicture = async (userId: string) => {
    const user = await db.users.findById({id: userId});
    if (!user.picture) {
        throw errorFactory('404', 'No profile picture to delete found');
    }

    const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: user.picture
    };

    // delete from s3 and if successful from db
    await s3Instance.send(new DeleteObjectCommand(deleteParams));
    await db.users.deleteProfilePicture({id: userId});

    return {
        success: true,
        data: null
    };
}

const updateUser = (userId: string, updateData: {username?: string, bio?: string, private_profile?: boolean, picture?: any}) => {
    return db.tx(async t => {
        const userData = await t.users.findById({id: userId});
        if (!userData) {
            throw errorFactory('404', 'User not found');
        }

        const picture = updateData.picture;
        delete updateData.picture;
        let uploadParams;
        if (picture) {
            const pictureKey = crypto.createHash('sha256').update(userId).digest('hex');
            const pictureURI = `${PictureFolder.PROFILE}/${pictureKey}`;
            const buffer = await sharp(picture.buffer).resize(200, 200).toBuffer();
            uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: pictureURI,
                Body: buffer,
                ContentType: picture.mimetype,
            };
        } 

        const data = await t.users.updateUser(userId, updateData);

        // Only after the user is updated, upload the picture
        if (picture) {
            await s3Instance.send(new PutObjectCommand(uploadParams));
            const pictureData = await t.users.updateUser(userId, { picture: uploadParams.Key });
            data.picture = pictureData.picture;
        }

        return {
            success: true,
            data
        }
    })
}

const updatePoints = async (userId: string, points: number) => {
    const data = await db.users.updatePoints({id: userId, points});

    return {
        success: true,
        data
    };
}

const getFriendsData = async (userId: string) => {
    const friendsData = await pictureToSignedUrl(await db.user_relationships.findFriendsByUserId({id: userId}));
    friendsData.sort((a, b) => b.points - a.points);

    return {
        success: true,
        data: friendsData
    };
}

const getGroupsData = async (userId: string) => {
    const groupsData = await pictureToSignedUrl(await db.users.findGroupsByUserId({id: userId}));

    return {
        success: true,
        data: groupsData
    };
}

export default {
    getUserData,
    deleteUser,
    deleteProfilePicture,
    updateUser,
    updatePoints,
    getFriendsData,
    getGroupsData,
    getVisitedUserData
};
