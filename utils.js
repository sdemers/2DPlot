
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

