import { DEGREES_TO_RADIANS, TURN_RATE, TURN_RATE_DECELERATION, FRICTION, ACCELERATION_RATE } from 'Services/constants';
import { magnitude } from 'Services/helpers';

const drawRadius = 20;

export default class Player {

  keys = {};
  mouse = {
    down: false,
    angle: null,
    position: {
      x: null,
      y: null,
    }
  }

  speed = 0;

  constructor(game, unit) {
    this.game = game;

    this.top = unit.top || 0;
    this.left = unit.left || 0;
    this.heading = unit.heading || 0;

    this.yaw = unit.yaw || 0;
    this.speedV = unit.speedV || 0;
    this.speedH = unit.speedH || 0;

    this.color = unit.color || 'blue';

    this.canvas = document.createElement('canvas');
    this.canvas.width = drawRadius * 2;
    this.canvas.height = drawRadius * 2;
    this.context = this.canvas.getContext('2d');

    this.draw();

    // TODO: extract position update logic
    this.listenForKeys();
  }

  updateMousePosition(event) {
    // position relative to 0,0
    const mousePos = {
      x: event.clientX - this.game.foreground.canvas.clientWidth / 2,
      y: event.clientY - this.game.foreground.canvas.clientHeight / 2,
    };

    const angle = Math.atan2(mousePos.y, mousePos.x);

    this.mouse.angle = angle / DEGREES_TO_RADIANS;
    this.mouse.position = mousePos;
  }

  handleMouseDown = (event) => {
    this.mouse.down = true;

    this.updateMousePosition(event);
  }

  handleMouseMove = (event) => {
    if (!this.mouse.down) return;

    this.updateMousePosition(event);
  }

  handleMouseUp = () => {
    this.mouse.down = false;
    this.mouse.angle = null;
  }

  listenForKeys() {
    this.game.foreground.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.game.foreground.canvas.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    this.game.foreground.canvas.addEventListener('touchStart', this.handleMouseDown);
    this.game.foreground.canvas.addEventListener('touchmove', this.handleMouseMove);
    document.addEventListener('touchend', this.handleMouseUp);

    this.game.foreground.canvas.addEventListener('keydown', (event) => {
      this.keys[event.keyCode] = true;
    });
    this.game.foreground.canvas.addEventListener('keyup', (event) => {
      this.keys[event.keyCode] = false;
    });
  }

  update(delta) {
    const { heading, speedV, speedH } = this;
    const { keys, mouse } = this;

    let reduce = true;

    // TODO: should choose controls, but this is ok for now
    if (mouse.down) {
      const targetHeading = mouse.angle;
      const currentHeading = heading + 90;

      const angleDifference = (targetHeading - currentHeading + 180) % 360 - 180;

      if (Math.abs(angleDifference) < 0.5) {
        this.heading = targetHeading - 90;
      } else {
        reduce = false;
        if (angleDifference < 0) {
          this.heading -= TURN_RATE * 20;
        } else {
          this.heading += TURN_RATE * 20;
        }
      }
    } else {
      if (keys[37]) {
        this.yaw -= TURN_RATE;
        reduce = false;
      }
      if (keys[39]) {
        this.yaw += TURN_RATE;
        reduce = false;
      }
    }

    // we don't want ships to keep spinning forever, so lets slow them down while not actively being turned
    if (reduce) this.yaw = this.yaw * TURN_RATE_DECELERATION;

    this.heading += this.yaw * delta;
    this.speedV = speedV * FRICTION;
    this.speedH = speedH * FRICTION;

    this.left += speedH;
    this.top += speedV;

    this.game.arena.effect(this, delta);

    const headingRads = heading * DEGREES_TO_RADIANS;

    const speed = Math.max(
      magnitude({
        x: this.speedH,
        y: this.speedV,
      }), 1
    );

    this.speed = speed.toFixed(2);

    if (!keys[38] && !mouse.down) return;

    const accelChange = (ACCELERATION_RATE * delta) / ((speed || 1) / 2);

    this.speedV += Math.cos(headingRads) * accelChange;
    this.speedH -= Math.sin(headingRads) * accelChange;

    this.game.effects.addEngineTrail(this);
  }

  draw() {
    const { context, color } = this;
    context.save();

    context.strokeStyle = color;
    context.fillStyle = color;
    context.shadowColor = color;

    context.translate(drawRadius, drawRadius);

    // context.shadowBlur = 40;
    context.lineWidth = 3;
    // core
    context.beginPath();
    context.arc(0, -2, 4, 0, 2 * Math.PI, false);
    context.fill();

    // inner
    context.beginPath();
    context.arc(0, 6, 8, 0.75 * Math.PI, (2 * Math.PI) + (0.25 * Math.PI), false);
    context.stroke();

    // outer
    context.beginPath();
    context.arc(2, 0, 15, 0.65 * Math.PI, 1.46 * Math.PI, false);
    context.arc(-2, 0, 15, 1.54 * Math.PI, (2 * Math.PI) + (0.35 * Math.PI), false);
    context.stroke();

    context.beginPath();
    context.arc(-6, -14, 5, Math.PI - 1, 0, false);
    context.fill();

    context.beginPath();
    context.arc(6, -14, 5, -Math.PI, 1, false);
    context.fill();

    context.restore();
  }

  render() {
    const { context } = this.game.foreground;
    const { top, left, heading } = this;

    const headingInRadians = heading * DEGREES_TO_RADIANS;

    if (this.mouse.down) {
      context.save();
      context.translate(left + this.mouse.position.x, top + this.mouse.position.y);
      context.beginPath();
      context.arc(0, 0, 20, 0, Math.PI * 2, false);
      context.strokeStyle = 'blue';
      context.lineWidth = 5;
      context.stroke();
      context.restore();
    }

    context.save();

    context.translate(left, top);
    context.rotate(headingInRadians);
    context.translate(-drawRadius, -drawRadius);
    context.drawImage(this.canvas, 0, 0);
    context.restore();

    // context.save();
    // context.font = '15pt Arial';
    // context.fillStyle = 'white';
    // context.strokeStyle = 'black';
    // context.textAlign = 'right';
    // context.textBaseline = 'top';
    // context.fillText(`${this.speed}km/s`, canvas.clientWidth / 2, canvas.clientHeight / -2);
    // context.restore();
  }
}
