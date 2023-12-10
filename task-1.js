const dockerImage = new DockerImage({
    position: {x: 600, y: 120},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3
});
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
        x: 150,
        y: 350,
    },
    width: 100,
    height: 100,
    label: "Images"
});

const registry = new Container({
    position: {
        x: 500,
        y: 100,
    },
    width: 200,
    height: 100,
    label: "Registry (https://hub.docker.com)"
});


function draw() {
    window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    host.draw();
    images.draw();
    registry.draw();

    dockerImage.draw();
}

draw();

term.onKey(function (event) {
    handleXtermInput(event, taskInputHandle);
});

function taskInputHandle() {
    if (newLine === 'docker pull hello-world') {
        term.write("\r\n");

        for (const logsKey in logs['docker pull hello-world']) {

            if (logsKey === '0') {
                term.write(logs['docker pull hello-world'][logsKey]);
            } else {
                setTimeout(() => {
                    term.write(logs['docker pull hello-world'][logsKey]);
                    setConsoleToNewLine();
                }, Number(logsKey));
            }
        }

        dockerImage.runAnimation([['x', -200], ['y', 250], ['x', -225]]);
    }
}

const logs = {
    "docker pull hello-world": {
        0: "Using default tag: latest\r\nlatest: Pulling from library/hello-world\r\n719385e32844: Waiting",
        3000: "\033[A\33[2K\r\033[A\33[2K\rUsing default tag: latest\r\nlatest: Pulling from library/hello-world\r\n719385e32844: Pull complete\r\nDigest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0\r\nStatus: Downloaded newer image for hello-world:latest\r\ndocker.io/library/hello-world:latest"
    }
};

