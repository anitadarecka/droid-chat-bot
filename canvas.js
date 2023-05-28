const canvas = document.querySelector("#galaxy");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

window.onresize = function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
};

function clearScreen() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let stars = [];
for (let i = 0; i < 500; i++) {
    stars.push({
        x: ~~(Math.random() * canvas.width),
        y: ~~(Math.random() * canvas.height),
        speed: ~~(1 + Math.random() * 5),
        color: ~~(Math.random() * 3)
    });
}

function loop() {
    requestAnimationFrame(loop, canvas);
    update();
    render();
}

function update() {
    for (let i = 0; i < 500; i++) {
        stars[i].x -= stars[i].speed;
        if (stars[i].x < 0) stars[i].x = canvas.width;
    }
}

function render() {
    
    clearScreen();
    for (let i = 0; i < 500; i++) {
        const s = stars[i];
        ctx.lineWidth = 1;
        ctx.strokeStyle = ["#444", "#888", "#FFF"][stars[i].color];
        ctx.strokeRect(s.x, s.y, 1, 1);
    }
}

loop();