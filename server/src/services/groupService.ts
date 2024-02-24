import { db, pgp } from "../db/connection/db.js";
import { errorFactory } from "../utils/errorFactory.js";


const createGroup = async (userId: string, groupName:string, groupBio?: string, groupPicture?: string) => {
    return await db.tx(async t => {
        const groupData = await t.groups.addGroup({group_name: groupName, bio: groupBio, picture: groupPicture});
        const data = await t.groups.addMember({group_id: groupData.id, user_id: userId, admin: true});

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
            throw errorFactory('23505', 'User is already a member of this group');
        }

        const data = await t.groups.addMember({group_id: groupData.id, user_id: userId, admin: false});
        
        return {
            success: true,
            data: data.group_id,
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
                const userData = await t.users.findById({id: member.user_id});
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
    getGroupInfo
};
