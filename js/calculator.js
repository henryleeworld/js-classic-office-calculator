'use strict';

const buttons = document.querySelectorAll('.button');
const currentOutput = document.querySelector('.calculator-screen');
const memoryIndicator = document.querySelector('.calculator-screen-mem');
const result = [];
let currentOperator = null;
let operator = null;
let equalsPressed = false;
let secondValue = null;
let functionAdded = false;
let memory = 0;

const getOutput = () => currentOutput.value;
const setOutput = (value) =>
    (currentOutput.value = value.toString().slice(0, 10));

const printNumber = (value) => {
    let output = getOutput();
    if (equalsPressed || output === 'Error') {
        reset();
        output = '';
    }
    if (currentOperator) {
        operator = currentOperator;
        currentOperator = null;
        output = '';
    }
    if (functionAdded) {
        functionAdded = false;
        output = '';
    }
    if (value === '.') {
        if (output.indexOf('.') !== -1) return;
    } else if (output === '0') output = '';

    setOutput((output += value));
};

const addOperator = (operation) => {
    if (currentOperator || getOutput() === 'Error') return;
    if (equalsPressed) operator = null;
    if (operator) calculateResultHandler();
    equalsPressed = false;
    functionAdded = false;
    result.push(+getOutput(), operation);
    currentOperator = operation;
};

const calculateResultHandler = () => {
    if (equalsPressed) result.push(+getOutput(), operator);
    else secondValue = +getOutput();
    const firstValue = result[result.length - 2];
    if (operator === 'DIVIDE' && secondValue === 0) {
        setOutput('Error');
        return;
    }
    let resultValue = calculateResult(operator, firstValue, secondValue);
    result.push(secondValue, 'EQUALS');
    equalsPressed = true;
    console.log(result);
    if (resultValue > 9999999999) {
        setOutput('Error');
        operator = null;
    } else setOutput(resultValue);
};

const calculateResult = (operation, firstValue, secondValue) => {
    switch (operation) {
        case 'ADD':
            return +math.add(math.bignumber(firstValue), math.bignumber(secondValue));
        case 'SUBTRACT':
            return +math.subtract(
                math.bignumber(firstValue),
                math.bignumber(secondValue)
            );
        case 'MULTIPLY':
            return +math.multiply(
                math.bignumber(firstValue),
                math.bignumber(secondValue)
            );
        case 'DIVIDE':
            return +math.divide(
                math.bignumber(firstValue),
                math.bignumber(secondValue)
            );
    }
};

const addFunction = (func) => {
    let output = getOutput();
    if (output === 'Error' || output === '0') return;
    switch (func) {
        case 'NEGATE':
            output = -output;
            break;
        case 'SQUARE':
            if (+output >= 0) {
                output = +math.sqrt(math.bignumber(output));
                functionAdded = true;
            } else {
                output = 'Error';
            }
            break;
        case 'PERCENT':
            output = +math.multiply(math.bignumber(output), 0.01);
            functionAdded = true;
            break;
        case 'BACKSPACE':
            if (currentOperator) return;
            if (output.length > 1) {
                output = output.slice(0, -1);
            } else output = 0;
            break;
    }
    setOutput(output);
};

const memoryAccess = (type) => {
    let output = getOutput();
    if (output === 'Error') return;
    switch (type) {
        case 'MPLUS':
            memory += +output;
            memoryIndicator.classList.add('calculator-screen-mem_visible');
            break;
        case 'MMINUS':
            memory -= +output;
            memoryIndicator.classList.add('calculator-screen-mem_visible');
            break;
        case 'MRC':
            setOutput(memory);
            if (currentOperator) operator = currentOperator;
            currentOperator = null;
    }
    functionAdded = true;
};

const buttonHandler = (type, value) => {
    switch (type) {
        case 'number':
            printNumber(value);
            break;
        case 'operation':
            addOperator(value);
            break;
        case 'equals':
            if (operator) calculateResultHandler();
            break;
        case 'clear':
            reset();
            break;
        case 'function':
            addFunction(value);
            break;
        case 'memory':
            memoryAccess(value);
            break;
    }
};

const reset = () => {
    currentOperator = null;
    operator = null;
    equalsPressed = false;
    secondValue = null;
    result.length = 0;
    memory = 0;
    memoryIndicator.classList.remove('calculator-screen-mem_visible');
    setOutput(0);
    console.clear();
};

for (const element of buttons) {
    element.addEventListener('click', function handler() {
        buttonHandler(element.dataset.type, element.value);
    });
}