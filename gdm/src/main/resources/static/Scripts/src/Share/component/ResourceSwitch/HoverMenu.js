define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/dom-attr',
	'dijit/popup',
	'dijit/Menu'], function(declare, array, domAttr, pm, Menu) {
	return declare(Menu, {
		popupDelay: 0,
		onItemHover: function() {
			//使其hover后就自动active
			//this._markActive();
			this.inherited(arguments);
		},
		onItemClick: function( /*dijit/_WidgetBase*/ item, /*Event*/ evt) {
			// summary:
			//		Handle clicks on an item.
			// tags:
			//		private

			// this can't be done in _onFocus since the _onFocus events occurs asynchronously
			if (typeof this.isShowingNow == 'undefined') { // non-popup menu
				//this._markActive();
			}

			this.focusChild(item);

			if (item.disabled) {
				return false;
			}

			// before calling user defined handler, close hierarchy of menus
			// and restore focus to place it was when menu was opened
			//this.onExecute();

			// user defined handler for click
			item._onClick ? item._onClick(evt) : item.onClick(evt);
		},
		/**
		 * 强制从右往左显示
		 * @return {Boolean} [description]
		 */
		isLeftToRight: function() {
			return false;
		}
	});
});