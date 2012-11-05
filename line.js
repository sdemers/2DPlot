/*
    Line module
*/

/// Line class --------------------------------------------

Line.prototype = new Drawable;
Line.prototype.constructor = Line;

function Line(startCoord, endCoord)
{
    Drawable.call(this);

    this.startCoord = startCoord;
    this.endCoord = endCoord;
    this.size = 2;
    this.drawnStart = startCoord;
    this.drawnEnd = endCoord;
}

Line.prototype.getLimit = function()
{
    var s = this.startCoord;
    var e = this.endCoord;

    var mini = s.min(e);
    var maxi = s.max(e);
    return [mini, maxi];
}

Line.prototype.getStartCoord = function()
{
    return this.startCoord;
}

Line.prototype.getEndCoord = function()
{
    return this.endCoord;
}

Line.prototype.setSize = function(size)
{
    this.size = size;
}

Line.prototype.setColor = function(color)
{
    this.color = color;
}

Line.prototype.getAngle = function()
{
    if (useLatLong)
    {
        return this.startCoord.getLatLong().getBearing(this.endCoord.getLatLong());
    }

    var angle = Math.atan(slope(this.getStartCoord(), this.getEndCoord()));
    return angle;
}

Line.prototype.draw = function(context, translatePos)
{
    var vp = context.viewPort;
    var scaled1 = vp.scale(this.startCoord).add(translatePos);
    var scaled2 = vp.scale(this.endCoord).add(translatePos);
    var x1 = scaled1.getX();
    var y1 = scaled1.getY();
    var x2 = scaled2.getX();
    var y2 = scaled2.getY();

    context.strokeStyle = this.color;
    context.fillStyle = this.color;

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();

    this.drawnStart = new Coord(x1, y1);
    this.drawnStart.setLatLong(this.startCoord.getLatLong());
    this.drawnEnd = new Coord(x2, y2);
    this.drawnEnd.setLatLong(this.endCoord.getLatLong());

    //debug.append(x1 + ", " + y1 + "<br>");
    //debug.append(x2 + ", " + y2 + "<br>");

    context.closePath();
}

Line.prototype.getInfoBoxPos = function()
{
    var x = (this.drawnEnd.getX() + this.drawnStart.getX()) / 2;
    var y = (this.drawnEnd.getY() + this.drawnStart.getY()) / 2;
    return new Coord(x, y);
}

Line.prototype.getDistanceDrawn = function(p)
{
    var c1 = this.drawnStart;
    var c2 = this.drawnEnd;

    if (isBetween(c1.getX(), p.getX(), c2.getX()) == false &&
        isBetween(c1.getY(), p.getY(), c2.getY()) == false)
    {
        return null;
    }

    return pointDistanceToLine(p, this.drawnStart, this.drawnEnd);
}

// Returns line length
Line.prototype.getLength = function()
{
    if (useLatLong)
    {
        // return km by default
        var distance = this.endCoord.getLatLong().getDistance(this.startCoord.getLatLong());

        switch (distanceUnit)
        {
            case "m":     distance *= 1000;      break;
            case "feet":  distance *= 3280.8399; break;
            case "nm":    distance *= 0.54;      break;
            case "miles": distance *= 0.6214;    break;
        }
        return distance;
    }

    var x2 = this.endCoord.getX() - this.startCoord.getX();
    x2 *= x2;
    var y2 = this.endCoord.getY() - this.startCoord.getY();
    y2 *= y2;
    return Math.sqrt(x2 + y2);
}
