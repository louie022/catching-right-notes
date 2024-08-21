class MusicalNote {
  
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.r = 16;
    this.yspeed = 0;
    
    //all musical notes: E, F, G, A, C, B, D
    this.notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    
    //randomly generate a note from the list
    this.note = this.notes[floor(random(this.notes.length))];
  }
  
  show(){
    fill(255);
    circle(this.x, this.y, this.r * 2);
    
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(this.note, this.x, this.y);
  }
  
  update(){
    this.y += this.yspeed;
    this.yspeed += 0.01;
  }
}