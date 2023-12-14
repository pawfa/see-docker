class Container {
    constructor({position, width, height, label, style}) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.label = label;
        this.style = {
            backgroundColor: '#E5F2FC',
            strokeColor: '#1D63ED',
            ...style
        };
    }

    draw() {
        ctx.fillStyle = this.style.backgroundColor;
        ctx.beginPath();
        ctx.roundRect(this.position.x, this.position.y, this.width, this.height, [10]);
        ctx.fill();
        ctx.strokeStyle = this.style.strokeColor;
        ctx.beginPath();
        ctx.roundRect(this.position.x, this.position.y, this.width, this.height, [10]);
        ctx.stroke();
        ctx.fillStyle = '#00084D';
        ctx.beginPath();
        ctx.roundRect(this.position.x, this.position.y - 15, ctx.measureText(this.label).width + 20, 25, [10]);
        ctx.fill();
        ctx.font = "16px Roboto";
        ctx.fillStyle = 'white';
        ctx.fillText(this.label, this.position.x + 10, this.position.y + 2);
    }
}


class DockerImage {
    constructor({position, imageSrc, animations, scale, name, logs}) {
        this.position = {...position};
        this.name = name;
        this.isAnimated = false;
        this.image = new Image();
        this.image.src = imageSrc;
        this.animations = animations;
        this.animation = [];
        this.animationPosition = {
            ...position,
            i: 0
        };
        this.status = 'registry';
        this.scale = scale;
        this.id = crypto.randomUUID().replaceAll("-", '');
        this.isHovered = false;
        this.logs = {
            pull: [
                [0, `Using default tag: latest\r\nlatest: Pulling from library/${this.name}\r\n719385e32844: Waiting`],
                [3000, `\x1b[A\x1b[2K\r\x1b[A\x1b[2K\rUsing default tag: latest\r\nlatest: Pulling from library/${this.name}\r\n719385e32844: Pull complete\r\nDigest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0\r\nStatus: Downloaded newer image for ${this.name}:latest\r\n`]
            ],
            run: [
                [1000, ``],
            ],
            ...logs
        };
    }

    getPullLogs() {
        const pullLogs = [];
        if (input.command === 'docker run') {
            pullLogs.push([0, `Unable to find image '${this.name}:latest' locally\n\r`]);
            pullLogs.push([1000, `latest: Pulling from library/${this.name}\r\n719385e32844: Waiting`]);
            pullLogs.push([2000, `\x1b[A\x1b[2K\rlatest: Pulling from library/${this.name}\r\n719385e32844: Pull complete\r\nDigest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0\r\nStatus: Downloaded newer image for ${this.name}:latest\r\n`]);
        } else {
            pullLogs.push([0, `Using default tag: latest\n\r`]);
            pullLogs.push([1000, `latest: Pulling from library/${this.name}\r\n719385e32844: Waiting`]);
            pullLogs.push([2000, `\x1b[A\x1b[2K\r\x1b[A\rlatest: Pulling from library/${this.name}\r\n719385e32844: Pull complete\r\nDigest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0\r\nStatus: Downloaded newer image for ${this.name}:latest\r\n`]);
        }

        return pullLogs;
    }

    async pull() {
        return new Promise((resolve) => {
            if (this.status === 'registry') {
                const pullLogs = this.getPullLogs()
                for (let i = 0; i < pullLogs.length; i++) {
                    const [timeout, log] = pullLogs[i];
                    if (i === 0) {
                        term.write(log);

                        this.runAnimation('pull');
                    } else {
                        setTimeout(() => {
                            term.write(log);
                            this.setStatus('downloaded');
                            setConsoleToNewLine();
                            resolve();
                            imagesArr.push(this);
                        }, Number(timeout));
                    }
                }
            } else {
                resolve();
            }
        });
    }

