const { createWorker } = require('tesseract.js');
const gtts = require('gtts')


exports.getText = async (req, res) => {

    const turl = req.body.url
    returnText(turl).then((textInput) => {
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




