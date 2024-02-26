import { db, pgp } from "../db/connection/db";
import { errorFactory } from "../utils/errorFactory.js";
import { getPreSignedUrl } from "../cloud/s3Client.js"


const searchGroupsAndUsers = async (searchPhrase: string) => {
    return await db.task(async t => {
        const matchedUsers = await t.users.searchByUsername({searchPhrase});
        matchedUsers.forEach(user => {
            if (user.picture) {
                user.picture = getPreSignedUrl(user.picture);
            }
        })

        const matchedGroups = await t.groups.searchByGroupname({searchPhrase});
        // matchedGroups.forEach(group => {
        //     if (group.picture) {
        //         group.picture = getPreSignedUrl(group.picture);
        //     }
        // }

        return {
            success: true,
            data: {matchedUsers, matchedGroups}
        }
    })
}

export default {
    searchGroupsAndUsers
};
