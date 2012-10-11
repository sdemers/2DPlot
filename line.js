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

Line.prototype.draw = function(context)
{
    var vp = context.viewPort;
    var scaled1 = vp.scale(this.startCoord);
    var scaled2 = vp.scale(this.endCoord);
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

    context.closePath();
}


