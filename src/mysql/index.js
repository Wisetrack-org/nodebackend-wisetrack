import mysql from "mysql2/promise";

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: `${process.env.HOST}`,
            user: "root",
            password: `${process.env.PASSWORD}`,
            database: `${process.env.DATABASE}`,
            port: `${process.env.PORT}`
        });
        return connection; 
    } catch (error) {
        console.error("Database connection error:", error);
        throw error; 
    }
};

export { connectDB };