const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const { GoogleGenAI } = require("@google/genai");

const app = express();

// ================================
// MIDDLEWARE
// ================================
app.use(cors());
app.use(express.json());

// ================================
// GEMINI AI
// ================================
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// ================================
// HOME ROUTE
// ================================
app.get("/", (req, res) => {
    res.send("AI Study Assistant Server is running 🚀");
});

// ================================
// ASK AI
// ================================
app.post("/api/ask", async (req, res) => {
    try {
        const { question } = req.body;

        // Check question
        if (!question) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        // Make sure question is a string
        const questionText = String(question).trim();

        if (!questionText) {
            return res.status(400).json({
                error: "Please enter a valid question."
            });
        }

        console.log("Question received:", questionText);

        // ================================
        // GEMINI REQUEST
        // ================================
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: questionText
        });

        // ================================
        // SEND AI ANSWER
        // ================================
        res.json({
            answer: response.text
        });

    } catch (error) {
        console.error("AI ERROR:", error);

        res.status(500).json({
            error: "Unable to connect to AI. Please try again.",
            details: error.message
        });
    }
});

// ================================
// START SERVER
// ================================
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});