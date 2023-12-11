const registry = new Container({
    position: {
        x: 500,
        y: 100,
    },
    width: 200,
    height: 100,
    label: "Registry (https://hub.docker.com)"
});

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

const imagesArr = [ubuntuImage];
const containerArr = [];

function draw() {
    window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    host.draw();
    images.draw();
    containers.draw();
    registry.draw();

    ubuntuImage.draw();
    helloWorldImage.draw();
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

    if (lastCommand === 'docker pull ubuntu') {
        term.write("\r\n");

        for (const logsKey in logs['docker pull ubuntu']) {

            if (logsKey === '0') {
                term.write(logs['docker pull ubuntu'][logsKey]);
            } else {
                setTimeout(() => {
                    term.write(logs['docker pull ubuntu'][logsKey]);
                    setConsoleToNewLine();
                }, Number(logsKey));
            }
        }

        dockerImage.runAnimation([['x', -200], ['y', 250], ['x', -225]]);
    }
}

const logs = {
    "docker pull ubuntu": {
        0: "Using default tag: latest\r\nlatest: Pulling from library/ubuntu\r\n719385e32844: Waiting",
        3000: "\033[A\33[2K\r\033[A\33[2K\rUsing default tag: latest\r\nlatest: Pulling from library/ubuntu\r\n719385e32844: Pull complete\r\nDigest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0\r\nStatus: Downloaded newer image for ubuntu:latest\r\ndocker.io/library/ubuntuhel:latest"
    }
};

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
