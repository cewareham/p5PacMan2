/*
In pygame, text cannot be written directly to the screen.
The first step is to create a Font object with a given font size.
The second step is to render the text into an image with a given color.
The third step is to blit the image to the screen. These are the steps:

font = pygame.font.SysFont(None, 24)
img = font.render('hello', True, BLUE)
screen.blit(img, (20, 20))
*/

class Text {
    constructor(text, color, x, y, size, time=null, id=null, visible=true) {
        this.id = id;
        this.text = text;
        this.color = color;
        this.size = size;
        this.visible = visible;
        this.posVector = new Vector2(x, y);
        this.timer = 0;
        this.lifespan = time;
        this.label = null;
        this.destroy = false;
        this.font = cc.pressfont;   // setupFont(..)
    }

    setText(newtext) {
        this.text = newtext;
    }

    update(dt) {
        if (this.lifespan != null) {
            this.timer += dt;
            if (this.timer >= this.lifespan) {
                this.timer = 0;
                this.lifespan = null;
                this.destroy = true;
                this.visible = false;
            }
        }
    }

    render() {
        if (this.visible) {
            const pos = this.posVector.asTuple();   // get posVector as {x:xVal, y:yVal}
            push();
            textFont(this.font);
            fill(this.color);
            textSize(this.size);
            text(this.text, pos.x, pos.y);
            pop();
        }
    }
}

class TextGroup {
    constructor() {
        this.nextid = 10;
        this.alltext = {};
        this.setupText();
        this.showText(cc.READYTXT);
    }

    addText(text, color, x, y, size, time=null, id=null) {
        this.nextid++;
        this.alltext[this.nextid] = new Text(text, color, x, y, size, time, id);
        return this.nextid;
    }

    removeText(id) {
        delete this.alltext[id];
    }

    setupText() {
        const size = cc.TILEHEIGHT;
        this.alltext[cc.SCORETXT] = new Text('0'.padEnd(8, '0'), cc.WHITE, 0, 2*cc.TILEHEIGHT+2, size);
        this.alltext[cc.LEVELTXT] = new Text('1'.padStart(3, '0'), cc.WHITE, 23*cc.TILEWIDTH, 2*cc.TILEHEIGHT+2, size);
        this.alltext[cc.READYTXT] = new Text("READY!", cc.YELLOW, 11.25*cc.TILEWIDTH, 21*cc.TILEHEIGHT, size, null, null, false);
        this.alltext[cc.PAUSETXT] = new Text("PAUSED!", cc.YELLOW, 10.625*cc.TILEWIDTH, 21*cc.TILEHEIGHT, size, null, null, false);
        this.alltext[cc.GAMEOVERTXT] = new Text("GAMEOVER!", cc.YELLOW, 10*cc.TILEWIDTH, 21*cc.TILEHEIGHT, size, null, null, false);
        this.addText("SCORE", cc.WHITE, 0, cc.TILEHEIGHT+2, size);
        this.addText("LEVEL", cc.WHITE, 23*cc.TILEWIDTH, cc.TILEHEIGHT+2, size);
    }

    update(dt) {
        for (const [key, value] of Object.entries(this.alltext)) {
            value.update(dt);
            if (value.destroy) this.removeText(key);
        }
    }

    showText(id) {
        this.hideText();
        this.alltext[id].visible = true;
    }

    hideText() {
        this.alltext[cc.READYTXT].visible = false;
        this.alltext[cc.PAUSETXT].visible = false;
        this.alltext[cc.GAMEOVERTXT].visible = false;
    }

    updateScore(score) {
        this.updateText(cc.SCORETXT, score.toString().padStart(8, '0'));
    }

    updateLevel(level) {
        this.updateText(cc.LEVELTXT, (level+1).toString().padStart(3, '0'));
    }

    updateText(id, value) {
        if (id in this.alltext) this.alltext[id].setText(value);
    }

    render() {
        for (const [key, value] of Object.entries(this.alltext)) {
            //console.log(key, value/*`${key}: ${value}`*/);
            /*if (value.visible)*/ value.render();
        }
    }
}
