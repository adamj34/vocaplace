import pgPromise from 'pg-promise';
import dbConfig from './db-config.js';


const pgp = pgPromise({});

const db = pgp(dbConfig);

export default db;
