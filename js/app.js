import { operate } from "./math.js"

let operator = undefined
let operand1 = undefined
let operand2 = undefined

const input = document.querySelector('#input')
const digitButtons = document.querySelectorAll('.digit')
const operatorButtons = document.querySelectorAll('.operator')
const equalsButton = document.querySelector('#EQ')
const clearButton = document.querySelector('#C')

digitButtons.forEach(btn => btn.addEventListener("click", e => appendDisplay(e.target.textContent)))
operatorButtons.forEach(btn => btn.addEventListener("click", e => handleOperator(e.target.textContent)))
equalsButton.addEventListener("click", solve)
clearButton.addEventListener("click", clear)

function handleOperator(symbol) {
    if (typeof operator === "undefined") {
        setOperand1()
    } else {
        solve()
    }

    operator = symbol
    appendDisplay(` ${symbol} `)
}

function solve() {
    setOperand2()
    const result = operate(operator, operand1, operand2)
    operator = undefined
    operand2 = undefined
    resetDisplay(`${result}`)
    setOperand1()
}

function clear() {
    operator = undefined
    operand1 = undefined
    operand2 = undefined
    resetDisplay("")
}

function setOperand1() {
    operand1 = parseInt(input.value)
}

function setOperand2() {
    operand2 = parseInt(input.value.split(operator)[1])
}

function appendDisplay(symbol) {
    input.value += symbol
    input.selectionStart = input.value.length
}

function resetDisplay(string) {
    input.value = string
}