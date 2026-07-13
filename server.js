require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

app.get("/", function(req, res) {
    res.send("Hello my backend is working");
});

app.get("/api/tasks", async function(req, res) {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

app.post("/api/tasks", async function(req, res) {
    const { data, error } = await supabase
        .from("tasks")
        .insert([{ task: req.body.task }])
        .select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

app.post("/api/chat", async function(req, res) {
    try {
        const userMessage = req.body.message;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "You are a helpful assistant for Mahaluxmi Shoe and Fancy Store, which sells shoes, slippers, bangles, cosmetics, and stoles/jewelry in Nagaur, Rajasthan. Store hours are Mon-Sat, 10 AM - 8 PM. Answer customer questions helpfully and briefly. Customer question: " + userMessage
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        console.log("Gemini response:", JSON.stringify(data));

        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const reply = data.candidates[0].content.parts[0].text;
        res.json({ reply: reply });
    } catch (err) {
        console.log("Chat route error:", err.message);
        res.status(500).json({ error: err.message });
    }
});