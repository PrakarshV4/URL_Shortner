const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// generate short code
function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}

// health check
app.get("/", (req, res) => {
    res.send("Server is running");
});


// CREATE short URL (DB insert)
app.post("/shorten", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({
            message: "URL is required"
            // 400 => client send invalid data
        });
    }

    const shortCode = generateShortCode();

    try {
        const result = await pool.query(
            "INSERT INTO urls (short_code, original_url) VALUES ($1, $2) RETURNING *",
            [shortCode, url]
        );

        res.json({
            shortCode: result.rows[0].short_code,
            originalUrl: result.rows[0].original_url
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// REDIRECT (DB read)
app.get("/:shortCode", async (req, res) => {
    const { shortCode } = req.params;

    try {
        const result = await pool.query(
            "SELECT original_url FROM urls WHERE short_code = $1",
            [shortCode]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Short URL not found"
            });
        }

        res.redirect(302, result.rows[0].original_url);
        // 302 is temporarily redirect

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// DB test
async function testDB() {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("DB Connected:", result.rows[0]);
    } catch (err) {
        console.error("DB Error:", err);
    }
}

testDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});