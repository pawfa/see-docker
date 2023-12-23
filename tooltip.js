class Tooltip {
    static currentStep = 0
    static lastStep = 0;
    static callbacks = {}
    static endCallbacks = [];

    static start() {
        this.currentStep = 1
    }

    constructor({tooltip, position}) {
        this.tooltip = tooltip;
        this.position = position;
        if (this.tooltip) {
            Tooltip.lastStep++
            this.tooltip.position = {
                x: this.position.x - tooltip.offset.x,
                y: this.position.y + tooltip.offset.y
            };
            this.tooltip.button = {
                position: {
                    x: this.tooltip.position.x + this.tooltip.width - 60,
                    y: this.tooltip.position.y + this.tooltip.height + 10
                },
                width: 60,
                height: 30
            };
            canvas.addEventListener('click', (e) => {
                const rect = canvas.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top;

                if (x > this.tooltip.button.position.x && x < this.tooltip.button.position.x + 50 && y > this.tooltip.button.position.y && y < this.tooltip.button.position.y + 50) {
                    Tooltip.currentStep++;
                }
            });
        }
    }

    static onEnd(callback, timeout) {
        this.endCallbacks.push({timeout: timeout, callback: callback})
    }
    static on(step,callback) {
        this.callbacks[step] ? this.callbacks[step].push(callback) : this.callbacks[step] = [callback]
    }

    drawTooltip() {
        if (Tooltip.endCallbacks.length > 0 && Tooltip.currentStep > Tooltip.lastStep) {
            Tooltip.endCallbacks.forEach((endCallback => {
                if (endCallback.timeout) {
                    setTimeout(()=> {
                        endCallback.callback()
                    },endCallback.timeout)
                }else {
                    endCallback.callback()
                }
            }))
            Tooltip.endCallbacks = []

        }
        if (this.tooltip && Tooltip.currentStep === this.tooltip.step) {
            ctx.save()
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.roundRect(this.tooltip.position.x, this.tooltip.position.y, this.tooltip.width, this.tooltip.height, [5]);
            ctx.fill();
            ctx.fillStyle = 'black';

            for (let i = 0; i < this.tooltip.text.length; i++) {
                ctx.font = "14px Roboto";
                ctx.fillText(this.tooltip.text[i].trim(), this.tooltip.position.x + 10, this.tooltip.position.y + 20 + 20 * i);
            }
            if (Tooltip.currentStep <= Tooltip.lastStep) {

                ctx.fillStyle = 'white';
                if (this.tooltip.step === Tooltip.lastStep) {
                    ctx.beginPath();
                    ctx.roundRect(this.tooltip.button.position.x, this.tooltip.button.position.y, this.tooltip.button.width-5, this.tooltip.button.height, [5]);
                    ctx.fill();
                    ctx.fillStyle = 'black';
                    ctx.fillText("End", this.tooltip.button.position.x + 15, this.tooltip.button.position.y + 20);
                } else {
                    ctx.beginPath();
                    ctx.roundRect(this.tooltip.button.position.x, this.tooltip.button.position.y, this.tooltip.button.width, this.tooltip.button.height, [5]);
                    ctx.fill();
                    ctx.fillStyle = 'black';
                    ctx.fillText("Next", this.tooltip.button.position.x + 15, this.tooltip.button.position.y + 20);
                }
            }
            ctx.restore()
            Tooltip.callbacks[Tooltip.currentStep]?.forEach((callback)=> callback())
        }
    }

}