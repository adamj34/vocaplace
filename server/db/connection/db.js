import pgPromise from 'pg-promise';
import dbConfig from './db-config.js';
import QuestionsRepository from "../repos/questions.js"


const initOptions = {
    query(e) {
        console.log('QUERY:', e.query);
    },
    extend(obj) {

        obj.questions = new QuestionsRepository(obj, pgp);
    }
};

const pgp = pgPromise(initOptions);

const db = pgp(dbConfig);  // db - singleton instance of the database connection

export default db;
