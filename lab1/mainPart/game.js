// получаем доступ к холсту
var canvas = null;
var context = null;

function init() {
    canvas = document.getElementById('canvasId');
    context = canvas.getContext('2d');
}

// размер квадратика
const grid = 32;
// массив с последовательностями фигур, на старте — пустой
var tetrominoSequence = [];

// с помощью двумерного массива следим за тем, что находится в каждой клетке игрового поля
// размер поля — 10 на 20, и несколько строк ещё находится за видимой областью
var playfield = [];

// заполняем сразу массив пустыми ячейками
for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}

// задаём формы для каждой фигуры
const tetrominos = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    'O': [
        [1,1],
        [1,1],
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ]
};

// цвет каждой фигуры
const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

// счётчик
let count = 0;
// текущая фигура в игре
let nextFig = false;
let tetromino = getNextTetromino();


// следим за кадрами анимации, чтобы если что — остановить игру
let rAF = null;
// флаг конца игры, на старте — неактивный
let gameOver = false;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// создаём последовательность фигур, которая появится в игре
function generateSequence() {
    // тут — сами фигуры
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
        // случайным образом находим любую из них
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        // помещаем выбранную фигуру в игровой массив с последовательностями
        tetrominoSequence.push(name);
    }
}

// получаем следующую фигуру
function getNextTetromino() {
    // если следующей нет — генерируем
    if (tetrominoSequence.length === 0) {
        nextFig = true;
        generateSequence();
    }
    // берём первую фигуру из массива
    const name = tetrominoSequence.pop();
    // сразу создаём матрицу, с которой мы отрисуем фигуру
    const matrix = tetrominos[name];

    // I и O стартуют с середины, остальные — чуть левее
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    // I начинает с 21 строки (смещение -1), а все остальные — со строки 22 (смещение -2)
    const row = name === 'I' ? -1 : -2;

    // вот что возвращает функция
    return {
        name: name,      // название фигуры (L, O, и т.д.)
        matrix: matrix,  // матрица с фигурой
        row: row,        // текущая строка (фигуры стартуют за видимой областью холста)
        col: col         // текущий столбец
    };
}

// поворачиваем матрицу на 90 градусов
// https://codereview.stackexchange.com/a/186834
function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    // на входе матрица, и на выходе тоже отдаём матрицу
    return result;
}

// проверяем после появления или вращения, может ли матрица (фигура) быть в этом месте поля или она вылезет за его границы
function isValidMove(matrix, cellRow, cellCol) {
    // проверяем все строки и столбцы
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                // если выходит за границы поля…
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                // …или пересекается с другими фигурами
                playfield[cellRow + row][cellCol + col])
            ) {
                // то возвращаем, что нет, так не пойдёт
                return false;
            }
        }
    }
    // а если мы дошли до этого момента и не закончили раньше — то всё в порядке
    return true;
}

function updateLevel() {
    let score = Number(localStorage.getItem('tetris.score'));
    score += 100;
    if(score >= 300){
        let level = Number(localStorage.getItem('tetris.level'));
        level += 1;
        localStorage.setItem('tetris.level', level);
        score = 0;
    }
    localStorage.setItem('tetris.score', score);
    refreshInfo();
}

// когда фигура окончательна встала на своё место
function placeTetromino() {
    // обрабатываем все строки и столбцы в игровом поле
    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {

                // если край фигуры после установки вылезает за границы поля, то игра закончилась
                if (tetromino.row + row < 0) {
                    return showGameOver();
                }
                // если всё в порядке, то записываем в массив игрового поля нашу фигуру
                playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
            }
        }
    }

    // проверяем, чтобы заполненные ряды очистились снизу вверх
    for (let row = playfield.length - 1; row >= 0; ) {
        // если ряд заполнен
        if (playfield[row].every(cell => !!cell)) {

            // очищаем его и опускаем всё вниз на одну клетку
            for (let r = row; r >= 0; r--) {
                for (let c = 0; c < playfield[r].length; c++) {
                    playfield[r][c] = playfield[r-1][c];
                }
            }
            updateLevel();
        }
        else {
            // переходим к следующему ряду
            row--;
        }
    }
    // получаем следующую фигуру
    tetromino = getNextTetromino();
    nextFigure();
}

// показываем надпись Game Over
function showGameOver() {
    store();
}

// следим за нажатиями на клавиши
document.addEventListener('keydown', function(e) {
    // если игра закончилась — сразу выходим
    if (gameOver) return;

    if(event.key === 'Enter'){
        rAF = requestAnimationFrame(loop);
        nextFigure();
    }
    // стрелки влево и вправо
    if (e.which === 37 || e.which === 39) {
        const col = e.which === 37
            // если влево, то уменьшаем индекс в столбце, если вправо — увеличиваем
            ? tetromino.col - 1
            : tetromino.col + 1;

        // если так ходить можно, то запоминаем текущее положение
        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }

    // стрелка вверх — поворот
    if (e.which === 38) {
        // поворачиваем фигуру на 90 градусов
        const matrix = rotate(tetromino.matrix);
        // если так ходить можно — запоминаем
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }

    // стрелка вниз — ускорить падение
    if(e.which === 40) {
        // смещаем фигуру на строку вниз
        const row = tetromino.row + 1;
        // если опускаться больше некуда — запоминаем новое положение
        if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
            tetromino.row = row - 1;
            // ставим на место и смотрим на заполненные ряды
            placeTetromino();
            return;
        }
        // запоминаем строку, куда стала фигура
        tetromino.row = row;
    }
});

function draw(id, array, color) {
    const fig = document.getElementById(id);
    let ctx = fig.getContext('2d');
    ctx.clearRect(0, 0, fig.width, fig.height);
    for(let y = 0; y < array.length; y++){
        for (let x = 0; x < array[0].length; x++){
            if(array[y][x] === 1){
                ctx.fillStyle = color;
                ctx.fillRect(25 * x, 25 * y, 25, 25);
                ctx.fillStyle = "black";
                ctx.strokeRect( 25 * x, 25 * y, 25, 25);
            }
        }
    }
}

// главный цикл игры
function loop() {
    // начинаем анимацию
    rAF = requestAnimationFrame(loop);
    // очищаем холст

    if(context)
        context.clearRect(0,0,canvas.width,canvas.height);

    // рисуем игровое поле с учётом заполненных фигур
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];

                context.fillStyle = colors[name];

                // рисуем всё на один пиксель меньше, чтобы получился эффект «в клетку»
                context.fillRect(col * grid, row * grid, grid-1, grid-1);
            }
        }
    }

    // рисуем текущую фигуру
    if (tetromino) {

        // фигура сдвигается вниз каждые 20 кадров
        if (++count > 20) {
            tetromino.row++;
            count = 0;

            // если движение закончилось — рисуем фигуру в поле и проверяем, можно ли удалить строки
            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                placeTetromino();
            }
        }
        if(context)
            // не забываем про цвет текущей фигуры
            context.fillStyle = colors[tetromino.name];

        // отрисовываем её
        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (let col = 0; col < tetromino.matrix[row].length; col++) {
                if (tetromino.matrix[row][col]) {

                    if(context)
                        // и снова рисуем на один пиксель меньше
                        context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
                }
            }
        }
    }
}

function nextFigure() {
    if(nextFig){
        nextFig = false;
        draw('nextId', tetromino.matrix, colors[tetromino.name]);
        return;
    }
    if (tetrominoSequence.length === 0) {
        generateSequence();
    }
    let tetr = tetrominoSequence[tetrominoSequence.length-1];
    draw('nextId', tetrominos[tetr], colors[tetr]);
}









