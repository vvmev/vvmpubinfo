/*
 *
 */

$(document).ready(function() {
	var slideIndex = 0;
	var lastElement;
	var elements = [];
	var slideDuration = 10;

	var stripQS = function(url) {
		if ((i = url.indexOf("?")) > 0) {
			url = url.slice(0, i+1);
		}
		return url;
	}
	var nextSlide = function() {
		slideIndex++;
		if (slideIndex >= elements.length)
			slideIndex = 0;
		elements[slideIndex].start();
	}
	var Slide = function(e) {
		if (e) {
			if ($.isArray(e))
				e = e[0];
			this.element = $(e);
		}
	}
	Slide.prototype.fadeOutIn = function() {
		var last = lastElement.element;
		var next = this;
		if (last.css("opacity") > 0) {
			last.fadeTo(300, 0, function() {
				last.hide();
				next.element.fadeTo(500, 1);
			});
		} else {
			next.element.fadeTo(500, 1);
		}
		lastElement = this;
	}
	var ImageSlide = function(e, img) {
		Slide.call(this, e);
		var me = this;
		this.image = $(img);
		this.image.load(function() {
			me.fadeOutIn();
		});
	}
	ImageSlide.prototype = new Slide();
	ImageSlide.prototype.start = function() {
		url = stripQS(this.image.attr("delayed-src")) + "?" + new Date().getTime();
		this.image.attr("src", url);
		var to = window.setTimeout(function() {
			window.clearTimeout(to);
			nextSlide();
		}, slideDuration * 1000);
	}
	var VideoSlide = function(e, video) {
		Slide.call(this, e);
		this.video = video[0];
		this.armed = false;
	}
	VideoSlide.prototype = new Slide();
	VideoSlide.prototype.start = function() {
		console.log("starting video");
		me = this;
		if (this.video.setCurrentTime instanceof Function)
			this.video.setCurrentTime(0);
		this.video.play();
		this.armed = true;
		$(this.video).bind("ended", function() {
			me.video.pause();
			if (me.armed) {
				me.armed = false;
				console.log("finished video");
				nextSlide();
			}
		});
		this.fadeOutIn();
	}

	$("div.stage > div").each(function(i, e) {
		if ((video = $(e).find("video")).size() > 0) {
			elements.push(new VideoSlide(e,
				video.mediaelementplayer({})));
			//elements.push(new VideoSlide(e, video));
		} else if ((img = $(e).find("img")).size() > 0) {
			elements.push(new ImageSlide(e, img[0]));
		} else {
			console.log("Don't know what to do with " + e);
		}
	});
	console.log(elements);
	lastElement = elements[0];
	lastElement.start();
});

/*		
		$('video').mediaelementplayer({
			ended: function() {
				fadeProxy();
				nextR();
			},
		});
		var elements = $("div.stage div.e");
		var index = elements.size();
		elements.hide();
		var stripQS = function(url) {
			if ((i = url.indexOf("?")) > 0) {
				url = url.slice(0, i+1);
			}
			return url;
		}
		var fade = function(last, next) {
			if (last.css("opacity") > 0) {
				last.fadeTo(300, 0, function() {
					last.hide();
					next.fadeTo(500, 1);
				});
			} else {
				next.fadeTo(500, 1);
			}
		}
		var nextTimeout = null;
		var scheduleNext = function() {
			if (!nextTimeout) {
				console.log("scheduling next, index=" + index);
				nextTimeout = window.setTimeout(nextR, 3000);
			}
		}
		var round = 0;
		var fadeProxy = null;
		elements.children("img").load(function() {
					fadeProxy();
					scheduleNext();
				});
		var nextR = function() {
			nextTimeout = null;
			var last = elements.slice(index,index+1);
			index++;
			if (index < 0 || index >= elements.size())
				index = 0;
			console.log("index=" + index + ", round=" + round++);
			var next = elements.slice(index,index+1);
			fadeProxy = function() {
				fade(last, next);
			};
			var img, video;
			if ((img = next.children("img")).size() > 0) {
				console.log("img: " + img);
				url = stripQS(img.attr("src")) + "?" + new Date();
				img.attr("src", url);
			} else if ((video = next.find("video")).size() > 0) {
				console.log("video: " + video);
				// hide previous element, then start playing
				// on completing the playback, fade to next
				fadeProxy();
				scheduleNext();
			}
		}
		nextR();
*/
