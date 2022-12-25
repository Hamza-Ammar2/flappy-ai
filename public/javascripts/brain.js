class Brain {
    constructor(cx, cy, cvY, cnPt, cnPb, w, bias) {
        this.cx = !cx? Math.random() : cx;
        this.cy = !cy? Math.random() : cy;
        this.cvY = !cvY? Math.random() : cvY;
        this.cnPt = !cnPt? Math.random() : cnPt;
        this.cnPb = !cnPb? Math.random() : cnPb;
        this.w = !w? Math.random() : w;
        this.bias = !bias? Math.random() : bias;
     }

    jump(x, y, velocityY, nearestPlat, canvasHeight, canvasWidth) {
        /*if (y/canvasHeight <= this.cy && x/canvasWidth <= this.cx
        && velocityY <= this.cvY && nearestPlat.height/canvasHeight <= this.cnPt
        &&(nearestPlat.height + nearestPlat.gap)/canvasHeight
        && (nearestPlat.width + x)/canvasWidth <= this.w) {
            return false;
        } else return true;*/
        
        
        
        
        let chance = this.cx*(x/canvasWidth) + this.cy*(y/canvasHeight) - this.cnPt*(nearestPlat.height/canvasHeight)
        + this.cvY*(velocityY/velocityY) 
        + this.cnPb*((nearestPlat.height+nearestPlat.gap)/canvasHeight) - this.w*(nearestPlat.width/canvasWidth)
        //+ this.bias;
        
        if (chance > this.bias) {
            return true;
        } else return false;

    }
}