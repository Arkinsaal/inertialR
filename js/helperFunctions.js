
function getNewGuid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};

function verticalCollision(pt, pl, tr) {
	return (
        (
            (pt-24 < tr.t) &&
            (pl-24 > tr.l) &&
            (pl+10 < tr.r)
        ) ||
        (
            (pt+4 > tr.b) &&
            (pl-24 > tr.l) &&
            (pl+10 < tr.r)
        )
    );
};
function horizontalCollision(pl, pt, tr) {
	return (
        (
            (pl-24 < tr.l) &&
            (pt-24 > tr.t) &&
            (pt+10 < tr.b)
        ) ||
        (
            (pl+4 > tr.r) &&
            (pt-24 > tr.t) &&
            (pt+10 < tr.b)
        )
    );
};

function blockCollision(pl, pt, tr) {
    return (
        ((pt-24) < tr.b) &&
        ((pt+4) > tr.t) &&
        ((pl+4) > tr.l) &&
        ((pl-24) < tr.r)
    );
};

function circleCollision(pl, ci) {
	var horiDiff = pl.l-ci.l-10,
		vertDiff = pl.t-ci.t - 10;
	return Math.sqrt((horiDiff*horiDiff) + (vertDiff*vertDiff)) < ci.r;
};

function drawTextAlongArc(context, str, centerX, centerY, radius, angle, curAngle, color) {
    var len = str.length, s;
    context.save();
    context.font = '10pt Arial';
    context.textAlign = 'center';
    context.fillStyle = color;
    context.strokeStyle = color;
    context.translate(centerX, centerY);
    context.rotate(curAngle);
    context.rotate(-1 * angle / 2);
    context.rotate(-1 * (angle / len) / 2);
    for(var n = 0; n < len; n++) {
      context.rotate(-1* (angle / len));
      context.save();
      context.translate(0, 1 * radius);
      s = str[n];
      context.fillText(s, 0, 0);
      context.restore();
    }
    context.restore();
};

function handleBlackhole(entity, bH, t) {
    if (circleCollision(entity,bH)) {

        var lDiff = entity.l - bH.l,
            tDiff = entity.t - bH.t,
            aDiff = Math.sqrt(Math.pow(lDiff, 2)+Math.pow(tDiff, 2)),
            dPerc = (((bH.r+10) - Math.abs(aDiff)) / bH.r),
            multplier = dPerc*bH.gravity*t;

        entity.speedV = entity.speedV - (tDiff*multplier);
        entity.speedH = entity.speedH - (lDiff*multplier);

        if (dPerc > 0.8) {
            entity.speedV = entity.speedV*0.999;
            entity.speedH = entity.speedH*0.999;
        };
    };
};

function handleCheckpoint(entity, cP) {
    if (circleCollision(entity,cP)) {
        if (!cP.touched) {
            entity.touchedCount++;
            playerTouchedCheckpoint(player);
        };
        cP.touched = true;
    };
};