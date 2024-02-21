import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory";


const getUserData = async (userId: string, username: string) => {
    try {
        const data = await db.users.findById({id: userId});
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

const getVisitedUserData = async (userId: string, visitedUserId: string) => {
    return await db.task(async () => {
        const visitedUser = await db.users.findById({id: visitedUserId});
        const visitedUserFriends = await db.user_relationships.findFriendsByUserId({id: visitedUserId});
        const visitedUserGroups = await db.users.findGroupsByUserId({id: visitedUserId});
        const userRelationship = await db.user_relationships.checkRelationship({user1_id: userId, user2_id: visitedUserId});
        return {
            success: true,
            user: visitedUser,
            friends: visitedUserFriends,
            groups: visitedUserGroups,
            relationship: userRelationship ? userRelationship.relationship : null
        }
    })
}

const deleteUser = async (userId: string) => {
    const deletedUser = await db.users.delete({id: userId});
    return {
        success: true,
        data: deletedUser
    };
}

const deleteProfilePicture = async (userId: string) => {
    await db.users.deleteProfilePicture({id: userId});
    return {
        success: true,
        data: null
    };
}

const updateUser = async (userData: {id: string, username?: string, bio?: string, private_profile?: boolean, picture?: string,}) => {
    const data = await db.users.update(userData);

    return {
        success: true,
        data
    };
}

const updatePoints = async (userId: string, points: number) => {
    const data = await db.users.updatePoints({id: userId, points});

    return {
        success: true,
        data
    };
}

const getFriendsData = async (userId: string) => {
    const friendsData = await db.user_relationships.findFriendsByUserId({id: userId});
    friendsData.sort((a, b) => b.points - a.points);

    return {
        success: true,
        data: friendsData
    };
}

const getGroupsData = async (userId: string) => {
    const groupsData = await db.users.findGroupsByUserId({id: userId});

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
