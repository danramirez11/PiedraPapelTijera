const PORT = 3000;
const socket = io(`http://localhost:${PORT}`);
let socketId = '';

const board = document.querySelector('.board');
const scores = document.querySelector('.scores');
const options = ['✊','✋','✌'];
const optionsDiv = document.createElement('div');
const statusText = document.createElement('h3');
const p = document.createElement('p');

socket.on('id', (id) => {
    socketId = id;

    updateBoard(false, '');
    updateScores(0,0);
});

socket.on('winner', (data) => {
    const {winner, users, currentPlay} = data;
    optionsDiv.innerHTML = `<h2>${currentPlay[users[0].id]} vs ${currentPlay[users[1].id]}</h2>`;
    if(winner === socketId){
        statusText.textContent = 'Ganaste!';
        p.textContent = 'Que suerte!';
    } else {
        statusText.textContent = 'Perdiste!';
        p.textContent = 'Ow, tal vez a la próxima :(';
    }
    updateScores(users[0].wins, users[1].wins);
    setTimeout(() => {
        updateBoard(false, '');
    }, 7000);
});

function updateBoard(selected, option){
    board.innerHTML = '';
    optionsDiv.innerHTML = '';

    statusText.textContent = 'Esperando jugada...';
    board.appendChild(statusText);

    options.forEach((option) => {
        const h2 = document.createElement('h2');
        h2.textContent = option;
        h2.addEventListener('click', () => {
            optionClicked(option);
        });
        optionsDiv.appendChild(h2);
    })
    board.appendChild(optionsDiv);
    selected ? p.textContent = `Seleccionaste: ${option}, esperando oponente...` : p.textContent = 'Selecciona una jugada';
    board.appendChild(p);
}

function optionClicked(option){
    socket.emit('option', option);
    updateBoard(true, option);
}

function updateScores(player1, player2){
    scores.innerHTML = `<p><b>Partidas ganadas</b></p><p>Jugador 1: ${player1}</p><p>Jugador 2: ${player2}</p>`;
}