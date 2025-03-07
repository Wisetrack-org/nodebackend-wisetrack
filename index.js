import { app } from "./src/app.js";
import dotenv from "dotenv";
import { connectDB } from "./src/mysql/index.js";

dotenv.config({
  path: "./.env",
});

app.get("/", (req, res) => {
  res.send("Atleast working😭");
});
app.get("/api/aI/predict-student", (req, res) => {
  res.send("No 404😭");
});

async function startServer() {
  try {
    await connectDB();

    // start Server
    app.listen(process.env.APP_PORT, () => {
      console.log(`⚙️ Server is running at port: ${process.env.APP_PORT}`);
    });

    console.log("Database connected");
  } catch (error) {
    console.log("MySQL connection failed !!! ", error);
  }
}

startServer();
