const trails = {};

export default class EngineTrail {
  constructor(game, { top, left, heading, color }) {
    this.game = game;

    this.top = top;
    this.left = left;
    this.heading = heading;
    this.speedV = -2 + (Math.random() * 4);
    this.speedH = -2 + (Math.random() * 4);

    this.engine = Math.round(Math.random() * 1);
    this.radius = 6;
    this.color = color;

    trails.player = trails.player || this.draw();
  }

  remove() {
    const { engineTrails: trails } = this.game.effects;

    trails.splice(trails.indexOf(this), 1);
  }

  update = (delta) => {
    const { speedV, speedH } = this;

    this.radius -= 0.05 * delta;
    if (this.radius < 0) this.remove();

    this.left += speedH;
    this.top += speedV;

    this.game.arena.effect(this, delta);
  }

  draw() {
    const { radius, color } = this;

    const canvas = document.createElement('canvas');
    canvas.width = radius * 2;
    canvas.height = radius * 2;
    const context = canvas.getContext('2d');

    context.shadowBlur = 60;
    context.fillStyle = color;
    context.shadowColor = color;
    context.beginPath();
    context.arc(radius, radius, 6, 0, Math.PI * 2, false);
    context.fill();

    return canvas;
  }

  render() {
    const { context } = this.game.background;
    const { left, top, radius } = this;

    context.save();
    context.translate(left - radius, top - radius);
    context.scale(radius / 6, radius / 6);
    context.globalAlpha = radius;
    context.drawImage(trails.player, 0, 0);
    context.restore();
  }
}
