define([
	'dojox/collections/Dictionary',
	'egis/Share/component/ResourceSwitch/ResourceSwitchControl',
     "dojo/dom-style",
     'ol'
], function (Dictionary, ResourceSwitchControl, domStyle, ol) {

        var control = function (opt_options) {

            var options = opt_options || {};

            this.div = document.createElement('div');
            domStyle.set(this.div, {
                position: "absolute",
                cursor: 'pointer'
            });

            this.layerSwitchConfig = {};
            var map = this.getMap();
            this.layerSwitchConfig.map = map;
            this.layerSwitchControl = new ResourceSwitchControl(this.layerSwitchConfig);

            this.layerSwitchControl.placeAt(this.div);
            this.layerSwitchControl.startup();


            $(this.div).addClass('dsgisopenlayerscontrolLayerSwitchControl');

            ol.control.Control.call(this, {
                element: this.div,
                target: options.target
            });
        }

        ol.inherits(control, ol.control.Control);

        return control;
    });