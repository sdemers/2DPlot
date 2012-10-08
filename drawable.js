/*
    Drawable class
*/

function Drawable()
{
    this.color = "#1234ff";
}

Drawable.prototype.draw = function(context)
{
}

// Should return 2 coords in an array:
// One containing min (x, y) other containing max (x, y)
Drawable.prototype.getLimit = function()
{
    return null;
}

Drawable.prototype.setColor = function(color)
{
    this.color = color;
}
