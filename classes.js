class DockerDrawable extends Tooltip {
    constructor({position, imageSrc, animations, scale, tooltips}) {
        super({position,tooltips})
        this.position = {...position};
        this.isHovered = false;
        this.image = new Image();
        this.image.src = imageSrc;
        this.isOverlayed = true
        this.listeners = []
        this.animations = animations;
        this.currentAnimations = [];
        this.animationPosition = {...position, i: 0};
        this.scale = scale;

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;

            if (x > this.position.x && x < this.position.x + 50 && y > this.position.y && y < this.position.y + 50) {
                this.isHovered = true;

            } else if (this.isHovered) {
                this.isHovered = false;
            }
        });
        drawables.add(this)
    }
    onEvent(eventName,callback) {
        this.listeners.push({
            eventName,
            callback
        })
    }

    sendEvent(eventName) {
        this.listeners.forEach((listener)=> {

            if (listener.eventName === eventName) {
                listener.callback()
            }
        })
    }

    runAnimation(animation) {
        const selectedAnimation = this.animations[animation];
        if (selectedAnimation.timeout) {
            setTimeout(() => {
                this.currentAnimations.push({
                    name: animation,
                    steps: this.animations[animation].movement
                });
            }, selectedAnimation.timeout);
        } else {
            this.currentAnimations.push({
                name: animation,
                steps: this.animations[animation].movement
            });
        }
    }
    animate() {
        let current = this.currentAnimations[0];

        if (!current) {
            return;
        }

        if (this.animationPosition.i === current.steps.length) {
            if (this.currentAnimations.length === 0) {
                return;
            } else {
                this.currentAnimations.shift();
                current = this.currentAnimations.shift()
                this.animationPosition.i = 0
            }
        }

        if (!current) {
            return;
        }

        const currentMovement = current.steps[this.animationPosition.i];

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
        if (this.isHovered) {
            ctx.save();
            ctx.font = "10px Roboto";
            ctx.fillStyle = 'black';
            ctx.fillText(this.id, this.position.x - 5, this.position.y + 100);
            ctx.restore();
        }
        if (this.image.src) {
            this.drawDockerRectangle(this.position);
        } else {
            ctx.strokeRect(this.position.x, this.position.y, 50, 50);
        }

        this.animate();

    }

    drawDockerRectangle(position) {
        const ratio = this.image.naturalWidth / this.image.naturalHeight;
        const imageWidth = this.image.height / this.scale * ratio;
        const imageHeight = this.image.height / this.scale;
        ctx.fillStyle = 'white';
        ctx.fillRect(position.x - 5, position.y - 5, imageWidth + 10, imageHeight + 10);
        ctx.drawImage(this.image, position.x, position.y, this.image.height / this.scale * ratio, this.image.height / this.scale);

        ctx.strokeRect(position.x - 5, position.y - 5, imageWidth + 10, imageHeight + 10);
        ctx.strokeStyle = 'black';
        this.drawTooltip()
    }
}


class DockerImage extends DockerDrawable {
    constructor({position, imageSrc, animations, scale, name, logs,tooltips}) {
        super({position, imageSrc, animations,scale,tooltips});
        this.name = name;
        this.status = 'registry';
        this.id = crypto.randomUUID().replaceAll("-", '');
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

        imagesArr.push(this)
    }

    getPullLogs() {
        const pullLogs = [];
        if (input.command === 'run') {
            pullLogs.push([0, `Unable to find image '${this.name}:latest' locally\n\r`]);
            pullLogs.push([1000, `latest: Pulling from library/${this.name}\r\n719385e32844: Waiting`]);
            pullLogs.push([2000, `\x1b[A\x1b[2K\rlatest: Pulling from library/${this.name}\r\n719385e32844: Pull complete\r\nDigest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0\r\nStatus: Downloaded newer image for ${this.name}:latest\r\n`]);
        } else {
            pullLogs.push([0, `Using default tag: latest\n\r`]);
            pullLogs.push([1000, `latest: Pulling from library/${this.name}\r\n719385e32844: Waiting`]);
            pullLogs.push([2000, `\x1b[2K\r\x1b[A\rlatest: Pulling from library/${this.name}\r\n719385e32844: Pull complete\r\nDigest: sha256:c79d06dfdfd3d3eb04cafd0dc2bacab0992ebc243e083cabe208bac4dd7759e0\r\nStatus: Downloaded newer image for ${this.name}:latest\r\n`]);
        }

        return pullLogs;
    }

    async pull() {
        return new Promise((resolve) => {
            if (this.status === 'registry') {
                const pullLogs = this.getPullLogs();
                for (let i = 0; i < pullLogs.length; i++) {
                    const [timeout, log] = pullLogs[i];
                    if (i === 0) {
                        term.write(log);

                        this.runAnimation('pull');
                    } else {
                        setTimeout(() => {
                            term.write(log);
                            if (i === pullLogs.length -1) {
                                this.setStatus('downloaded');
                                setConsoleToNewLine();
                                resolve();
                            }
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
                const pullLogs = this.getPullLogs();
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
                        }, Number(timeout));
                    }
                }
            });
        }
        let intervalID;
        intervalID = setInterval(()=> {
            if (this.currentAnimations.length === 0) {
                DockerContainer.runContainer({
                    position: this.position,
                    imageSrc: this.image.src,
                    animations: this.animations,
                    scale: this.scale,
                    name: this.name,
                    logs: this.logs
                })
                this.sendEvent("container-created")
                clearInterval(intervalID)
            }
        },100)
    }

