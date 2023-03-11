
async function getAudio() {
    const imageUrl = document.getElementById("image").value
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

function play(url) {
    console.log(url)
    const audio = new Audio()
    audio.src = url
    audio.preload = 'auto'
    audio.load()
    audio.play()
}