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
ubuntuImage.setStatus('downloaded')
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
helloWorldImage.setStatus('downloaded')
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

imagesArr.push(helloWorldImage, ubuntuImage)
containersArr.push(helloWorldContainerExited, ubuntuContainerRunning)
drawables.push(host,images,containers,ubuntuImage,helloWorldImage, helloWorldContainerExited,ubuntuContainerRunning)

function taskInputHandle() {
    if (input.command === 'images') {
        console.log(imagesArr)
        term.write("\r\n");
        term.write(dockerImages());
        setConsoleToNewLine();
    }
    if (input.command === 'ps') {
        term.write("\r\n");
        term.write(dockerContainers());
        setConsoleToNewLine();
    }
}