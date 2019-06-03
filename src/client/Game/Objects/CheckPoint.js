import { drawTextAlongArc } from 'Services/helpers';

let checkPointCanvas = null;

export default class CheckPoint {
  constructor(game, { left, top }) {
    this.game = game;

    this.left = left || [
      -1000 + Math.random() * 600,
      1000 - Math.random() * 600,
    ][Math.round(Math.random())];
    this.top = top || [
      -1000 + Math.random() * 600,
      1000 - Math.random() * 600,
    ][Math.round(Math.random())];
    this.radius = 70;

    this.rotation = 0;

    this.touched = false;

    checkPointCanvas = checkPointCanvas || this.draw();
  }

  update(delta) {
    this.rotation += 0.01 * delta;
  }

  draw() {
    const { radius } = this;

    const canvas = document.createElement('canvas');
    canvas.width = radius * 2 + 10;
    canvas.height = radius * 2 + 10;
    const context = canvas.getContext('2d');

    context.strokeStyle = 'rgb(50,255,50)';
    context.lineWidth = 5;
    // context.shadowColor = 'rgb(50,255,50)';
    // context.shadowBlur = 20;
    // context.shadowOffsetX = 0;
    // context.shadowOffsetY = 0;

    context.beginPath();
    context.arc(radius + 5, radius + 5, radius, 0, 2 * Math.PI, false);
    context.closePath();
    context.stroke();

    drawTextAlongArc(context, 'Checkpoint', radius + 5, radius + 5, radius - 10, (Math.PI / 2), 0, 'rgb(0, 255, 0)');

    return canvas;
  }

  render() {
    const { context } = this.game.background;
    const { left, top, radius, rotation } = this;

    const intersection = this.game.intersection(this);

    const drawRadius = Math.max(radius - Math.max(10, Math.min(intersection.radius, radius)), 10);
    const drawLeft = intersection.x || left;
    const drawTop = intersection.y || top;

    const scale = drawRadius / radius;

    context.save();
    context.translate(drawLeft, drawTop);
    context.rotate(rotation);
    context.translate(-(radius * scale), -(radius * scale));
    context.scale(scale, scale);
    context.drawImage(checkPointCanvas, 0, 0);
    context.restore();
  }
}