    async runImage() {
        if (this.status === 'registry') {
            await new Promise((resolve) => {
                const pullLogs = this.getPullLogs()
                for (let i = 0; i < pullLogs.length; i++) {
                    const [timeout, log] = pullLogs[i];
                    if (i === 0) {
                        term.write(log);

                        this.runAnimation('pull');
                    } else {
                        setTimeout(() => {
                            term.write(log);
                            this.setStatus('downloaded');
                            resolve();
                            imagesArr.push(this);
                        }, Number(timeout));
                    }
                }
            });
        }

        for (let i = 0; i < this.logs['run'].length; i++) {
            const [timeout, log] = this.logs['run'][i];
            if (i === 0) {
                this.runAnimation('run');
            }
            if (i === this.logs['run'].length - 1) {
                setTimeout(async () => {
                    containersArr.push(this);
                    await this.setStatus('running', 500);
                    term.write(log);
                    if (input.args.length > 0) {
                        if (input.args[0].includes("echo")) {
                            term.write(input.args[0].split('echo')[1].trim().replaceAll("\"",''));
                        }
                    }
                    this.setStatus('exited');
                    setConsoleToNewLine();
                }, Number(timeout));
            }
        }
        containersArr.push(this);
    }

    runAnimation(animation) {
        if (typeof animation === 'string') {
            const selectedAnimation = this.animations[animation];
            if (selectedAnimation.timeout) {
                setTimeout(()=> {
                    this.animation.push(...this.animations[animation].movement)
                    this.isAnimated = true;
                },selectedAnimation.timeout)
            }else {
                this.animation.push(...this.animations[animation].movement);
            }
        } else {
            this.animation = animation;
        }
        this.isAnimated = true;
    }

    async setStatus(status, timeout) {
        this.status = status;
        if (timeout !== undefined) {
            await new Promise((resolve) => {
                this.status = status;
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        }
    }


    animate() {
        if (this.animationPosition.i >= this.animation.length) {
            this.isAnimated = false;
            return;
        }

        const currentMovement = this.animation[this.animationPosition.i];

        if ((currentMovement[1] > 0 && this.position[currentMovement[0]] > this.animationPosition[currentMovement[0]] + currentMovement[1]) || currentMovement[1] < 0 && this.position[currentMovement[0]] < this.animationPosition[currentMovement[0]] + currentMovement[1]) {
            this.animationPosition = {x: this.position.x, y: this.position.y, i: this.animationPosition.i + 1};
        }
        this.position[currentMovement[0]] = currentMovement[1] > 0 ? this.position[currentMovement[0]] + 4 : this.position[currentMovement[0]] - 4;
    }

    draw() {
        ctx.strokeStyle = '#00084D';
        if (this.status === 'removed') {
            return;
        }
        if (this.status === 'running') {
            ctx.strokeStyle = 'green';
            ctx.save();
            ctx.font = "10px Roboto";
            ctx.fillStyle = 'green';
            ctx.fillText("RUNNING", this.position.x - 5, this.position.y - 10);
            ctx.restore();
        }
        if (this.isHovered) {
            ctx.font = "10px Roboto";
            ctx.fillText(this.id, this.position.x - 5, this.position.y + 100);
        }
        if (this.status === 'exited') {
            ctx.strokeStyle = 'red';
            ctx.save();
            ctx.font = "10px Roboto";
            ctx.fillStyle = 'red';
            ctx.fillText("EXITED", this.position.x - 5, this.position.y - 10);
            ctx.restore();
        }
        if (this.image.src) {
            const ratio = this.image.naturalWidth / this.image.naturalHeight;
            const imageWidth = this.image.height / this.scale * ratio;
            const imageHeight = this.image.height / this.scale;
            ctx.fillStyle = 'white';
            ctx.fillRect(this.position.x - 5, this.position.y - 5, imageWidth + 10, imageHeight + 10);
            ctx.drawImage(this.image, this.position.x, this.position.y, this.image.height / this.scale * ratio, this.image.height / this.scale);

            ctx.strokeRect(this.position.x - 5, this.position.y - 5, imageWidth + 10, imageHeight + 10);
            ctx.strokeStyle = 'black';
        } else {
            ctx.strokeRect(this.position.x, this.position.y, 50, 50);
        }

        if (this.isAnimated) {
            this.animate();
        }

    }
}