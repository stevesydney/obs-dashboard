
const { createClient } = require("redis");
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");
const write = require('write');
const randomstring = require("randomstring");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    maxHttpBufferSize: 1e8
  });

const db = createClient();

db.on('error', (err) => console.log('Redis Client Error', err));

const setImage = async (key, value) => {
    await db.connect();
    await db.hSet(key, value, (err, reply) => {
        if (err) throw err;
        console.log(reply);
        
    }).then((e, x) => {console.log(e, x)});
    await db.disconnect(); 
}

app.use('/assets', express.static('assets'));
app.use('/images', express.static('images'));

app.get('/logo', (req, res) => {
    res.sendFile(__dirname + '/logo.html');
});

app.get('/starting-soon', (req, res) => {
    res.sendFile(__dirname + '/starting-soon.html');
});

app.get('/pomodoro', (req, res) => {
    res.sendFile(__dirname + '/pomodoro.html');
});

app.get('/bg-logo', (req, res) => {
    res.sendFile(__dirname + '/bg-logo.html');
});

app.get('/bg-logo-bright', (req, res) => {
    res.sendFile(__dirname + '/bg-logo-bright.html');
});

app.get('/logo-med', (req, res) => {
    res.sendFile(__dirname + '/logo-med.html');
});

app.get('/research-text', (req, res) => {
    res.sendFile(__dirname + '/research-text.html');
});

app.get('/video-text', (req, res) => {
    res.sendFile(__dirname + '/video-text.html');
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
});

app.get('/image-manager', (req, res) => {
    res.sendFile(__dirname + '/image-manager.html');
});

let currentResearchText;
let currentVideoText;

io.on('connection', (socket) => {
    if (currentResearchText) {
        io.emit('research text', currentResearchText);
    }
    if (currentVideoText) {
        io.emit('video text', currentVideoText);
    }
    socket.on('research text', (researchText) => {
        io.emit('research text', researchText);
        currentResearchText = researchText;
    });

    socket.on('video text', (videoText) => {
        io.emit('video text', videoText);
        currentVideoText = videoText;
    });

    socket.on('pomodoro', (pomoData) => {
        io.emit('pomodoro', pomoData);
    });

});

server.listen(4000, () => {
    console.log('listening on *:4000');
});
