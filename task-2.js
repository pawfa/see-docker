const host = new Container({
    position: {
        x: 100,
        y: 100,
    },
    width: 500,
    height: 300,
    label: "Host"
});

const dockerImage = new DockerImage({
    position: {x: 450, y: 200},
    imageSrc: "./img/hello-world-logo.png",
    animation: [['x', -300]]
});

const images = new Container({
    position: {
        x: 350,
        y: 150,
    },
    width: 200,
    height: 200,
    label: "Images"
});

const containers = new Container({
    position: {
        x: 110,
        y: 150,
    },
    width: 200,
    height: 200,
    label: "Containers"
});


function draw() {
    window.requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    host.draw();
    images.draw();
    containers.draw();

    dockerImage.draw();
}

draw();

