class Pause {
    constructor(paused=false) {
        this.paused = paused;
        this.timer = 0;
        this.pauseTime = null;
        this.func = null;
    }

    update(dt) {
        if (this.pauseTime != null) {
            this.timer += dt;
            if (this.timer >= this.pauseTime) {
                this.timer = 0;
                this.paused = false;
                this.pauseTime = null;
                return this.func
            }
        }
        return null;
    }

    setPause(playerPaused=false, pauseTime=null, func=null) {
        this.timer = 0;
        this.func = func;
        this.pauseTime = pauseTime;
        this.flip();
    }

    flip() {
        this.paused = !this.paused;
    }
}