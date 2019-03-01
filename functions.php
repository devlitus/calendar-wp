<?php
// Add custom Theme Functions here
require_once (get_stylesheet_directory(). "/calendar/calendar.php");
function add_script_calendario(){
    $theme = wp_get_theme( get_template() );
    $version = $theme->get( 'Version' );
    wp_enqueue_style( 'flatsome-style', get_stylesheet_uri(), array(), $version, 'all');
    wp_register_style("calendar", get_stylesheet_directory_uri(). "/calendario/css/calendar.css", array("flatsome-style"),'1.0', 'all');
    wp_enqueue_style("calendar");
    wp_enqueue_script('calendar', get_stylesheet_directory_uri(). '/calendario/js/calendar.js', array('jquery'), '1.0', true);
    wp_localize_script('calendar', 'calendar_var',['ajaxurl' => admin_url('admin-ajax.php')]);
}
add_action('wp_enqueue_scripts', "add_script_calendario");