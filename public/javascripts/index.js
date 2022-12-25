//const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
const gravity = 0.3;
//canvas.width = innerWidth - 300;
//canvas.height = innerHeight - 300;
const birdImage = new Image();
const background = new Image();
const apply = document.getElementById("apply");
const mr = document.getElementById("mr");
const pop = document.getElementById("pop");
const mutationRate = 0.1;
const Score = document.getElementById("score");

birdImage.src = "assets/bird.png";
background.src = "assets/download.jpg";

function getHighestScore(birds) {
    let maxScore = 0;
    birds.forEach(bird => {
        maxScore = Math.max(maxScore, bird.score);
    });
    return maxScore;
}

function allDead(birds) {
    for (let bird of birds) {
        if (!bird.loose) {
            return false;
        }
    }
    return true;
}

class Platform {
    constructor() {
        this.x = canvas.width;
        this.height = Math.random()*(canvas.height - 150);
        this.gap = Math.random()*50 + 100;
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

class Bird {
    constructor(cx, cy, cvY, cnPt, cnPb, w, bias) {
        this.loose = false;
        this.x = 40;
        this.y = 300;
        this.ratio = 630/445;
        this.velocity = {
            y: 0
        };
        this.width = 50
        this.height = this.width/this.ratio;
        this.score = 0
        this.brain = new Brain(cx, cy, cvY, cnPt, cnPb, w, bias)
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.angle*(Math.PI/180));
        ctx.drawImage(birdImage, 0 - this.width/2, 0 - this.height/2, this.width, this.height);
        ctx.restore();
    }

    think() {
        let nearestPlatform;
        let disToNearPlat = Infinity;

        platforms.forEach(platform => {
            if (platform.x + platform.width > this.x) {
                let diff = Math.min(disToNearPlat, platform.x - (this.x + this.width));
                if (diff !== disToNearPlat) {
                    nearestPlatform = platform; 
                    disToNearPlat = diff;
                }
            }
        });


        if (this.brain.jump(disToNearPlat, this.y, this.velocity.y, nearestPlatform, canvas.height, canvas.width)) {
            this.angle = -45;
            this.velocity.y = -4;
        }
    }

    update() {
        this.draw();
        this.think();
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

let population = new Population(Bird, mutationRate);

let birds = population.birds;


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
    //cancelAnimationFrame(animationID);
    

    if (allDead(birds)) {
        birds = population.matingPool(birds);
        platforms = [new Platform()];
        last = timeInSecond;
    }

    platforms.forEach((platform, i) => {
        if (platform.x + platform.width <= 0) {
            platforms.splice(i, 1)
            return
        }
        platform.update()
    });

    birds.forEach(bird => {
        if (bird.loose) return
        bird.update()
    });

    Score.textContent = getHighestScore(birds);
    //if (player.loose) {cancelAnimationFrame(animationID); clearInterval(spawnPlats);}
    //player.update();
};
animate();




window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case " ":
            player.velocity.y = -4;
            break;
    }
});




apply.addEventListener('click', () => {
    let newRate = Number(mr.value)/10;
    population = new Population(Bird, newRate, Number(pop.value)*100);
    platforms = [];
    cancelAnimationFrame(animationID);
    last = 0;
    num = 0;
    birds = population.birds;
    animate();
});