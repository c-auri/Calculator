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
const clearEntryButton = document.querySelector('#CE')

digitButtons.forEach(btn => btn.addEventListener("click", e => appendOperand(e.target.textContent)))
operatorButtons.forEach(btn => btn.addEventListener("click", e => handleOperator(e.target.textContent)))
equalsButton.addEventListener("click", solve)
clearButton.addEventListener("click", clear)
clearEntryButton.addEventListener("click", clearEntry)

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
        updateDisplay()
    }
}

function solve() {
    if (!isSet("operand2")) {
        return
    }

    expression.operand1 = String(operate(expression.operator, +expression.operand1, +expression.operand2))
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
    expression.operator = ""
    expression.operand1 = ""
    expression.operand2 = ""
    updateDisplay()
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

    if (isSet("operator")) {
        input.value += ` ${expression.operator} ${expression.operand2}`
    }

    console.log(expression)
}

function isSet(property) {
    return expression[property].length > 0
}

function getCurrentOperator() {
    return isSet("operator") ? "operand2" : "operand1"
}