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

    const tableExists = async (tableName) => {
      const [tables] = await connection.execute(
        `SHOW TABLES LIKE '${tableName}'`
      );
      return tables.length > 0;
    };

    // universities table
    if (!(await tableExists("Universities"))) {
      await connection.execute(`
        CREATE TABLE Universities (
            university_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(100) NOT NULL,
            location VARCHAR(100),
            established_year INT
        )
    `);
      console.log("Universities table created.");
    } else {
      console.log("Universities table already exists.");
    }
    // student table
    if (!(await tableExists("Students"))) {
      await connection.execute(`
        CREATE TABLE Students (
            student_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            date_of_birth DATE NOT NULL,
            enrollment_date DATE NOT NULL,
            university_id INT,
            FOREIGN KEY (university_id) REFERENCES Universities(university_id)
        )
    `);
      console.log("Students table created.");
    } else {
      console.log("Students table already exists.");
    }

    // teacher table
    if (!(await tableExists("Teachers"))) {
      await connection.execute(`
        CREATE TABLE Teachers (
            teacher_id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            subject VARCHAR(100),
            hire_date DATE NOT NULL,
            university_id INT,
            FOREIGN KEY (university_id) REFERENCES Universities(university_id)
        )
    `);
      console.log("Teachers table created.");
    } else {
      console.log("Teachers table already exists.");
    }

    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Server is running at port: ${process.env.PORT}`);
    });

    console.log("Database connected");
  } catch (error) {
    console.log("MySQL connection failed !!! ", error);
  }
}

startServer();
