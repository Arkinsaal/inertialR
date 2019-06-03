import texture from '../../../../rs/boundaryTexture.png';
import { drawAtPointsInArc } from 'Services/helpers';

export default class Boundary {
  texture = null;

  constructor(game, { radius, elasticity }) {
    this.game = game;

    this.left = 0;
    this.top = 0;
    this.radius = radius || 2000;
    this.effectRadius = this.radius;

    this.elasticity = elasticity || 0.001;

    this.loadImage();
  }

  loadImage() {
    this.texture = new Image();

    this.texture.src = texture;
  }

  effect = (object, delta) => {
    const distanceFromCenter = Math.sqrt(object.top ** 2 + object.left ** 2);
    const distancePercentage = Math.abs(distanceFromCenter) / this.effectRadius;
    const multiplier = ((distancePercentage < 0.6 ? 0 : distancePercentage) ** 2) * 0.001 * delta;

    object.speedV = object.speedV - (object.top * multiplier);
    object.speedH = object.speedH - (object.left * multiplier);
  }

  render() {
    const { context } = this.game.background;
    const { left, top, radius } = this;

    context.save();
    if (this.texture) {
      drawAtPointsInArc(context, this.texture, left, top, radius * 0.6, 0, Math.PI * 2, 100);
    } else {
      context.beginPath();
      context.arc(left, top, radius * 0.6, 0, 2 * Math.PI, false);
      context.closePath();
      context.lineWidth = 10;
      context.strokeStyle = 'white';
      context.stroke();
    }
    context.restore();
  }
}
