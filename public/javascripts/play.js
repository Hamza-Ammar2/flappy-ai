const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
const gravity = 0.3;
canvas.width = 500;
canvas.height = 500;
const birdImage = new Image();
const background = new Image();
const end = document.getElementById('end');
const Score = document.getElementById("score");

birdImage.src = "assets/bird.png";
background.src = "assets/download.jpg";

function addScore(score) {
    Score.textContent = score;
}

class Platform {
    constructor() {
        this.x = canvas.width;
        this.height = Math.random()*(canvas.height - 150);
        this.gap = Math.random()*50 + 140;
        this.velocity = {
            x: -3.5
        }
        this.width = 50;
    }

    draw() {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, 0, this.width, this.height);
        ctx.fillRect(this.x, this.height + this.gap, this.width, canvas.height - this.height - this.gap);
        ctx.fillStyle = null;
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
    }
}

let platforms = [new Platform()];

class Player {
    constructor() {
        this.loose = false;
        this.ratio = 630/445;
        this.x = 40;
        this.y = 40;
        this.velocity = {
            y: 0
        };
        this.width = 50
        this.height = this.width/this.ratio;
        this.angle = 0;
        this.score = 0
    }

    draw() {
        platforms.forEach((platform, i) => {
            platform.update();
            if (platform.x + platform.width <= 0) {
                platforms.splice(i, 1)
            }
        });
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.angle*(Math.PI/180));
        ctx.drawImage(birdImage, 0 - this.width/2, 0 - this.height/2, this.width, this.height);
        ctx.restore();
    }

    update() {
        this.draw();
        this.y += this.velocity.y;

        if (this.y + this.height <= canvas.height) {
            if (this.y <= 0) {
                this.loose = true;
                this.y = 0;
            }
            platforms.forEach(platform => {
                if (this.x + this.width >= platform.x 
                    && this.x <= platform.x + platform.width) {
                        if (this.y < platform.height
                            || this.y + this.height > platform.height + platform.gap) {
                            this.loose = true;
                            return;
                        } 
                    }
                
                if (platform.x + platform.width + platform.velocity.x <= this.x
                    && platform.x + platform.width >= this.x) {
                        this.score++;
                        addScore(this.score);
                    }
            });
        } else {
            this.loose = true;
            this.y = canvas.height - this.height
        }
        
        if (this.angle < 90) {
            this.angle++;
        } else this.angle = 90;
        this.velocity.y += gravity;
    }
}

const player = new Player();

let animationID;
let last = 0;
let num = 0;
let speed = 2;

const animate = (timeStamp) => {
    animationID = requestAnimationFrame(animate);
    let timeInSecond = timeStamp / 1000;

    if (timeInSecond - last >= speed) {
        last = timeInSecond;
        platforms.push(new Platform());
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    if (player.loose) {
        cancelAnimationFrame(animationID);
        end.style.display = "block";
    }
    player.update();
};
animate();




window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case " ":
            player.velocity.y = -5;
            player.angle = -45;
            break;
    }
});

end.lastChild.addEventListener('click', () => location.reload());