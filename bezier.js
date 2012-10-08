/*
    Bezier module
*/

/// Bezier class ------------------------------------------

Bezier.prototype = new Drawable;
Bezier.prototype.constructor = Bezier;

function Bezier(start, cp1, cp2, end)
{
    Drawable.call(this);

    this.color = "#339933";

    this.start = start;
    this.cp1 = cp1;
    this.cp2 = cp2;
    this.end = end;
}

Bezier.prototype.draw = function(ctx)
{
    var context = ctx;

    context.lineWidth = 1;

    var vp = context.viewPort;
    var s = vp.scale(this.start.getCoord());
    var cp1 = vp.scale(this.cp1);
    var cp2 = vp.scale(this.cp2);
    var e = vp.scale(this.end.getCoord());

    // draw the lines from start/end to control points
    context.beginPath();

    context.strokeStyle = '#bebebe';
    context.moveTo(s.getX(), s.getY());
    context.lineTo(cp1.getX(), cp1.getY());

    context.moveTo(e.getX(), e.getY());
    context.lineTo(cp2.getX(), cp2.getY());

    context.stroke();
    context.closePath();

    // draw the bezier curve
    context.beginPath();
    context.moveTo(s.getX(), s.getY());
    context.strokeStyle = this.color;
    context.bezierCurveTo(cp1.getX(), cp1.getY(),
                          cp2.getX(), cp2.getY(),
                          e.getX(),   e.getY());
    context.stroke();
    context.closePath();

    // draw the points
    this.start.draw(context);
    this.end.draw(context);

    var cp1Point = new Point(this.cp1);
    cp1Point.setColor('#ff5555');
    cp1Point.draw(context);

    var cp2Point = new Point(this.cp2);
    cp2Point.setColor('#ff5555');
    cp2Point.draw(context);
}

Bezier.prototype.getLimit = function()
{
    var s   = this.start.getCoord();
    var cp1 = this.cp1;
    var cp2 = this.cp2;
    var e   = this.end.getCoord();

    var minX = min(s.getX(), min(cp1.getX(), min(cp2.getX(), e.getX())));
    var minY = min(s.getY(), min(cp1.getY(), min(cp2.getY(), e.getY())));
    var maxX = max(s.getX(), max(cp1.getX(), max(cp2.getX(), e.getX())));
    var maxY = max(s.getY(), max(cp1.getY(), max(cp2.getY(), e.getY())));

    var mini = new Coord(minX, minY);
    var maxi = new Coord(maxX, maxY);
    return [mini, maxi];
}
