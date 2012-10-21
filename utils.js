
function optional(def, x)
{
    if (typeof x == 'undefined')
    {
        return def;
    }

    return x;
}

function min(a, b)
{
    return a <= b ? a : b;
}

function max(a, b)
{
    return a >= b ? a : b;
}


// Returns the top left position of an object relative to the top left
// corner of the window.
function findPos(obj)
{
    var curleft = curtop = 0;

    if (obj.offsetParent)
    {
        do
        {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        }
        while (obj = obj.offsetParent);

        return [curleft, curtop];
    }
}

// Returns the slope of a line between c1 and c2 (Coord)
function slope(c1, c2)
{
    if (c1.getX() == c2.getX())
    {
        return 100000000.0;
    }

    if (c1.getX() < c2.getX())
    {
        return (c2.getY() - c1.getY()) / (c2.getX() - c1.getX());
    }

    return (c1.getY() - c2.getY()) / (c1.getX() - c2.getX());
}

// Returns the distance between a point p and a line c1, c2
function pointDistanceToLine(p, c1, c2)
{
    if (isBetween(c1.getX(), p.getX(), c2.getX()) == false &&
        isBetween(c1.getY(), p.getY(), c2.getY()) == false)
    {
        return null;
    }

    // Invert y axis
    var c1p = new Coord(c1.getX(), -c1.getY());
    var c2p = new Coord(c2.getX(), -c2.getY());
    var pp = new Coord(p.getX(), -p.getY());

    var m = slope(c1p, c2p);

    // y = mx + b
    // b = y - mx
    var b = c1p.getY() - (m * c1p.getX());

    // -mx + y -b = 0
    // Ax + By + C = 0
    // A = -m
    // B = 1
    // C = -b 
    var A = -m;
    var B = 1;
    var C = -b;

    // distance formula:
    // d = | Am + Bn + C | / sqrt(A2 + B2)
    var d = Math.abs(A * pp.getX() + B * pp.getY() + C) / Math.sqrt(A * A + B * B);

    //debug.append("d: " + d);

    return d;
}

// Returns the distance between a point p and a line c1, c2
function pointDistanceToPoint(p1, p2)
{
    var A = p2.getX() - p1.getX();
    var B = p2.getY() - p1.getY();
    var d = Math.sqrt(A * A + B * B);

    return d;
}

function isBetween(a, b, c)
{
    if ((a < b && b < c) ||
        (c < b && b < a))
    {
        return true;
    }

    return false;
}

function degToRad(d)
{
    return d * Math.PI / 180;
}

function radToDeg(r)
{
    return r * 180 / Math.PI;
}

function normalizeRadian(angle)
{
    while (angle < 0)
    {
        angle += 2 * Math.PI;
    }

    while (angle > 2 * Math.PI)
    {
        angle -= 2 * Math.PI;
    }

    return angle;
}

function Debug(div)
{
    this.divElement = document.getElementById(div);
    this.text = '';
}

Debug.prototype.clear = function()
{
    this.out('');
}

Debug.prototype.out = function(str)
{
    this.text = str;
    this.divElement.innerHTML = str;
}

Debug.prototype.append = function(str)
{
    this.out(this.text + str);
}

String.prototype.trim = function()
{
    a = this.replace(/^\s+/, '');
    return a.replace(/\s+$/, '');
};


Array.prototype.uniquePush = function(el)
{
    if (this.indexOf(el) == -1)
    {
        this.push(el);
    }
}
