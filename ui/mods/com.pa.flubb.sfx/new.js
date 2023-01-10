var flubb_sfx = new(function () {
		var self = this;
		self.audioHandlers = [];
		self.addHandler = function (msg, callback, disappear) {
			self.audioHandlers.push({
				trigger: msg,
				callback: callback,
				disappear: disappear
			});
		};
		var oldHandlers = handlers.chat_message;
		handlers.chat_message = function (d) {
			//we don't care about server stuff so we just forward it
			if (d.type === 'server') {
				oldHandlers(d);
				return;
			}
			var handled = false;
			for (var x in self.audioHandlers) {
				var handler = self.audioHandlers[x];
				if (d.message.toLowerCase() === handler.trigger.toLowerCase()) {
					if (!handler.disappear) {
						oldHandlers(d);
					}
					handled = true;
					// sometimes it takes time to load the files so asynchronous execution.
					(function (h) {
						setTimeout(function () {
							h.callback(d.message)
						}, 0);
					})(handler)

				}
			}
			if (!handled) {
				oldHandlers(d);
			}

		}

	})();
