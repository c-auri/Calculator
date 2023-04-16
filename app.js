window.addEventListener("keydown", handleKeypress)

document.querySelectorAll('.digit').forEach(btn => btn.addEventListener("click", e => appendOperand(e.target.textContent)))
document.querySelectorAll('.operator').forEach(btn => btn.addEventListener("click", e => handleOperator(e.target.textContent)))
document.querySelector('#point').addEventListener("click", handleDecimalPoint)

document.querySelector('#EQ').addEventListener("click", solve)
document.querySelector('#CLEAR').addEventListener("click", clear)
document.querySelector('#DEL').addEventListener("click", clearEntry)

const error = document.querySelector('#error')
const input = document.querySelector('#input')
input.value = ''

const precisionFactor = 100

const expression = {
    operator: "",
    operand1: "",
    operand2: "",
}

const numberKeys = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ]
const operatorKeys = [ '+', '-', '*', '×', '/', '÷', ]

function handleKeypress(e) {
    let key = e.key

    if (key === '*') key = '×'
    if (key === '/') key = '÷'

    if (numberKeys.includes(key)) {
        appendOperand(key)
    } else if (operatorKeys.includes(key)) {
        e.preventDefault()
        handleOperator(key)
    } else if (key === '.') {
        handleDecimalPoint()
    } else if (key === 'Enter') {
        solve()
    } else if (key === 'Backspace') {
        clearEntry()
    } else if (key === 'Escape') {
        clear()
    } else {
        return
    }

    animateKeyPress(key)
}

function appendOperand(symbol) {
    removeError()
    appendCurrentOperand(symbol)
    updateDisplay()
}

function handleOperator(symbol) {
    if (symbol === '-' && (!isSet("operand1") || isSet("operator") && !isSet("operand2"))) {
        appendOperand(symbol)
        return
    }

    if (isSet("operator")) {
        solve()
    }

    if (!isSet("operand1") && !['+', '-'].includes(symbol)) {
        appendCurrentOperand('1')
    }

    expression.operator = symbol
    updateDisplay()
}

function handleDecimalPoint() {
    if (!getCurrentOperand()) {
        appendOperand('0')
    }
    if (!getCurrentOperand().includes('.')) {
        appendOperand('.')
    }
}

function solve() {
    if (!isSet("operand2")) {
        return
    }

    let result = operate(expression)
    result = Math.round(result * precisionFactor) / precisionFactor

    expression.operand1 = String(result)
    expression.operand2 = ""
    expression.operator = ""
    updateDisplay()
}

function operate({ operator, operand1, operand2 }) {
    switch (operator) {
        case "+":
            return +operand1 + +operand2
        case "-":
            return +operand1 - +operand2
        case "×":
            return +operand1 * +operand2
        case "÷":
            return +operand1 / +operand2
    }
}

function clear() {
    removeError()
    clearAll()
    updateDisplay()
}

function clearAll() {
    expression.operator = ""
    expression.operand1 = ""
    expression.operand2 = ""
    input.value = ''
}

function clearEntry() {
    if (isSet("operand2")) {
        clearLast("operand2")
    } else if (isSet("operator")) {
        clearLast("operator")
    } else if (isSet("operand1")) {
        clearLast("operand1")
    }

    updateDisplay()
}

function clearLast(property) {
    expression[property] = expression[property].slice(0, -1)
}

function updateDisplay() {
    input.value = expression.operand1

    if (input.value !== '-' && (isNaN(+input.value) || !isFinite(+input.value))) {
        showError()
        clearAll()
    }

    if (isSet("operator")) {
        input.value += ` ${expression.operator} ${expression.operand2}`
    }
}

function animateKeyPress(key) {
    const button = document.querySelector(`[data-key="${key}"]`)
    button.classList.add('pressed')
    setTimeout(() => button.classList.remove('pressed'), 100)
}

function isSet(property) {
    return expression[property].length > 0
}

function getCurrentOperand() {
    return expression[getCurrentOperandName()]
}

function appendCurrentOperand(symbol) {
    expression[getCurrentOperandName()] += symbol
}

function getCurrentOperandName() {
    return isSet("operator") ? "operand2" : "operand1"
}

function showError() {
    error.classList.remove('hidden')
}

function removeError() {
    error.classList.add('hidden')
}