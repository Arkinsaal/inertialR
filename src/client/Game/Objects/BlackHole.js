import { circleCollision, magnitude } from 'Services/helpers';

const randomPosition = () => ([
  -1000 + Math.random() * 900,
  1000 - Math.random() * 900,
][Math.round(Math.random())]);

export default class BlackHole {
  constructor(game, { left, top, radius, gravity }) {
    this.game = game;

    this.left = left || randomPosition();
    this.top = top || randomPosition();
    this.radius = radius || 100 + (Math.random() * 50);

    this.gravity = gravity || 0.01;

    this.integrity = 100;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.radius * 2;
    this.canvas.height = this.radius * 2;
    this.context = this.canvas.getContext('2d');

    this.draw();
  }

  effect = (object, delta) => {
    const { left, top, radius, gravity, integrity } = this;

    const collision = circleCollision(object, this);

    if (!collision) return;

    // TODO: Only update if its a player
    this.updateIntegrity(delta);

    if (integrity <= 0) return;

    const xDifference = object.left - left;
    const yDifference = object.top - top;
    const distanceFromCenter = magnitude({
      x: xDifference,
      y: yDifference,
    });
    const distancePercentage = (radius + 10 - Math.abs(distanceFromCenter)) / radius;
    const multiplier = distancePercentage * gravity * delta;

    object.speedV = object.speedV - (yDifference * multiplier);
    object.speedH = object.speedH - (xDifference * multiplier);
  }

  updateIntegrity(delta) {
    if (this.integrity <= -100) return;

    this.integrity -= delta;
  }

  update(delta) {
    if (this.integrity >= 100) return;

    this.integrity += delta;
  }

  draw() {
    const { context, radius } = this;

    const gradient = context.createRadialGradient(radius, radius, 10, radius, radius, radius);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.8, 'transparent');
    gradient.addColorStop(0.8, 'white');
    gradient.addColorStop(1, 'transparent');

    context.save();
    context.beginPath();
    context.fillStyle = gradient;
    context.arc(radius, radius, radius, 0, 2 * Math.PI, false);
    context.closePath();
    context.fill();
    context.restore();
  }

  render() {
    const { context } = this.game.background;
    const { left, top, radius } = this;

    context.save();
    context.translate(left - radius, top - radius);

    context.beginPath();
    context.arc(radius, radius, radius * 0.7, 0, (2 * Math.PI) * (Math.round(this.integrity) / 100), false);
    context.strokeStyle = this.integrity > 0 ? 'white' : 'red';
    context.lineWidth = 5;
    context.stroke();

    context.drawImage(this.canvas, 0, 0);
    context.restore();
  }
}
