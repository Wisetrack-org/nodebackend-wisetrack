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

    if (!(await tableExists("Classes"))) {
      await connection.execute(`
        CREATE TABLE Classes (
            class_id INT AUTO_INCREMENT PRIMARY KEY,
            class_name VARCHAR(100) NOT NULL,
            academic_year YEAR NOT NULL,
            semester INT NOT NULL,
            university_id INT,
            FOREIGN KEY (university_id) REFERENCES Universities(university_id)
        )
    `);
    }

    if (!(await tableExists("Subjects"))) {
      await connection.execute(`
        CREATE TABLE Subjects (
            subject_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            class_id INT,
            teacher_id INT,
            FOREIGN KEY (class_id) REFERENCES Classes(class_id),
            FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id)
        )
    `);
    }

    await connection.execute(`
    ALTER TABLE Students 
    ADD COLUMN class_id INT,
    ADD FOREIGN KEY (class_id) REFERENCES Classes(class_id)
`);

    if (!(await tableExists("StudentSubjects"))) {
      await connection.execute(`
        CREATE TABLE StudentSubjects (
            student_id INT,
            subject_id INT,
            PRIMARY KEY (student_id, subject_id),
            FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
            FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
        )
    `);
    }

    if (!(await tableExists("Attendance"))) {
      await connection.execute(`
        CREATE TABLE Attendance (
            attendance_id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT,
            subject_id INT,
            date DATE NOT NULL,
            status ENUM('Present','Absent') NOT NULL,
            FOREIGN KEY (student_id) REFERENCES Students(student_id),
            FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id)
        )
    `);
    }

    if (!(await tableExists("Parents"))) {
      await connection.execute(`
        CREATE TABLE Parents (
            parent_id INT AUTO_INCREMENT PRIMARY KEY,
            student_id INT NOT NULL,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE,
            phone VARCHAR(20),
            FOREIGN KEY (student_id) REFERENCES Students(student_id)
        )
    `);
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
