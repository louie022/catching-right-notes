class SquareNote {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 32; // Size of the square
    this.yspeed = 0;
    // Array of musical notes for the square
    this.notes = ['E', 'F', 'G', 'A', 'C', 'B', 'D'];
    // Randomly choose a note from the array
    this.note = this.notes[floor(random(this.notes.length))];
  }

  show() {
    fill(255);
    square(this.x, this.y, this.size);

    fill(0);
    textSize(28);
    textAlign(CENTER, CENTER);
    // Correctly position the text at the center of the square
    text(this.note, this.x, this.y);
  }

  update() {
    this.y += this.yspeed;
    this.yspeed += 0.01;
  }
}
