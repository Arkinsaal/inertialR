import { getNewGuid, circleCollision, getCentroid } from './helpers';

const randomPosition = (outer, inner) => ([
  -outer + Math.random() * inner,
  outer - Math.random() * inner,
][Math.round(Math.random())]);

export function generateBoundary() {
  return {
    left: 0,
    top: 0,
    radius: 2000,
    effectRadius: 2000,
    elasticity: 0.001,
  };
}

export function generateBlackHoles(count = 50) {
  const blackHoles = [];

  for (let i = 0; i < count; i++) {
    const newBlackHole = {
      left: randomPosition(1000, 900),
      top: randomPosition(1000, 900),
      radius: 100,
      gravity: 0.01,
    };

    const collisionCheck = circleCollision.bind(this, newBlackHole);

    const collisions = blackHoles.filter(collisionCheck);
    const toMerge = [...collisions, newBlackHole];

    const totalGravity = toMerge.reduce((reduced, { gravity }) => (reduced + gravity), 0); // TODO: this is probably too much
    const totalArea = toMerge.reduce((reduced, { radius }) => reduced + (Math.PI * (radius ** 2)), 0);
    const radius = Math.sqrt(totalArea / Math.PI);
    const { left, top } = getCentroid(toMerge);

    collisions.forEach((collision) => {
      const index = blackHoles.indexOf(collision);

      blackHoles.splice(index, 1);
    });

    blackHoles.push({
      left,
      top,
      radius,
      gravity: totalGravity,
    });
  }

  return blackHoles;
}

export function generateCheckPoints(count = 4) {
  const checkPoints = {};

  for (let i = 0; i < count; i++) {
    const id = getNewGuid();

    checkPoints[id] = {
      left: randomPosition(1000, 600),
      top: randomPosition(1000, 600),
      radius: 70,
    };
  }

  return checkPoints;
}
