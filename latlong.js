/*
    LatLong module
*/

/// LatLong class -------------------------------------------

var projectionCenter = new LatLong(0, 0);
var earthRadiusInMeter = 6378.14 * 1000;

function setProjectionCenter(projCenter)
{
    var cosLat = projCenter.cosLat;
    var sinLat = projCenter.sinLat;
    var cosLon = projCenter.cosLon;
    var sinLon = projCenter.sinLon;

    var a = 6378137;
    var f = 1/298.257223563;

    var e2 = 2 * f - (f * f);
    var N = a / Math.sqrt(1 - (e2 * sinLat * sinLat));
    var x = N * cosLat * cosLon;
    var y = N * cosLat * sinLon;
    var z = (N * (1 - e2)) * sinLat;

    earthRadiusInKM  = Math.sqrt(x*x + y*y + z*z);
    projectionCenter = projCenter;
}

function LatLong(lat, lon)
{
    this.lat = normalizeRadianToHalfPi(lat);
    this.lon = normalizeRadianToPi(lon);

    this.sinLat = Math.sin(this.lat);
    this.cosLat = Math.cos(this.lat);
    this.sinLon = Math.sin(this.lon);
    this.cosLon = Math.cos(this.lon);
}

LatLong.prototype.convertToXY = function()
{
    var pj = projectionCenter;

    var cosLongDiff = Math.cos(this.lon - pj.lon);
    var sinLongDiff = Math.sin(this.lon - pj.lon);

    // compute C, the angular distance of the point from the projection center.
    var cosC = this.sinLat * pj.sinLat +
               this.cosLat * pj.cosLat * cosLongDiff;

    var C = Math.acos(cosC);
    if (cosC == 0.0)
    {
        return null;
    }

    var radius = earthRadiusInMeter / 1000;

    var x = (radius / cosC) * this.cosLat * sinLongDiff;
    var y = (radius / cosC) * (pj.cosLat * this.sinLat -
                               pj.sinLat * this.cosLat * cosLongDiff);

    return new Coord(x, y);
}
