import { app } from "./src/app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/mysql/index.js";

dotenv.config({
    path: "./.env",
});

// PORT = 3000;

app.get("/", (req, res) => {
    res.send("Atleast working😭");
});
app.get("/api/aI/predict-student", (req, res) => {
    res.send("No 404😭");
});

async function startServer() {
    try {
        const connection = await connectDB();

        // Check if the users table exists
        const [tables] = await connection.execute("SHOW TABLES LIKE 'users'");

        if (tables.length === 0) {
            // Create the users table if it doesn't exist
            await connection.execute(`
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log("Users table created.");
        } else {
            console.log("Users table already exists.");
        }
        app.listen(process.env.PORT, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        });
        console.log("Database connected");
    } catch (error) {
        console.log("MySQL connection failed !!! ", error);
    }
}

startServer();
