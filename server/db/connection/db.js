import pgPromise from 'pg-promise';
import dbConfig from './db-config.js';
import QuestionsRepository from "../repos/questions.js"
import UnitsRepository from "../repos/units.js"
import TopicsRepository from "../repos/topics.js"
import UsersRepository from '../repos/users.js';
import ProfilePicturesRepository from '../repos/profile_pictures.js';
import UserRelationshipsRepository from '../repos/user_relationships.js';


const initOptions = {
    query(e) {
        console.log('QUERY:', e.query);
    },
    extend(obj) {
        obj.users = new UsersRepository(obj, pgp);
        obj.units = new UnitsRepository(obj, pgp);
        obj.topics = new TopicsRepository(obj, pgp);
        obj.questions = new QuestionsRepository(obj, pgp);
        obj.profile_pictures = new ProfilePicturesRepository(obj, pgp);
        obj.user_relationships = new UserRelationshipsRepository(obj, pgp);
    }
};

const pgp = pgPromise(initOptions);

const db = pgp(dbConfig);  // db - singleton instance of the database connection

export {pgp, db};
