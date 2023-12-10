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
    imageSrc: "./img/ubuntu-logo.png",
    scale: 60
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
    if (newLine === 'docker run ubuntu echo "Hello from container!"') {
        term.write("\r\n");

        for (let i = 0; i < logs['docker run ubuntu echo "Hello from container!"'].length; i++) {
            setTimeout(() => {
                term.write(logs['docker run ubuntu echo "Hello from container!"'][i][1]);
                logs['docker run ubuntu echo "Hello from container!"'][i][0] === 3000 && dockerImage.setStatus('exited')
                if (i === logs['docker run ubuntu echo "Hello from container!"'].length-1) {
                    setConsoleToNewLine()
                }
            }, Number(logs['docker run ubuntu echo "Hello from container!"'][i][0]));
        }
        dockerImage.runAnimation([['x', -150], ['y', 300],['x', -200]]);
        dockerImage.setStatus('running');
    }
}

const logs = {
    'docker run ubuntu echo "Hello from container!"': [
        [3000, "Unable to find image 'ubuntu:latest' locally\r\n" +
        "latest: Pulling from library/ubuntu\r\n" +
        "5e8117c0bd28: Pull complete\r\n" +
        "Digest: sha256:8eab65df33a6de2844c9aefd19efe8ddb87b7df5e9185a4ab73af936225685bb\r\n" +
        "Status: Downloaded newer image for ubuntu:latest\r\n" +
        "Hello from container!\r\n"
    ]]
};