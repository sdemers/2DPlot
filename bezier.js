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

    var mini = s.min(cp1).min(cp2).min(e);
    var maxi = s.max(cp1).max(cp2).max(e);

    return [mini, maxi];
}
