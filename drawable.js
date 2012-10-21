/*
    Drawable class
*/

function Drawable()
{
    this.color = "#1234ff";
}

Drawable.prototype.draw = function(context, translatePos)
{
}

// Should return 2 coords in an array:
// One containing min (x, y) other containing max (x, y)
Drawable.prototype.getLimit = function()
{
    return null;
}

Drawable.prototype.getDistanceDrawn = function(p)
{
    return null;
}

Drawable.prototype.getLength = function()
{
    return null;
}

Drawable.prototype.getAngle = function()
{
    return null;
}

Drawable.prototype.getTextPos = function()
{
    return "";
}



// Position of the box used to print information about this object in the canvas.
Drawable.prototype.getInfoBoxPos = function()
{
    return null;
}

Drawable.prototype.setColor = function(color)
{
    this.color = color;
}
