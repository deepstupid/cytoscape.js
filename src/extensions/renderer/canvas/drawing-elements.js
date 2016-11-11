'use strict';

var math = require('../../../math');

var CRp = {};

CRp.drawElement = function (context, ele, shiftToOriginWithBb, showLabel) {
    var r = this;

    if (ele.isNode()) {
        r.drawNode(context, ele, shiftToOriginWithBb, showLabel);
    } else {
        r.drawEdge(context, ele, shiftToOriginWithBb, showLabel);
    }
};

CRp.drawCachedElement = function (context, ele, pxRatio, extent) {

    var bb = ele.boundingBox();

    const bbw = Math.round(bb.w);
    if (bbw === 0) return;
    const bbh = Math.round(bb.h);
    if (bbh === 0) return;


    if (!extent || math.boundingBoxesIntersect(bb, extent)) {
        var r = this;
        var cache = r.data.eleTxrCache.getElement(ele, bb, pxRatio);

        if (cache) {
            context.drawImage(cache.texture.canvas,
                cache.x, 0,
                cache.width, cache.height,
                Math.round(bb.x1), Math.round(bb.y1), bbw, bbh);
        } else { // if the element is not cacheable, then draw directly
            r.drawElement(context, ele);
        }
    }
};

CRp.drawElements = function (context, eles) {
    var r = this;

    for (var i = 0; i < eles.length; i++) {
        r.drawElement(context, eles[i]);
    }
};

CRp.drawCachedElements = function (context, eles, pxRatio, extent) {
    var r = this;

    for (var i = 0; i < eles.length; i++) {
        var ele = eles[i];

        r.drawCachedElement(context, ele, pxRatio, extent);
    }
};

CRp.drawCachedNodes = function (context, eles, pxRatio, extent) {
    var r = this;

    for (var i = 0; i < eles.length; i++) {
        var ele = eles[i];

        if (!ele.isNode()) {
            continue;
        }

        r.drawCachedElement(context, ele, pxRatio, extent);
    }
};

CRp.drawLayeredElements = function (context, eles, pxRatio, extent) {
    var r = this;

    var layers = r.data.lyrTxrCache.getLayers(eles, pxRatio);

    if (layers) {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var bb = layer.bb;

            //using whole integer
            const bbw = Math.round(bb.w);
            if (bbw === 0) continue;
            const bbh = Math.round(bb.h);
            if (bbh === 0) continue;

            context.drawImage(layer.canvas,
                Math.round(bb.x1), Math.round(bb.y1), bbw, bbh);
        }
    } else { // fall back on plain caching if no layers
        r.drawCachedElements(context, eles, pxRatio, extent);
    }
};

module.exports = CRp;
