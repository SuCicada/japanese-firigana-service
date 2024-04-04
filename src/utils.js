function get_hiragana_extra(data) {
    let furiStr = "";
    let kanjiFuStr = "";
    data.forEach((item) => {
        const [character, type, hiragana, katakana] = item;
        switch (type) {
            case 1:
                //   ruby = (
                //     <>
                //       <ruby>
                //         {character}
                //         <rp>(</rp>
                //         <rt>{hiragana}</rt>
                //         <rp>)</rp>
                //       </ruby>
                //     </>
                //   );

                furiStr += hiragana;
                kanjiFuStr += `${character}(${hiragana})`;
                break;

            case 2:
            default:
                //   switch (character) {
                //     case " ":
                //       ruby = <>&nbsp;</>;
                //       break;
                //     case "\n":
                //       ruby = <br />;
                //       break;
                //     default:
                //       ruby = <>{character}</>;
                //   }
                furiStr += character;
                kanjiFuStr += character;
        }
    });
    return {
        hiragana: furiStr,
        okurigana: kanjiFuStr,
    };
}
module.exports = { get_hiragana_extra };
