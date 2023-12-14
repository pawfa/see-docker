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
    name: 'ubuntu'
});
const ubuntuContainerRunning = new DockerImage({
    position: {x: 220, y: 380},
    imageSrc: "./img/ubuntu-logo.png",
    scale: 60,
    name: 'ubuntu'
});

ubuntuContainerRunning.setStatus('running')

const helloWorldImage = new DockerImage({
    position: {x: 370, y: 360},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3,
    name: 'hello-world'
});
const helloWorldContainerExited = new DockerImage({
    position: {x: 130, y: 380},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3,
    name: 'hello-world'
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

imagesArr.push(helloWorldImage, ubuntuImage)
containersArr.push(helloWorldContainerExited, ubuntuContainerRunning)

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
}