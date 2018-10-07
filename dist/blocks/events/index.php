<?php
/**
 * Server-side rendering for the Recent Ecents showcase block
 * This inherits a lot of logic from the events block, yet due to time constraints
 * does not benefit from any inheritance or shared methods
 *
 * @since 	1.1.7
 * @package Milieux Blocks
 */

/**
 * returns image aspect ratio, so to set padding and eliminate page reflows
 * @param  [type] $ID [description]
 * @return string     integer value representing the % height
 */
function _mlx__get_image_ratio_padding ($ID) {
	$meta = wp_get_attachment_metadata($ID);
	return ($meta['sizes']['medium']['height'] / $meta['sizes']['medium']['width']) * 100;
}

/**
 * Renders the post grid block on server.
 */
function milieux_blocks_render_block_core_latest_events( $attributes ) {
	$recent_posts = wp_get_recent_posts( array(
		'numberposts' => $attributes['postsToShow'],
		'post_status' => 'publish',
		'post_type' => 'feature',
		'order' => $attributes['order'],
		'orderby' => $attributes['orderBy'],
		'category' => $attributes['categories'],
	), 'OBJECT' );

	// print_r($attributes);
	$main_event_markup = '';
	$list_items_markup = '';

	$mainEvent = $attributes['mainEvent']; // Array

	// Check if a featured Post is set and toggled
	if ($attributes['displayMainEvent'] == true && is_array($mainEvent)) {
		$fp_ID = $mainEvent['id'];
		$fp_img = $mainEvent['image'];

		$main_event_markup .= sprintf(
			'<div class="mlx-block-events main-event"><div class="main-event__inner">'
		);

		$main_event_markup .= sprintf(
			'<noscript><img= src="%1$s"/></noscript>',
			$fp_img['source_url']
		);

		$main_event_markup .= sprintf(
			'<div class="main-event__image-container" style="padding-bottom:%1$s%%">',
			_mlx__get_image_ratio_padding ($fp_img['id'])
		);

		$main_event_markup .= sprintf(
			'<img class="main-event-image hero lazyload" src="%1$s" ',
			$fp_img['source_url']
		);

		$main_event_markup .= sprintf(
			'srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-srcset="%1$s" ',
			wp_get_attachment_image_srcset($fp_img['id'])
		);

		$main_event_markup .= sprintf(
			'data-sizes="auto" alt="%1$s"></div><a href="%2$s"><h2>%3$s</h2></a></div></div>', // close main-event div
			$fp_img['alt_text'],
			esc_html($mainEvent['url']),
			esc_html($mainEvent['title'])
		);
	}



	if (is_array($recent_posts)) {

		foreach ( $recent_posts as $post ) {
			// Get the post ID
			$post_id = $post->ID;

			// Get the post thumbnail
			$post_thumb_id = get_post_thumbnail_id( $post_id );

			if ( $post_thumb_id && isset( $attributes['displayPostImage'] ) && $attributes['displayPostImage'] ) {
				$post_thumb_class = 'has-thumb';
			} else {
				$post_thumb_class = 'no-thumb';
			}

			// Start the markup for the post
			$list_items_markup .= sprintf(
				'<article class="%1$s">',
				esc_attr( $post_thumb_class )
			);

			// Get the main-event image
			if ( isset( $attributes['displayPostImage'] ) && $attributes['displayPostImage'] && $post_thumb_id ) {
				if( $attributes['imageCrop'] === 'landscape' ) {
					$post_thumb_size = 'landscape-large';
				} else {
					$post_thumb_size = 'square-large'; // was medium
				}

				$list_items_markup .= sprintf(
					'<div class="mlx-block-events__image"><a href="%1$s" rel="bookmark">%2$s</a></div>',
					esc_url( get_permalink( $post_id ) ),
					wp_get_attachment_image( $post_thumb_id, $post_thumb_size )
				);
			}

			// Wrap the text content
			$list_items_markup .= sprintf(
				'<div class="mlx-block-events__text">'
			);

				// Get the post title
				$title = get_the_title( $post_id );

				if ( ! $title ) {
					$title = __( 'Untitled', 'milieux-blocks' );
				}

				$list_items_markup .= sprintf(
					'<h2 class="mlx-block-events__title"><a href="%1$s" rel="bookmark">%2$s</a></h2>',
					esc_url( get_permalink( $post_id ) ),
					esc_html( $title )
				);

				// Wrap the byline content
				$list_items_markup .= sprintf(
					'<div class="mlx-block-events__byline">'
				);

					// Get the post author
					if ( isset( $attributes['displayPostAuthor'] ) && $attributes['displayPostAuthor'] ) {
						$list_items_markup .= sprintf(
							'<div class="mlx-block-events__author"><a class="ab-text-link" href="%2$s">%1$s</a></div>',
							esc_html( get_the_author_meta( 'display_name', $post->post_author ) ),
							esc_html( get_author_posts_url( $post->post_author ) )
						);
					}

					// Get the post date
					if ( isset( $attributes['displayPostDate'] ) && $attributes['displayPostDate'] ) {
						$list_items_markup .= sprintf(
							'<time datetime="%1$s" class="mlx-block-events__date">%2$s</time>',
							esc_attr( get_the_date( 'c', $post_id ) ),
							esc_html( get_the_date( '', $post_id ) )
						);
					}

				// Close the byline content
				$list_items_markup .= sprintf(
					'</div>'
				);

				// Wrap the excerpt content
				$list_items_markup .= sprintf(
					'<div class="mlx-block-events__excerpt">'
				);

					// Get the excerpt
					$excerpt = apply_filters( 'the_excerpt', get_post_field( 'post_excerpt', $post_id, 'display' ) );

					if( empty( $excerpt ) ) {
						$excerpt = apply_filters( 'the_excerpt', wp_trim_words( $post->post_content, 25 ) );
					}

					if ( ! $excerpt ) {
						$excerpt = null;
					}

					if ( isset( $attributes['displayPostExcerpt'] ) && $attributes['displayPostExcerpt'] ) {
						$list_items_markup .=  wp_kses_post( $excerpt );
					}

					if ( isset( $attributes['displayPostLink'] ) && $attributes['displayPostLink'] ) {
						$list_items_markup .= sprintf(
							'<p><a class="mlx-block-events__link" href="%1$s" rel="bookmark">%2$s</a></p>',
							esc_url( get_permalink( $post_id ) ),
							esc_html__( 'Continue Reading', 'milieux-blocks' )
						);
					}

				// Close the excerpt content
				$list_items_markup .= sprintf(
					'</div>'
				);

			// Wrap the text content
			$list_items_markup .= sprintf(
				'</div>'
			);

			// Close the markup for the post
			$list_items_markup .= "</article>\n";
		}
	}

	// Build the classes
	$class = "mlx-block-events align{$attributes['align']}";

	if ( isset( $attributes['className'] ) ) {
		$class .= ' ' . $attributes['className'];
	}

	$grid_class = 'mlx-block-events__container';

	if ( isset( $attributes['postLayout'] ) && 'list' === $attributes['postLayout'] ) {
		$grid_class .= ' is-list';
	} else {
		$grid_class .= ' is-grid';
	}

	if ( isset( $attributes['columns'] ) && 'grid' === $attributes['postLayout'] ) {
		$grid_class .= ' columns-' . $attributes['columns'];
	}

	// Output the post markup
	$block_content = sprintf(
		'<div class="%1$s"><h3 class="page-type-title">Features</h3>%2$s<div class="%3$s">%4$s</div></div>',
		esc_attr( $class ),
		$main_event_markup,
		esc_attr( $grid_class ),
		$list_items_markup
	);

	return $block_content;
}

