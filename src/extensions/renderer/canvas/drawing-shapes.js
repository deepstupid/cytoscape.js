'use strict';

var math = require('../../../math');

var CRp = {};

// @O Polygon drawing
CRp.drawPolygonPath = function (context, x, y, width, height, points) {

    const halfW = width / 2;
    const halfH = height / 2;

    if (context.beginPath) {
        context.beginPath();
    }

    context.moveTo(
        Math.round(x + halfW * points[0]),
        Math.round(y + halfH * points[1])
    );

    var ii = 2;
    for (var i = 1; i < points.length / 2; i++) {
        context.lineTo(
            Math.round(x + halfW * points[ii++]),
            Math.round(y + halfH * points[ii++])
        );
    }

    context.closePath();
};

// Round rectangle drawing
CRp.drawRoundRectanglePath = function (context, x, y, width, height) {

    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var cornerRadius = math.getRoundRectangleRadius(width, height);

    if (context.beginPath) {
        context.beginPath();
    }

    // Start at top middle
    context.moveTo(x, y - halfHeight);
    // Arc from middle top to right side
    context.arcTo(x + halfWidth, y - halfHeight, x + halfWidth, y, cornerRadius);
    // Arc from right side to bottom
    context.arcTo(x + halfWidth, y + halfHeight, x, y + halfHeight, cornerRadius);
    // Arc from bottom to left side
    context.arcTo(x - halfWidth, y + halfHeight, x - halfWidth, y, cornerRadius);
    // Arc from left side to topBorder
    context.arcTo(x - halfWidth, y - halfHeight, x, y - halfHeight, cornerRadius);
    // Join line
    context.lineTo(x, y - halfHeight);


    context.closePath();
};

var sin0 = Math.sin(0);
var cos0 = Math.cos(0);

var sin = {};
var cos = {};

var ellipseStepSize = Math.PI / 40;

for (var i = 0 * Math.PI; i < 2 * Math.PI; i += ellipseStepSize) {
    sin[i] = Math.sin(i);
    cos[i] = Math.cos(i);
}

CRp.drawEllipsePath = function (context, centerX, centerY, width, height) {
    if (context.beginPath) {
        context.beginPath();
    }

    if (context.ellipse) {
        context.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
    } else {
        var xPos, yPos;
        const rw = width / 2;
        const rh = height / 2;
        for (var i = 0 * Math.PI; i < 2 * Math.PI; i += ellipseStepSize) {
            const sini = sin[i];
            const cosi = cos[i];
            xPos = centerX - (rw * sini) * sin0 + (rw * cosi) * cos0;
            yPos = centerY + (rh * cosi) * sin0 + (rh * sini) * cos0;

            if (i === 0) {
                context.moveTo(xPos, yPos);
            } else {
                context.lineTo(xPos, yPos);
            }
        }
    }

    context.closePath();
};

module.exports = CRp;
