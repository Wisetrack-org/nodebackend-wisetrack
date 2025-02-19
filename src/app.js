import express from "express";
import cors from "cors";
// import cookieParser from "cookie-parser";

const app = express();

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

const corsOptions = {
    origin: "*", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type"], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers)
};

app.options('*', cors(corsOptions)); // Pre-flight request handling

// Enable CORS for all routes
app.use(cors(corsOptions));

// app.use(cors({
//     origin: '*', // Allow all origins temporarily for testing
//     credentials: true,
// }));

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(cookieParser());

//routes import
import aiRouter from "./routes/aI.routes.js";
import form from "./routes/submission.routes.js";
import studentLogin  from "./routes/signin.routes.js";
import signup from "./routes/signup.routes.js";

app.use("/api/aI", aiRouter);

// for submission
app.use("/api/aI/feedback", form);

// for login
app.use("/api", studentLogin)

// for signup
app.use("/api", signup);

export { app };
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./db/index.js";  // Import your MongoDB connection
// import aiRouter from "./routes/aI.routes.js";
// import form from "./routes/submission.routes.js";

// // Configure dotenv (now part of app.js)
// dotenv.config({
//     path: './.env'
// });

// const app = express();

// // CORS configuration
// // const corsOptions = {
// //     origin: "*", // Your frontend URL
// //     methods: ["GET", "POST", "PUT", "DELETE"],
// //     allowedHeaders: ["Content-Type"],
// //     credentials: true,
// // };

// // app.use(cors(corsOptions));

// const corsOptions = {
//     origin: "https://wisetrack.vercel.app", // Your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"], // Include 'Authorization' if needed
//     credentials: true, // Allow credentials (cookies, authorization headers)
// };

// // Enable CORS
// app.use(cors(corsOptions));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static files, if any
// app.use(express.static("public"));

// // Routes
// app.use("/api/aI", aiRouter);
// app.use("/api/aI/feedback", form);

// // Test route
// app.get('/api/aI/predict-student', (req, res) => {
//     res.json({ message: 'Predict student endpoint is working!' });
// });

// // MongoDB connection
// connectDB()
//     .then(() => {
//         console.log('MongoDB connected successfully!');
//     })
//     .catch((err) => {
//         console.error("MongoDB connection failed: ", err);
//     });

// // Export the app for Vercel to handle the serverless function
// export default app;
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./db/index.js"; // Import your MongoDB connection
// import axios from "axios";
// import { asyncHandler } from "./utils/asyncHandler.js";
// import { ApiError } from "./utils/ApiError.js";
// import { ApiResponse } from "./utils/ApiResponse.js";
// import { student } from "./models/students.models.js"; // Adjust the import based on your file structure
// import { teacher } from "./models/teacher.models.js"; // Adjust the import based on your file structure

// // Configure dotenv (now part of app.js)
// dotenv.config({
//     path: "./.env",
// });

// const app = express();

// // CORS configuration
// const corsOptions = {
//     origin: "https://wisetrack.vercel.app", // Your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"], // Include 'Authorization' if needed
//     credentials: true, // Allow credentials (cookies, authorization headers)
// };

// // Enable CORS
// app.use(cors(corsOptions));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static files, if any
// app.use(express.static("public"));

// // Predict student logic
// const predictStudent = asyncHandler(async (req, res) => {
//     const { uniqueId } = req.body; // Assuming the unique ID is passed in the request body

//     if (!uniqueId) {
//         throw new ApiError(400, "Unique ID is required.");
//     }

//     try {
//         // Retrieve student data from the database based on uniqueId
//         const std = await student.findOne({ uniqueId });

//         if (!std) {
//             throw new ApiError(404, "Student not found.");
//         }

//         // Retrieve teacher data based on student's uniqueId
//         const tea = await teacher.findOne({ uniqueId: std.uniqueId });

//         if (!tea) {
//             throw new ApiError(404, "Teacher not found.");
//         }

//         console.log(tea.attendance);

//         // Combine student and teacher data into the correct format for FastAPI
//         const combinedData = {
//             Attendance: tea.attendance,
//             Grades: tea.grades,
//             Homework_Streak: tea.streak,
//             Feedback_Behavior: tea.behaviour,
//             Weekly_Test_Scores: tea.test,
//             Attention_Test_Scores: tea.attention,
//             Ragging: std.ragging || 0,
//             Finance_Issue: std.financeIssue || 0,
//             Mental_Health_Issue: std.mentalHealth || 0,
//             Physical_Health_Issue: std.physicalHealth || 0,
//             Discrimination_Based_on_Gender:
//                 std.discriminationBasedOnGender || 0,
//             Physical_Disability: std.physicalDisability || 0,
//             Not_Interested: std.notInterested || 0,
//             Working_and_Studying: std.workingAndStudying || 0,
//             School_Is_Far: std.schoolIsFar || 0,
//         };

//         // Log combined data for debugging
//         console.log("Combined Data being sent to FastAPI:", combinedData);

//         // Send combined data to FastAPI
//         const response = await axios.post(
//             "https://66f2f44233057800a664709c--starlit-puppy-f74507.netlify.app/predict",
//             combinedData
//         );

//         // Return the prediction result
//         return res.status(200).json(response.data);
//     } catch (error) {
//         console.error("Error occurred while fetching prediction:", error); // Log full error for debugging

//         if (error.response) {
//             console.error("Response data:", error.response.data); // Log response data for further insight
//             throw new ApiError(error.response.status, error.response.data);
//         } else if (error.request) {
//             throw new ApiError(
//                 500,
//                 "No response received from prediction service."
//             );
//         } else {
//             throw new ApiError(
//                 500,
//                 `Unexpected error occurred: ${error.message}`
//             );
//         }
//     }
// });

// // Add route directly to the app
// app.post("/api/aI/predict-student", predictStudent);

// // MongoDB connection
// connectDB()
//     .then(() => {
//         console.log("MongoDB connected successfully!");
//     })
//     .catch((err) => {
//         console.error("MongoDB connection failed: ", err);
//     });

// // Export the app for Vercel to handle the serverless function
// export default app;