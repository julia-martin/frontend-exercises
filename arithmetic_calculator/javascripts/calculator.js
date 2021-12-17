document.addEventListener('DOMContentLoaded', () => {
  let form = document.querySelector('form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let firstNum = Number(document.getElementById('first-number').value);
    let secondNum = Number(document.getElementById('second-number').value);
    let operation = document.getElementById('operator').value;
    let result;
    switch (operation) {
      case '+':
        result = firstNum + secondNum;
        break;
      case '-':
        result = firstNum - secondNum;
        break;
      case '*':
        result = firstNum * secondNum;
        break;
      case '/':
        result = firstNum / secondNum;
        break;
    }
    document.getElementById('result').textContent = result;
  });
});