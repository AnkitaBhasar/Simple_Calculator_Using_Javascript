let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let shouldResetScreen = false;

const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.getElementById('equalsBtn');
const clearButton = document.getElementById('clearBtn');
const deleteButton = document.getElementById('deleteBtn');
const pointButton = document.getElementById('pointBtn');
const lastOperationScreen = document.getElementById('lastOperationScreen');
const currentOperationScreen = document.getElementById('currentOperationScreen');
const extraButtons = document.querySelectorAll('#extra-buttons button');

window.addEventListener('keydown', handleKeyboardInput);
equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteLastCharacter);
pointButton.addEventListener('click', addDecimalPoint);

numberButtons.forEach(button => button.addEventListener('click', () => appendDigit(button.textContent)));
operatorButtons.forEach(button => button.addEventListener('click', () => chooseOperation(button.textContent)));
extraButtons.forEach(button => button.addEventListener('click', () => handleExtraFunction(button.textContent)));

function appendDigit(digit) {
  if (currentOperationScreen.textContent === '0' || shouldResetScreen) resetScreen();
  currentOperationScreen.textContent += digit;
}

function resetScreen() {
  currentOperationScreen.textContent = '';
  shouldResetScreen = false;
}

function clear() {
  currentOperationScreen.textContent = '0';
  lastOperationScreen.textContent = '';
  firstOperand = '';
  secondOperand = '';
  currentOperation = null;
}

function addDecimalPoint() {
  if (shouldResetScreen) resetScreen();
  if (!currentOperationScreen.textContent.includes('.')) {
    if (currentOperationScreen.textContent === '') {
      currentOperationScreen.textContent = '0';
    }
    currentOperationScreen.textContent += '.';
  }
}

function deleteLastCharacter() {
  currentOperationScreen.textContent = currentOperationScreen.textContent.slice(0, -1) || '0';
}

function chooseOperation(operator) {
  if (currentOperation !== null) evaluate();
  firstOperand = currentOperationScreen.textContent;
  currentOperation = operator;
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation}`;
  shouldResetScreen = true;
}

function evaluate() {
  if (currentOperation === null || shouldResetScreen) return;
  if (currentOperation === '÷' && currentOperationScreen.textContent === '0') {
    alert("Division by zero is not allowed!");
    return;
  }
  secondOperand = currentOperationScreen.textContent;
  currentOperationScreen.textContent = formatResult(calculate(currentOperation, firstOperand, secondOperand));
  lastOperationScreen.textContent = `${firstOperand} ${currentOperation} ${secondOperand} =`;
  currentOperation = null;
}

function formatResult(result) {
  return Number(result);
}

function handleKeyboardInput(event) {
  if (event.key >= 0 && event.key <= 9) appendDigit(event.key);
  if (event.key === '.') addDecimalPoint();
  if (event.key === '=' || event.key === 'Enter') evaluate();
  if (event.key === 'Backspace') deleteLastCharacter();
  if (event.key === 'Escape') clear();
  if (['+', '-', '*', '/'].includes(event.key)) chooseOperation(convertOperator(event.key));
}

function convertOperator(keyboardOperator) {
  return keyboardOperator === '/' ? '÷' : keyboardOperator === '*' ? '×' : keyboardOperator === '-' ? '−' : '+';
}

function calculate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b !== 0 ? a / b : null;
    default: return null;
  }
}

function handleExtraFunction(value) {
  let currentValue = currentOperationScreen.textContent;
  try {
    switch (value) {
      case '1/x':
        currentValue = (1 / parseFloat(currentValue));
        break;
      case '√':
        currentValue = Math.sqrt(parseFloat(currentValue)).toFixed(4);
        break;
      case 'x2':
        currentValue = Math.pow(parseFloat(currentValue), 2);
        break;
      case '^':
        if (currentOperation !== null) {
          evaluate();
        }
        firstOperand = currentOperationScreen.textContent;
        currentOperation = '^';
        lastOperationScreen.textContent = `${firstOperand} ^`;
        shouldResetScreen = true;
        return;
      default:
        break;
    }
  } catch (error) {
    currentValue = "Error";
  }
  currentOperationScreen.textContent = currentValue;
}
