const express = require('express');
const http = require('http');

const app = express();
const fs = require('fs');
const uuidv4 = require('uuid/v4');

app.use(express.static('src'));

function readData() {
    const rawData = fs.readFileSync("videos.json");
    return JSON.parse(rawData);
}

let videos = readData();
app.listen(8081);

function saveVideos(){
    const rawData = JSON.stringify(videos);
    fs.writeFileSync("videos.json", rawData);
}

function addVideo(filename, title, langs, description, version) {
    const uuid = uuidv4();
    videos[uuid] = {
        "filename": filename,
        "title": title,
        "langs": langs,
        "description": description,
        "version": version
    };
    saveVideos();
}
//addVideo("finished1.mp4", "Test video 1 title", ["nor", "en"], "Test video 1 description", "1.0.0");
//addVideo("finished2.mp4", "Test video 2 title", ["nor", "en"], "Test video 2 description", "1.0.1");


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