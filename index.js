const express = require('express');
const http = require('http');

const app = express();

app.use(express.static('src'));

app.listen(8081);


const videos = {
    video1: {
        filename: "finished1.mp4",
        title: "Video 1",
        langs: [
            "nor", 
            "en",
        ],
    },
    video2: {
        filename: "finished2.mp4",
        title: "Video 2",
        langs: [
            "nor", 
            "en",
        ],
    },
    video3: {
        filename: "video3.mp4",
    }
}

//statically serve files. 
app.get('/video/:videoId/info', function(req, res){
    const videoInfo = videos[req.params.videoId];
    if (videoInfo) {
        res.send(videoInfo);
    } else {
        res.send({"error: ": "Video id not found"});
    }
})

app.get('/video/:videoId', function(req, res){
    console.log("WE GOT A REQUEST!");
    const videoInfo = videos[req.params.videoId];
    if (videoInfo) {
        const file = `${__dirname}/src/videos/${videoInfo.filename}`;
        res.download(file);
    } else {
        res.sendStatus(404);
    }
})

app.get('/videos', function(req, res){
    res.send(videos);
})

//root, API index. 
app.get('/', function(req, res){
    res.send({"test": "hello"});
});