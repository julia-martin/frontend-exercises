const randomWord = function() {
  let words = ['apple', 'banana', 'orange', 'pear'];
  return () => {
    if (words.length === 0) return -1;
    let word = words[Math.floor(Math.random() * words.length)];
    words.splice(words.indexOf(word), 1);
    return word;
  }
}();

document.addEventListener('DOMContentLoaded', () => {
  class Game {
    constructor() {
      this.word = randomWord();
      this.numIncorrect = 0;
      this.lettersGuessed = [];
      this.allowedWrong = 6;
      this.start();
    }

    start() {
      // clean up previous game
      document.getElementById('message').textContent = '';
      document.getElementById('replay').style.visibility = 'hidden';
      document.querySelectorAll('span').forEach(s => s.remove());

      if (this.word === -1) {
        document.getElementById('message').textContent = "Sorry, I've run out of words!";
      } else {
        // Add blanks
        for (let count = 0; count < this.word.length; count++) {
          let space = document.createElement('span');
          document.getElementById('spaces').appendChild(space);
        }
      }
    }

    addGuess(letter) {
      if (this.lettersGuessed.includes(letter)) {
        return;
      }
      this.lettersGuessed.push(letter);

      let guessSpan = document.createElement('span');
      guessSpan.textContent = letter;
      document.getElementById('guesses').appendChild(guessSpan);
    }

    checkLetter(letter) {
      if (this.word.includes(letter)) {
        this._showLetters(letter);
        this._checkWinner();
      } else {
        // Guessed wrong
        this.numIncorrect++;
        document.getElementById('apples').setAttribute('class', `guess_${this.numIncorrect}`);
        if (this.numIncorrect === this.allowedWrong) {
          this._gameOver(false);
        }
      }
    }

    _showLetters(letter) {
      // get indexes of letter in word
      let indexes = [];
      for (let idx = 0; idx < this.word.length; idx++) {
        if (letter === this.word[idx]) {
          indexes.push(idx);
        }
      }
      // update span text
      document.querySelectorAll('#spaces span').forEach((span, idx) => {
        if (indexes.includes(idx)) {
          span.textContent = this.word[idx];
        }
      });
    }

    _checkWinner() {
      // Check if all letters are guessed
      let spaces = Array.prototype.slice.call(document.querySelectorAll('#spaces span'));
      if (spaces.every(span => span.textContent.length === 1)) {
        this._gameOver(true);
      }
    }

    _gameOver(won) {
      let message = document.getElementById('message');
      if (won) {
        message.textContent = "Congrats! You guessed the word!";
        document.body.className = 'win';
      } else {
        message.textContent = "Sorry! You're out of guesses.";
        document.body.className = 'lose';
      }
      document.getElementById('replay').style.visibility = 'visible';
      document.removeEventListener('keyup', handleKeyUp);
    }
  }

  let game = new Game();

  function handleKeyUp(e) {
    if ((/^[a-z]$/i).test(e.key)) {
      game.addGuess(e.key);
      game.checkLetter(e.key);
    }
  }

  document.addEventListener('keyup', handleKeyUp);

  document.getElementById('replay').addEventListener('click', e => {
    e.preventDefault();
    document.addEventListener('keyup', handleKeyUp);
    game = new Game();
  });
});