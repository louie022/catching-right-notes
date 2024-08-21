let musicalNotes = [];
let pot;

let noteCounter = 0;

let notesDiv;
let notes = '';

let chordLetters = ['F', 'A', 'C', 'E', 'G', 'C', 'G', 'B', 'D'];

let keyFrequency = {
  C: 261.6256,
  D: 293.6648,
  E: 329.6276,
  F: 349.2282,
  G: 391.9954,
  A: 440.0000,
  B: 493.8833,
};

let env, wave;

let gameOver = false;

function preload() {
  chordProgression = loadStrings('cp.txt');

  // Load the negative beep sound file
  negativeBeep = loadSound('negative_beeps.mp3');
}

function setup() {
  chordProgression = chordProgression.join('');
  console.log(chordProgression);

  createCanvas(700, 600);

  env = new p5.Envelope();
  env.setADSR(0.05, 0.1, 0.5, 1);
  env.setRange(1.2, 0);

  wave = new p5.Oscillator();

  wave.setType('sine');
  wave.start();
  wave.freq(440);
  wave.amp(env);

  let noteKeys = Object.keys(keyFrequency);

  pot = new Pot(width / 2, 50);

  notesDiv = createDiv('');
  notesDiv.style('font-size', '42pt');
}

function draw() {
  background(255);

  // Randomly spawn circle or square notes
  if (random(1) < 0.05) {
    if (random(1) < 0.5) {
      musicalNotes.push(new MusicalNote(random(width), random(-100, -20)));
    } else {
      musicalNotes.push(new SquareNote(random(width), random(-100, -20)));
    }
  }

  for (let note of musicalNotes) {
    note.show();
    note.update();
  }

  for (let i = musicalNotes.length - 1; i >= 0; i--) {
    if (pot.catches(musicalNotes[i])) {
      // Check if it's a circle (MusicalNote) or square (SquareNote)
      if (musicalNotes[i] instanceof MusicalNote) {
        let note = musicalNotes[i].note;
        let correctLetter = chordProgression.charAt(noteCounter);

        if (correctLetter == note) {
          console.log("✔"); // Correct note, proceed to the next
          noteCounter++;
          notes += note; // Update the display notes only when correct
          // Play the corresponding sound
          playNoteSound(note);

          // Check if the user has completed the chord progression
          if (noteCounter >= chordProgression.length) {
            console.log("🎉 Completed the chord progression!");

            playChordProgression(); // Play the chord progression

            noteCounter = 0; // Reset the counter for the next round
            notes = ''; // Reset the notes string
          }
        } else {
          console.log("❌"); // Incorrect note, reset the sequence
          noteCounter = 0; // Reset the counter
          notes = ''; // Reset the notes string to start from the beginning
          // Play the negative beep sound
          playNegativeBeep();
        }

      } else if (musicalNotes[i] instanceof SquareNote) {
        // If it's a square, treat it as a mistake
        console.log("❌ Caught a square note!");
        noteCounter = 0; // Reset the counter
        notes = ''; // Reset the notes string to start from the beginning
        // Play the negative beep sound
        playNegativeBeep();
      }

      notesDiv.html(notes);
      musicalNotes.splice(i, 1);
    } else {
      // Check for out-of-bound notes and remove them accordingly
      if (musicalNotes[i] instanceof MusicalNote && musicalNotes[i].y > height + musicalNotes[i].r) {
        musicalNotes.splice(i, 1);
      } else if (musicalNotes[i] instanceof SquareNote && musicalNotes[i].y > height + musicalNotes[i].size) {
        musicalNotes.splice(i, 1);
      }
    }
  }

  // Move your Pot
  pot.x = mouseX;
  pot.show();

  drawChordCircles();
}

function drawChordsInCorner() {
  let chords = ['FAC', 'EGC', 'GBD'];
  let x = 50;  // X position of the first circle
  let y = 50;  // Y position of the first circle
  let r = 30;  // Radius of each circle

  for (let i = 0; i < chords.length; i++) {
    let chord = chords[i];

    // Draw the circle
    fill(255);
    stroke(0);
    circle(x, y + i * 2 * r, r * 2);  // Adjust Y position for each chord

    // Draw the letter inside the circle
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(chord, x, y + i * 2 * r);  // Center the text inside the circle
  }
}

function playNoteSound(note) {
  let freq = keyFrequency[note];
  wave.freq(freq);
  env.play();
}

function playNegativeBeep() {
  // Play the negative beep sound when the user catches the wrong letter
  if (negativeBeep.isPlaying()) {
    negativeBeep.stop(); // Stop the sound if it's already playing
  }
  negativeBeep.play();
}

let chordColors = Array(9).fill([255]); // Default color is white for all letters

function drawChordCircles() {
  let circleDiameter = 20; // Diameter of each circle
  let spacing = 25; // Spacing between circles

  for (let i = 0; i < chordLetters.length; i++) {
    // Calculate the x position for each circle
    let x = 30 + i * spacing;
    let y = 30; // y position for the circles

    // Draw the circle with the current color
    fill(chordColors[i]);
    circle(x, y, circleDiameter);

    // Draw the letter inside the circle
    fill(0);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(chordLetters[i], x, y);
  }
}

function playChordProgression() {
  // Define the chords in the progression with unique indices
  let chords = [
    [0, 1, 2],  // FAC chord -> indices 0, 1, 2
    [3, 4, 5],  // EGC chord -> indices 3, 4, 5
    [6, 7, 8],  // GBD chord -> indices 6, 7, 8
  ];

  // Define the original and active colors
  let originalColor = [255]; // White
  let activeColor = [255, 0, 0]; // Red

  // Stop further gameplay by clearing the musical notes array
  musicalNotes = [];

  // Function to play a chord and change letter colors
  function playChordWithEffect(chord, duration, index) {
    // Play the chord
    for (let idx of chord) {
      let note = chordLetters[idx]; // Get the letter corresponding to the index
      let freq = keyFrequency[note];
      wave.freq(freq);
      env.play();
    }

    // Change the color of the corresponding letters
    for (let idx of chord) {
      chordColors[idx] = activeColor; // Change to active color
    }

    // Revert the colors back to the original after the duration
    setTimeout(() => {
      for (let idx of chord) {
        chordColors[idx] = originalColor; // Change back to original color
      }
      // If the last chord was played, restart the progression
      if (index === chords.length - 1) {
        playChordProgression(); // Loop the progression
      }
    }, duration);
  }

  // Set duration for FAC and EGC chords (1 second each)
  let duration = 1000;

  // Play the FAC chord
  setTimeout(() => playChordWithEffect(chords[0], duration, 0), 0);

  // Play the EGC chord with an additional 1-second delay
  setTimeout(() => playChordWithEffect(chords[1], duration, 1), duration + 500);

  // Play the GBD chord with twice the duration (2 seconds)
  setTimeout(() => playChordWithEffect(chords[2], duration * 2, 2), (duration + 1000) + duration);
}
