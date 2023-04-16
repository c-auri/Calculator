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
    if (numberKeys.includes(e.key)) {
        appendOperand(e.key)
    } else if (operatorKeys.includes(e.key)) {
        e.preventDefault()
        handleOperator(e.key)
    } else if (e.key === '.') {
        handleDecimalPoint()
    } else if (e.key === 'Enter') {
        solve()
    } else if (e.key === 'Backspace') {
        clearEntry()
    } else if (e.key === 'Escape') {
        clear()
    }
}

function appendOperand(symbol) {
    removeError()
    appendCurrentOperand(symbol)
    updateDisplay()
}

function handleOperator(symbol) {
    switch (symbol) {
        case '*':
            handleOperator("×")
            break;
        case '/':
            handleOperator("÷")
            break;
        case '-':
            if (!isSet("operand1") || isSet("operator") && !isSet("operand2")) {
                appendOperand(symbol)
                break;
            }
            // intentional fallthrough
        default:
            if (isSet("operator")) {
                solve()
            }

            if (!isSet("operand1") && !['+', '-'].includes(symbol)) {
                appendCurrentOperand('1')
            }

            expression.operator = symbol
            updateDisplay()
            break;
    }
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

    let result = operate(expression.operator, +expression.operand1, +expression.operand2)
    result = Math.round(result * precisionFactor) / precisionFactor

    expression.operand1 = String(result)
    expression.operand2 = ""
    expression.operator = ""
    updateDisplay()
}

function operate(operator, a, b) {
    switch (operator) {
        case "+":
            return a + b
        case "-":
            return a - b
        case "×":
            return a * b
        case "÷":
            return a / b
    }
}

function clear() {
    removeError()
    clearExpression()
    updateDisplay()
}

function clearExpression() {
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
        clearExpression()
    }

    if (isSet("operator")) {
        input.value += ` ${expression.operator} ${expression.operand2}`
    }
}

function showError() {
    error.classList.remove('hidden')
}

function removeError() {
    error.classList.add('hidden')
}

function isSet(property) {
    return expression[property].length > 0
}

function getCurrentOperandName() {
    return isSet("operator") ? "operand2" : "operand1"
}

function getCurrentOperand() {
    return expression[getCurrentOperandName()]
}

function appendCurrentOperand(symbol) {
    expression[getCurrentOperandName()] += symbol
}