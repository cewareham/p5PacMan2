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
  RED          : 'rgb(255,0,0)',
  PINK         : 'rgb(255,100,150)',
  TEAL         : 'rgb(100,255,255)',
  ORANGE       : 'rgb(230,190,40)',
  GREEN        : 'rgb(0, 255, 0)',

  STOP         : 0,
  UP           : 1,
  DOWN         : -1,
  LEFT         : 2,
  RIGHT        : -2,
  PORTAL       : 3,
  keySpace     : 32,
  
  DIR : {UP: 1, DOWN: -1, LEFT: 2, RIGHT: -2},

  PACMAN       : 0,
  PELLET       : 1,
  POWERPELLET  : 2,
  GHOST        : 3,

  SCATTER      : 0,
  CHASE        : 1,
  FREIGHT      : 2,
  SPAWN        : 3,
  BLINKY       : 4,
  PINKY        : 5,
  INKY         : 6,
  CLYDE        : 7,
  FRUIT        : 8,
  }
cc.SCREENWIDTH = cc.NCOLS*cc.TILEWIDTH;    // 448
cc.SCREENHEIGHT = cc.NROWS*cc.TILEHEIGHT;  // 576
cc.SCREENSIZE = (cc.SCREENWIDTH, cc.SCREENHEIGHT);
