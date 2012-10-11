/*
    Bezier Plot
*/

var context = null;
var zoom = null;
var objects = new Array();

var debug = null;

function init(canvasName)
{
    debug = new Debug("debug");

    var canvas = document.getElementById(canvasName);

    if (canvas.getContext)
    {
        context = canvas.getContext('2d');
        var w = canvas.width = canvas.clientWidth;
        var h = canvas.height = canvas.clientHeight;
        context.viewPort = new ViewPort(w, h);
    }
    else
    {
        return;
    }
}

function draw(scale, translatePos)
{
    emptyCanvas();
 
    var limits = [];
    objects.forEach(function(obj)
    {
        var l = obj.getLimit();

        if (l != null)
        {
            var objMin = l[0];
            var objMax = l[1];

            if (limits.length == 0)
            {
                limits = [objMin, objMax];
            }
            else
            {
                var newMin = objMin.min(limits[0]);
                var newMax = objMax.max(limits[1]);
                limits = [newMin, newMax];
            }
        }
    });

    if (context != null)
    {
        context.save();

        context.translate(translatePos.x, translatePos.y);

        // Apply scale factor
        var l0 = new Coord(limits[0].getX() * 1/scale, limits[0].getY() * 1/scale);
        var l1 = new Coord(limits[1].getX() * 1/scale, limits[1].getY() * 1/scale);

        context.viewPort.setLimits(l0, l1);

        objects.forEach(function(obj) { obj.draw(context); });

        //var text = "Limits: (" + l0.x + ", " + l0.y + "), (" + l1.x + ", " + l1.y + ")";
        //context.translate(-translatePos.x, -translatePos.y);
        //context.strokeText(text, 20, 20);

        context.restore();
    }
}

function clearCanvas()
{
    objects = [];
    //debug.clear();
    emptyCanvas();
}

function emptyCanvas()
{
    var c = context;
    if (c != null)
    {
        c.viewPort.reset();

        var cnv = c.canvas;

        c.beginPath();
	    c.fillStyle = "#ffffff";
	    c.fillRect(0, 0, cnv.width, cnv.height);
	    c.fill();
    }
}

function parseLines(data)
{
    var exp = /[^0-9.|-]/g;
    var input = data.replace(exp, ' ');
    input = input.replace(/[ ]+/g, ' ');
    input = input.replace(/\|[ ]/, '|');
    input = input.replace(/[ ]\|/, '|');
    input = input.replace(/\|$/, '');
    input = input.replace(/^\|/, '');
    input = input.replace(/\n/, '');

    var linesData = input.split('|');

    var lines = new Array();

    for (i = 0; i < linesData.length; ++i)
    {
        var set = new Array();
        var line = linesData[i].trim();
        var positions = line.split(' ');
        var remain = positions.length % 2;

        if (remain == 1)
        {
            positions.pop();
        }

        if (positions.length < 2)
        {
            continue;
        }

        for (j = 0; j < positions.length; j += 2)
        {
			coord = new Coord(parseFloat(positions[j]), parseFloat(positions[j+1]));
            set.push(coord);
        }

        lines.push(set);
    }

    return lines;
}

function parsePoints(data)
{
    var exp = /[^0-9.-]/g;
    var input = data.replace(exp, ' ');
    input = input.replace(/[ ]+/g, ' ').trim();

    var pointsData = input.split(' ');

    var points = new Array();

    for (i = 0; i < pointsData.length; i += 2)
    {
        if (i + 1 >= pointsData.length)
        {
            break;
        }

        var x = pointsData[i].trim();
        var y = pointsData[i + 1].trim();

        var coord = new Coord(parseFloat(x), parseFloat(y));
        points.push(coord);
    }

    return points;
}

function drawLines(lines, scale, translatePos, close=false)
{
	var colors = ["#339933", "#1947D1", "#FF9900", "#FF0000"];

    for (i = 0; i < lines.length; ++i)
    {
        var lineDef = lines[i];

        if (lineDef.length == 1)
        {
            var coord = lineDef[0];
            addPoint(coord, colors[i % colors.length]);
        }
        else
        {
            for (j = 0; j < lineDef.length - 1; ++j)
            {
                var coord1 = lineDef[j];
                var coord2 = lineDef[j+1];

                addPoint(coord1, colors[i % colors.length]);
                addPoint(coord2, colors[i % colors.length]);
                addLine(coord1, coord2, colors[i % colors.length]);
            }

            if (close)
            {
                var coord1 = lineDef[lineDef.length - 1];
                var coord2 = lineDef[0];
                addLine(coord1, coord2, colors[i % colors.length]);
            }
        }
    }

    draw(scale, translatePos);
}

