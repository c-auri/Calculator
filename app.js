window.addEventListener("keydown", handleKeypress)

document.querySelectorAll('.digit').forEach(btn => btn.addEventListener("click", e => handleOperand(e.target.textContent)))
document.querySelectorAll('.operator').forEach(btn => btn.addEventListener("click", e => handleOperator(e.target.textContent)))
document.querySelector('#point').addEventListener("click", handleDecimalPoint)

document.querySelector('#EQ').addEventListener("click", solve)
document.querySelector('#CLEAR').addEventListener("click", clearAll)
document.querySelector('#DEL').addEventListener("click", clearLastEntry)

const error = document.querySelector('#error')
const input = document.querySelector('#input')
input.textContent = ''

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
        handleOperand(key)
    } else if (operatorKeys.includes(key)) {
        e.preventDefault()
        handleOperator(key)
    } else if (key === '.') {
        handleDecimalPoint()
    } else if (key === 'Enter') {
        solve()
    } else if (key === 'Backspace') {
        clearLastEntry()
    } else if (key === 'Escape') {
        clearAll()
    } else {
        return
    }

    animateKeyPress(key)
}

function handleOperand(symbol) {
    removeError()
    appendCurrentOperand(symbol)
    updateDisplay()
}

function handleOperator(symbol) {
    if (isMinusSign(symbol)) {
        handleOperand(symbol)
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
        handleOperand('0')
    }
    if (!getCurrentOperand().includes('.')) {
        handleOperand('.')
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

function animateKeyPress(key) {
    const button = document.querySelector(`[data-key="${key}"]`)
    button.classList.add('pressed')
    setTimeout(() => button.classList.remove('pressed'), 100)
}

function clearAll() {
    removeError()
    clearExpression()
    updateDisplay()
}

function clearExpression() {
    expression.operator = ""
    expression.operand1 = ""
    expression.operand2 = ""
    input.textContent = ''
}

function clearLastEntry() {
    if (isSet("operand2")) {
        sliceProperty("operand2")
    } else if (isSet("operator")) {
        sliceProperty("operator")
    } else if (isSet("operand1")) {
        sliceProperty("operand1")
    }

    updateDisplay()
}

function sliceProperty(property) {
    expression[property] = expression[property].slice(0, -1)
}

function updateDisplay() {
    input.textContent = expression.operand1

    if (!isValid(input.textContent)) {
        showError()
        clearExpression()
    }

    if (isSet("operator")) {
        input.textContent += ` ${expression.operator} ${expression.operand2}`
    }
}

function isValid(number) {
    return number === '-' || (!isNaN(+number) && isFinite(+number))
}

function updateCursor(input) {
    input.selectionStart = input.selectionEnd = input.textContent.length
}

function showError() {
    error.classList.remove('hidden')
}

function removeError() {
    error.classList.add('hidden')
}

function isMinusSign(symbol) {
    return symbol === '-'
        && (!isSet("operand1") || isSet("operator") && !isSet("operand2"))
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