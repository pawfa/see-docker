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

ubuntuContainerRunning.setStatus('exited')

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
helloWorldContainerExited.setStatus('exited')


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
    helloWorldContainerExited.draw()
    ubuntuContainerRunning.draw();
}

draw();

term.onKey(function (event) {
    handleXtermInput(event,taskInputHandle)
});

function taskInputHandle() {
    if (newLine.startsWith('docker rm ')) {
        const id = newLine.split(" ")[2];
        const foundContainer = containerArr.find((container)=> container.id);
        foundContainer.setStatus('removed')
    }
    if (newLine === 'docker images') {
        term.write("\r\n");
        term.write(dockerImages());
        setConsoleToNewLine()
    }
    if (newLine === 'docker ps' || newLine === 'docker ps -a') {
         const cmd = newLine;


        for (let i = 0; i < logs[cmd].length; i++) {
            setTimeout(() => {
                term.write(logs[cmd][i][1]);
                logs[cmd][i][0] === 3000 && dockerImage.setStatus('exited')
                if (i === logs[cmd].length-1) {
                    setConsoleToNewLine()
                }
            }, Number(logs[cmd][i][0]));
        }
    }
}

function dockerImages() {
    const logs = ["REPOSITORY                     TAG       IMAGE ID       CREATED         SIZE"];
    for (const dockerImage of imagesArr) {
        logs.push(`${dockerImage.name}                         latest    ${dockerImage.id.substring(0,11)}   9 days ago      77.8MB`)
    }
    return logs.join("\r\n");
}

function dockerContainers() {
    const logs = ["CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS        PORTS     NAMES"];
    for (const dockerImage of containerArr) {
        logs.push(`${dockerImage.name}                         latest    ${dockerImage.id.substring(0,11)}   9 days ago      77.8MB`)
    }
    return logs.join("\r\n");
}
const logs = {
    'docker ps': [
        [0, "CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS        PORTS     NAMES\r\n" +
        "55cd75ded759   ubuntu     \"/docker-entrypoint.…\"   4 seconds ago   Up 1 second   80/tcp    focused_johnson"]
    ],
    'docker ps -a': [
        [0, "CONTAINER ID  IMAGE         COMMAND                 CREATED             STATUS                   PORTS    NAMES\r\n" +
        "55cd75ded759  hello-world   \"/docker-entrypoint.…\"  About a minute ago  Exited (0) 30 seconds ago         epic_kapitsa"]
    ],

};