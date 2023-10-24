import pgPromise from 'pg-promise';
import dbConfig from './db-config.js';


const pgp = pgPromise({});

const db = pgp(dbConfig);  // db - singleton instance of the database connection

export default db;
