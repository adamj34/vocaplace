import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory";


const searchGroupsAndUsers = async (searchPhrase: string) => {
    return await db.task(async t => {
        const matchedUsers = await t.users.searchByUsername({searchPhrase});
        const matchedGroups = await t.groups.searchByGroupname({searchPhrase});

        return {
            success: true,
            data: {matchedUsers, matchedGroups}
        }
    })
}

export default {
    searchGroupsAndUsers
};
