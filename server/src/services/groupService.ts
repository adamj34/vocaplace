import { pictureToSignedUrl } from "../cloud/s3Client";
import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory.js";


const createGroup = async (userId: string, groupName:string, groupBio?: string, groupPicture?: string) => {
    return await db.tx(async t => {
        const groupData = await t.groups.addGroup({group_name: groupName, bio: groupBio, picture: groupPicture});
        const data = await t.groups.addMember({group_id: groupData.id, user_id: userId, admin: true, accepted: true});

        return {
            success: true,
            data: groupData,
        }
    })
}

const joinGroup = async (userId: string, groupName: string) => {
    return await db.tx(async t => {
        const groupData = await t.groups.findGroupIdByName({group_name: groupName});
        if (!groupData) {
            throw errorFactory('404', 'Group not found');
        }
        const members = await t.groups.findMembersByGroupId({id: groupData.id});
        const isMember = members.some(member => member.user_id === userId);
        if (isMember) {
            throw errorFactory('23505', 'User is already a member of this group or already sent a request to join this group.');
        }

        const data = await t.groups.addMember({group_id: groupData.id, user_id: userId, admin: false, accepted: false});
        
        return {
            success: true,
            data: data.group_id,
        }
    })
}

const updateMembership = async (userId: string, userIdToBeAccepted: string, groupId: number) => {
    return await db.tx(async t => {
        const userRequestingData = await t.groups.findMemberByGroupIdAndUserId({user_id: userId, group_id: groupId});
        if (!userRequestingData || !userRequestingData.admin) {
            throw errorFactory('403', 'User is not an admin of this group');
        }

        const groupData = await t.groups.findById({id: groupId});
        if (!groupData) {
            throw errorFactory('404', 'Group not found');
        }

        const members = await t.groups.findMembersByGroupId({id: groupId});
        const isMember = members.some(member => member.user_id === userIdToBeAccepted);
        if (!isMember) {
            throw errorFactory('404', 'User is not a member of this group');
        }

        await t.groups.updateMembership({user_id: userIdToBeAccepted, group_id: groupId, accepted: true});
        
        return {
            success: true,
            data: null
        }
    })
}

const deleteMember = async (userId: string, userIdtoBeDeleted: string, groupId: number) => {
    return await db.task(async t => {
        //check if group exits
        const groupData = await t.groups.findById({id: groupId});
        if (!groupData) {
            throw errorFactory('404', 'Group not found');
        }

        // check if user is a member of the group
        const members = await t.groups.findMembersByGroupId({id: groupId});
        const isMember = members.some(member => member.user_id === userIdtoBeDeleted);
        if (!isMember) {
            throw errorFactory('404', 'User is not a member of this group');
        }

        // admin is deleting a member
        if (userId !== userIdtoBeDeleted) {
            const userRequestingData = await t.groups.findMemberByGroupIdAndUserId({user_id: userId, group_id: groupId});
            if (!userRequestingData || !userRequestingData.admin) {
                throw errorFactory('403', 'User is not an admin of this group');
            }
        }

        await t.groups.removeMember({user_id: userIdtoBeDeleted, group_id: groupId});
        
        return {
            success: true,
            data: null
        }
    })
}

const getGroupInfo = async (groupId: number) => {
    return await db.task(async t => {
        const groupData = await t.groups.findById({id: groupId});
        if (!groupData) {
            throw errorFactory('404', 'Group not found');
        }

        // add members to groupData
        const members = await t.groups.findMembersByGroupId({id: groupId});
        const membersData = await Promise.all(
            members.map(async member => {
                const userData = await pictureToSignedUrl(await t.users.findById({id: member.user_id}));
                return {...userData, admin: member.admin};
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
    joinGroup,
    getGroupInfo,
    deleteMember,
    updateMembership
};
