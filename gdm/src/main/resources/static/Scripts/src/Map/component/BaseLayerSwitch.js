/**
* Created with JetBrains WebStorm.
* User: chengbin
* Date: 13-5-3
* To change this template use File | Settings | File Templates.
*/
define([
    "require",
    'dojo/_base/lang',
    'dojo/_base/array',
    "dojo/on",
    "dojo/dom-construct",
    "dojo/dom-style",
    'ol'
], function (require, lang, array, on, domConstruct, domStyle, ol) {

    var control = function (opt_options) {

        this.baseLayerTypes = null;

        var options = opt_options || {};

        if (opt_options.baseLayerTypes) {
            this.baseLayerTypes = opt_options.baseLayerTypes;
        }

        this.div = document.createElement('div');
        domStyle.set(this.div, {
            position: "absolute",
            cursor: 'pointer'
        });

        on(this.div, "mouseover", lang.hitch(this, function (e) {

            for (var i = 0; i < this.div.childNodes.length; i++) {

                this.div.childNodes[i].style.display = "inline";
            }
        }));

        var mouseLeave = lang.hitch(this, function (e) {
            if (hasClick) {
                hasClick = false;
                var obj = null;
                for (var i = 0; i < this.div.childNodes.length; i++) {

                    if (this.div.childNodes[i].i == currentIndex) {

                        obj = this.div.childNodes[i];
                        this.div.removeChild(this.div.childNodes[i]);
                        break;
                    }
                }

                if (obj != null) {
                    this.div.appendChild(obj);
                }
            }

            for (var i = 0; i < this.div.childNodes.length; i++) {

                if (this.div.childNodes[i].i != currentIndex) {
                    this.div.childNodes[i].style.display = "none";
                }
            }

        });

        on(this.div, "mouseleave", mouseLeave);

        var langHitch = lang.hitch(this, function (e) {

            var map = this.getMap();
            if (!map) {
                return;
            }

            var layers = map.getLayers().getArray();
            var baseLayer = null;
            var uBaseLayers = [];
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer.type=='TILE') {
                    this.getMap().removeLayer(layer);
                }
                else {
                    uBaseLayers.push(layer);
                }
            }

            var nextLayer = this.baseLayerTypes[currentIndex];
            nextLayer.setZIndex(1);
            if (!nextLayer) {
                return;
            }
            this.getMap().addLayer(nextLayer);

        });


        var hasClick = false;
        var currentIndex = 0;
        var imgClick = function (index) {
            hasClick = true;
            currentIndex = index;
            mouseLeave();
            langHitch();
        };
        for (var i = 0; i < this.baseLayerTypes.length; i++) {

            var imgDom = document.createElement('img');

            var layers = this.baseLayerTypes[i];
            imgDom.src = layers.get('imgUrl');
            imgDom.i = i;
            imgDom.style.width = "40px";
            imgDom.onclick = function () { imgClick(this.i); }
            //on(imgDom, "click", langHitch);

            if (layers.SelectLayer == true) {
                imgDom.style.display = "inline";
                currentIndex = i;
            }
            else {
                imgDom.style.display = "none";
            }

            this.div.appendChild(imgDom);
        }

        $(this.div).addClass('BaseLayerSwitch');



        ol.control.Control.call(this, {
            element: this.div,
            target: options.target
        });
    }

    ol.inherits(control, ol.control.Control);

    return control;
});