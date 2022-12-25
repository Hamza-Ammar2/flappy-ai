class Population {
    constructor(type, mutationRate, size) {
        this.size = size ? size : 1000;
        this.birds = [];

        this.type = type;

        for (let i = 0; i < this.size; i++) {
            this.birds.push(new type());
        }
        this.mutationRate = mutationRate;
    }

    matingPool(birds) {
        let bestBirds = [];
        let children = [];
        let diff;
        birds.forEach(bird => {
            bird.x = null;
            bird.y = null;
            let chance = bird.score === 0? 0.1: bird.score;
            if (Math.random() < chance) bestBirds.push(bird);
        });

        bestBirds.forEach(bird => {
            let child = this.mate(bird, bestBirds[Math.floor(Math.random()*bestBirds.length)]);
            children.push(child);
        });

        diff = birds.length - children.length;
        //console.log(children.length);
        for (let i = 0; i < diff; i++) {
            children.push(this.mutate(children[Math.floor(Math.random()*children.length)]));
        }
        return children;
    }

    mate(bird1, bird2) {
        let cx = Math.random() < 0.5? bird1.brain.cx: bird2.brain.cx;
        let cy = Math.random() < 0.5? bird1.brain.cy: bird2.brain.cy;
        let cvY = Math.random() < 0.5? bird1.brain.cvY: bird2.brain.cvY;
        let cnPt = Math.random() < 0.5? bird1.brain.cnPt: bird2.brain.cnPt;
        let cnPb = Math.random() < 0.5? bird1.brain.cnPb: bird2.brain.cnPb;
        let w = Math.random() < 0.5? bird1.brain.w: bird2.brain.w;
        let bias = Math.random() < 0.5? bird1.brain.bias: bird2.brain.bias;
        
        return new this.type(cx, cy, cvY, cnPt, cnPb, w, bias);
    }

    mutate(bird) {
        let cx = Math.random() < this.mutationRate? bird.brain.cx: Math.random();
        let cy = Math.random() < this.mutationRate? bird.brain.cy: Math.random();
        let cvY = Math.random() < this.mutationRate? bird.brain.cvY: Math.random();
        let cnPt = Math.random() < this.mutationRate? bird.brain.cnPt: Math.random();
        let cnPb = Math.random() < this.mutationRate? bird.brain.cnPb: Math.random();
        let w = Math.random() < this.mutationRate? bird.brain.w: Math.random();
        let bias = Math.random() < this.mutationRate? bird.brain.bias: Math.random();

        return new this.type(cx, cy, cvY, cnPt, cnPb, w, bias);
    }
}