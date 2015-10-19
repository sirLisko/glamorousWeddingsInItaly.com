/*globals jQuery*/

($ => {
	$(document.body).on('click', '.header__nav a', e => {
		e.preventDefault();

		$('.header__toggle').prop('checked', false);

		var $elm = $(e.target).addClass('header__nav--active');

		$('html, body').animate({
			scrollTop: $('#' + $elm.attr('href').split('#')[1]).offset().top
		}, 1000);
	});

	var $header = $('.header');

	function setNavigationhighlight(elm) {
		$('.header__nav--active').removeClass('header__nav--active');
		$('.header__nav a[href=#' + elm + ']').addClass('header__nav--active');
	}

	function checkHeaderPosition(scrollTop){
		if (scrollTop > ($window.height() - $header.height())) {
			$header.removeClass('header--home');
		} else {
			$header.addClass('header--home');
			setNavigationhighlight('home');
		}
	}

	var $window = $(window).on('scroll', () => {
		var scrollTop = $window.scrollTop(), currentNav;

		$('.panel__scroll').each((i, el) => {
			var $el = $(el);
			if ($el.offset().top + $window.height() > scrollTop && currentNav !== $el) {
				setNavigationhighlight($el.attr('id'));
				return false;
			}
		});

		checkHeaderPosition(scrollTop);
	});

	checkHeaderPosition($window.scrollTop());

})(jQuery);
