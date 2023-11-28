import os
import dotenv
import uvicorn
from fastapi import FastAPI
import pykakasi

app = FastAPI()


@app.post("/convert/")
def convert_text(data: dict):
    text = data["text"]
    kks = pykakasi.kakasi()
    result = kks.convert(text)
    print(text)
    # print(result)
    return {
        "text": text,
        "furigana": [{
            "orig": item['orig'],
            "kana": item['kana'],
            "hira": item['hira'],
            "romaji": item['hepburn']
        } for item in result]}


dotenv.load_dotenv(dotenv.find_dotenv())

port = int(os.environ.get('PORT', 41401))

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
