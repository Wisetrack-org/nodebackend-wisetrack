// import { student } from "../models/students.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { doHashValidation } from "../utils/hashing.js";
import jwt from "jsonwebtoken";
import { connectDB } from "../mysql/index.js";

// for student
const studentLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const connection = await connectDB();

  try {
    const [students] = await connection.execute(
      "SELECT student_id, email, password FROM Students WHERE email = ?",
      [email]
    );

    if (students.length === 0) {
      throw new ApiError(404, "Student's email not found");
    }

    const student = students[0];

    // verify password
    const passwordMatch = await doHashValidation(password, student.password);

    if (!passwordMatch) {
      throw new ApiError(401, "Invalid password");
    }

    // jwt
    const token = jwt.sign(
      { studentId: student.student_id, userType: "students" },
      process.env.TOKEN_SECRET || "your_secret_key",
      { expiresIn: "8h" }
    );

    // cookie
    res.cookie("Authorization", "Bearer " + token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ...student,
          token: token,
        },
        "Logged in successfully"
      )
    );
  } catch (error) {
    console.error("MySQL Error:", error);
    throw new ApiError(500, "Internal Server Error");
  } finally {
    connection.end();
  }
});

// for teacher
const teacherLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const connection = await connectDB();

  try {
    const [teachers] = await connection.execute(
      "SELECT teacher_id, email, password FROM Teachers WHERE email = ?",
      [email]
    );

    if (teachers.length === 0) {
      throw new ApiError(404, "Teacher email not found");
    }

    const teacher = teachers[0];

    // verify password
    const passwordMatch = await doHashValidation(password, teacher.password);

    if (!passwordMatch) {
      throw new ApiError(401, "Invalid password");
    }

    // jwt
    const token = jwt.sign(
      { teacherId: teacher.teacher_id, userType: "teachers" }, // Add userType
      process.env.TOKEN_SECRET || "your_secret_key",
      { expiresIn: "8h" }
    );

    // cookie
    res.cookie("Authorization", "Bearer " + token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, teacher, "Logged in successfully"));
  } catch (error) {
    console.error("MySQL Error:", error);
    throw new ApiError(500, "Internal Server Error");
  } finally {
    connection.end();
  }
});

// for university
const universityLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const connection = await connectDB();

  try {
    const [universities] = await connection.execute(
      "SELECT university_id, email, password FROM Universities WHERE email = ?",
      [email]
    );

    if (universities.length === 0) {
      throw new ApiError(404, "University email not found");
    }

    const university = universities[0];

    // verify password
    const passwordMatch = await doHashValidation(password, university.password);

    if (!passwordMatch) {
      throw new ApiError(401, "Invalid password");
    }

    // jwt
    const token = jwt.sign(
      { universityId: university.university_id, userType: "universities" },
      process.env.TOKEN_SECRET || "your_secret_key",
      { expiresIn: "8h" }
    );

    // cookie
    res.cookie("Authorization", "Bearer " + token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, university, "Logged in successfully"));
  } catch (error) {
    console.error("MySQL Error:", error);
    throw new ApiError(500, "Internal Server Error");
  } finally {
    connection.end();
  }
});

// for parents
const parentLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const connection = await connectDB();

  try {
    const [studentResult] = await connection.execute(
      "SELECT student_id, first_name, last_name, email, password FROM Students WHERE email = ?",
      [email]
    );

    if (studentResult.length === 0) {
      throw new ApiError(401, "Invalid email or password");
    }

    const student = studentResult[0];

    if (!student.password) {
      throw new ApiError(500, "Password not found for this student");
    }

    // jwt
    const token = jwt.sign(
      { studentId: student.student_id, userType: "parents" },
      process.env.TOKEN_SECRET || "your_secret_key",
      { expiresIn: "8h" }
    );

    // cookie
    res.cookie("Authorization", "Bearer " + token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, student, "Logged in successfully"));
  } catch (error) {
    console.error("Login error:", error);
    throw new ApiError(500, "Login failed");
  } finally {
    await connection.end();
  }
});

export { studentLogin, teacherLogin, universityLogin, parentLogin };
