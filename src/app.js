import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



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

app.use(cookieParser());

// Enable CORS for all routes
app.use(cors(corsOptions));

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(cookieParser());

//routes import
import aiRouter from "./routes/aI.routes.js";
import form from "./routes/submission.routes.js";
import studentLogin  from "./routes/signin.routes.js";
import signup from "./routes/signup.routes.js";
// import protectedRoute from "./routes/student.routes.js"

app.use("/api/aI", aiRouter);

// for submission
app.use("/api/aI/feedback", form);

// for login
app.use("/api", studentLogin)

// for signup
app.use("/api", signup);

// for protected routes testing
// app.use("/api", protectedRoute)

export { app };