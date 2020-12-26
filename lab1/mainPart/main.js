function store() {
    saveHistory();
    document.location.href = "/mainPart/endPart/end.html"; //финальная страничка
}
function saveHistory() {
    let name = localStorage.getItem('tetris.username');
    let highscore = localStorage.getItem('tetris.highscores');
    let table;
    if(highscore) {
        table = JSON.parse(localStorage.getItem('tetris.highscores'));
    } else {
        table = [];
    }
    let score = 300 * Number(localStorage.getItem('tetris.level'))
    + Number(localStorage.getItem('tetris.score'));
    let element = [name, score];
    for (let i = 0; i < table.length; i++){
        if(table[i][0] === name) {
            if(table[i][1] === localStorage.getItem('tetris.score')) {
                return;
            }
        }
    }
    table.push(element);
    localStorage.setItem('tetris.highscores', JSON.stringify(table));
}
function refreshInfo() {
    let level = document.getElementById('levelId');
    level.textContent = "Текущий уровень: " + localStorage.getItem('tetris.level');
    let score = document.getElementById('scoreId');
    score.textContent = "Score: " + localStorage.getItem('tetris.score');
}
function readInfo() {
    localStorage.setItem('tetris.level', 0);
    localStorage.setItem('tetris.timeout', 500);
    localStorage.setItem('tetris.score', 0);
    let levelId = document.getElementById('playerId');
    let username = localStorage.getItem('tetris.username');
    if(username == null || username === ""){
        document.location.href = "https://localhost/";
    }else{
        levelId.textContent = "Игрок: " + username;
        refreshInfo();
    }
}