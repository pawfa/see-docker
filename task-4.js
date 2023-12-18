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
    position: {x: 550, y: 130},
    imageSrc: "./img/ubuntu-logo.png",
    scale: 60,
    name: 'ubuntu',
    animations: {
        pull: {
            movement:[['x', -150], ['y', 250]]
        },
        run: {
            movement: [['x', -200]],
            timeout: 1000
        }
    },
    logs: {
        run: [[2000,'']]
    }
});
imagesArr.push(ubuntuImage)

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
drawables.push(host,registry,images,containers,ubuntuImage)

async function taskInputHandle() {
    if (input.command === 'run') {
        const img = imagesArr.find((image)=> image.name === input.name)
        if (img) {
            term.write("\r\n");
            await img.runImage()
        } else {
            setConsoleToNewLine()
        }
    }
}