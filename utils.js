var earthRadius = 6371; // km

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

function normalizeRadianToPi(angle)
{
    while (angle < -Math.PI)
    {
        angle += Math.PI;
    }

    while (angle > Math.PI)
    {
        angle -= Math.PI;
    }

    return angle;
}

function normalizeRadianToHalfPi(angle)
{
    while (angle < -(Math.PI/2))
    {
        angle += Math.PI / 2;
    }

    while (angle > Math.PI/ 2)
    {
        angle -= Math.PI / 2;
    }

    return angle;
}

// http://www.movable-type.co.uk/scripts/latlong.html

function latLongToXY(projectionCenter, coord)
{
}

function getDistanceBetweenLatLong(coord1, coord2)
{
    var lat1 = coord1.getX();
    var lon1 = coord1.getY();
    var lat2 = coord2.getX();
    var lon2 = coord2.getY();

    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;

    return d;
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

// extend Number object with methods for presenting bearings & lat/longs

Number.prototype.toDMS = function()
{
    // convert numeric degrees to deg/min/sec
    var d = Math.abs(this);  // (unsigned result ready for appending compass dir'n)
    d += 1/7200;  // add ? second for rounding
    var deg = Math.floor(d);
    var min = Math.floor((d-deg)*60);
    var sec = Math.floor((d-deg-min/60)*3600);
    // add leading zeros if required
    if (deg<100) deg = '0' + deg;
    if (deg<10) deg = '0' + deg;
    if (min<10) min = '0' + min;
    if (sec<10) sec = '0' + sec;
    return deg + ' ' + min + '\'' + sec + '\"';
}

Number.prototype.toDegrees = function()
{
    return this * 180 / Math.PI;
}

Number.prototype.toRadians = function()
{
    return this * Math.PI / 180;
}

Number.prototype.toPrecision = function(fig)
{ 
    // override toPrecision method with one which displays 
    if (this == 0)
    {
        return 0;                      // trailing zeros in place of exponential notation
    }

    var scale = Math.ceil(Math.log(this)*Math.LOG10E);
    var mult = Math.pow(10, fig-scale);
    return Math.round(this*mult)/mult;
}

Number.prototype.toLat = function()
{
    // convert numeric degrees to deg/min/sec latitude
    return this.toDMS().slice(1) + (this < 0 ? 'S' : 'N');  // knock off initial '0' for lat!
}

Number.prototype.toLong = function()
{
    // convert numeric degrees to deg/min/sec longitude
    return this.toDMS() + (this > 0 ? 'E' : 'W');
}
