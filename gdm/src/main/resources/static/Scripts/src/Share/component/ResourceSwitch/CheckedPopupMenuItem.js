define([
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/aspect',
    "dojo/_base/lang",
	'dijit/CheckedMenuItem',
	'dijit/PopupMenuItem',
    "dijit/popup",
	'dojo/dom-style',
	'dojo/dom-class',
	'dojo/text!./CheckedPopupMenuItem.html'], function(declare, array, aspect,lang, CheckedMenuItem, PopupMenuItem,pm, domStyle, domClass, template) {
	    return declare(PopupMenuItem, {
		templateString: template,

	        // checked: Boolean
	        //		Our checked state
		checked: false,


		_setCheckedAttr: function (/*Boolean*/ checked) {
		    //this.domNode.setAttribute("aria-checked", checked ? "true" : "false");
		    //this._set("checked", checked);	// triggers CSS update via _CssStateMixin
		},

		iconClass: "",	// override dijitNoIcon

		role: "menuitemcheckbox",

		onChange: function (/*Boolean*/ /*===== checked =====*/) {
		    // summary:
		    //		User defined function to handle check/uncheck events
		    // tags:
		    //		callback
		},

		_openPopup: function (/*Object*/ params, /*Boolean*/ focus) {
		    // summary:
		    //		Open the popup to the side of/underneath this MenuItem, and optionally focus first item
		    // tags:
		    //		protected

		    var popup = this.popup;

		    pm.open(lang.delegate(params, {
		        popup: this.popup,
		        around: this.domNode
		    }));

		    if (focus && popup.focus) {
		        popup.focus();
		    }

		},

		startup: function () {
		    if (this._started) { return; }
		    this.inherited(arguments);

		    // We didn't copy the dropdown widget from the this.srcNodeRef, so it's in no-man's
		    // land now.  Move it to <body>.
		    if (!this.popup) {
		        var node = query("[widgetId]", this.dropDownContainer)[0];
		        this.popup = registry.byNode(node);
		    }
		    this.ownerDocumentBody.appendChild(this.popup.domNode);
		    this.popup.domNode.setAttribute("aria-labelledby", this.containerNode.id);
		    this.popup.startup();

		    this.popup.domNode.style.display = "none";
		    this.ChangeGroupMark(false);
		},

		ChangeGroupMark : function(isShow)
		{
		    if (this.arrowWrapper) {
		        if (isShow) {
		            domStyle.set(this.arrowWrapper, "visibility", "");
		            this.focusNode.setAttribute("aria-haspopup", "true");
		        }
		        else {
		            domStyle.set(this.arrowWrapper, "visibility", "hidden");
		            this.focusNode.setAttribute("aria-haspopup", "false");
		        }
		    }
		    
		},

		_onClick: function (/*Event*/) {

		    if (!this.disabled) {
		        this.checked = !this.checked;
		        if (this.checked) {
		            domStyle.set(this.checkWrapper, "visibility", "visible");
		        }
		        else {
		            domStyle.set(this.checkWrapper, "visibility", "hidden");
		        }
		    }

		    this.onChange(this.checked);
		},

	    _closePopup: function(){
	       pm.close(this.popup);
	       this.popup.parentMenu = null;	            
	    }
	});
});