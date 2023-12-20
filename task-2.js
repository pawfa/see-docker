const host = new Container({
    position: {
        x: 100,
        y: 100,
    },
    width: 500,
    height: 300,
    label: "Host"
});

const helloWorldImage = new DockerImage({
    position: {x: 450, y: 200},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3,
    name: 'hello-world',
    animations: {
        run: {movement: [['x', -200]]}
    },
    logs: {
        run: [[2000, "\r\n" +
        "Hello from Docker!\r\n" +
        "This message shows that your installation appears to be working correctly.\r\n" +
        "\r\n" +
        "To generate this message, Docker took the following steps:\r\n" +
        " 1. The Docker client contacted the Docker daemon.\r\n" +
        " 2. The Docker daemon pulled the \"hello-world\" image from the Docker Hub.\r\n" +
        "    (amd64)\r\n" +
        " 3. The Docker daemon created a new container from that image which runs the\r\n" +
        "    executable that produces the output you are currently reading.\r\n" +
        " 4. The Docker daemon streamed that output to the Docker client, which sent it\r\n" +
        "    to your terminal.\r\n" +
        "\r\n" +
        "To try something more ambitious, you can run an Ubuntu container with:\r\n" +
        " $ docker run -it ubuntu bash\r\n" +
        "\r\n" +
        "Share images, automate workflows, and more with a free Docker ID:\r\n" +
        " https://hub.docker.com/\r\n" +
        "\r\n" +
        "For more examples and ideas, visit:\r\n" +
        " https://docs.docker.com/get-started/\r\n" +
        "\r\n" +
        "\r\n"
        ]]
    }
});
helloWorldImage.setStatus('downloaded')

const images = new Container({
    position: {
        x: 350,
        y: 150,
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
        y: 150,
    },
    width: 200,
    height: 200,
    label: "Containers",
    style: {
        backgroundColor: 'white'
    }
});

drawables.push(host,images,containers,...imagesArr)

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