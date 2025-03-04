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
        `SHOW TABLES LIKE '${tableName}'``SET FOREIGN_KEY_CHECKS = 0;
          DROP TABLE IF EXISTS Attendance;
          DROP TABLE IF EXISTS StudentSubjects;
          DROP TABLE IF EXISTS Parents;
          DROP TABLE IF EXISTS Subjects;
          DROP TABLE IF EXISTS Students;
          DROP TABLE IF EXISTS Teachers;
          DROP TABLE IF EXISTS Classes;
          DROP TABLE IF EXISTS Universities;
          SET FOREIGN_KEY_CHECKS = 1;`
      );
      return tables.length > 0;
    };

    // if (!(await tableExists("Universities"))) {
    //   await connection.execute(`
    //     CREATE TABLE Universities (
    //         university_id INT AUTO_INCREMENT PRIMARY KEY,
    //         name VARCHAR(100) NOT NULL UNIQUE,
    //         email VARCHAR(100) NOT NULL,
    //         password VARCHAR(100) NOT NULL,
    //         location VARCHAR(100),
    //         established_year INT
    //     )
    //   `);
    //   console.log("✅ Universities table created.");
    // }

    // // ✅ Students Table (Depends on Universities)
    // if (!(await tableExists("Students"))) {
    //   await connection.execute(`
    //     CREATE TABLE Students (
    //         student_id INT AUTO_INCREMENT PRIMARY KEY,
    //         first_name VARCHAR(50) NOT NULL,
    //         last_name VARCHAR(50) NOT NULL,
    //         email VARCHAR(100) UNIQUE NOT NULL,
    //         password VARCHAR(100) NOT NULL,
    //         date_of_birth DATE NOT NULL,
    //         enrollment_date DATE NOT NULL,
    //         university_id INT,
    //         FOREIGN KEY (university_id) REFERENCES Universities(university_id) ON DELETE CASCADE
    //     )
    //   `);
    //   console.log("✅ Students table created.");
    // }

    // // ✅ Teachers Table (Depends on Universities)
    // if (!(await tableExists("Teachers"))) {
    //   await connection.execute(`
    //     CREATE TABLE Teachers (
    //         teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    //         first_name VARCHAR(50) NOT NULL,
    //         last_name VARCHAR(50) NOT NULL,
    //         email VARCHAR(100) UNIQUE NOT NULL,
    //         password VARCHAR(100) NOT NULL,
    //         subject VARCHAR(100),
    //         hire_date DATE NOT NULL,
    //         university_id INT,
    //         FOREIGN KEY (university_id) REFERENCES Universities(university_id) ON DELETE CASCADE
    //     )
    //   `);
    //   console.log("✅ Teachers table created.");
    // }

    // // ✅ Classes Table (Depends on Universities)
    // if (!(await tableExists("Classes"))) {
    //   await connection.execute(`
    //     CREATE TABLE Classes (
    //         class_id INT AUTO_INCREMENT PRIMARY KEY,
    //         class_name VARCHAR(100) NOT NULL,
    //         academic_year YEAR NOT NULL,
    //         branch VARCHAR(100) NOT NULL,
    //         university_id INT,
    //         FOREIGN KEY (university_id) REFERENCES Universities(university_id) ON DELETE CASCADE
    //     )
    //   `);
    //   console.log("✅ Classes table created.");
    // }

    // // ✅ Subjects Table (Depends on Classes and Teachers)
    // if (!(await tableExists("Subjects"))) {
    //   await connection.execute(`
    //     CREATE TABLE Subjects (
    //         subject_id INT AUTO_INCREMENT PRIMARY KEY,
    //         subject_name VARCHAR(100) NOT NULL,
    //         semester INT NOT NULL,
    //         class_id INT,
    //         teacher_id INT,
    //         FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE,
    //         FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id) ON DELETE SET NULL
    //     )
    //   `);
    //   console.log("✅ Subjects table created.");
    // }

    // // ✅ Updating Students Table (Adding class_id and semester)
    // }

    // // ✅ StudentSubjects Table (Many-to-Many for Students & Subjects)
    // if (!(await tableExists("StudentSubjects"))) {
    //   await connection.execute(`
    //     CREATE TABLE StudentSubjects (
    //         student_id INT,
    //         subject_id INT,
    //         semester INT NOT NULL,
    //         PRIMARY KEY (student_id, subject_id, semester),
    //         FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    //         FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE
    //     )
    //   `);
    //   console.log("✅ StudentSubjects table created.");
    // }

    // // ✅ Attendance Table (Depends on Students & Subjects)
    // if (!(await tableExists("Attendance"))) {
    //   await connection.execute(`
    //     CREATE TABLE Attendance (
    //         attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    //         student_id INT,
    //         subject_id INT,
    //         semester INT NOT NULL,
    //         date DATE NOT NULL,
    //         status ENUM('Present','Absent') NOT NULL,
    //         FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    //         FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE
    //     )
    //   `);
    //   console.log("✅ Attendance table created.");
    // }

    // // ✅ Parents Table (Depends on Students)
    // if (!(await tableExists("Parents"))) {
    //   await connection.execute(`
    //     CREATE TABLE Parents (
    //         parent_id INT AUTO_INCREMENT PRIMARY KEY,
    //         student_id INT NOT NULL,
    //         first_name VARCHAR(50) NOT NULL,
    //         last_name VARCHAR(50) NOT NULL,
    //         email VARCHAR(100) UNIQUE,
    //         phone VARCHAR(20),
    //         FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
    //     )
    //   `);
    //   console.log("✅ Parents table created.");
    // }

    // ✅ Start Server
    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Server is running at port: ${process.env.PORT}`);
    });

    console.log("Database connected");
  } catch (error) {
    console.log("MySQL connection failed !!! ", error);
  }
}
