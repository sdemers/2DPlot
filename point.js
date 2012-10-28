/*
    Point module
*/

/// Coord class -------------------------------------------

function Coord(x, y)
{
    this.x = x;
    this.y = y;
}

Coord.prototype.getX = function()
{
    return this.x;
}

Coord.prototype.getY = function()
{
    return this.y;
}

Coord.prototype.setX = function(x)
{
    this.x = x;
}

Coord.prototype.setY = function(y)
{
    this.y = y;
}

Coord.prototype.setXY = function(x, y)
{
    this.setX(x);
    this.setY(y);
}

Coord.prototype.min = function(rhs)
{
    var x = min(this.x, rhs.x);
    var y = min(this.y, rhs.y);

    return new Coord(x, y);
}

Coord.prototype.max = function(rhs)
{
    var x = max(this.x, rhs.x);
    var y = max(this.y, rhs.y);

    return new Coord(x, y);
}

Coord.prototype.add = function(rhs)
{
    var x = this.x + rhs.x;
    var y = this.y + rhs.y;

    return new Coord(x, y);
}

/// Point class --------------------------------------------

Point.prototype = new Drawable;
Point.prototype.constructor = Point;

function Point(coord)
{
    Drawable.call(this);

    this.coord = coord;
    this.size = 2;
    this.coordDrawn = coord;
}

Point.prototype.getCoord = function()
{
    return this.coord;
}

Point.prototype.getTextPos = function()
{
    return "(" + this.coord.getX().toFixed(3) + ", " + this.coord.getY().toFixed(3) + ")";
}

Point.prototype.getInfoBoxPos = function()
{
    return this.coordDrawn;
}

Point.prototype.getLimit = function()
{
    return [this.coord, this.coord];
}

Point.prototype.setSize = function(size)
{
    this.size = size;
}

Point.prototype.setColor = function(color)
{
    this.color = color;
}

Point.prototype.getDistanceDrawn = function(p)
{
    return pointDistanceToPoint(p, this.coordDrawn);
}

Point.prototype.draw = function(context, translatePos)
{
    var vp = context.viewPort;
    var scaled = vp.scale(this.coord).add(translatePos);

    this.coordDrawn = scaled;

    var x = scaled.getX();
    var y = scaled.getY();

    context.strokeStyle = this.color;
    context.fillStyle = this.color;

    context.beginPath();
    context.arc(x, y, this.size, 0, Math.PI * 2, true);

    if (this.size > 1)
    {
        context.fill();
    }
    else 
    {
        context.stroke();
    }

    context.closePath();
}
