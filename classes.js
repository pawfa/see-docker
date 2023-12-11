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
        this.scale = scale;
        this.id = crypto.randomUUID().replaceAll("-",'');
        this.isHovered = false
    }

    runAnimation(animation) {
        this.animation = animation;
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