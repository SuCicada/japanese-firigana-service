const express = require('express');
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const cors = require("cors");
const {MyParser} = require("./parser");
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

let parser = new MyParser();

async function init() {
    await parser.init(new KuromojiAnalyzer());
}

app.post('/convert/', async (req, res) => {
    const {text} = req.body;
    console.log(text);
    const result = await parser.convert(text);
    res.json({
        data: result,
    });
});

const port = process.env.PORT || 41401;
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await init();
});
