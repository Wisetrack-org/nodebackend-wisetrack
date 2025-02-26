import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();

app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

//routes import
import aiRouter from "./routes/aI.routes.js";
import form from "./routes/submission.routes.js";
import studentLogin  from "./routes/signin.routes.js";
import signup from "./routes/signup.routes.js";
import student from "./routes/student.routes.js"

app.use("/api/aI", aiRouter);

// for submission
app.use("/api/aI/feedback", form);

// for login
app.use("/api", studentLogin)

// for signup
app.use("/api", signup);

// for student dashboard
app.use("/api/student", student);

export { app };