const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 600;
canvas.style.background = "white"
const ctx = canvas.getContext("2d");

let term = new Terminal({
    cursorBlink: true,
    fontFamily: 'monospace',
    fontSize: 12,
    cols: 120,
    rows: 33
});
term.open(document.getElementById('terminal'));
term.write('user@host:/$ ');

term.attachCustomKeyEventHandler((arg) => {
    if (arg.ctrlKey && arg.code === "KeyV" && arg.type === "keydown") {
        navigator.clipboard.readText()
            .then(text => {
                term.write(text);
            })
    };
    if (arg.ctrlKey && arg.code === "KeyC" && arg.type === "keydown") {
        setConsoleToNewLine()
    }
    return true;
});

const DIR = "user@host:/$ ";
let newLine = '';
let isWaitingForResponse = false;

const imagesArr = [];
const containersArr = [];

const dockerCommands = ["pull", "run", "rm", "ps", "images", "container"]

let input = {
    command: '',
    options: [],
    args: [],
    name: ''
}
function parseDockerCommand() {
    if(isWaitingForResponse) {
        return
    }
    if (newLine.startsWith("docker")) {
        const splitted = newLine.split(" ");
        const commandName = splitted?.[1];

        if (dockerCommands.includes(commandName)) {
            input = {
                command: commandName
            }

            if (input.command === 'rm' || input.command === 'pull' || input.command === 'container') {
                if (splitted[2]) {
                    input.name = splitted[2]
                }
            }
            if (input.command === 'ps') {
                if (splitted[2] === "-a") {
                    input.options = splitted[2]
                }
            }

            if (newLine.startsWith('docker run')) {
                lastCommand = 'docker run'
                input = {
                    command: 'run',
                    name: splitted[2],
                    args: splitted[3] ? [`echo "hello from container!"`]:[]
                }
            }
        } else {
            if (!input.command) {
                term.write(getUnknownDockerCommand(commandName));
                setConsoleToNewLine()
            }
        }
    }
}

function dockerImages() {
    const logs = ["REPOSITORY                     TAG       IMAGE ID       CREATED         SIZE"];
    for (const dockerImage of imagesArr.filter(image=> image.status !== 'registry')) {
        logs.push(`${dockerImage.name}${new Array(31 -dockerImage.name.length).fill(0).map(()=> " ").join("")}latest    ${dockerImage.id.substring(0, 11)}   9 days ago      77.8MB`);
    }
    return logs.join("\r\n");
}

function dockerContainers() {
    const logs = ["CONTAINER ID  IMAGE          COMMAND                  CREATED         STATUS        PORTS     NAMES"];

    for (const dockerImage of containersArr) {
        if (!input.options) {
            if(dockerImage.status !== 'exited'){
                logs.push(`${dockerImage.id.substring(0, 11)}   ${dockerImage.name}         "/docker-entrypoint.…"   4 seconds ago   Up 1 second   80/tcp    focused_johnson`);
            }
        }else if (input.options.includes("-a")) {
            logs.push(`${dockerImage.id.substring(0, 11)}   ${dockerImage.name}${new Array(15 -dockerImage.name.length).fill(0).map(()=> " ").join("")}"/docker-entrypoint.…"   4 seconds ago   Up 1 second   80/tcp    focused_johnson`);
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
            parseDockerCommand()
            onEnter(event)
        }
    } else {
        newLine += event.key;
        term.write(event.key);
    }
}

function getUnknownDockerCommand(command) {
    return `\r\ndocker: '${command}' is not a docker command.\r\nSee 'docker --help'`
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