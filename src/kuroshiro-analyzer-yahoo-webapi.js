// import axios from "axios";
const axios = require('axios').default;
// const querystring = require('querystring');
// const xmlParser = require('fast-xml-parser');
// import querystring from "querystring";
// import xmlParser from "fast-xml-parser";

// const API_URL = "https://jlp.yahooapis.jp/MAService/V1/parse";
// const API_URL = "https://jlp.yahooapis.jp/MAService/V2/parse";
const API_URL = "https://jlp.yahooapis.jp/FuriganaService/V2/furigana"

/**
 * Yahoo WebAPI Analyzer
 */
class Analyzer {
    /**
     * Constructor
     * @param {string} [appId] Your Yahoo application ID.
     * @param {Number} [timeout] Request timeout in millisecond.
     */
    constructor({appId, timeout} = {}) {
        this._analyzer = null;
        this._appId = appId;
        this._timeout = timeout || 5000;
    }

    /**
     * Initialize the analyzer
     * @returns {Promise} Promise object represents the result of initialization
     */
    init() {
        return new Promise((resolve, reject) => {
            if (this._analyzer == null) {
                this._analyzer = "yahoo";
                resolve();
            } else {
                reject(new Error("This analyzer has already been initialized."));
            }
        });
    }

    /**
     * Parse the given string
     * @param {*} str input string
     * @returns {Promise} Promise object represents the result of parsing
     */
    parse(str = "") {
        const self = this;
        return new Promise((resolve, reject) => {
            // const paramJson = {
            //     appid: self._appId,
            //     sentence: str,
            //     results: "ma"
            // };
            let paramJson = {
                "id": "1234-1",
                "jsonrpc": "2.0",
                "method": "jlp.furiganaservice.furigana",
                "params": {
                    "q": str,
                    "grade": 1
                }
            }
            axios({
                method: "post",
                url: API_URL,
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": `Yahoo AppID: ${this._appId}`,
                },
                data: JSON.stringify(paramJson),
                // timeout: self._timeout
            })
                .then((res) => {
                    // console.log(res.data.result)
                    // let data = JSON.parse()
                    let data = res.data.result;
                    let tokens = this.transformToKuroshiroTokens(data)
                    // console.log(data)
                    // const result = data;
                    let result = tokens;
                    // const resObj = xmlParser.parse(res.data, {
                    //     trimValues: false // in case of the whitespace character
                    // });
                    // if (resObj.ResultSet.ma_result.total_count === 0) return resolve(result);
                    // if (resObj.ResultSet.ma_result.total_count === 1) {
                    //     result.push({
                    //         surface_form: resObj.ResultSet.ma_result.word_list.word.surface,
                    //         pos: resObj.ResultSet.ma_result.word_list.word.pos,
                    //         reading: resObj.ResultSet.ma_result.word_list.word.reading
                    //     });
                    // } else {
                    //     for (let i = 0; i < resObj.ResultSet.ma_result.word_list.word.length; i++) {
                    //         result.push({
                    //             surface_form: resObj.ResultSet.ma_result.word_list.word[i].surface,
                    //             pos: resObj.ResultSet.ma_result.word_list.word[i].pos,
                    //             reading: resObj.ResultSet.ma_result.word_list.word[i].reading
                    //         });
                    //     }
                    // }
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    transformToKuroshiroTokens(data) {
        let res = []
        data.word.forEach((word) => {
            if (word.subword) {
                word.subword.forEach((subword) => {
                    let token = {
                        surface_form: subword.surface,
                        reading: subword.furigana,
                        pronunciation: subword.furigana,
                    }
                    res.push(token)
                })
            } else {
                let token = {
                    surface_form: word.surface,
                    reading: word.furigana,
                    pronunciation: word.furigana,
                }
                res.push(token)
            }
        })
        return res
    }
}

module.exports = Analyzer;
// export default Analyzer;
// exports.YahooWebAnalyzer = Analyzer;