    async setStatus(status, timeout) {
        if (timeout !== undefined) {
            await new Promise((resolve) => {
                this.status = status;
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        } else {
            this.status = status;
        }
    }

}

class DockerContainer extends DockerDrawable {

    static runContainer({position, imageSrc, animations, scale, name, logs}) {
        new DockerContainer({
            position: position,
            imageSrc: imageSrc,
            animations: animations,
            scale: scale,
            name: name,
            logs: logs
        }).run();
    }

    constructor({position, imageSrc, animations, scale, name, logs,tooltips}) {
        super({
            position: position,
            imageSrc: imageSrc,
            animations: animations,
            scale: scale,
            tooltips: tooltips
        });
        this.id = crypto.randomUUID().replaceAll("-", '');
        this.status = 'created'
        this.name = name;
        this.logs = logs;

        containersArr.push(this);
    }
    run() {
        for (let i = 0; i < this.logs['run'].length; i++) {
            const [timeout, log] = this.logs['run'][i];
            if (i === 0) {
                this.runAnimation('run');
            }
            if (i === this.logs['run'].length - 1) {
                setTimeout(async () => {
                    await this.setStatus('running', 1000);
                    term.write(log);
                    if (input.args.length > 0) {
                        if (input.args[0].includes("echo")) {
                            term.write(input.args[0].split('echo')[1].trim().replaceAll("\"", ''));
                        }
                    }
                    this.setStatus('exited');
                    setConsoleToNewLine();
                }, Number(timeout));
            }
        }
    }
    async setStatus(status, timeout) {
        if (timeout !== undefined) {
            await new Promise((resolve) => {
                this.status = status;
                this.sendEvent("set-status-"+status)
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        } else {
            this.sendEvent("set-status-"+status)
            this.status = status;
        }
    }

    count = 0;
    draw() {
        ctx.strokeStyle = '#00084D';
        if (this.status === 'removed') {
            return;
        }
        if (this.status === 'running') {
            ctx.strokeStyle = 'green';
        }
        if (this.isHovered) {
            ctx.save();
            ctx.font = "10px Roboto";
            ctx.fillStyle = 'black';
            ctx.fillText(this.id, this.position.x - 5, this.position.y + 100);
            ctx.restore();
        }
        if (this.status === 'exited') {
            ctx.strokeStyle = 'red';
        }

        if (this.image.src) {
            const ratio = this.image.naturalWidth / this.image.naturalHeight;
            const imageWidth = this.image.height / this.scale * ratio;
            const imageHeight = this.image.height / this.scale;

            const height = imageHeight + 10;
            const width = imageWidth + 10;
            const depth = 5;
            const x = this.position.x - 5;
            const y = this.position.y - 5;

            ctx.fillStyle = 'white';
            ctx.lineWidth = 0.5
            ctx.fillRect(x, y, imageWidth + 10, imageHeight + 10);
            ctx.drawImage(this.image, this.position.x, this.position.y, this.image.height / this.scale * ratio, this.image.height / this.scale);
            ctx.strokeRect(x, y, width, height);
            ctx.lineWidth = 1

            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y);
            ctx.lineTo(x + width + depth, y - depth);
            ctx.lineTo(x + depth, y - depth);
            ctx.closePath();
            ctx.stroke()
            ctx.fill();

            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.moveTo(x + width, y);
            ctx.lineTo(x + width, y + height);
            ctx.lineTo(x + width + depth, y + height - depth);
            ctx.lineTo(x + width + depth, y - depth);
            ctx.closePath();
            ctx.stroke()
            ctx.fill();

            if (this.status === 'exited') {
                ctx.strokeStyle = 'red';
                ctx.save();
                ctx.font = "10px Roboto";
                ctx.fillStyle = 'red';
                ctx.fillText("EXITED", this.position.x - 5, y + height +10);
                ctx.restore();
            }
            if (this.status === 'running') {

                ctx.strokeStyle = 'green';
                ctx.save();
                ctx.font = "10px Roboto";
                ctx.fillStyle = 'green';
                ctx.fillText("RUNNING", this.position.x - 5, y + height +10);
                ctx.restore();

                this.count++;

                if (this.count % 100 > 40) {
                    ctx.strokeStyle = 'green';
                    ctx.save();
                    ctx.font = "20px Roboto";
                    ctx.fillStyle = 'green';
                    ctx.fillText(".", this.position.x + 50, y + height +10);
                    ctx.restore();
                }
                if (this.count % 100 > 20) {
                    ctx.strokeStyle = 'green';
                    ctx.save();
                    ctx.font = "20px Roboto";
                    ctx.fillStyle = 'green';
                    ctx.fillText(".", this.position.x + 45, y + height +10);
                    ctx.restore();
                }
                if (this.count % 100 > 2) {
                    ctx.strokeStyle = 'green';
                    ctx.save();
                    ctx.font = "20px Roboto";
                    ctx.fillStyle = 'green';
                    ctx.fillText(".", this.position.x + 40, y + height +10);
                    ctx.restore();
                }
            }
        }
        this.animate();
        this.drawTooltip()
        ctx.strokeStyle = '#00084D';
    }

}