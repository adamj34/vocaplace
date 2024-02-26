import queries from "../sql/sqlQueries.js";
import {IDatabase, IMain} from 'pg-promise';
import { getPreSignedUrl } from "../../cloud/s3Client.js"

class UsersRepository {
    db: IDatabase<any>;
    pgp: IMain;
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    add(values: { id: string; username: string; }) {
        return this.db.one(queries.users.add, values);
    }

    delete(value: { id: string; }) {
        return this.db.one(queries.users.delete, value);
    }

    deleteProfilePicture(value: { id: string; }) {
        return this.db.none(`
        UPDATE
            users
        SET
            picture = NULL
        WHERE id = $<id>`
        , value);
    }

    update(values: { id: string; bio?: string; username?: string; private_profile?: boolean; picture?: string; }) {
        return this.db.one(queries.users.update, {
            id: values.id || null,
            bio: values.bio || null,
            username: values.username || null,
            private_profile: values.private_profile === undefined ? null : values.private_profile,
            picture: values.picture || null
        });
    }

    updatePoints(values: { id: string; points: number; }) {
        return this.db.one(`
        UPDATE
            users
        SET points = points + $<points>
        WHERE id = $<id>
        RETURNING points
        `, values);
    }

    async findById(value: { id: string; }) {
        const user = await this.db.one(queries.users.find, value);
        // If the user has a picture, get a signed url for it
        if (user.picture) {
            user.picture = await getPreSignedUrl(user.picture);
        }
        return user;
    }

    findGroupsByUserId(value: { id: string; }) {
        return this.db.any(`
        SELECT
            g.*,
            gp.admin
        FROM
            group_membership gp
        JOIN 
            groups g ON g.id = gp.group_id
        WHERE user_id = $<id>
        `, value);
    }

    searchByUsername(value: { searchPhrase: string; }) {
        return this.db.any(`
        SELECT
            id,
            username,
            picture
        FROM
            users
        WHERE username ILIKE $1
        `,  ['%' + value.searchPhrase + '%']);
    } 
}

export default UsersRepository;
