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

const dockerImage = new DockerImage({
    position: {x: 550, y: 130},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3
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


function draw() {
    window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    host.draw();
    registry.draw()
    images.draw();
    containers.draw();

    dockerImage.draw();
}

draw();

term.onKey(function (event) {
    handleXtermInput(event,taskInputHandle)
});

function taskInputHandle() {
    if (newLine === 'docker run hello-world') {
        term.write("\r\n");

        for (let i = 0; i < logs['docker run hello-world'].length; i++) {
            setTimeout(() => {
                term.write(logs['docker run hello-world'][i][1]);
                logs['docker run hello-world'][i][0] === 3000 && dockerImage.setStatus('exited')
                if (i === logs['docker run hello-world'].length-1) {
                    setConsoleToNewLine()
                }
            }, Number(logs['docker run hello-world'][i][0]));
        }
        dockerImage.runAnimation([['x', -150], ['y', 300],['x', -200]]);
        dockerImage.setStatus('running');
    }
}

const logs = {
    "docker run hello-world": [
        [0, "Unable to find image 'hello-world:latest' locally\r\nlatest: Pulling from library/hello-world\r\n719385e32844: Waiting"],
        [3000, "\033[A\33[2K\r\033[A\33[2K\rUnable to find image 'hello-world:latest' locally\r\n" +
            "latest: Pulling from library/hello-world\r\n" +
            "719385e32844: Pull complete\r\n" +
            "Digest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0\r\n" +
            "Status: Downloaded newer image for hello-world:latest\r\n" +
            "\r\n" +
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
};