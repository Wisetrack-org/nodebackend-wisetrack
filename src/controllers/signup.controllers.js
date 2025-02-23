import { signupSchema } from "../middlewares/validator.cjs";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { doHash } from "../utils/hashing.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { connectDB } from "../mysql/index.js"; 

const createUser = async (connection, tableName, email, hashedPassword, additionalFields) => {
    const [existingUsers] = await connection.execute(
        `SELECT * FROM ${tableName} WHERE email = ?`,
        [email]
    );

    if (existingUsers.length > 0) {
        throw new ApiError(409, "User with email already exists");
    }

    const fields = Object.keys(additionalFields).join(", ");
    const placeholders = Object.keys(additionalFields).map(() => "?").join(", ");
    
    await connection.execute(
        `INSERT INTO ${tableName} (email, password, ${fields}) VALUES (?, ?, ${placeholders})`,
        [email, hashedPassword, ...Object.values(additionalFields)]
    );
};

const studentSignup = asyncHandler(async (req, res) => {
    const { email, password, first_name, last_name, date_of_birth, enrollment_date, university_id } = req.body;

    const { error } = signupSchema.validate({ email, password });

    if (error) {
        throw new ApiError(400, "Provide a valid email or password");
    }

    const hashedPassword = await doHash(password, 12);
    const connection = await connectDB();

    try {
        await createUser(connection, 'Students', email, hashedPassword, {
            first_name,
            last_name,
            date_of_birth,
            enrollment_date,
            university_id
        });

        return res.status(201).json(new ApiResponse(200, "Student registered successfully"));
    } catch (err) {
        console.error("MySQL Error:", err);
        throw new ApiError(500, "Internal Server Error");
    } finally {
        connection.end();
    }
});

const teacherSignup = asyncHandler(async (req, res) => {
    const { email, password, first_name, last_name, subject, hire_date, university_id } = req.body;

    const { error } = signupSchema.validate({ email, password });

    if (error) {
        throw new ApiError(400, "Provide a valid email or password");
    }

    const hashedPassword = await doHash(password, 12);
    const connection = await connectDB();

    try {
        await createUser(connection, 'Teachers', email, hashedPassword, {
            first_name,
            last_name,
            subject,
            hire_date,
            university_id
        });

        return res.status(201).json(new ApiResponse(200, "Teacher registered successfully"));
    } catch (err) {
        console.error("MySQL Error:", err);
        throw new ApiError(500, "Internal Server Error");
    } finally {
        connection.end();
    }
});

const universitySignup = asyncHandler(async (req, res) => {
    const { email, password, name, location, established_year } = req.body;

    const { error } = signupSchema.validate({ email, password });

    if (error) {
        throw new ApiError(400, "Provide a valid email or password");
    }

    const hashedPassword = await doHash(password, 12);
    const connection = await connectDB();

    try {
        await createUser(connection, 'Universities', email, hashedPassword, {
            name,
            location,
            established_year
        });

        return res.status(201).json(new ApiResponse(200, "University registered successfully"));
    } catch (err) {
        console.error("MySQL Error:", err);
        throw new ApiError(500, "Internal Server Error");
    } finally {
        connection.end();
    }
});

export { studentSignup, teacherSignup, universitySignup };
