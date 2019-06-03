export function getNewGuid() {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
}

export function drawTextAlongArc(context, str, centerX, centerY, radius, angle, curAngle, color) {
  const len = str.length;
  let s = '';
  context.save();
  context.font = '10pt Arial';
  context.textAlign = 'center';
  context.fillStyle = color;
  context.strokeStyle = color;
  context.translate(centerX, centerY);
  context.rotate(curAngle);
  context.rotate(-1 * angle / 2);
  context.rotate(-1 * (angle / len) / 2);
  for (let n = 0; n < len; n++) {
    context.rotate(-1 * (angle / len));
    context.save();
    context.translate(0, 1 * radius);
    s = str[n];
    context.fillText(s, 0, 0);
    context.restore();
  }
  context.restore();
}

export function drawAtPointsInArc(context, pattern, centerX, centerY, radius, startAngle, endAngle = Math.PI * 2, count) {
  context.save();

  const angleDiff = (endAngle - startAngle) / count;

  for (let n = 0; n < count; n++) {
    context.save();
    context.rotate(n * angleDiff);
    context.translate(0, radius);
    context.drawImage(pattern, 0, 0);
    context.restore();
  }

  context.restore();
}

export function intersect(
  { x1: lx1, y1: ly1, x2: lx2, y2: ly2 },
  { x1: vx1, y1: vy1, x2: vx2, y2: vy2 }
) {
  // Check if none of the lines are of length 0
  if ((lx1 === lx2 && ly1 === ly2) || (vx1 === vx2 && vy1 === vy2)) return false;

  // essentially the angle between lines
  const denominator = ((vy2 - vy1) * (lx2 - lx1) - (vx2 - vx1) * (ly2 - ly1));

  // Lines are considered parallel
  if (denominator > -0.001 && denominator < 0.001) return false;

  // does the vector intersect the line?
  const ua = ((vx2 - vx1) * (ly1 - vy1) - (vy2 - vy1) * (lx1 - vx1)) / denominator;
  // const ub: number = ((lx2 - lx1) * (ly1 - vy1) - (ly2 - ly1) * (lx1 - vx1)) / denominator;

  // is the intersection along the segments
  if (ua < 0.001 || ua > 0.999) return false;

  return {
    x: lx1 + ua * (lx2 - lx1),
    y: ly1 + ua * (ly2 - ly1),
  };
}

export const magnitude = (a) => Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));

export const circleCollision = ({ left: x1, top: y1, radius: r1 = 0 }, { left: x2, top: y2, radius: r2 }) =>
  magnitude({
    x: x1 - x2 - 10,
    y: y1 - y2 - 10,
  }) < (r1 + r2);

export const scaleBetween = (unscaledNum, minAllowed, maxAllowed, min, max) =>
  (((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min)) + minAllowed;

export function absoluteMin(array, key) {
  const arrayOfAbsolutes = array.map(item => Math.abs(item[key]));

  const indexOfMinValue = arrayOfAbsolutes.indexOf(Math.min(...arrayOfAbsolutes));

  return array[indexOfMinValue][key];
}

export const mergeStyles = (styles, checks) =>
  Object.entries(checks).reduce((reduced, [key, value]) => {
    const check = typeof key === 'function' ? value : () => value;

    if (!check()) return reduced;

    return {
      ...reduced,
      ...styles[key],
    };
  }, {});

export function getCentroid(points) {
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
