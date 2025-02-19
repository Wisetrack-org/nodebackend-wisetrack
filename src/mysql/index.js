import mysql from "mysql2/promise";

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "root",
            database: "wisetrack"
        });
        return connection; 
    } catch (error) {
        console.error("Database connection error:", error);
        throw error; 
    }
}; 

export { connectDB };