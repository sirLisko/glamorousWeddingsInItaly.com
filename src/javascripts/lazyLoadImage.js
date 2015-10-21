/*

(function($){
	'use strict';

	function getImageSrc($elm){
		if ($elm.data('src')) {
			return $elm.data('src');
		} else {
			return $elm.attr('src');
		}
	}

	function updateImg(){
		$('[data-src]').each(function(i, elm){
			var src = getImageSrc($(elm));
			var newElm = $(elm).clone();
			newElm.attr('src', src).removeAttr('data-src');
			if (elm.tagName==='image'){
				$(elm).attr('xlink:href', src);
			} else {
				$(elm).replaceWith(newElm);
			}
		});
	}

	$('[data-src]').one('load', function() {
		updateImg();
	}).each(function() {
		if(this.complete) { $(this).load(); }
	});
})(jQuery);*/
