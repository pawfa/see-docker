class Container {
    constructor({position, width, height, label, style, tooltip}) {
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
        this.tooltip = tooltip
        this.isTooltipVisible = false
    }

    showTooltip(isVisible) {
        this.tooltip.isVisible = isVisible
    }

    drawTooltip() {
        const x = this.position.x - this.tooltip.offset.x;
        const y = this.position.y + this.tooltip.offset.y;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect(x, y, this.tooltip.width, this.tooltip.height, [5]);
        ctx.fill();
        ctx.fillStyle = 'black';

        for (let i = 0; i < this.tooltip.text.length; i++) {
            ctx.font = "14px Roboto";
            ctx.fillText(this.tooltip.text[i].trim(), x+10, y+20 + 20 * i);
        }
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.roundRect(x + this.tooltip.width - 60, y + this.tooltip.height + 10, 60, 30, [5]);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.fillText("Next", x + this.tooltip.width - 45, y + this.tooltip.height + 30);
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
        if (this.tooltip && currentTooltipStep === this.tooltip.step) {
            this.drawTooltip()
        }
        ctx.font = "16px Roboto";
        ctx.fillStyle = 'white';
        ctx.fillText(this.label, this.position.x + 10, this.position.y + 2);

    }
}
