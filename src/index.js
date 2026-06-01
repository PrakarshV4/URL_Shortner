const express = require('express');
const dotenv = require('dotenv');

dotenv.config()

const app = express();
app.use(express.json());

const url_map = {} // in memory storage
const PORT = process.env.PORT || 3000;

function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}

app.get("/", (req, res) => {
    res.send("Server is running");
})

// User sends URL to shorten
app.post("/shorten", (req, res) => {
    const {url} = req.body
    if (!url) {
        return res.status(400).json({ 
            message: "URL is required"
            // 400 => client send invalid data
        });
    }
    
    const shortCode = generateShortCode();
    url_map[shortCode] = url;

    console.log(url_map);

    res.json({
        shortCode
    });
})


// Redirecting
app.get("/:shortCode", (req, res) => {
    const { shortCode } = req.params;
    const original_url = url_map[shortCode];

    if (!original_url) {
        // 404 => Requested resource does not exist
        return res.status(404).json({
            message: "Short URL not found"
        })
    }

    res.redirect(302, original_url);
    // 302 is temporarily redirect
})


app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})