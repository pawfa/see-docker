const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 600;
canvas.style.background = "white"
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

const imagesArr = [];
const containersArr = [];

let input = {
    command: '',
    options: [],
    name: ''
}
function parseDockerCommand() {
    console.log(newLine)
    if (newLine.startsWith('docker rm ')) {
        lastCommand = newLine
    }
    if (newLine === 'docker images') {
        lastCommand = 'docker images'
        input = {
            command: 'docker images'
        }
    }
    if (newLine === 'docker ps') {
        lastCommand = 'docker ps'
        input = {
            command: 'docker ps'
        }
    }
    if (newLine === 'docker container prune') {
        lastCommand = 'docker container prune'
        input = {
            command: 'docker container prune'
        }
    }
    if (newLine === 'docker ps -a') {
        lastCommand = 'docker ps -a'
        input = {
            command: 'docker ps',
            options: ["-a"]
        }
    }
    if (newLine === 'docker pull ubuntu') {
        lastCommand = 'docker pull ubuntu'
        input = {
            command: 'docker pull',
            name: ["ubuntu"]
        }
    }

    if (newLine === 'docker run') {
        lastCommand = 'docker run'
        input = {
            command: 'docker run',
            name: ["ubuntu"],
            args: [`echo "hello from container!"`]
        }
    }
}

function dockerImages() {
    const logs = ["REPOSITORY                     TAG       IMAGE ID       CREATED         SIZE"];
    for (const dockerImage of imagesArr) {
        logs.push(`${dockerImage.name}                         latest    ${dockerImage.id.substring(0, 11)}   9 days ago      77.8MB`);
    }
    return logs.join("\r\n");
}

function dockerContainers() {
    const logs = ["CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS        PORTS     NAMES"];

    for (const dockerImage of containersArr) {
        if (!input.options) {
            if(dockerImage.status !== 'exited'){
                logs.push(`${dockerImage.id.substring(0, 11)}   ${dockerImage.name}     "/docker-entrypoint.…"   4 seconds ago   Up 1 second   80/tcp    focused_johnson`);
            }
        }else if (input.options.includes("-a")) {

            logs.push(`${dockerImage.id.substring(0, 11)}   ${dockerImage.name}     "/docker-entrypoint.…"   4 seconds ago   Up 1 second   80/tcp    focused_johnson`);
        }
    }
    return logs.join("\r\n");
}

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
    parseDockerCommand()
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
    const pathName = window.location.pathname;
    const currentTask = pathName.match(/task-\d/g)?.[0];
    const taskNo = !currentTask ? 1 :currentTask[currentTask.length-1];
    if (Number(taskNo) === 7) {
        return
    }
    const pathsSplitted = pathName.split("/")
    pathsSplitted.splice(-1)
    const path = pathsSplitted.filter(Boolean).join("/")

    window.location.href = `${window.location.origin}/${path}/task-${Number(taskNo)+1}.html`
}