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



app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})