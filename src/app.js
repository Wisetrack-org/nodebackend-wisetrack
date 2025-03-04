import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-wisetrack.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An error occurred";

  res.status(statusCode).json({
    success: false,
    message: message,
    statusCode: statusCode,
  });
});

//routes import
import aiRouter from "./routes/aI.routes.js";
import form from "./routes/submission.routes.js";
import studentLogin from "./routes/signin.routes.js";
import signup from "./routes/signup.routes.js";
import student from "./routes/student.routes.js";
import university from "./routes/university.routes.js"
import parent from "./routes/parents.routes.js"

app.use("/api/aI", aiRouter);

// for submission
app.use("/api/aI/feedback", form);

// for login
app.use("/api", studentLogin);

// for signup
app.use("/api", signup);

// for student dashboard
app.use("/api/student", student);

// for parent
app.use("/api/parent", parent)

// for teacher


// for university
app.use("/api/university", university)

export { app };