const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;
let { users, currentPlay } = require('./database/users');

app.use('/play', express.static(`${__dirname}/../public`));

io.on('connection', (socket) => {
    console.log(`Un cliente se ha conectado: ${socket.id}`);

    newPlayer(socket.id);

    socket.emit('id', socket.id, socket.id);

    socket.on('option', (option) => {
        optionSelected(socket.id, option);
    });

    socket.on('disconnect', () => {
        console.log(`El cliente ${socket.id} se ha desconectado`);
        users = users.filter((user) => user.id !== socket.id);
    })
})

function newPlayer(id) {
    player = {
        id: id,
        wins: 0,
    };
    users.push(player);
};

function optionSelected(player, option){
    currentPlay[player] = option;
    if(Object.keys(currentPlay).length === 2){
        const plays = Object.values(currentPlay);
        const play1 = plays[0];
        const play2 = plays[1];
        let winner = '';
        if(play1 === play2){
            winner = 'Empate';
        } else if(play1 === '✊' && play2 === '✌'){
            winner = Object.keys(currentPlay)[0];
        } else if(play1 === '✋' && play2 === '✊'){
            winner = Object.keys(currentPlay)[0];
        } else if(play1 === '✌' && play2 === '✋'){
            winner = Object.keys(currentPlay)[0];
        } else {
            winner = Object.keys(currentPlay)[1];
        }
        users.find((user) => user.id === winner).wins++;
        io.emit('winner', {winner, users, currentPlay});
        currentPlay = {};
    }
}

server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})