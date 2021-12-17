document.addEventListener('DOMContentLoaded', function() {
  let form = document.querySelector('form');
  let input = document.querySelector('#guess');
  let paragraph = document.querySelector('p');
  let link = document.querySelector('a');
  let answer;
  let guesses;

  function newGame() {
    answer = Math.floor(Math.random() * 100) + 1;
    guesses = 0;
    paragraph.textContent = 'Guess a number from 1 to 100';
  }

  function validateInput(input) {
    if (isNaN(input)) {
      alert('Must be a number');
      return false;
    }
    if (input < 1 || input > 100) {
      alert('Must be between 1 and 100');
      return false;
    }
    return true;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    let guess = parseInt(input.value, 10);
    if (!validateInput(guess)) return;
    let message;
    let btn = document.querySelector('[type=submit]');
    btn.disabled = false;

    guesses += 1;

    if (guess === answer) {
      message = `You guessed it! It took you ${guesses} guesses.`;
      btn.setAttribute('disabled', true);
    } else if (guess > answer) {
      message = `My number is lower than ${guess}`;
    } else {
      message = `My number is higher than ${guess}`;
    }

    paragraph.textContent = message;
  });

  link.addEventListener('click', event => {
    event.preventDefault();
    newGame();
  });

  newGame();
});