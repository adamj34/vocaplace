
async function testConnection(db) {
    try {
        const conn = await db.connect(); // try to connect
        conn.done();                     // success, release connection
        console.log(`Connection to database successful, PG server version: ${conn.client.serverVersion}`);
    } catch (err) {
        console.error(`Error connecting to database: ${err}`);
    }
}

export default testConnection;