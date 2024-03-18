import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Instance, PictureFolder } from "../cloud/s3Client"
import { pictureToSignedUrl, invalidateCache } from "../cloud/cloudFrontClient"
import sharp from "sharp";
import crypto from "crypto";
import logger from "../logger/logger";


const createGroup = (userId: string, groupName: string, groupBio?: string, groupPicture?: any) => {
    return db.tx(async t => {
        const groupData = await t.groups.addGroup({ group_name: groupName, bio: groupBio, picture: groupPicture });
        const data = await t.groups.addMember({ group_id: groupData.id, user_id: userId, admin: true, accepted: true });

        if (groupPicture) {
            const pictureKey = crypto.createHash('sha256').update(String(groupData.id)).digest('hex');
            const pictureURI = `${PictureFolder.GROUP}/${pictureKey}`;
            const buffer = await sharp(groupPicture.buffer).resize(200, 200).toBuffer();
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: pictureURI,
                Body: buffer,
                ContentType: groupPicture.mimetype,
            };

            await s3Instance.send(new PutObjectCommand(uploadParams));
            groupData.picture = pictureURI;
        }

        t.groups.updateGroup(groupData.id, { picture: groupData.picture });

        return {
            success: true,
            data: groupData,
        }
    })
}

const updateGroup = (userId: string, groupId: number, updateData: { group_name?: string, bio?: string, picture?: any }) => {
    return db.tx(async t => {
        const groupData = await t.groups.findById({ id: groupId });
        if (!groupData) {
            throw errorFactory('404', 'Group not found');
        }

        const userRequestingData = await t.groups.findMemberByGroupIdAndUserId({ user_id: userId, group_id: groupId });
        if (!userRequestingData || !userRequestingData.admin) {
            throw errorFactory('403', 'User is not an admin of this group');
        }

        const picture = updateData.picture;
        delete updateData.picture;
        let uploadParams;
        if (picture) {
            const pictureKey = crypto.createHash('sha256').update(String(groupData.id)).digest('hex');
            const pictureURI = `${PictureFolder.GROUP}/${pictureKey}`;
            const buffer = await sharp(picture.buffer).resize(200, 200).toBuffer();
            uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: pictureURI,
                Body: buffer,
                ContentType: picture.mimetype,
            };
        }

        let data;
        if (Object.keys(updateData).length > 0) {
            data = await t.groups.updateGroup(groupId, updateData);
        } else {
            data = groupData;
        }

        // Only after the group is updated, upload the picture
        if (picture) {
            await s3Instance.send(new PutObjectCommand(uploadParams));
            try {
                await invalidateCache(groupData.picture);
            } catch (err) {
                logger.error('Error invalidating cache for group picture', err);
            }
            const pictureData = await t.groups.updateGroup(groupId, { picture: uploadParams.Key });
            data.picture = pictureData.picture;
        }

        return {
            success: true,
            data
        }
    })
}

const deleteGroupPicture = (userId: string, groupId: number) => {
    return db.tx(async t => {
        const groupData = await t.groups.findById({ id: groupId });
        if (!groupData) {
            throw errorFactory('404', 'Group not found');
        } else if (!groupData.picture) {
            throw errorFactory('404', 'Group does not have a picture to delete');
        }

        const userRequestingData = await t.groups.findMemberByGroupIdAndUserId({ user_id: userId, group_id: groupId });
        if (!userRequestingData || !userRequestingData.admin) {
            throw errorFactory('403', 'User is not an admin of this group');
        }

        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: groupData.picture
        };

        // delete picture from s3 and if successful update group picture to null
        await s3Instance.send(new DeleteObjectCommand(deleteParams));
        try {
            await invalidateCache(groupData.picture);
        } catch (err) {
            logger.error('Error invalidating cache for group picture', err);
        }
        await t.groups.deleteGroupPicture(groupId);

        return {
            success: true,
            data: null
        }
    })
}

const joinGroup = (userId: string, groupName: string) => {
    return db.tx(async t => {
        const groupData = await t.groups.findGroupIdByName({ group_name: groupName });
        if (!groupData) {
            throw errorFactory('404', 'Group not found');
        }
        const members = await t.groups.findMembersByGroupId({ id: groupData.id });
        const isMember = members.some(member => member.user_id === userId);
        if (isMember) {
            throw errorFactory('23505', 'User is already a member of this group or already sent a request to join this group.');
        }

        const data = await t.groups.addMember({ group_id: groupData.id, user_id: userId, admin: false, accepted: false });

        return {
            success: true,
            data: {"group_id": data.group_id},
        }
    })
}

const updateMembership = (userId: string, userIdToBeAccepted: string, groupId: number) => {
    return db.tx(async t => {
        const userRequestingData = await t.groups.findMemberByGroupIdAndUserId({ user_id: userId, group_id: groupId });
        if (!userRequestingData || !userRequestingData.admin) {
            throw errorFactory('403', 'User is not an admin of this group');
        }

        const groupData = await t.groups.findById({ id: groupId });
        if (!groupData) {
            throw errorFactory('404', 'Group not found');
        }

        const members = await t.groups.findMembersByGroupId({ id: groupId });
        const isMember = members.some(member => member.user_id === userIdToBeAccepted);
        if (!isMember) {
            throw errorFactory('404', 'User is not a member of this group');
        }

        await t.groups.updateMembership({ user_id: userIdToBeAccepted, group_id: groupId, accepted: true });

        return {
            success: true,
            data: null
        }
    })
}

const deleteMember = (userId: string, userIdToBeDeleted: string, groupId: number) => {
    return db.task(async t => {
        //check if group exits
        const groupData = await t.groups.findById({ id: groupId });
        if (!groupData) {
            throw errorFactory('404', 'Group not found');
        }

        // check if user is a member of the group
        const members = await t.groups.findMembersByGroupId({ id: groupId });
        const isMember = members.some(member => member.user_id === userIdToBeDeleted);
        if (!isMember) {
            throw errorFactory('404', 'User is not a member of this group');
        }

        // admin is deleting a member (userId === userIdToBeDeleted - user is leaving the group himself)
        if (userId !== userIdToBeDeleted) {
            const userRequestingData = await t.groups.findMemberByGroupIdAndUserId({ user_id: userId, group_id: groupId });
            if (!userRequestingData || !userRequestingData.admin) {
                throw errorFactory('403', 'User is not an admin of this group');
            }
        }

        await t.groups.removeMember({ user_id: userIdToBeDeleted, group_id: groupId });

        return {
            success: true,
            data: null
        }
    })
}

const getGroupInfo = (groupId: number) => {
    return db.task(async t => {
        const groupData = pictureToSignedUrl(await t.groups.findById({ id: groupId }));
        if (!groupData) {
            throw errorFactory('404', 'Group not found');
        }

        // add members to groupData
        const members = await t.groups.findMembersByGroupId({ id: groupId });
        const membersData = await Promise.all(
            members.map(async member => {
                const userData = pictureToSignedUrl(await t.users.findById({ id: member.user_id }));
                return { ...userData, admin: member.admin };
            })
        );

        return {
            success: true,
            group: groupData,
            members: membersData
        };
    })
}

export default {
    createGroup,
    updateGroup,
    deleteGroupPicture,
    joinGroup,
    getGroupInfo,
    deleteMember,
    updateMembership
};
