<?php
/**
 * Plugin Name: Milieux Gutenberg Blocks
 * Plugin URI: https://github.com/ahmadawais/create-guten-block/
 * Description: A selection of blocks purpose-built for the milieux theme and the Gutenberg editor
 * Author: mrahmadawais, maedahbatool, Michael Hemingway
 * Author URI: https://michaelhemingway.com/
 * Version: 1.0.1
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Milieux Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * Initialize the blocks
 */
function milieux_blocks_loader() {

	/**
	 * Adds a custom block category to the Gutenberg Block selection
	 */
	add_filter( 'block_categories', function( $categories, $post ) {
		return array_merge(
			$categories,
			array(
				array(
					'slug' => 'milieux-blocks',
					'title' => __( 'Milieux Blocks', 'milieux-blocks' ),
				),
			)
		);
	}, 10, 2 );

	/**
	 * Enqueue Gutenberg block assets for both frontend + backend.
	 *
	 * `wp-blocks`: includes block type registration and related functions.
	 *
	 * @since 1.0.0
	 */
	function milieux_block_assets() {
		wp_enqueue_style( 'milieux-blocks',
			plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ),
			array('') //array( 'wp-blocks' )
			// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' )
		);
	}

	add_action( 'enqueue_block_assets', 'milieux_block_assets' );

	/**
	 * Enqueue Gutenberg block assets for backend editor.
	 *
	 * `wp-blocks`: includes block type registration and related functions.
	 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
	 * `wp-i18n`: To internationalize the block's text.
	 *
	 * @since 1.0.0
	 */
	function milieux_editor_assets() {
		wp_enqueue_script( 'milieux-blocks',
			plugins_url() . '/milieux-blocks/dist/blocks.build.js' ,
			array( 'wp-blocks', 'wp-i18n', 'wp-element', 'hm-gb-tools-editor' ),
			'',//filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ),
			true // Enqueue the script in the footer.
		);

		wp_enqueue_style( 'milieux-blocks-editor',
			plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
			array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
			// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' )
		);
	}
	add_action( 'enqueue_block_editor_assets', 'milieux_editor_assets' );

	/**
	 * Load Post Grid PHP
	 */
	require_once plugin_dir_path( __FILE__ ) . 'dist/blocks/features/index.php';
}
add_action( 'plugins_loaded', 'milieux_blocks_loader' );


/**
 * Load the plugin textdomain
 */
function milieux_blocks_init() {
	load_plugin_textdomain( 'milieux-blocks', false, basename( dirname( __FILE__ ) ) . '/languages' );
}
//add_action( 'init', 'milieux_blocks_init' ); // no lang defined so far
