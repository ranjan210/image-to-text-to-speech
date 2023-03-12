
async function getAudio() {
    const imageUrl = document.getElementById("image-link").value
    document.getElementById("source-image").src = imageUrl;
    fetch("http://localhost:3000/parseImage", {

        method: "POST",

        body: JSON.stringify({
            url: imageUrl
        }),

        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => {
            const reader = response.body.getReader();
            return new ReadableStream({
                start(controller) {
                    return pump();
                    function pump() {
                        return reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            return pump();
                        });
                    }
                },
            });
        })
        .then((stream) => new Response(stream))
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob))
        .then(play)
        .catch((err) => console.error(err));
}

function setUpAnalyser(audio) {
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");

    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;
    function renderFrame() {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i]/2;
            ctx.fillStyle = "#e17055";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
    audio.play();
    renderFrame();
}

function play(url) {
    console.log(url)
    var audio = document.getElementById("audio");
    audio.src = url
    audio.preload = 'auto'
    audio.load()
    setUpAnalyser(audio)
}

