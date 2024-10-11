/**
* User: chengbin
* Date: 13-4-1
*/
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/_Container",
    "dojo/text!./Popup.html",
    'dijit/form/Button'
], function (declare, lang, array, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Container, template, Button, ready) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _Container], {
        templateString: template,
        icon: '/Content/themes/blue/images/transparent.png',
        title: '无标题',
        detailText: '详情>>',
        enableDetail: true,
        detailClickHandler: null,
        //{x:100, y:100}
        position: null,
        lonlat: null,
        map: null,
        closable: true,
        TAIL_LEFT: 15,
        TAIL_HEIGHT: 19,
        div: null,
        //'destroy'/'hide'
        closeAction: 'destroy',
        constructor: function () {
        },
        postCreate: function () {
            this.inherited(arguments);
            this.div = this.domNode;
            if (!this.enableDetail) {
                $(this.detailNode).hide();
            }
            if (this.enableDetail && this.detailClickHandler) {
                $(this.detailNode).click(this.detailClickHandler);
            }
            if (!this.closable) {
                $(this.closeNode).hide();
            } else {
                $(this.closeNode).click(lang.hitch(this, function () {
                    this.close();
                }));
            }
            $(this.div).click(lang.hitch(this, function () {
                if (this.map) {
                    array.forEach(this.map.popups, function (popup) {
                        if (popup.div) {
                            $(popup.div).removeClass('focused');
                        }
                    });
                }
                $(this.div).addClass('focused');
                this.bringToTop();
            }));
        },
        bringToTop: function () {
            var maxZIndex = -1;
            if (this.map) {
                array.forEach(this.map.popups, function (popup) {
                    if (popup.div) {
                        var zIndex = parseInt($(popup.div).css('z-index'));
                        if (zIndex > maxZIndex)
                            maxZIndex = zIndex;
                    }
                });
            }
            if (this.div) {
                $(this.div).css('z-index', maxZIndex + 1);
            }
        },
        draw: function () {
            if (this.map) {
                array.forEach(this.map.popups, lang.hitch(this, function (popup) {
                    if (popup != this) {
                        popup.hide();
                    }
                }));
            }
            this.bringToTop();
            return this.domNode;
        },
        startup: function () {
            this.inherited(arguments);
            //TODO:老版本需要该设置，Openlayers升级到3.x后设置该样式会导致提示框位置偏移
            //this.domNode.style.position = 'absolute';
        },
        destroy: function () {
            this.close();
            $(this.detailNode).unbind('click');
            $(this.closeNode).unbind('click');
            this.inherited(arguments);
        },
        updatePosition: function () {
            var px = this.map.getLayerPxFromLonLat(this.lonlat);
            if (px) {
                this.set('position', px);
            }
            $(this.tailNode).css({
                left: this.TAIL_LEFT,
                top: $(this.domNode).outerHeight() - 2
            });
            if ($(this.domNode).css('height') != '0px') {
                var contentHeight = $(this.domNode).height() - $(this.titleNode).outerHeight();
                $(this.contentNode).height(contentHeight);
            }
        },
        close: function () {
            this.hide();
            this.onClose();
        },
        onClose: function () {
        },
        show: function () {
            if (this.map) {
                this.map.getOverlays().forEach(function (element, index, itemArray) {

                    $(element.getElement()).hide();
                }, this);
            }
            $(this.domNode).show();
        },
        hide: function () {
            $(this.domNode).hide();
        },
        visible: function () {
            return $(this.domNode).is(':visible');
        },
        moveTo: function (px) {
            this.set('position', px);
        },
        _setPositionAttr: function (position) {
            this.position = position;
            $(this.domNode).css({
                left: this.position.x - this.TAIL_LEFT + (this.offset ? this.offset.x : 0),
                top: this.position.y - this.TAIL_HEIGHT - $(this.domNode).height() + (this.offset ? this.offset.y : 0)
            });
            if (this.map) {
                this.lonlat = this.map.getLonLatFromPixel(this.position);
            }
        }
    });
});