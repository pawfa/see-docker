
const host = new Container({
    position: {
        x: 100,
        y: 300,
    },
    width: 200,
    height: 200,
    label: "Host"
});

const images = new Container({
    position: {
        x: 170,
        y: 370,
    },
    width: 100,
    height: 100,
    label: "Images",
    style: {
        backgroundColor: 'white'
    }
});

const registry = new Container({
    position: {
        x: 500,
        y: 100,
    },
    width: 270,
    height: 140,
    label: "Registry (https://hub.docker.com)"
});
const helloWorldImage = new DockerImage({
    position: {x: 550, y: 130},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3,
    name: "hello-world",
    animations: {
        pull : {movement:[['x', -200], ['y', 260], ['x', -150]]}
    }
});

function taskInputHandle() {
    if (input.command === 'pull') {
        const img = imagesArr.find((image)=> image.name === input.name)
        if (img) {
            img.pull()
        } else {
            setConsoleToNewLine()
        }
    }
}

