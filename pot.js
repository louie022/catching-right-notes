class Pot {
  constructor(x, w){
    this.x = x;
    this.w = w;
    this.h = 10;
    this.y = height - this.h;
  }
  
  catches(note){
    // Check for circle-shaped notes (MusicalNote)
    if(note instanceof MusicalNote) {
      if(note.y + note.r >= this.y && note.x > this.x - this.w / 2 && note.x < this.x + this.w / 2)
        return true;
      else
        return false;
    }
    
    // Check for square-shaped notes (SquareNote)
    else if(note instanceof SquareNote) {
      if(note.y + note.size >= this.y && note.x > this.x - this.w / 2 && note.x < this.x + this.w / 2)
        return true;
      else
        return false;
    }
  }
  
  show(){
    fill(255);
    strokeWeight(2);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
}

// class Pot {
//   constructor(x, w){
//     this.x = x;
//     this.w = w;
//     this.h = 10;
//     this.y = height - this.h;
//   }
  
//   catches(musicalNote){
//     if(musicalNote.y + musicalNote.r >= this.y && musicalNote.x > this.x - this.w / 2 && musicalNote.x < this.x + this.w / 2)
//       return true;
//     else
//       return false;
//   }
  
  
//   show(){
//     fill(255);
//     strokeWeight(2);
//     rectMode(CENTER);
//     rect(this.x, this.y, this.w, this.h);
//   }
// }
