const gameArea = document.querySelector(".gameArea");
const btn = document.querySelector(".btn");
const gameIntro = document.querySelector(".game");
const speedInput = document.querySelector(".game>input");
const gameHeader = document.querySelector(".game>h1");
const gameMessage = document.querySelector(".message");

const gameAreaBounds = gameArea.getBoundingClientRect();

let keys = {};
const game = {
    started: false,
    score: 0,
    speed: 8,
    enemies: 3
};

document.addEventListener("keydown", function (e) {
    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
        keys[e.key] = true;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
        keys[e.key] = false;
    }
});
btn.addEventListener("click", startGame);


function startGame() {
    game.started = true;
    gameIntro.classList.add("hide");
    gameArea.innerHTML = "";
    make();
    if (speedInput.value !== '') {
        game.speed = parseInt(speedInput.value);
        speedInput.value = '';
    }
    gameArea.classList.remove("hide");
    makeEnemies();
    makeRoad();
    requestAnimationFrame(play);
}

function make() {
    const div = document.createElement("div");
    div.classList.add("car");
    gameArea.appendChild(div);

    const h2 = document.createElement("h2");
    h2.innerHTML = "Score: ";
    let span = document.createElement("span");
    span.innerHTML = 0;
    span.setAttribute("class", "score");
    h2.appendChild(span);
    gameArea.appendChild(h2);

    const imgLeft = document.createElement("img");
    imgLeft.src = './assets/left.png';
    imgLeft.alt = "left";
    imgLeft.style.left = "20px";
    imgLeft.classList.add("img");
    gameArea.appendChild(imgLeft);
    const imgRight = document.createElement("img");
    imgRight.src = './assets/right.png';
    imgRight.alt = "right"
    imgRight.style.right = "20px";
    imgRight.classList.add("img");
    gameArea.appendChild(imgRight);

    const directions = document.querySelectorAll(".img");

    directions.forEach(function (direction) {
        if (direction.alt === 'left') {
            direction.addEventListener("touchstart", function (e) {
                e.preventDefault();
                keys['ArrowLeft'] = true;
            });
            direction.addEventListener("touchend", function () {
                keys['ArrowLeft'] = false;
            });
        }
        if (direction.alt === 'right') {
            direction.addEventListener("touchstart", function (e) {
                e.preventDefault();
                keys['ArrowRight'] = true;
            });
            direction.addEventListener("touchend", function () {
                keys['ArrowRight'] = false;
            });
        }
    });
}

function play() {
    const car = document.querySelector(".car");
    const score = document.querySelector(".score");
    moveEnemies(car);
    moveRoad();
    car.x = car.offsetLeft;
    car.y = car.offsetTop;
    if (keys["ArrowLeft"] && car.x > 0) {
        car.x -= game.speed;
    }
    if (keys["ArrowRight"] && car.x < (gameArea.offsetWidth - car.offsetWidth)) {
        car.x += game.speed;
    }
    if (keys["ArrowUp"] && car.y > 100) {
        car.y -= game.speed;
    }
    if (keys["ArrowDown"] && car.y < (gameArea.offsetHeight - car.offsetHeight - 50)) {
        car.y += game.speed;
    }
    car.style.left = car.x + "px";
    car.style.top = car.y + "px";
    if (game.started) {
        requestAnimationFrame(play);
    }
    game.score++;
    score.innerHTML = game.score;
}

function makeEnemies() {
    for (let i = 0; i < game.enemies; i++) {
        let div = document.createElement("div");
        div.classList.add("enemy");
        div.y = (i * 150) * -1;
        div.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
        div.style.backgroundColor = randomColor();
        gameArea.appendChild(div);
    }
}

function makeRoad() {
    for (let i = 0; i < 10; i++) {
        let div = document.createElement("div");
        div.classList.add("road");
        div.y = i * 150;
        gameArea.appendChild(div);
    }
}

function moveEnemies(car) {
    let enemies = document.querySelectorAll(".enemy");
    enemies.forEach(function (enemy) {
        if (isCollide(car, enemy)) {
            gameOver();
        }
        if (enemy.y > gameArea.offsetHeight) {
            enemy.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
            enemy.y = -100;
            enemy.style.backgroundColor = randomColor();
        }
        enemy.y += game.speed;
        enemy.style.top = enemy.y + 'px';
    });
}

function moveRoad() {
    let roads = document.querySelectorAll(".road");
    roads.forEach(function (road) {
        if (road.y > 1500) {
            road.y -= 1500;
        }
        road.y += game.speed;
        road.style.top = road.y + 'px';
    })
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.left > bRect.right) ||
        (aRect.right < bRect.left)
    );
}

function gameOver() {
    const scoreBoard = document.querySelector(".gameArea>h2");
    scoreBoard.innerHTML = '';
    game.started = false;
    gameIntro.classList.remove("hide");
    gameIntro.style.position = "absolute";
    gameIntro.style.backgroundColor = "#32718E";
    gameHeader.innerHTML = "Game over!";
    gameMessage.innerHTML = "Your score: " + game.score;
    game.score = 0;
    keys = {};
    btn.textContent = "Play again";
}

function randomColor() {
    return '#' + Math.random().toString().substr(-6);
}