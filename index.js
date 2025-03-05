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

    if (!(await tableExists("TeacherClasses"))) {
      await connection.execute(`CREATE TABLE TeacherClasses (
  assignment_id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id INT NOT NULL,
  class_id INT NOT NULL,
  academic_year YEAR NOT NULL,
  branch VARCHAR(50) NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id),
  FOREIGN KEY (class_id) REFERENCES Classes(class_id),
  UNIQUE KEY unique_assignment (teacher_id, class_id, academic_year)
);`);
    }

    // start Server
    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Server is running at port: ${process.env.PORT}`);
    });

    console.log("Database connected");
  } catch (error) {
    console.log("MySQL connection failed !!! ", error);
  }
}

startServer();
