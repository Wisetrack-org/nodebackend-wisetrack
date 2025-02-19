import { signupSchema } from "../middlewares/validator.cjs";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { doHash } from "../utils/hashing.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { connectDB } from "../mysql/index.js"; 

const signup = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { error, value } = signupSchema.validate({ email, password });

    if (error) {
        throw new ApiError(400, "Provide a valid email or password");
    }

    const hashedPassword = await doHash(password, 12);

    const connection = await connectDB();

    try {
        const [existingUsers] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            throw new ApiError(409, "User with email already exists");
        }

        // new user
        await connection.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );

        return res
            .status(201)
            .json(new ApiResponse(200, "User registered Successfully"));
    } catch (err) {
        console.error("MySQL Error:", err);
        throw new ApiError(500, "Internal Server Error");
    } finally {
        connection.end();
    }
});

export { signup };
