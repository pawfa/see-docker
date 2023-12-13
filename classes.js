class Container {
    constructor({position, width, height, label}) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.label = label;
    }

    draw() {
        ctx.font = "20px Arial";
        ctx.fillText(this.label, this.position.x + 5, this.position.y - 5);
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }
}


class DockerImage {
    constructor({position, imageSrc, animation, scale,name}) {
        this.position = {...position};
        this.name = name;
        this.isAnimated = false;
        this.image = new Image();
        this.image.src = imageSrc;
        this.animation = animation;
        this.animationPosition = {
            ...position,
            i: 0
        };
        this.status = 'registry';
        this.scale = scale;
        this.id = crypto.randomUUID().replaceAll("-",'');
        this.isHovered = false
        this.logs =  {
            pull: [
                [0, `Using default tag: latest\r\nlatest: Pulling from library/${this.name}\r\n719385e32844: Waiting`],
                [3000, `\x1b[A\x1b[2K\r\x1b[A\x1b[2K\rUsing default tag: latest\r\nlatest: Pulling from library/${this.name}\r\n719385e32844: Pull complete\r\nDigest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0\r\nStatus: Downloaded newer image for ${this.name}:latest\r\n`]
            ],
            run: [
                [1000, ``],
            ]
        }
    }
    async pull() {
        return new Promise((resolve)=> {
            if (this.status === 'registry') {
                for (let i = 0; i < this.logs['pull'].length; i++){
                    const [timeout, log] = this.logs['pull'][i];
                    if (i === 0) {
                        term.write(log)
                        ubuntuImage.runAnimation([['x', -200], ['y', 250]]);
                    } else {
                        setTimeout(() => {
                            term.write(log);
                            this.setStatus('downloaded')
                            setConsoleToNewLine();
                            resolve()
                        }, Number(timeout));
                    }
                }
            } else {
                resolve()
            }
        })
    }

    async runImage() {
        if (this.status === 'registry') {
            await this.pull();
        }
        for (let i = 0; i < this.logs['run'].length; i++){
            const [timeout, log] = this.logs['run'][i];
            if (i === 0) {
                ubuntuImage.runAnimation([['x', -200]]);
            }
            if (i === this.logs['run'].length-1) {
                setTimeout(() => {
                    this.setStatus('running')
                    term.write(log);
                }, Number(timeout));
            }
        }
        containersArr.push(this)
    }

    runAnimation(animation) {
        this.animation = animation;
        this.animationPosition.i = 0
        this.isAnimated = true;
    }
    setStatus(status) {
        this.status = status;
    }


    animate() {
        if (this.animationPosition.i >= this.animation.length) {
            this.isAnimated = false
            return;
        }
        const currentMovement = this.animation[this.animationPosition.i];

        if ((currentMovement[1] > 0 && this.position[currentMovement[0]] > this.animationPosition[currentMovement[0]] + currentMovement[1]) || currentMovement[1] < 0 && this.position[currentMovement[0]] < this.animationPosition[currentMovement[0]] + currentMovement[1]) {
            this.animationPosition = {x: this.position.x, y: this.position.y, i: this.animationPosition.i + 1};
        }
        this.position[currentMovement[0]] = currentMovement[1] > 0 ? this.position[currentMovement[0]] + 4 : this.position[currentMovement[0]] - 4;
    }

    draw() {
        if (this.status === 'removed') {
            return
        }
        if (this.status === 'running') {
            ctx.strokeStyle = 'green'
            ctx.font = "10px Arial";
            ctx.fillText("RUNNING", this.position.x-5, this.position.y - 10);
        }
        if (this.isHovered) {
            ctx.font = "10px Arial";
            ctx.fillText(this.id, this.position.x-5, this.position.y + 100);
        }
        if (this.status === 'exited') {
            ctx.strokeStyle = 'red'
            ctx.font = "10px Arial";
            ctx.fillText("EXITED", this.position.x-5, this.position.y - 10);
        }
        if (this.image.src) {
            const ratio = this.image.naturalWidth / this.image.naturalHeight;
            const imageWidth = this.image.height / this.scale * ratio;
            const imageHeight = this.image.height / this.scale;
            ctx.drawImage(this.image, this.position.x, this.position.y, this.image.height / this.scale * ratio, this.image.height / this.scale);

            ctx.strokeRect(this.position.x - 5, this.position.y - 5, imageWidth + 10, imageHeight + 10);
            ctx.strokeStyle = 'black'
        } else {
            ctx.strokeRect(this.position.x, this.position.y, 50, 50);
        }

        if (this.isAnimated) {
            this.animate();
        }

    }
}