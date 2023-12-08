const term = new Terminal({
    cursorBlink: true,
    fontFamily: 'monospace'
});
term.open(document.getElementById('terminal'));
term.write('user@host:/$ ')

const DIR = "user@host:/$ "
let newLine = '';
term.onKey(function(event) {
    if(event.key === '\x7F'){   //Backspace
        if (newLine.length === 0) {
        } else {
            newLine = newLine.substring(0, newLine.length-1)
            term.write("\b \b")
        }
    }else if (event.key === "\r") {
        if (newLine === 'docker pull nginx') {
            run();
        }
        term.write("\r\n")
        term.write(DIR)
        newLine = ''
    } else {
        newLine += event.key;
        term.write(event.key)
    }


})

function run() {
    document.querySelector("#motion-demo").classList.add("animate-image")
}