$(document).ready(function() {

	var $screens = $(".screen"),
		$screenHome = $(".screen-home"),
		$screenToc = $(".screen-toc"),
		$screenStory = $(".screen-story"),
		$grid,
		$carousel,
		$currentScreen = $screenHome,
		currentChapter = 0,
		currentSlide = 0,
		isAnimating = false,
		noop = function(){};

	var navigate = function($to, callback) {
		if (isAnimating) {
			return;
		} else {
			callback = callback || noop;
			isAnimating = true;
			$currentScreen.removeClass("screen-current").one("transitionend", function() {
				$currentScreen = $to;
				$to.addClass("screen-current").one("transitionend", function() {
					callback();
					isAnimating = false;
				});
			});
		}
	};

	var updateTocLayout = function() {
		$(".toc__item a", $grid).get(currentChapter).focus();
	};

	$screens.imagesLoaded(function() {
		$grid = $(".toc__grid", $screenToc).masonry({
			itemSelector: ".toc__item",
			columnWidth: ".toc__item--sizer",
			percentPosition: true
		});
		$carousel = $(".carousel", $screenStory).flickity({
			pageDots: false,
			prevNextButtons: false
		});
		$(".loading", $screenHome).removeClass("progress").text("entrer");
	});

	$(document).on("keyup", function(e) {
		if (e.which === 13 && $currentScreen === $screenHome) {
			navigate($screenToc, updateTocLayout);
		}
		if (e.which === 27) {
			if ($currentScreen === $screenStory) {
				navigate($screenToc, updateTocLayout);
			}
			if ($currentScreen === $screenToc) {
				navigate($screenHome);
			}
		}
	});

	$screenHome.on("click", ".button", function() {
		navigate($screenToc, updateTocLayout);
	});

	$screenToc
		.on("click", ".toc__item a", function(e) {
			e.preventDefault();
			$(this).focus();
			var goTo = $(this).data("goto");
			currentSlide = goTo;
			$carousel.flickity("select", goTo, false, true);
			navigate($screenStory, function() {
				$carousel.focus();
			});
		})
		.on("focus", ".toc__item a", function() {
			currentChapter = $(".toc__item a", $screenToc).index($(this));
		});

	$screenStory.on("click", ".story-close", function() {
		navigate($screenToc, updateTocLayout);
	});

	$(window).on("orientationchange", function() {
		$screenStory.css("visibility", "hidden");
		$carousel.flickity("destroy");
		$carousel = $(".carousel", $screenStory).flickity({
			pageDots: false,
			prevNextButtons: false,
			initialIndex: currentSlide
		});
		$screenStory.css("visibility", "visible");
	});

});
