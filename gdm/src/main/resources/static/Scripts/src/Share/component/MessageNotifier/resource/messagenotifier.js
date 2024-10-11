define([
	'ds/gis/util/MessageNotifier'], function(MessageNotifier) {
	describe("MessageNotifier", function() {
		it('can notify message', function() {
			var notifier = new MessageNotifier();
			notifier.startup();
			notifier.notify({
				type: 'warn',
				text: '第一条'
			});
			notifier.notify({
				type: 'error',
				text: '第二条'
			});
			notifier.notify({
				text: 'test2'
			});
			notifier.notify({
				text: 'test2'
			});
			notifier.notify({
				text: 'test2'
			});
			notifier.notify({
				text: '最后一条'
			});
			notifier.notify({
				text: '最后一条'
			});
			notifier.notify({
				text: '最后一条'
			});
			notifier.notify({
				text: '这是一条很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的消息很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的消息'
			});
			notifier.notify({
				text: '最后一条'
			});
			notifier.notify({
				text: '最后一条1'
			});
			notifier.notify({
				text: '最后一条2'
			});
			notifier.notify({
				text: '最后一条3'
			});
			notifier.notify({
				text: '最后一条4'
			});
			notifier.notify({
				text: '最后一条5'
			});
			notifier.notify({
				text: '最后一条6'
			});
			notifier.notify({
				text: '最后一条7'
			});
			notifier.notify({
				text: '最后一条8'
			});
			setTimeout(function() {
				notifier.notify({
					text: 'reshow'
				});
				notifier.notify({
					text: '最后一条6'
				});
				notifier.notify({
					text: '最后一条7'
				});
				notifier.notify({
					text: '最后一条8'
				});
			}, 20000);
		});
	});
});