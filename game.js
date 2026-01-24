const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let camera = { x: 0, y: 0};

const buildings = [
    {x: 100, y: 100, w: 150, h: 100, label: "About Me", text: "hey stupid"},
    {x: 400, y: 200, w: 180, h: 120, label: "Projects", text: "Here is some stuff i made"},
    {x: 700, y: 100, w: 160, h: 100, label: "Contact", text: "email: beepbeepblepboop"}
];

let hoveredBuilding = null;
let activeBuilding = null;

canvas.addEventListener("mousemove", e => {
    const mouseX = e.clientX + camera.x;
    const mouseY = e.clientY + camera.y;

    hoveredBuilding = null;

    for(const b of buildings) {
        if (
            mouseX >= b.x &&
            mouseX <= b.x + b.w &&
            mouseY >= b.y &&
            mouseY <= b.y + b.h
        ) {
            hoveredBuilding = b;
            break;
        }
    }
});

canvas.addEventListener("click", () => {
    if(hoveredBuilding) {
        activeBuilding = hoveredBuilding;
    } else {
        activeBuilding = null;
    }
});

const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function update() {
    const speed = 5;
    if (keys["ArrowUp"]) camera.y -= speed;
    if (keys["ArrowDown"]) camera.y += speed;
    if (keys["ArrowLeft"]) camera.x -= speed;
    if (keys["ArrowRight"]) camera.x += speed;
}

function drawWorld(){

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(const b of buildings) {
        ctx.fillStyle = (b === hoveredBuilding) ? "#ccc" : "#888";
        ctx.fillRect(b.x - camera.x, b.y - camera.y, b.w, b.h);

        ctx.fillStyle = "black";
        ctx.font = "14px monospace";
        ctx.fillText(b.label, b.x - camera.x + 10, b.y - camera.y + 20);
    }

    if(activeBuilding){
        const boxWidth = 300;
        const boxHeight = 150;
        const x = 50;
        const y = canvas.height - boxHeight - 50;

        ctx.fillStyle = "#222";
        ctx.fillRect(x, y, boxWidth, boxHeight);

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, boxWidth, boxHeight);

        ctx.fillStyle = "white";
        ctx.font = "16px monospace";
        wrapText(ctx, activeBuilding.text, x + 10, y + 25, boxWidth - 20, 20);
        }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++){
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if(testWidth > maxWidth && n > 0){
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

function loop() {
    update();
    drawWorld();
    requestAnimationFrame(loop);
}

loop();