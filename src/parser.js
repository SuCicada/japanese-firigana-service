const Kuroshiro = require("kuroshiro");

const {
    patchTokens,
    getStrType,
    toRawHiragana,
    isKanji,
    isKatakana,
    toRawKatakana,
    toRawRomaji
} = require("kuroshiro/lib/util");

class MyParser extends Kuroshiro.default {
    constructor() {
        super();
    }
    async init(analyzer) {
        await super.init(analyzer);
        console.log("MyParser init")
    }

    async convert(str) {
        const rawTokens = await this._analyzer.parse(str);
        // console.log("rawTokens", rawTokens)
        const tokens = patchTokens(rawTokens);
        // console.log("tokens", tokens)
        // return tokens
        // else if (options.mode === "okurigana" || options.mode === "furigana") {
        const notations = []; // [basic, basic_type[1=kanji,2=kana,3=others], notation, pronunciation]
        for (let i = 0; i < tokens.length; i++) {
            /**
              if (hasKJ && hasHK) return 1;
              if (hasKJ) return 0;
              if (hasHK) return 2;
              return 3;
            */
            const strType = getStrType(tokens[i].surface_form);
            switch (strType) {
                case 0:
                    notations.push([tokens[i].surface_form, 1, toRawHiragana(tokens[i].reading), tokens[i].pronunciation || tokens[i].reading]);
                    break;
                case 1:
                    let pattern = "";
                    let isLastTokenKanji = false;
                    const subs = []; // recognize kanjis and group them
                    for (let c = 0; c < tokens[i].surface_form.length; c++) {
                        if (isKanji(tokens[i].surface_form[c])) {
                            if (!isLastTokenKanji) { // ignore successive kanji tokens (#10)
                                isLastTokenKanji = true;
                                pattern += "(.+)";
                                subs.push(tokens[i].surface_form[c]);
                            } else {
                                subs[subs.length - 1] += tokens[i].surface_form[c];
                            }
                        } else {
                            isLastTokenKanji = false;
                            subs.push(tokens[i].surface_form[c]);
                            pattern += isKatakana(tokens[i].surface_form[c]) ? toRawHiragana(tokens[i].surface_form[c]) : tokens[i].surface_form[c];
                        }
                    }
                    const reg = new RegExp(`^${pattern}$`);
                    const matches = reg.exec(toRawHiragana(tokens[i].reading));
                    if (matches) {
                        let pickKanji = 1;
                        for (let c1 = 0; c1 < subs.length; c1++) {
                            if (isKanji(subs[c1][0])) {
                                notations.push([subs[c1], 1, matches[pickKanji], toRawKatakana(matches[pickKanji])]);
                                pickKanji += 1;
                            } else {
                                notations.push([subs[c1], 2, toRawHiragana(subs[c1]), toRawKatakana(subs[c1])]);
                            }
                        }
                    } else {
                        notations.push([tokens[i].surface_form, 1, toRawHiragana(tokens[i].reading), tokens[i].pronunciation || tokens[i].reading]);
                    }
                    break;
                case 2: // hasHK
                    for (let c2 = 0; c2 < tokens[i].surface_form.length; c2++) {
                        notations.push([tokens[i].surface_form[c2], 2, toRawHiragana(tokens[i].reading[c2]), (tokens[i].pronunciation && tokens[i].pronunciation[c2]) || tokens[i].reading[c2]]);
                    }
                    break;
                case 3:
                    for (let c3 = 0; c3 < tokens[i].surface_form.length; c3++) {
                        notations.push([tokens[i].surface_form[c3], 3, tokens[i].surface_form[c3], tokens[i].surface_form[c3]]);
                    }
                    break;
                default:
                    throw new Error("Unknown strType");
            }
        }
        let result = [];
        // switch (options.to) {
        //     case "katakana":
        // if (options.mode === "okurigana") {
        //     for (let n0 = 0; n0 < notations.length; n0++) {
        //         if (notations[n0][1] !== 1) {
        //             result += notations[n0][0];
        //         } else {
        //             result += notations[n0][0] + options.delimiter_start + toRawKatakana(notations[n0][2]) + options.delimiter_end;
        //         }
        // }
        // } else { // furigana
        //     for (let n1 = 0; n1 < notations.length; n1++) {
        //         if (notations[n1][1] !== 1) {
        //             result += notations[n1][0];
        //         } else {
        //             result += `<ruby>${notations[n1][0]}<rp>${options.delimiter_start}</rp><rt>${toRawKatakana(notations[n1][2])}</rt><rp>${options.delimiter_end}</rp></ruby>`;
        //         }
        //     }
        // }
        // return result;
        // case "hiragana":
        //     if (options.mode === "okurigana") {
        // for (let n4 = 0; n4 < notations.length; n4++) {
        //         // console.log(notations)
        //     if (notations[n4][1] !== 1) {
        //         // result += notations[n4][0];
        //     } else {
        //         // result += notations[n4][0] + options.delimiter_start + notations[n4][2] + options.delimiter_end;
        //     }
        // }
        //         } else { // furigana
        //             for (let n5 = 0; n5 < notations.length; n5++) {
        //                 if (notations[n5][1] !== 1) {
        //                     result += notations[n5][0];
        //                 } else {
        //                     result += `<ruby>${notations[n5][0]}<rp>${options.delimiter_start}</rp><rt>${notations[n5][2]}</rt><rp>${options.delimiter_end}</rp></ruby>`;
        //                 }
        //             }
        //         }
        // return result;
        return notations
        //     default:
        //         throw new Error("Invalid Target Syllabary.");
        // }
    }
}

exports.MyParser = MyParser;
