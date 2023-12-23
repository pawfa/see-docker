const host = new Container({
    position: {
        x: 100,
        y: 300,
    },
    width: 200,
    height: 200,
    label: "Host",
    tooltip : {
        text: ["Host is a machine (physical or virtual) where","Docker is installed and which is responsible"," for, among other things, running containers"," and managing your local images."],
        height: 95,
        width: 325,
        offset: {
            x: -230,
            y: 0
        },
        step: 3
    }
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
    label: "Registry (https://hub.docker.com)",
    tooltip : {
        text: ["Registry is a place where Docker images are stored","before you download them to your machine.","It can be public like Docker Hub or you can have", "your own private repository."],
        height: 95,
        width: 350,
        offset: {
            x: 370,
            y: -60
        },
        step: 1
    }
});

const helloWorldImage = new DockerImage({
    position: {x: 550, y: 130},
    imageSrc: "./img/hello-world-logo.png",
    scale: 3,
    name: "hello-world",
    animations: {
        pull : {movement:[['x', -200], ['y', 260], ['x', -150]]}
    },
    tooltip : {
        text: ["This is a representation of a Docker Image.","An image is a read-only template which contains","instructions used for creating a Docker container"],
        height: 75,
        width: 325,
        offset: {
            x: 370,
            y: 10
        },
        step: 2
    }
});

Tooltip.on(1,()=> {
    drawables.showOverlay()
    registry.isOverlayed = false
    helloWorldImage.isOverlayed = false
})

Tooltip.on(2,()=> {
    drawables.showOverlay()
    registry.isOverlayed = true
    helloWorldImage.isOverlayed = false
})

Tooltip.on(3,()=> {
    drawables.showOverlay()
    registry.isOverlayed = true
    helloWorldImage.isOverlayed = true
    host.isOverlayed = false
    images.isOverlayed = false
})
Tooltip.on(4, ()=> {
    drawables.hideOverlay()
})

function taskInputHandle() {

    if (input.command === 'pull') {

        const img = imagesArr.find((image)=> image.name === input.name)
        if (img) {
            Tooltip.start()

            Tooltip.onEnd(()=>{
                drawables.hideOverlay()
            })

            Tooltip.onEnd(()=>{
                img.pull()
            }, 300)

        } else {
            setConsoleToNewLine()
        }
    }
}

