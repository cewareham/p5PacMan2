let cc = {
  sprites: {
    // must have full path or p5.js editor won't work here!
    "grass"   : { "path" : "assets/grass.png"},
    "project" : { "path" : "assets/project.png"},
    "title" : { "path" : "assets/title.png"},
  },
  sounds : {
    "run_amok" : { "path" : "assets/run_amok.mp3"},
  },
  
  TILEWIDTH    : 16,
  TILEHEIGHT   : 16,
  NROWS        : 36,
  NCOLS        : 28,
  SCREENWIDTH  : -1,  // placeholder, calc'ed below
  SCREENHEIGHT : -1,  // placeholder, calc'ed below
  SCREENSIZE   : -1,  // placeholder, calc'ed below
  BLACK        : 'black',
  YELLOW       : 'yellow',
  WHITE        : 'white',
  RED          : 'red',

  STOP         : 0,
  UP           : 1,
  DOWN         : -1,
  LEFT         : 2,
  RIGHT        : -2,

  PACMAN       : 0,
}
cc.SCREENWIDTH = cc.NCOLS*cc.TILEWIDTH;    // 448
cc.SCREENHEIGHT = cc.NROWS*cc.TILEHEIGHT;  // 576
cc.SCREENSIZE = (cc.SCREENWIDTH, cc.SCREENHEIGHT);
