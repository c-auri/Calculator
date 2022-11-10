const input = document.querySelector('#input')

const digitButtons = document.querySelectorAll('.digit')
const operatorButtons = document.querySelectorAll('.operator')
const inputButtons = document.querySelectorAll('.digit, .operator, #dot')

inputButtons.forEach(btn => btn.addEventListener("click", e => writeToDisplay(e.target.textContent)))

function writeToDisplay(character) {
    input.value += character
    input.selectionStart = input.value.length
}