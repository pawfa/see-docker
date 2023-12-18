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
drawables.push(host,images,containers,ubuntuImage,helloWorldImage,helloWorldContainerExited,ubuntuContainerRunning);

function taskInputHandle(event) {
    if (input.command === 'rm') {
        const foundContainer = containersArr.find((container) => container.id.substring(0, 11) === input.name);
        term.write("\r\n");
        term.write(input.name);
        foundContainer.setStatus('removed');
        setConsoleToNewLine();
    }
    if (input.command === 'images') {
        term.write("\r\n");
        term.write(dockerImages());
        setConsoleToNewLine();
    }
    if (input.command === 'ps') {
        term.write("\r\n");
        term.write(dockerContainers());
        setConsoleToNewLine();
    }

    if (input.command === 'container' && input.name === 'prune') {
        if (isWaitingForResponse) {
            for (const dockerImage of containersArr.filter((container)=> container.status === 'exited')) {
                term.write("\r\n");
                term.write(dockerImage.id);
                dockerImage.setStatus('removed');
            }
            isWaitingForResponse = false
            setConsoleToNewLine();
        } else {
            isWaitingForResponse = true
            term.write("\r\n");
            term.write("WARNING! This will remove all stopped containers.\r\n" +
                "Are you sure you want to continue? [y/N]");
        }
    }
}


