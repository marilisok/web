function restart() {
    document.location.href = "https://localhost/";
}
function printHist() {
    let table = (JSON.parse(localStorage.getItem('tetris.highscores')));
    table.sort(function(a,b){
        return Number(b[1]) - Number(a[1]);
    });

    for(let i = 0; i < 5; i++) {
        let line = document.getElementById(`line${i}`);
        let el = table[i][1];
        if(el) {
            line.textContent = table[i][0] + ". . . . . . . . . . . . "  + table[i][1];
        }
    }
}