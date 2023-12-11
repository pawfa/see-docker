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
const ubuntuContainerRunning = new DockerImage({
    position: {x: 220, y: 380},
    imageSrc: "./img/ubuntu-logo.png",
    scale: 60,
    name: "ubuntu"
});

ubuntuContainerRunning.setStatus('exited');

const helloWorldImage = new DockerImage({
    position: {x: 370, y: 360},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3,
    name: "hello-world"
});
const helloWorldContainerExited = new DockerImage({
    position: {x: 130, y: 380},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3,
    name: "hello-world"
});
helloWorldContainerExited.setStatus('exited');


const images = new Container({
    position: {
        x: 340,
        y: 340,
    },
    width: 200,
    height: 200,
    label: "Images"
});

const containers = new Container({
    position: {
        x: 110,
        y: 340,
    },
    width: 200,
    height: 200,
    label: "Containers"
});

const imagesArr = [helloWorldImage, ubuntuImage];
const containerArr = [helloWorldContainerExited, ubuntuContainerRunning];

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
    if (newLine.startsWith('docker rm ')) {
        lastCommand = newLine
    }
    if (newLine === 'docker images') {
        lastCommand = 'docker images'
    }
    if (newLine === 'docker ps') {
        lastCommand = 'docker ps'
    }
    if (newLine === 'docker container prune') {
        lastCommand = 'docker container prune'
    }
    if (newLine === 'docker ps -a') {
        lastCommand = 'docker ps -a'
    }

    if (lastCommand.startsWith('docker rm ')) {
        const id = newLine.split(" ")[2];
        const foundContainer = containerArr.find((container) => container.id.substring(0, 11) === id);
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
    console.log(lastCommand)

    if (lastCommand === 'docker container prune') {
        if (isWaitingForResponse) {
            for (const dockerImage of containerArr) {
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
    if (lastCommand === 'docker ps -a') {
        term.write("\r\n");
        term.write(dockerContainers(["-a"]));
        setConsoleToNewLine();
    }
}

canvas.onmousemove = function (e) {

    var rect = this.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;
    for (const image of [...containerArr, ...imagesArr]) {
        ctx.fillText(image.id, image.position.x, image.position.y);
        if (x > image.position.x && x < image.position.x + 50 && y > image.position.y && y < image.position.y + 50) {
            image.isHovered = true;
        } else if (image.isHovered) {
            image.isHovered = false;
        }
    }
};

function dockerImages() {
    const logs = ["REPOSITORY                     TAG       IMAGE ID       CREATED         SIZE"];
    for (const dockerImage of imagesArr) {
        logs.push(`${dockerImage.name}                         latest    ${dockerImage.id.substring(0, 11)}   9 days ago      77.8MB`);
    }
    return logs.join("\r\n");
}

function dockerContainers(args) {
    const logs = ["CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS        PORTS     NAMES"];

    for (const dockerImage of containerArr) {
        if (!args) {
            if(dockerImage.status !== 'exited'){
                logs.push(`${dockerImage.id.substring(0, 11)}   ${dockerImage.name}     "/docker-entrypoint.…"   4 seconds ago   Up 1 second   80/tcp    focused_johnson`);
            }
        }else if (args.includes("-a")) {
            logs.push(`${dockerImage.id.substring(0, 11)}   ${dockerImage.name}     "/docker-entrypoint.…"   4 seconds ago   Up 1 second   80/tcp    focused_johnson`);
        }
    }
    return logs.join("\r\n");
}
