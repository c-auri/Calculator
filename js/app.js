import { operate } from "./math.js"

let expression = {
    operator: "",
    operand1: "",
    operand2: "",
}

const input = document.querySelector('#input')
const digitButtons = document.querySelectorAll('.digit')
const operatorButtons = document.querySelectorAll('.operator')
const equalsButton = document.querySelector('#EQ')
const clearButton = document.querySelector('#C')

digitButtons.forEach(btn => btn.addEventListener("click", e => appendOperand(e.target.textContent)))
operatorButtons.forEach(btn => btn.addEventListener("click", e => handleOperator(e.target.textContent)))
equalsButton.addEventListener("click", solve)
clearButton.addEventListener("click", clear)

function appendOperand(symbol) {
    expression[getCurrentOperator()] += symbol
    updateDisplay()
}

function handleOperator(symbol) {
    if (symbol === "-" && (!isSet("operand1") || isSet("operator") && !isSet("operand2"))) {
        appendOperand(symbol)
    } else {
        if (isSet("operator")) { solve() }
        expression.operator = symbol
    }

    updateDisplay()
}

function solve() {
    expression.operand1 = operate(expression.operator, +expression.operand1, +expression.operand2)
    expression.operand2 = ""
    expression.operator = ""
    updateDisplay()
}

function clear() {
    expression.operator = ""
    expression.operand1 = ""
    expression.operand2 = ""
    updateDisplay()
}

function updateDisplay() {
    input.value = expression.operand1

    if (isSet("operator")) {
        input.value += ` ${expression.operator} ${expression.operand2}`
    }
}

function isSet(property) {
    return expression[property].length > 0
}

function getCurrentOperator() {
    return isSet("operator") ? "operand2" : "operand1"
}