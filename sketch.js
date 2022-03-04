let game;

function setup() {
  createCanvas(cc.SCREENWIDTH, cc.SCREENHEIGHT);
  game = new Game();
}

function draw() {
  game.update();
  game.render();
}

//*** keep oppDirection(..) here - used several places
// get key value from cc.DIR that is
  // opposite direction of dirString
  function oppDirection(dirString) {
    let dir = cc.DIR[dirString];
    let oppdir = dir * -1;
    let oppKey = getKeyValue(cc.DIR, oppdir);
    return oppKey;
  }

// src: https://stackoverflow.com/questions/35948669/how-to-check-if-a-value-exists-in-an-object-using-javascript
// obj->{key:value, key1:value1} eg.var obj = {"a": "test1", "b": "test2"};
// get object key given the value you want (normally you did it opposite->obj.key1 is value1)
// but here we want the opposite obj.key1 given value1
function getKeyValue(obj, value) {
  for (let key in obj) {
    if (obj[key] === value) return key;
  }
  return null;
}
