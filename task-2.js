const host = new Container({
    position: {
        x: 100,
        y: 100,
    },
    width: 500,
    height: 300,
    label: "Host"
});



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
        "\r\n"
        ]]
    }
});
helloWorldImage.setStatus('downloaded')
Tooltip.onEnd(()=> {
    drawables.hideOverlay()
})

async function taskInputHandle() {
    if (input.command === 'run') {

        const img = imagesArr.find((image)=> image.name === input.name)
        if (img) {
            img.onEvent("container-created", ()=> {

                containersArr[0].addTooltip({
                    text: ["This is a representation of a Docker Container.","Container is an isolated environment for your code.","It contains everything that your code needs in order to run."],
                    height: 75,
                    width: 380,
                    offset: {
                        x: 370,
                        y: 70
                    },
                    step: 1
                });
                containersArr[0].addTooltip({
                    text: ["After executing docker run hello-world command","new container has started based on the hello-world image","Container has run for a short period of time, executed all the code","and the main process within stopped - resulting in a container with status exited."],
                    height: 95,
                    width: 520,
                    offset: {
                        x: 370,
                        y: 70
                    },
                    step: 2
                })

                containersArr[0].onEvent("set-status-exited",()=> {
                    console.log('status-exited')
                    Tooltip.start()
                    Tooltip.on(1,()=> {
                        drawables.showOverlay()
                        containersArr[0].isOverlayed = false
                    })
                })
            })
            await img.runImage()

        } else {
            setConsoleToNewLine()
        }
    }
}