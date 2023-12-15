const host = new Container({
    position: {
        x: 50,
        y: 250,
    },
    width: 500,
    height: 300,
    label: "Host"
});

const ubuntuImage = new DockerImage({
    position: {x: 450, y: 360},
    imageSrc: "./img/ubuntu-logo.png",
    scale: 60,
    name: "ubuntu"
});
imagesArr.push(ubuntuImage)
const ubuntuContainerRunning = new DockerImage({
    position: {x: 220, y: 380},
    imageSrc: "./img/ubuntu-logo.png",
    scale: 60,
    name: "ubuntu"
});
containersArr.push(ubuntuContainerRunning)
ubuntuContainerRunning.setStatus('running');

const helloWorldImage = new DockerImage({
    position: {x: 370, y: 360},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3,
    name: "hello-world"
});
imagesArr.push(helloWorldImage)
const helloWorldContainerExited = new DockerImage({
    position: {x: 130, y: 380},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3,
    name: "hello-world"
});
containersArr.push(helloWorldContainerExited)
helloWorldContainerExited.setStatus('exited');


const images = new Container({
    position: {
        x: 340,
        y: 340,
    },
    width: 200,
    height: 200,
    label: "Images",
    style: {
        backgroundColor: 'white'
    }
});

const containers = new Container({
    position: {
        x: 110,
        y: 340,
    },
    width: 200,
    height: 200,
    label: "Containers",
    style: {
        backgroundColor: 'white'
    }
});

function draw() {
    window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    host.draw();
    images.draw();
    containers.draw();

    ubuntuImage.draw();
    helloWorldImage.draw();
    helloWorldContainerExited.draw();
    ubuntuContainerRunning.draw();
}

draw();

term.onKey(function (event) {
    handleXtermInput(event, taskInputHandle);
});
let lastCommand = ''
let isWaitingForResponse = false;
function taskInputHandle(event) {
    if (lastCommand.startsWith('docker rm ')) {
        const id = newLine.split(" ")[2];
        const foundContainer = containersArr.find((container) => container.id.substring(0, 11) === id);
        term.write("\r\n");
        term.write(id);
        foundContainer.setStatus('removed');
        setConsoleToNewLine();
    }
    if (lastCommand === 'docker images') {
        term.write("\r\n");
        term.write(dockerImages());
        setConsoleToNewLine();
    }
    if (lastCommand === 'docker ps') {
        term.write("\r\n");
        term.write(dockerContainers());
        setConsoleToNewLine();
    }

    if (lastCommand === 'docker container prune') {
        if (isWaitingForResponse) {
            for (const dockerImage of containersArr) {
                term.write("\r\n");
                term.write(dockerImage.id);
                dockerImage.setStatus('removed');
            }
            isWaitingForResponse = false
            setConsoleToNewLine();
        } else {
            term.write("\r\n");
            term.write("WARNING! This will remove all stopped containers.\r\n" +
                "Are you sure you want to continue? [y/N]");
            isWaitingForResponse = true
        }
    }
    if (lastCommand === 'docker ps') {
        term.write("\r\n");
        term.write(dockerContainers());
        setConsoleToNewLine();
    }
}


