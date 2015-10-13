/*globals GMaps*/

(function(){
	var map = new GMaps({
		el: '#map',
		lat: 42.3295432,
		lng: 12.45055,
		zoom: 13,
		scrollwheel: false
	});

	map.addMarker({
		lat: 42.3295432,
		lng: 12.45055,
		infoWindow: {
			content: '<p class="title">Glamorous Weddings in Italy</p><p>Agenzia Wedding Planner</p><p>Via Gargarasi, 24</p><p>Civita Castellana (VT)</p>'
		}
	});
})();
