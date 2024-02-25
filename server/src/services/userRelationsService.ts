import { db, pgp } from "../db/connection/db";
import { errorFactory, FrienshipConstraintError } from "../utils/errorFactory.js";


enum RelationshipState {
    PENDING_USER1_USER2 = 'pending_user1_user2',
    PENDING_USER2_USER1 = 'pending_user2_user1',
    FRIENDS = 'friends',
}

const sendFriendRequest = async (userId: string, friendId: string) => {
    return await db.tx(async t => {
        // adhere to the constraint that user1_id < user2_id
        if (userId === friendId) {
            throw new FrienshipConstraintError('Cannot add yourself as a friend');
        } else {
            let users;
            if (userId < friendId) {
                users = {
                    user1_id: userId,
                    user2_id: friendId,
                    relationship: RelationshipState.PENDING_USER1_USER2
                };
            } else {
                users = {
                    user1_id: friendId,
                    user2_id: userId,
                    relationship: RelationshipState.PENDING_USER2_USER1
                };
            }

            const data = await t.user_relationships.checkRelationship(users);
            // if relationship does not exist
            if (!data) {
                const data = await t.user_relationships.addFriend(users);
                return {
                    success: true,
                    data
                };
            } else {
                throw new FrienshipConstraintError('You are already friends or have a pending request with this user');
            }
        }
    })
}

const acceptFriendRequest = async (userId: string, friendId: string) => {
    if (userId === friendId) {
        throw new FrienshipConstraintError('Cannot add yourself as a friend');
    }

    let users;
    if (userId < friendId) {
        users = {user1_id: userId, user2_id: friendId};
    } else {
        users = {user1_id: friendId, user2_id: userId};
    }
    users.relationship = RelationshipState.FRIENDS;

    const data = await db.user_relationships.acceptFriend(users)
    
    return {
        success: true,
        data
    };
}

const checkRelationship = async (userId: string, friendId: string) => {
    if (userId === friendId) {
        throw new FrienshipConstraintError('Cannot check relationship with yourself');
    } else {
        let users;
        if (userId < friendId) {
            users = {user1_id: userId, user2_id: friendId};
        } else {
            users = {user1_id: friendId, user2_id: userId};
        }

        let data = await db.user_relationships.checkRelationship(users);
        if (!data) {
            data = users;
            data.relationship = null; 
        }

        return {
            success: true,
            data
        }
    }
}

const checkPendingRequests = async (userId: string) => {
    return await db.task(async t => {
        const pendingRequests = await t.user_relationships.getPendingRequests({id : userId});
        const data = await Promise.all(pendingRequests.map(user => t.users.findById({id: user.user_id})));

        return {
            success: true,
            data
        };
    })
}

const deleteFriend = async (userId: string, friendId: string) => {
    let users;
    if (userId < friendId) {
        users = {user1_id: userId, user2_id: friendId};
    } else {
        users = {user1_id: friendId, user2_id: userId};
    }
    const data = await db.user_relationships.deleteFriend(users)

    return {
        success: true,
        data
    };
}


export default {
    sendFriendRequest,
    acceptFriendRequest,
    checkRelationship,
    checkPendingRequests,
    deleteFriend
};
