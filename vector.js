class Vector2 {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
    this.thresh = 0.000001;
  }
  
  add(other) {
    return new Vector2(this.x+other.x, this.y+other.y);
  }
  sub(other) {
    return new Vector2(this.x-other.x, this.y-other.y);    
  }
  neg() {
    return new Vector2(-this.x, -this.y);
  }
  mul(scalar) {
    return new Vector2(this.x*scalar, this.y*scalar);
  }
  div(scalar) {
    if (scalar != 0) {
      return new Vector2(this.x/parseFloat(scalar), this.y/parseFloat(scalar));
    }
    return null;
  }
  truediv(scalar) {
    return this.div(scalar);
  }
  eq(other) {
    if (Math.abs(this.x-other.x) < this.thresh) {
      if (Math.abs(this.y-other.y) < this.thresh) {
        return true;
      }
      return false;
    }
  }
  magnitudeSquared() {
    return this.x*this.x + this.y*this.y;
  }
  magnitude() {
    return Math.sqrt(this.magnitudeSquared());
  }
  // p5.js already has copy() function so must rename
  cpy() {
    return new Vector2(this.x, this.y);
  }
  asTuple() {
    return {x:this.x, y:this.y};
  }
  asInt() {
    // python int() truncates decimal portion so we us JS floor()
    return {x:Math.floor(this.x), y:Math.floor(this.y)};
    //return {x:parseInt(this.x), y:parseInt(this.y)};
    //return {x:this.x, y:this.y};
  }
  // p5.js already has str() function so must rename
  strng() {
    return "<"+str(this.x)+", "+str(this.y)+">";
  }
}
