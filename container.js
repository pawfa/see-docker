class Container extends Tooltip {
    constructor({position, width, height, label, style, tooltip}) {
        super({tooltip, position})
        this.position = position;
        this.width = width;
        this.height = height;
        this.label = label;
        this.isOverlayed = true
        this.style = {
            backgroundColor: '#E5F2FC',
            strokeColor: '#1D63ED',
            ...style
        };
        drawables.add(this);
    }


    draw() {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = this.style.backgroundColor;
        ctx.beginPath();
        ctx.roundRect(this.position.x, this.position.y, this.width, this.height, [10]);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = this.style.strokeColor;
        ctx.beginPath();
        ctx.roundRect(this.position.x, this.position.y, this.width, this.height, [10]);
        ctx.stroke();
        ctx.fillStyle = '#00084D';
        ctx.beginPath();
        ctx.roundRect(this.position.x, this.position.y - 15, ctx.measureText(this.label).width + 20, 25, [10]);
        ctx.fill();
        this.drawTooltip()
        ctx.font = "16px Roboto";
        ctx.fillStyle = 'white';
        ctx.fillText(this.label, this.position.x + 10, this.position.y + 2);

    }
}
