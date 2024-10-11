/**
 * Author: shenyi
 * Email: shenyi@dscomm.com.cn
 * Date: 13-4-10
 */
define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dojo/text!./resource/MessageNotifier.html',
	'dojox/collections/Queue',
	'dojox/timing'], function(declare, _WidgetBase, _TemplatedMixin, template, Queue) {
	return declare([_WidgetBase, _TemplatedMixin], {
		baseClass: 'notifier',
		textClass: 'text',
		cls: '',
		templateString: template,
		showTimeout: 5000,
		slideDuration: 1000,
		_isAnimating: false,
		_hidden: true,
		_queue: new Queue(),
		_timer: new dojox.timing.Timer(500),
		_preventHide: false,
		_originalHeight: -1,
		_clearTimeoutId: -1,
		constructor: function(args) {
			this.inherited(arguments);
		},
		postCreate: function() {
			this.inherited(arguments);
			var me = this,
				$node;
			$node = $(me.domNode);
			$node.css({
				width: me.width,
				height: me.height
			});
			$node.mouseover(function() {
				me._preventHide = true;
			}).mouseleave(function() {
				me._preventHide = false;
			});
			$node.hide();
		},
		startup: function() {
			this.placeAt(document.body);
			this.inherited(arguments);
			this._run();
		},
		notify: function(msg) {
			if (!msg.type) {
				msg.type = 'info';
			}
			this._queue.enqueue(msg);
		},
		_clearHideTimeout: function() {
			if (this._clearTimeoutId >= 0) {
				clearTimeout(this._clearTimeoutId);
				this._clearTimeoutId = -1;
			}
		},
		_run: function() {
			var me = this;
			me._timer.onTick = function() {
				if (me._queue.peek()) {
					if (me._show() && !me._isAnimating) {
						var msg;
						msg = me._queue.dequeue();
						me._appendMsg(msg);
					}
				} else {
					if (me._preventHide) {
						me._clearHideTimeout();
					} else {
						me._hideInTimeout();
					}
				}
			};
			me._timer.start();
		},
		_hideInTimeout: function() {
			var me = this;
			if (me._clearTimeoutId < 0 && !me._hidden && !me._preventHide) {
				me._clearTimeoutId = setTimeout(function() {
					if (!me._hidden && !me._preventHide) {
						me._hide();
					}
					me._clearTimeoutId = -1;
				}, me.showTimeout);
			}
		},
		_appendMsg: function(msg) {
			var me = this,
				textDiv,
				$msgDiv;
			$(me.domNode).height(me._originalHeight);
			$msgDiv = $(me.domNode).children('ul');
			textDiv = me._buildTextDiv(msg);
			$msgDiv.append(textDiv);
			while (me._getChildrenHeight() > $(me.domNode).height()) {
				$msgDiv.children('.' + me.textClass + ':first-child').remove();
				if ($msgDiv.children('.' + me.textClass).length === 1) break;
			}
			//如果单条消息高度高于本元素总高度，则暂时将本消息框高度增长到消息高度+10
			//console.log($(me.domNode).height());
			while ($msgDiv.outerHeight() > $(me.domNode).height()) {
				var domNodeHeight = $(me.domNode).height();
				$(me.domNode).height(domNodeHeight + 10);
			}
		},
		_getChildrenHeight: function() {
			var height = 0;
			$.each($(this.domNode).children(), function(i, textNode) {
				height += $(textNode).outerHeight();
			});
			return height;
		},
		_buildTextDiv: function(msg) {
			$text = $('<li/>');
			$text.addClass(this._getMsgClass(msg));
			$text.addClass(this.textClass);
			$text.html(msg.text);
			return $text[0];
		},
		_show: function() {
			var me = this,
				$node;
			if (me._clearTimeoutId >= 0) me._clearHideTimeout();
			if (!me._hidden) {
				return true;
			}
			if (me._hidden && !me._isAnimating) {
				$node = $(this.domNode);
				me._isAnimating = true;
				$node.css({
					left: ($('body').width() - $node.width()) / 2,
					height: me.height
				});
				$node.slideDown(me.slideDuration, function() {
					me._isAnimating = false;
					me._hidden = false;
					if (me._originalHeight < 0) {
						me._originalHeight = $(me.domNode).height();
					}
				});
				return true;
			}
			return false;
		},
		_hide: function() {
			var me = this,
				$node;
			if (me._hidden) return true;
			if (!me._hidden && !me._isAnimating) {
				$node = $(this.domNode);
				me._isAnimating = true;
				$node.slideUp(me.slideDuration, function() {
					me._isAnimating = false;
					me._hidden = true;
					me._clearText();
				});
				return true;
			}
			return false;
		},
		_clearText: function() {
			$(this.domNode).children('ul').empty();
		},
		_showOnce: function() {
			var me = this;
			if (me._show()) {
				setTimeout(function() {
					me._hide();
				}, me.showTimeout);
				return true;
			}
			return false;
		},
		_getMsgClass: function(msg) {
			return {
				info: 'info',
				warn: 'warn',
				error: 'error'
			}[msg.type || 'info'] || 'info';
		}
	});
});