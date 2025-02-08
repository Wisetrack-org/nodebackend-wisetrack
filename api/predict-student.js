import { predictStudent } from "../../controllers/aiController.js"; // Adjust the path as needed

export default async (req, res) => {
    if (req.method === "POST") {
        return predictStudent(req, res); // Use the controller for handling the request
    } else {
        return res.status(405).json({ error: "Method Not Allowed" });
    } 
};
