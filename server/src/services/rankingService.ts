import { db, pgp } from "../db/connection/db.js";
import { errorFactory } from "../utils/errorFactory.js";


const getTopUsersRanking = async () => {
    const ranking = await db.rankings.getTopUsers();
    return {
        success: true,
        data: ranking
    };
};

const getFriendsRanking = async (userId: string) => {
    return await db.task(async t => {
        const friendsData = await t.user_relationships.findFriendsByUserId({id: userId});
        const userData = await t.users.findById({id: userId});
        friendsData.push(userData);
        friendsData.sort((a, b) => b.points - a.points);

        return {
            success: true,
            data: friendsData
        }
    })
};

export default {
    getTopUsersRanking,
    getFriendsRanking
};
