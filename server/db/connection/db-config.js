const dbConfig = {
    "host": process.env.DB_SERVICE_NAME,
    "port": process.env.DB_PORT,
    "database": process.env.DB_NAME,
    "user": process.env.DB_USER,
    "password": process.env.DB_PASSWORD
}

console.log(dbConfig);
export default dbConfig;