var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');

// width and height of boxes
var w = 0.1 * canvas.width;

var rows = canvas.height / w;
var columns = canvas.width / w;
var rainbowColors = [
                    '#FE7498',
                    '#4B0082',
                    '#0000FF',
                    '#00FF00',
                    '#FFFF00',
                    '#FF7F00',
                    '#FF0000',
                    '#BB1581'    
                        ];
// rows*column array of curve 
var curves = [];
var fillStyleColor = '#000000';
window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	init();
})

function init(){
    w = 0.1 * canvas.width;
    rows = canvas.height / w;
    columns = canvas.width / w;


    curves = [];

    for (let j = 0; j < rows; j++) {
        let arr = [];
        for (let i = 0; i < columns; i++) {
            arr.push(new Curve());
        }
        curves.push(arr);
    }
    animate();
}

var angle = 0;
var px = 0;
var py = 0;
var radius = 0;

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, innerWidth, innerHeight);
    update();
}

function update() {
    for (var i = 1; i < columns; i++) {
        context.beginPath();
        radius = w / 2 * 0.9;
        context.arc(w * i + w / 2, w / 2, radius, 0, 2 * Math.PI);
        context.stroke();
        context.beginPath();
        px = w * i + w / 2 + radius * Math.cos(angle * i);
        py = w / 2 + radius * Math.sin(angle * i);
        context.arc(px, py, 3, 0, Math.PI * 2);
        context.fillStyle = fillStyleColor;
        context.fill();
        context.moveTo(px, py);
        context.lineTo(px, canvas.height);
        context.stroke();

        for (var j = 1; j < rows; j++) {
            curves[j][i].setX(px);
        }
    }
    for (var j = 1; j < rows; j++) {
        context.beginPath();
        context.arc(w / 2, w * j + w / 2, radius, 0, 2 * Math.PI);
        context.stroke();
        context.beginPath();
        px = w / 2 + radius * Math.cos(angle * j);
        py = w * j + w / 2 + radius * Math.sin(angle * j);
        context.arc(px, py, 3, 0, Math.PI * 2);
        context.fillStyle = fillStyleColor;
        context.fill(); 
        context.moveTo(px, py);
        context.lineTo(canvas.width, py);
        context.stroke();

        for (var i = 1; i < columns; i++) {
            curves[j][i].setY(py);
        }
    }

    for(let j = 0; j < rows; j++){
        for(let i = 0; i < columns; i++){
            curves[j][i].addPoint();
            curves[j][i].show();
        }
    }
    
    angle += 0.05;
    if(angle > Math.PI * 2){
        for(let j = 0; j < rows; j++){
            for(let i = 0; i < columns; i++){
                curves[j][i].path = [];
            }
        }
        angle = 0;
        fillStyleColor = rainbowColors[Math.floor(Math.random()*rainbowColors.length)];
        context.strokeStyle = fillStyleColor;
    }
}


function Curve() {
    this.path = [];
    this.x;
    this.y;

    this.setX = function (x) {
        this.x = x;
    }

    this.setY = function (y) {
        this.y = y;
    }

    this.addPoint = function () {
        var vector = [this.x, this.y];
        this.path.push(vector);
    }

    this.show = function () {
        context.beginPath();
        this.path.forEach(element => {
           context.lineTo(element[0], element[1]); 
           context.stroke();
        });
        // context.arc(this.x, this.y, 3, 0, Math.PI*2);
        // context.fillStyle = fillStyleColor;
        // context.fill();
    }
}
init();
