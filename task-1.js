const helloWorldImage = new DockerImage({
    position: {x: 600, y: 120},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3,
    name: "hello-world",
    animations: {
        pull : {movement:[['x', -200], ['y', 250], ['x', -225]]}
    }
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
    width: 200,
    height: 100,
    label: "Registry (https://hub.docker.com)"
});
imagesArr.push(helloWorldImage)


function draw() {
    window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    host.draw();
    images.draw();
    registry.draw();

    helloWorldImage.draw();
}

draw();

term.onKey(function (event) {
    handleXtermInput(event, taskInputHandle);
});

function taskInputHandle() {
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

