document.querySelectorAll('.digit').forEach(btn => btn.addEventListener("click", e => appendOperand(e.target.textContent)))
document.querySelectorAll('.operator').forEach(btn => btn.addEventListener("click", e => handleOperator(e.target.textContent)))

document.querySelector('#EQ').addEventListener("click", solve)
document.querySelector('#CLEAR').addEventListener("click", clear)
document.querySelector('#DEL').addEventListener("click", clearEntry)

const input = document.querySelector('#input')
const error = document.querySelector('#error')

const precisionFactor = 100

const expression = {
    operator: "",
    operand1: "",
    operand2: "",
}

function appendOperand(symbol) {
    removeError()
    expression[getCurrentOperand()] += symbol
    updateDisplay()
}

function handleOperator(symbol) {
    if (symbol === "-" && (!isSet("operand1") || isSet("operator") && !isSet("operand2"))) {
        removeError()
        appendOperand(symbol)
    } else {
        if (isSet("operator")) { solve() }
        expression.operator = symbol
        updateDisplay()
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
        case "+": return a + b
        case "-": return a - b
        case "×": return a * b
        case "÷": return a / b
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
    
    if (isNaN(+input.value) || !isFinite(+input.value)) {
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

function getCurrentOperand() {
    return isSet("operator") ? "operand2" : "operand1"
}