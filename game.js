const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const darkCanvas = document.getElementById("darkness");
const darkCtx = darkCanvas.getContext("2d");

canvas.width = darkCanvas.width = window.innerWidth;
canvas.height = darkCanvas.height = window.innerHeight;

let camera = { x: 0, y: 0};

const buildings = [
    {x: 100, y: 100, w: 150, h: 100, label: "Welcome!", text: "Coming soon"},
    {x: 400, y: 200, w: 180, h: 120, label: "song of the week", text: "coming soon"},
    {x: 700, y: 100, w: 160, h: 100, label: "blog", text: "coming soon"}
];

const player = {
    x: 200,
    y: 200,
    w: 40,
    h: 40,
    speed: 2
};

let hoveredBuilding = null;
let activeBuilding = null;

let mouseX = canvas.width/2;
let mouseY = canvas.height/2;
let torch = {x: mouseX, y: mouseY, radius: 120};

canvas.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const worldX = mouseX + camera.x;
    const worldY = mouseY + camera.y;

    hoveredBuilding = null;

    for(const b of buildings) {
        if (
            worldX >= b.x &&
            worldX <= b.x + b.w &&
            worldY >= b.y &&
            worldY <= b.y + b.h
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
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

function update() {
    const speed = 5;
    if (keys["arrowup"] || keys["w"]) player.y -= player.speed;
    if (keys["arrowdown"] || keys["s"]) player.y += player.speed;
    if (keys["arrowleft"] || keys["a"]) player.x -= player.speed;
    if (keys["arrowright"] || keys["d"]) player.x += player.speed;

    camera.x = player.x - canvas.width / 2 + player.w/2;
    camera.y = player.y - canvas.height / 2 + player.h /2;

    torch.x += (mouseX - torch.x) * 0.1;
    torch.y += (mouseY - torch.y) * 0.1;
}

function drawWorld(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(const b of buildings) {
        ctx.fillStyle = (b === hoveredBuilding) ? "#ccc" : "#888";
        ctx.fillRect(b.x - camera.x, b.y - camera.y, b.w, b.h);

        ctx.fillStyle = "black";
        ctx.font = "14px monospace";
        ctx.fillText(b.label, b.x - camera.x + 10, b.y - camera.y + 20);
    }
    ctx.fillStyle = "white";
        ctx.fillRect(player.x - camera.x, player.y - camera.y, player.w, player.h);

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

    darkCtx.clearRect(0, 0, darkCanvas.width, darkCanvas.height);
    darkCtx.fillStyle = "rgba(0, 0, 0, 0.95)";
    darkCtx.fillRect(0, 0, darkCanvas.width, darkCanvas.height);

   
  darkCtx.globalCompositeOperation = "destination-out";
  darkCtx.beginPath();
  darkCtx.arc(mouseX, mouseY, 120, 0, Math.PI*2);
  darkCtx.fill();
  darkCtx.globalCompositeOperation = "source-over";
    
        
       
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