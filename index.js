const express = require("express")
var app = express();
const bodyparser = require("body-parser")
const parseImage = require("./controllers/parseImage")
const cors = require("cors")

const port = process.env.port || 3000
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST"],
}

app.use(cors(corsOptions))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get("/", function (req, res) {
    res.send('Hello World!')
  });


app.post("/parseImage", parseImage.getText)



app.listen(port, () => {
    console.log("Server started")
})

