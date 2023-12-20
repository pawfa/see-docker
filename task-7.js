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
    position: {x: 550, y: 120},
    imageSrc: "./img/ubuntu-logo.png",
    scale: 60,
    name: "ubuntu",
    animations: {
        pull : {movement:[['x', -150], ['y', 250]]},
        run: {
            timeout: 1000,
            movement: [['x', -200, 2000]]
        }
    }
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

drawables.push(host,images,containers,registry, ...imagesArr,...containersArr)

async function taskInputHandle() {
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

    if (input.command === 'run') {
        const img = imagesArr.find((image)=> image.name === input.name)
        if (img) {
            term.write("\r\n");
            await img.runImage()
        } else {
            setConsoleToNewLine()
        }
    }
    if (input.command === 'pull') {
        const img = imagesArr.find((image)=> image.name === input.name)
        if (img) {
            term.write("\r\n");
            img.pull()
        } else {
            setConsoleToNewLine()
        }
    }
}