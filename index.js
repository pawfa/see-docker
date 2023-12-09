const canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 500;
const ctx = canvas.getContext("2d");

const term = new Terminal({
    cursorBlink: true,
    fontFamily: 'monospace'
});
term.open(document.getElementById('terminal'));
term.write('user@host:/$ ');


const DIR = "user@host:/$ ";
let newLine = '';
term.onKey(function (event) {
    if (event.key === '\x7F') {   //Backspace
        if (newLine.length === 0) {
        } else {
            newLine = newLine.substring(0, newLine.length - 1);
            term.write("\b \b");
        }
    } else if (event.key === "\r") {
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

            dockerImage.runAnimation();
        }
        if (newLine === 'docker run hello-world') {
            term.write("\r\n");

            for (const logsKey in logs['docker run hello-world']) {
                setTimeout(() => {
                    term.write(logs['docker run hello-world'][logsKey]);
                    setConsoleToNewLine();
                    dockerImage.setStatus('exited')
                }, Number(logsKey));
            }
            dockerImage.runAnimation();
            dockerImage.setStatus('running');
        }

    } else {
        newLine += event.key;
        term.write(event.key);
    }

});

function setConsoleToNewLine() {
    term.write("\r\n");
    term.write(DIR);
    newLine = '';
}

const logs = {
    "docker pull hello-world": {
        0: "Using default tag: latest\r\nlatest: Pulling from library/hello-world\r\n719385e32844: Waiting",
        3000: "\033[A\33[2K\r\033[A\33[2K\rUsing default tag: latest\r\nlatest: Pulling from library/hello-world\r\n719385e32844: Pull complete\r\nDigest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0\r\nStatus: Downloaded newer image for hello-world:latest\r\ndocker.io/library/hello-world:latest"
    },
    "docker run hello-world": {
        2000: "\r\n" +
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
    }
};