/**
 * Registers the `core/latest-events` block on server.
 */
function milieux_blocks_register_block_core_latest_events() {

	// Check if the register function exists
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	register_block_type( 'milieux-blocks/events', array(
		'attributes' => array(
			'categories' => array(
				'type' => 'string',
			),
			'className' => array(
				'type' => 'string',
			),
			'postsToShow' => array(
				'type' => 'number',
				'default' => 6,
			),
			'displayPostAuthor' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'displayPostImage' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'displayPostLink' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'postLayout' => array(
				'type' => 'string',
				'default' => 'grid',
			),
			'columns' => array(
				'type' => 'number',
				'default' => 2,
			),
			'align' => array(
				'type' => 'string',
				'default' => 'center',
			),
			'width' => array(
				'type' => 'string',
				'default' => 'wide',
			),
			'order' => array(
				'type' => 'string',
				'default' => 'desc',
			),
			'orderBy'  => array(
				'type' => 'string',
				'default' => 'date',
			),
			'mainEvent' => array(
				'type' => 'object',
				'default' => 0,
			),
			'displayMainEvent' => array(
				'type' => 'boolean',
				'default' => false,
			)
		),
		'render_callback' => 'milieux_blocks_render_block_core_latest_events',
	) );
}

add_action( 'init', 'milieux_blocks_register_block_core_latest_events' );


/**
 * Create API fields for additional info
 */
function milieux_blocks_register_rest_fields() {
	// Add landscape main-event image source
	register_rest_field(
		'event',
		'featured_image_src',
		array(
			'get_callback' => 'milieux_blocks_get_image_src_landscape',
			'update_callback' => null,
			'schema' => null,
		)
	);

	// Add square featured image source
	register_rest_field(
		'event',
		'featured_image_src_square',
		array(
			'get_callback' => 'milieux_blocks_get_image_src_square',
			'update_callback' => null,
			'schema' => null,
		)
	);

	// Add author info
	register_rest_field(
		'event',
		'author',
		array(
			'get_callback' => 'milieux_blocks_get_author_info',
			'update_callback' => null,
			'schema' => null,
		)
	);
}
add_action( 'rest_api_init', 'milieux_blocks_register_rest_fields' );


/**
 * Get landscape featured image source for the rest field
 */
function milieux_blocks_get_image_src_landscape( $object, $field_name, $request ) {
	$feat_img_array = wp_get_attachment_image_src(
		$object['featured_media'],
		'mlx-block-events__landscape',
		false
	);
	return $feat_img_array[0];
}

/**
 * Get square featured image source for the rest field
 */
function milieux_blocks_get_image_src_square( $object, $field_name, $request ) {
	$feat_img_array = wp_get_attachment_image_src(
		$object['featured_media'],
		'mlx-block-events__square',
		false
	);
	return $feat_img_array[0];
}

/**
 * Get author info for the rest field
 */
function milieux_blocks_get_author_info( $object, $field_name, $request ) {
	$post_author = (int) $object['author'];

	$array_data = array();
	$array_data['user_nicename'] = get_the_author_meta('user_nicename');
	$array_data['first_name'] = get_user_meta($post_author, 'first_name', true);
	$array_data['last_name'] = get_user_meta($post_author, 'last_name', true);
	$array_data['nickname'] = get_user_meta($post_author, 'nickname', true);

	return array_filter($array_data);
}
