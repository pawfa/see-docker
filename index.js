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

const img = new Image();
img.src = "./img/logo-docker.JPG";


class Drawables {
    elements = []

    add(...elements) {
        for (const element of elements) {
            if (Array.isArray(element)) {
                this.elements.push(...element)
            } else {
                this.elements.push(element)
            }
        }
    }

    drawAll() {
        this.elements.forEach((drawable => drawable.draw()));
    }
}

const drawables = new Drawables()

function draw() {
    window.requestAnimationFrame(draw);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.1
    ctx.drawImage(img, 0, 0, img.width, img.height,0,10,img.width*0.8,img.height*0.8);

    drawables.drawAll();
}
term.onKey(function (event) {
    handleXtermInput(event, taskInputHandle);
});

draw();
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

            // TODO Fix docker run ubuntu echo "hello!" displaying "hello from container"
            if (newLine.startsWith('docker run')) {
                lastCommand = 'docker run'
                let echoCommand = ''
                if (splitted[3] === 'echo') {
                    const [,,,,...rest] = splitted
                    echoCommand = rest.join(" ")
                }
                input = {
                    command: 'run',
                    name: splitted[2],
                    args: splitted[3] === 'echo' ? [`${splitted[3]} ${echoCommand}`]:[]
                }
            }
            term.write("\r\n");
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

    for (const dockerContainer of containersArr) {
        if (!input.options) {
            if(dockerContainer.status !== 'exited' || dockerContainer.status !== 'removed'){
                logs.push(`${dockerContainer.id.substring(0, 11)}   ${dockerContainer.name}         "/docker-entrypoint.…"   4 seconds ago   Up 1 second   80/tcp    focused_johnson`);
            }
        }else if (input.options.includes("-a")) {
            logs.push(`${dockerContainer.id.substring(0, 11)}   ${dockerContainer.name}${new Array(15 -dockerContainer.name.length).fill(0).map(()=> " ").join("")}"/docker-entrypoint.…"   4 seconds ago   ${dockerContainer.status === 'exited'? "Exited" : "Up 1 second"}   80/tcp    focused_johnson`);
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
        parseDockerCommand()
        if (!input.command) {
            setConsoleToNewLine()
        } else {
            onEnter(event)
        }
    } else if(event.key === '\x16') {
        // Handle Ctrl + V
        navigator.clipboard.readText()
            .then(text => {
                newLine += text;
                term.write(text);
            });
    } else if(event.key === '\x03') {
        // Handle Ctrl + C
        if (term.hasSelection()) {
            navigator.clipboard.writeText(term.getSelection())
        } else {
            setConsoleToNewLine()
            input = {}
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
    input = {}
}

const x = document.createElement("BUTTON");
const t = document.createTextNode("Next");
x.appendChild(t);
document.querySelector(".left-side").appendChild(x);

x.classList.add("next-btn")

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