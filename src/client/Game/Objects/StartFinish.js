import { drawTextAlongArc } from 'Services/helpers';
import texture from '../../../../rs/flagTexture.png';

let startFinishCanvas = null;

export default class StartFinish {
  texture = null;

  constructor(game) {
    this.game = game;

    this.left = 0;
    this.top = 0;
    this.radius = 200;

    this.rotation = 0;

    startFinishCanvas = startFinishCanvas || this.draw();

    this.loadImage();
  }

  loadImage() {
    this.texture = new Image();
    this.texture.addEventListener('load', () => {
      startFinishCanvas = this.draw();
    });

    this.texture.src = texture;
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

    context.beginPath();
    context.arc(radius + 5, radius + 5, radius, 0, 2 * Math.PI, false);
    context.strokeStyle = '#fff';
    context.lineWidth = 5;
    context.stroke();
    if (this.texture) {
      context.fillStyle = context.createPattern(this.texture, 'repeat');
      context.fill();
    }

    context.beginPath();
    context.arc(radius + 5, radius + 5, (radius - 40), 0, 2 * Math.PI, false);
    context.stroke();
    context.shadowColor = '#fff';
    // context.shadowBlur = 200;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.fillStyle = 'rgb(33,40,48)';
    context.fill();
    drawTextAlongArc(context, 'Start / Finish', radius + 5, radius + 5, radius - 50, (Math.PI / 4), 0, '#fff');

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
    context.drawImage(startFinishCanvas, 0, 0);
    context.restore();
  }
}
