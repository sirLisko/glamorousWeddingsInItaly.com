/*globals jQuery*/

($ => {
	var $form = $('.contact__form');

	$form.on('submit', e => {
		e.preventDefault();

		$form
			.removeClass('contact__form--ok')
			.removeClass('contact__form--ko');

		$.ajax({
			type: 'POST',
			url: $form.attr('action'),
			data: $form.serialize(),
			success: () => {
				$form.addClass('contact__form--ok');
				$('.contact__input input').val('');
			},
			error: () => {
				$form.addClass('contact__form--ko');
			}
		});
	});
})(jQuery);
