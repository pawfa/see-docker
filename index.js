const canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext("2d");

let term = new Terminal({
    cursorBlink: true,
    fontFamily: 'monospace',
    fontSize: 12,
    cols: 120
});
term.open(document.getElementById('terminal'));
term.write('user@host:/$ ');


const DIR = "user@host:/$ ";
let newLine = '';

function handleXtermInput(event,onEnter) {
    if (event.key === '\x7F') {   //Backspace
        if (newLine.length === 0) {
        } else {
            newLine = newLine.substring(0, newLine.length - 1);
            term.write("\b \b");
        }
    } else if (event.key === "\r") {
        if (newLine === '') {
            setConsoleToNewLine()
        } else {
            onEnter(event)
        }
    } else {
        newLine += event.key;
        term.write(event.key);
    }
}

function setConsoleToNewLine() {
    term.write("\r\n");
    term.write(DIR);
    newLine = '';
}

var x = document.createElement("BUTTON");
var t = document.createTextNode("Next");
x.appendChild(t);
document.body.appendChild(x);

x.onclick = ()=>{
    const current = window.location.href;
    const currentTask = current.match(/task-\d/g)[0];
    const taskNo = currentTask[currentTask.length-1];
    window.location.href = current.substring(0, current.length - 6) + `${Number(taskNo)+1}.html`
}