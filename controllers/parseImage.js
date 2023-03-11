const { createWorker } = require('tesseract.js');
const gtts = require('gtts')
const fs = require("fs")
const util = require("util")

exports.getText = async (req, res) => {

    const turl = req.body.url
    returnText(turl).then((textInput)=>{
        const Gtts = new gtts(textInput, 'en-au');
        Gtts.stream().pipe(res);
    })

}


async function returnText(url) {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(url);
    await worker.terminate();
    return text;
}




/*async function writeToFile(audioBase64) {
    audioBase64.forEach(element => {
        writeToFileSingle(element["base64"])
    });
}

async function writeToFileSingle(audio) {

    const writeFile = util.promisify(fs.appendFile)
    await writeFile('output.mp3', Buffer.from(audio, 'base64'));

}*/