const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const axios = require('axios');
const { Translate } = require('@google-cloud/translate').v2;
const projectId = 'trans-315811';
const service = new Translate({ projectId });
service.key = 'AIzaSyB7d1S7QIn7L01wMzwxWi7PhS5Z3FroXb0'
const RU = 'ru'
const EN = 'en'

const translate = (text, language) => {
    return service.translate(text, language);
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', 'me: ' + msg);
        translate(msg, EN)
            .then(result => {
                axios.get(`http://127.0.0.1:5000/?question=${result[0]}`)
                    .then(response => {
                        translate(response.data, RU)
                            .then(result => {
                                io.emit('chat message', 'AI: ' + result[0]);
                            })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            })
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});