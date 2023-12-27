class Tooltip {
    static currentStep = 0
    static lastStep = 0;
    static callbacks = {}
    static endCallbacks = [];

    static start() {
        this.currentStep = 1
    }

    constructor({tooltips = [], position}) {
        this.tooltips = tooltips;
        this.position = position;
        tooltips.forEach((tooltip)=> this.addTooltip(tooltip))
    }

    addTooltip(tooltip) {
        Tooltip.lastStep++
        tooltip.position = {
            x: this.position.x - tooltip.offset.x,
            y: this.position.y + tooltip.offset.y
        };
        tooltip.button = {
            position: {
                x: tooltip.position.x + tooltip.width - 60,
                y: tooltip.position.y + tooltip.height + 10
            },
            width: 60,
            height: 30
        };
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;

            if (x > tooltip.button.position.x && x < tooltip.button.position.x + 50 && y > tooltip.button.position.y && y < tooltip.button.position.y + 50) {
                Tooltip.currentStep++;
            }
        });
        this.tooltips.push(tooltip);
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

        const currentTooltip = this.tooltips.find((tooltip)=> tooltip.step === Tooltip.currentStep)

        if (currentTooltip) {
            console.log('asdasdasd')
            ctx.save()
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.roundRect(currentTooltip.position.x, currentTooltip.position.y, currentTooltip.width, currentTooltip.height, [5]);
            ctx.fill();
            ctx.fillStyle = 'black';

            for (let i = 0; i < currentTooltip.text.length; i++) {
                ctx.font = "14px Roboto";
                ctx.fillText(currentTooltip.text[i].trim(), currentTooltip.position.x + 10, currentTooltip.position.y + 20 + 20 * i);
            }
            if (Tooltip.currentStep <= Tooltip.lastStep) {

                ctx.fillStyle = 'white';
                if (currentTooltip.step === Tooltip.lastStep) {
                    ctx.beginPath();
                    ctx.roundRect(currentTooltip.button.position.x, currentTooltip.button.position.y, currentTooltip.button.width-5, currentTooltip.button.height, [5]);
                    ctx.fill();
                    ctx.fillStyle = 'black';
                    ctx.fillText("End", currentTooltip.button.position.x + 15, currentTooltip.button.position.y + 20);
                } else {
                    ctx.beginPath();
                    ctx.roundRect(currentTooltip.button.position.x, currentTooltip.button.position.y, currentTooltip.button.width, currentTooltip.button.height, [5]);
                    ctx.fill();
                    ctx.fillStyle = 'black';
                    ctx.fillText("Next", currentTooltip.button.position.x + 15, currentTooltip.button.position.y + 20);
                }
            }
            ctx.restore()
            Tooltip.callbacks[Tooltip.currentStep]?.forEach((callback)=> callback())
        }
    }

}