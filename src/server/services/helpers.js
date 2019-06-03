function getNewGuid() {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
}
const magnitude = (a) => Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));

const circleCollision = ({ left: x1, top: y1, radius: r1 = 0 }, { left: x2, top: y2, radius: r2 }) =>
  magnitude({
    x: x1 - x2 - 10,
    y: y1 - y2 - 10,
  }) < (r1 + r2);

function getCentroid(points) {
  const { length } = points;

  if (length === 1) return points[0];

  if (length === 2) {
    return {
      left: (points[0].left + points[1].left) / 2,
      top: (points[0].top + points[1].top) / 2,
    };
  }

  const [first] = points;
  const last = points[points.length - 1];

  if (first.left !== last.left || first.top !== last.top) points.push(first);

  let twiceArea = 0;
  let left = 0;
  let top = 0;
  let p1;
  let p2;
  let f;

  for (let i = 0, j = length - 1; i < length; j = i++) {
    p1 = points[i];
    p2 = points[j];
    f = p1.left * p2.top - p2.left * p1.top;
    twiceArea += f;
    left += (p1.left + p2.left) * f;
    top += (p1.top + p2.top) * f;
  }
  f = twiceArea * 3;

  return {
    left: left / f,
    top: top / f,
  };
}

module.exports = {
  getNewGuid,
  magnitude,
  circleCollision,
  getCentroid,
};
