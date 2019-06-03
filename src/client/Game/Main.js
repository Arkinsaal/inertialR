import FpsController from './FpsController';

import Player from './Players/Player';
import Arena from './Arena';
import Effects from './Effects';

import { intersect, magnitude } from 'Services/helpers';

function resize(canvas) {
  const { devicePixelRatio } = window;

  const { clientWidth, clientHeight } = canvas;

  const width = clientWidth * devicePixelRatio;
  const height = clientHeight * devicePixelRatio;

  if (
    canvas.width !== width ||
    canvas.height !== height
  ) {
    canvas.width = width;
    canvas.height = height;
  }
}

function clear({ canvas, context }) {
  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
}

export default class Main {

  fps = {
    rendering: [0],
    updating: [0],
  };

  constructor({ foreground, background }, settings) {
    this.foreground = foreground;
    this.background = background;

    this.start = performance.now();

    this.arena = new Arena(this, settings);

    this.effects = new Effects(this);

    this.player = new Player(this, {});
    this.opponents = {};

    this.fpsController = new FpsController(this, {
      fps: 30,
      render: this.render,
      update: this.update,
    });

    this.fpsController.start();
  }

  intersection = (object) => {
    const { player } = this;

    const playerToObject = {
      x1: player.left,
      y1: player.top,
      x2: object.left,
      y2: object.top,
    };

    const distanceToCheckPoint = magnitude({
      x: player.left - object.left,
      y: player.top - object.top,
    });

    const { canvas } = this.foreground;

    const clientLeft = player.left - (canvas.clientWidth / 2);
    const clientTop = player.top - (canvas.clientHeight / 2);
    const clientRight = clientLeft + canvas.clientWidth;
    const clientBottom = clientTop + canvas.clientHeight;

    const wallIntersections = [
      intersect(playerToObject, { x1: clientLeft, y1: clientTop, x2: clientLeft, y2: clientBottom }),
      intersect(playerToObject, { x1: clientLeft, y1: clientTop, x2: clientRight, y2: clientTop }),
      intersect(playerToObject, { x1: clientRight, y1: clientTop, x2: clientRight, y2: clientBottom }),
      intersect(playerToObject, { x1: clientLeft, y1: clientBottom, x2: clientRight, y2: clientBottom }),
    ].filter((intersection) => !!intersection);

    const intersection = [
      () => null,
      () => wallIntersections[0],
      () => {
        // TODO: this is close
        const mag1 = magnitude(wallIntersections[0]);
        const mag2 = magnitude(wallIntersections[1]);

        return wallIntersections[mag1 < mag2 ? 0 : 1];
      }
    ][wallIntersections.length]();

    if (!intersection) return {
      x: null,
      y: null,
      radius: null,
    };

    const distanceToIntersection = magnitude({
      x: player.left - intersection.x,
      y: player.top - intersection.y,
    });

    intersection.radius = distanceToCheckPoint - distanceToIntersection;

    return intersection;
  }

  update = (delta) => {
    const time = performance.now();

    this.player.update(delta);
    this.effects.update(delta);
    this.arena.update(delta);

    this.fps.updating.push(performance.now() - time);
    if (this.fps.updating.length > 120) this.fps.updating.shift();
  }

  render = () => {
    resize(this.foreground.canvas);
    resize(this.background.canvas);

    clear(this.background);
    clear(this.foreground);

    this.foreground.context.save();
    this.background.context.save();

    this.foreground.context.translate(this.foreground.canvas.width / 2, this.foreground.canvas.height / 2);
    this.background.context.translate(this.background.canvas.width / 2, this.background.canvas.height / 2);

    this.renderFps();

    this.foreground.context.translate(-this.player.left, -this.player.top);
    this.background.context.translate(-this.player.left, -this.player.top);

    this.arena.render();
    this.effects.render();
    this.player.render();

    this.foreground.context.restore();
    this.background.context.restore();
  }

  renderFps() {
    const { context, canvas } = this.foreground;
    const { fps } = this.fpsController;

    context.save();

    context.translate(canvas.clientWidth / -2, canvas.clientHeight / -2);

    context.beginPath();
    context.fillStyle = 'rgba(0, 0, 0, 0.4)';
    context.strokeStyle = 'white';
    context.fillRect(0, 0, 160, 20);

    context.moveTo(0, 20 - (fps[0] * 0.2));
    for (let i = 1; i < fps.length; i++) {
      context.lineTo(i, 20 - (fps[i] * 0.2));
    }
    context.stroke();

    context.font = '10pt Arial';
    context.fillStyle = 'white';
    context.textBaseline = 'top';

    context.fillText(`${Math.round(fps.slice(-1)[0])}:${Math.round(fps.reduce((prev, curr) => prev + curr) / fps.length)}`, 125, 5);

    context.restore();
  }
}
