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

function addVideo(filename, title, langs, description, version, thumbFileName, tags) {
    const uuid = uuidv4();
    let languages = [];
    for (i = 0; i < langs.length; i++){
        languages.push({"languageName": langs[i], "index": "" + i});
    }
    videos.push({
        "uid": uuid,
        "fileName": filename,
        "videoTitle": title,
        "videoLanguages": languages,
        "description": description,
        "version": version,
        "thumbnailFileName": thumbFileName,
        "tags": tags
    });
    saveVideos();
}

/*addVideo(
    "langTest.mp4",
    "Language test video",
    ["Norwegian", "English"],
    "Language test video (long)",
    "1",
    "mafVideo1.png"
);*/

/*addVideo(
    "mafVideo1.mp4",
    "Brestfeading: Food for Life (Duplicate)",
    ["English"],
    "Duplicated to extend list! Health promotion video about brestfeeding and reasons why it should be done.",
    "1",
    "mafVideo1.png"
);
addVideo(
    "mafVideo2.mp4",
    "Warning signs in Pregnancy (Duplicate)",
    ["English"],
    "Duplicated to extend list! Information video about danger signs in pregnancy, and how to deal with them",
    "1",
    "mafVideo2.png"
);
addVideo(
    "mafVideo3.mp4",
    "Neonatal Resuscitation (Duplicate)",
    ["English"],
    "Duplicated to extend list! Informational video on neonatal resuscitation",
    "1",
    "mafVideo3.png"
);
addVideo(
    "mafVideo4.mp4",
    "What and when to feed your child (6 months to 2 years) (Duplicate)",
    ["English"],
    "Duplicated to extend list! Health promotion video on nutrition for children (6 months to 2 years)",
    "1",
    "mafVideo4.png"
);
addVideo(
    "mafVideo5.mp4",
    "How to care for a newborn (duplicate)",
    ["English"],
    "Duplicated to extend list! Health promotion video on what to do and how to care for newborn baby.",
    "1",
    "mafVideo5.png"
);
addVideo(
    "WHO_ _In our hands_ - HIV self-testing in Malawi.mp4",
    "HIV self-testing-kits (Duplicate)",
    ["Chichewa"],
    "Duplicated to extend list! Health promotion video on HIV self-testing kits.",
    "1",
    "hivSelfTest.png"
);*/
//addVideo("finished4.mp4", "Test video 3", "nor", "Test video 3. This is a long video. description", "1");
//addVideo("finished1.mp4", "Test video 10(1) title", "nor,en", "Test video 10(1) description. More text here. We want looong text! yoyoyoyo this is quite fun isn't it? More text here. We want looong text! yoyoyoyo this is quite fun isn't it? More text here. We want looong text! yoyoyoyo this is quite fun isn't it?", "1");
//addVideo("finished2.mp4", "Test video 8(2) title", "nor,en", "Test video 8(2) description", "1");

function getVideoInfo(uid) {
    for (i = 0; i < videos.length; i++){
        if (videos[i].uid === uid) {
            return videos[i];
        }
    }
}
//statically serve files.
app.get('/video/:videoId/info', function(req, res){
    const videoInfo = getVideoInfo(req.params.videoId);
    if (videoInfo) {
        res.send(videoInfo);
    } else {
        res.send({"error: ": "Video id not found"});
    }
})

app.get('/video/:videoId', function(req, res){
    const videoInfo = getVideoInfo(req.params.videoId);
    if (videoInfo) {
        const file = `${__dirname}/src/videos/${videoInfo.fileName}`;
        res.download(file);
    } else {
        res.sendStatus(404);
    }
})
app.get('/thumbnail/:videoId', function(req, res){
    const videoInfo = getVideoInfo(req.params.videoId);
    console.log(videoInfo);
    if (videoInfo) {
        const file = `${__dirname}/src/thumbnails/${videoInfo.thumbnailFileName}`;
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