const express = require('express');
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const YahooWebAnalyzer = require("./kuroshiro-analyzer-yahoo-webapi");
const cors = require("cors");
const { MyParser } = require("./parser");
const https = require('https');
const fs = require('fs');
const utils = require('./utils');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

let parser = new MyParser();

async function init() {
    await parser.init(new YahooWebAnalyzer({
        appId: process.env.YAHOO_APP_ID,
    }));
}

app.post('/convert/', async (req, res) => {
    const { text, hiragana_extra } = req.body;
    console.log("req:", text, hiragana_extra);
    const result = await parser.convert(text);
    let hiragana, okurigana;
    if (hiragana_extra) {
        ({ hiragana, okurigana } = utils.get_hiragana_extra(result))
        console.log("hiragana:", hiragana);
        console.log("okurigana:", okurigana);
    }
    res.json({
        data: result,
        hiragana,
        okurigana,
    });
});

const port = process.env.PORT || 41401;
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await init();
});

// let key_dir = path.join(__dirname,"../")
// const options = {
//     key: fs.readFileSync(path.join(key_dir,'server.key')),
//     cert: fs.readFileSync(path.join(key_dir,'server.crt'))
// };

// https.createServer(options, app).listen(port, async () => {
//     console.log(`Server is running on port ${port}`);
//     await init();
// });