function drawRectangle(points, scale, translatePos)
{
	var colors = ["#339933", "#1947D1", "#FF9900", "#FF0000"];

    for (i = 0; i < points.length; i += 2)
    {
        if (i + 1 >= points.length)
        {
            break;
        }

        var coord1 = points[i];
        var coord2 = new Coord(points[i + 1].getX(), points[i].getY());
        var coord3 = points[i + 1];
        var coord4 = new Coord(points[i].getX(), points[i + 1].getY());

        addPoint(coord1, colors[i % colors.length]);
        addPoint(coord2, colors[i % colors.length]);
        addPoint(coord3, colors[i % colors.length]);
        addPoint(coord4, colors[i % colors.length]);
        addLine(coord1, coord2, colors[i % colors.length]);
        addLine(coord2, coord3, colors[i % colors.length]);
        addLine(coord3, coord4, colors[i % colors.length]);
        addLine(coord4, coord1, colors[i % colors.length]);
    }

    draw(scale, translatePos);
}

function drawPoints(points, scale, translatePos)
{
	var colors = ["#339933", "#1947D1", "#FF9900", "#FF0000"];

    for (i = 0; i < points.length; ++i)
    {
        var coord = points[i];
        addPoint(coord, colors[i % colors.length]);
    }

    draw(scale, translatePos);
}

function addPoint(coord, color)
{
    var pt = new Point(coord);

    pt.setSize(2);
	pt.setColor = color;
    objects.push(pt);
}

function addLine(coord1, coord2, color)
{
    var line = new Line(coord1, coord2);

    line.setSize(2);
    line.setColor(color);
    objects.push(line);
}

function parseBezier(data)
{
    var exp = /[^0-9.-]/g;
    var input = data.replace(exp, ' ');
    input = input.replace(/[ ]+/g, ' ');
    input = input.replace(/^[ ]+/g, '');
    input = input.replace(/\n/, '');

    var xy = input.split(' ');
    var remain = xy.length % 8;

    for (i = 0; i < remain; ++i)
    {
        xy.pop();
    }

    for (i = 0; i < xy.length; ++i)
    {
        xy[i] = parseFloat(xy[i]);
    }

    var curves = []

    if (xy.length < 8)
    {
        return curves;
    }

    for (i = 0; i < xy.length; i += 8)
    {
        var bez = new Bezier(new Point(new Coord(xy[i], xy[i + 1])),
                             new Coord(xy[i + 2], xy[i + 3]),
                             new Coord(xy[i + 4], xy[i + 5]),
                             new Point(new Coord(xy[i + 6], xy[i + 7])));
        curves.push(bez);
    }

    return curves;
}

function addBezier(curve)
{
    objects.push(curve);
}

function drawBezier(curves, scale, translatePos)
{
    for (i = 0; i < curves.length; ++i)
    {
        addBezier(curves[i]);
    }

    draw(scale, translatePos);
}

/// ViewPort object
function ViewPort(width, height)
{
    this.width  = width;
    this.height = height;

    this.minX = 0;
    this.minY = 0;
    this.maxX = width;
    this.maxY = height;
}

ViewPort.prototype.setLimits = function(c1, c2)
{
    if (typeof c1 == 'undefined' ||
        typeof c2 == 'undefined')
    {
        return;
    }

    this.minX = min(c1.getX(), c2.getX()) - 10;
    this.minY = min(c1.getY(), c2.getY()) - 10;
    this.maxX = max(c1.getX(), c2.getX()) + 10;
    this.maxY = max(c1.getY(), c2.getY()) + 10;
}

ViewPort.prototype.reset = function()
{
    this.minX = 0;
    this.minY = 0;
    this.maxX = this.width;
    this.maxY = this.height;  
}

ViewPort.prototype.scale = function(c)
{
    var spanX  = this.maxX - this.minX;
    var spanY  = this.maxY - this.minY;

    var maxSpan = max(spanX, spanY);

    var ratioX = this.width / maxSpan;

    var ratioY = this.height / maxSpan;

    var newX = (c.getX() + (-1 * this.minX)) * ratioX;
    var newY = this.height - ((c.getY() + (-1 * this.minY)) * ratioY);

    //debug.append(newX + ', ' + newY + '<br>');

    return new Coord(newX, newY);
}
