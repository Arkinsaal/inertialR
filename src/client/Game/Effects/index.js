import EngineTrail from '../Objects/EngineTrail';

import { DEGREES_TO_RADIANS } from 'Services/constants';

export default class Effects {
  constructor(game) {
    this.game = game;

    this.engineTrails = [];
  }

  addEngineTrail = ({ left, top, heading, color }) => {
    const headingInRadians = heading * DEGREES_TO_RADIANS;

    this.engineTrails.push(
      new EngineTrail(this.game, {
        left,
        top,
        heading: headingInRadians,
        color,
      })
    );
  }

  update(delta) {
    for (let i = 0; i < this.engineTrails.length; i++) {
      this.engineTrails[i].update(delta);
    }
  }

  render() {
    for (let i = 0; i < this.engineTrails.length; i++) {
      this.engineTrails[i].render();
    }
  }
}
