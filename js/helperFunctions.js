
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
            (pt-24 < tr.b) &&
            (pl-24 > tr.l) &&
            (pl+10 < tr.r)
        ) ||
        (
            (pt+4 > tr.t) &&
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
        ((pt-30) < tr.b) &&
        ((pt+10) > tr.t) &&
        ((pl+10) > tr.l) &&
        ((pl-30) < tr.r)
    );
};

function circleCollision(pl, ci) {
	var horiDiff = pl.l-ci.l-10,
		vertDiff = pl.t-ci.t - 10;
	return Math.sqrt((horiDiff*horiDiff) + (vertDiff*vertDiff)) < ci.r;
};