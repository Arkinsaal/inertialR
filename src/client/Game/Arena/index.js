import StartFinish from '../Objects/StartFinish';
import Boundary from '../Objects/Boundary';
import CheckPoint from '../Objects/CheckPoint';
import BlackHole from '../Objects/BlackHole';

export default class Arena {
  constructor(game, settings = {}) {
    this.game = game;

    this.blackHoles = [];
    this.checkPoints = [];
    this.startFinish = new StartFinish(game);
    this.boundary = new Boundary(game, settings.boundary);

    this.setupCheckPoints(settings.checkPoints);
    this.setupBlackHoles(settings.blackHoles);
  }

  setupCheckPoints(checkPoints) {
    for (let i = 0; i < checkPoints.length; i++) {
      this.checkPoints.push(
        new CheckPoint(this.game, checkPoints[i])
      );
    }
  }

  setupBlackHoles(blackHoles) {
    for (let i = 0; i < blackHoles.length; i++) {
      this.blackHoles.push(
        new BlackHole(this.game, blackHoles[i])
      );
    }
  }

  effect = (object, delta) => {
    this.boundary.effect(object, delta);

    for (let i = 0; i < this.blackHoles.length; i++) {
      this.blackHoles[i].effect(object, delta);
    }
  }

  update(delta) {
    this.startFinish.update(delta);

    this.checkPoints.forEach((checkPoint) => {
      checkPoint.update(delta);
    });

    this.blackHoles.forEach((blackHole) => {
      blackHole.update(delta);
    });
  }

  render() {
    this.startFinish.render();
    this.boundary.render();

    this.checkPoints.forEach((checkPoint) => {
      checkPoint.render();
    });

    this.blackHoles.forEach((blackHole) => {
      blackHole.render();
    });
  }
}
