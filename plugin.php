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

defined( 'MLX_BLOCKS_DIR' ) OR define( 'MLX_BLOCKS_DIR', plugin_dir_path( __FILE__ ) );
defined( 'MLX_BLOCKS_URL' ) OR define( 'MLX_BLOCKS_URL', plugin_dir_url( __FILE__ ) );

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
			MLX_BLOCKS_URL . 'dist/blocks.style.build.css',
			array( 'wp-blocks' ),
			'', ''// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' )
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
			array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
			'',//filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ),
			true // Enqueue the script in the footer.
		);
		$now = new DateTime();
		wp_enqueue_style(
			'milieux-blocks-editor',
			MLX_BLOCKS_URL . 'dist/blocks.editor.build.css',
			[],
			// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' )
			$now->getTimestamp()
		);
	}
	add_action( 'enqueue_block_editor_assets', 'milieux_editor_assets' );

	/**
	 * Load Post Grid PHP
	 */
	add_image_size( 'square-large', 1024, 1024, true ); // used in the following code
	add_image_size( 'landscape-medium', 1024, 576, true );
	require_once plugin_dir_path( __FILE__ ) . 'dist/blocks/features/index.php';
	require_once plugin_dir_path( __FILE__ ) . 'dist/blocks/events/index.php';
}
add_action( 'plugins_loaded', 'milieux_blocks_loader' );


/**
 * Load the plugin textdomain
 */
function milieux_blocks_init() {
	load_plugin_textdomain( 'milieux-blocks', false, basename( dirname( __FILE__ ) ) . '/languages' );
}
//add_action( 'init', 'milieux_blocks_init' ); // no lang defined so far
