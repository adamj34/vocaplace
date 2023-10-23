import pgPromise from 'pg-promise';


class Database {

    constructor() {
        const pgp = pgPromise({});
        this.db = pgp(
            `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVICE_NAME}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        );
    }

    async testConnection() {
        const conn = await this.db.connect(); // try to connect
        conn.done(); // success, release connection
        console.log(`Connection to database successful, server version: ${conn.client.serverVersion}`);
    }

    async getConection() {
        return this.db;
    }
}

export default new Database();
