<?php
// [ca_calendar]
function ca_calendar() {
	return '<div id="calendar">
			    <div class="calendar-info">
			        <div class="calendar-prev" id="prev-month" style="color: #a6f090" hidden="hidden">&#60;</div>
			        <div class="calendar-month" id="month-ca"></div>
			        <div class="calendar-year" id="year"></div>
			        <div class="calendar-next" id="next-month" style="color: #a6f090">&#62;</div>
			    </div>
			    <div class="calendar-week">
			        <div class="calendar-day calendar-item">Dilluns</div>
			        <div class="calendar-day calendar-item">Dimarts</div>
			        <div class="calendar-day calendar-item">Dimecres</div>
			        <div class="calendar-day calendar-item">Dijous</div>
			        <div class="calendar-day calendar-item">Divendres</div>
			        <div class="calendar-day calendar-item">Dissapte</div>
			        <div class="calendar-day calendar-item">Diumenge</div>
			    </div>
			    <div class="calendar-dates" id="dates"></div>
			</div>
			<!-- Leyenda -->
			<div style="color: red">Tot el día reservat</div>
			<div style="color: orange;">Parcialment reservat</div>
			';

}
add_shortcode('ca_calendar', 'ca_calendar');
// [es_calendar]
function es_calendar() {
	return '<div id="calendar">
			    <div class="calendar-info">
			        <div class="calendar-prev" id="prev-month" style="color: #a6f090" hidden="hidden">&#60;</div>
			        <div class="calendar-month" id="month"></div>
			        <div class="calendar-year" id="year"></div>
			        <div class="calendar-next" id="next-month" style="color: #a6f090">&#62;</div>
			    </div>
			    <div class="calendar-week">
			        <div class="calendar-day calendar-item">Lunes</div>
			        <div class="calendar-day calendar-item">Martes</div>
			        <div class="calendar-day calendar-item">Miércoles</div>
			        <div class="calendar-day calendar-item">Jueves</div>
			        <div class="calendar-day calendar-item">Viernes</div>
			        <div class="calendar-day calendar-item">Sábado</div>
			        <div class="calendar-day calendar-item">Domingo</div>
			    </div>
			    <div class="calendar-dates" id="dates"></div>
			</div>
			<!-- Leyenda -->
			<div style="color: red;">Todo el dia reservado</div>
			<div style="color: orange;">Parcialmente reservado</div>
			';

}
add_shortcode('es_calendar', 'es_calendar');
function reservas_salo(){
	global $wpdb;
	$postmeta = $wpdb->prefix."postmeta";
	$post = $wpdb->prefix."posts";
	$reserva = [];
	$consulta = "SELECT	post_id, meta_key, meta_value FROM $postmeta
					INNER JOIN $post 
					ON $postmeta.post_id = $post.ID
					  WHERE ($postmeta.meta_key='_sln_booking_date' OR $postmeta.meta_key='_sln_booking_duration') 
					    AND post_type='sln_booking' AND post_status LIKE'sln%' ORDER BY post_id;";
	$results = $wpdb->prepare($consulta, ARRAY_A);
	$result = $wpdb->get_results($results);
	foreach ($result as $item) {
		$reserva[] = $item;
	}
	wp_send_json($reserva);
}

add_action("wp_ajax_nopriv_reservas", "reservas_salo");
add_action("wp_ajax_reservas", "reservas_salo");
