/**
 * BLOCK: Milieux Blocks Page Grid
 */

// Import block dependencies and components
import edit from './edit';

// Import CSS
import './style.scss';
import './editor.scss';

// Components
const { __ } = wp.i18n

// Extend component
// const { Component } = wp.element

// Register block controls
const {
	registerBlockType,
} = wp.blocks;

// Register alignments
const validAlignments = [ 'center', 'wide' ]

export const name = 'core/latest-posts';

// Register the block
registerBlockType( 'milieux-blocks/features', {
	title: __( 'Features' ),
	description: __( 'Add a grid or list of customizable posts to your page.' ),
	icon: 'grid-view',
	category: 'milieux-blocks',
	keywords: [
		__( 'features' ),
		__( 'grid' ),
		__( 'milieux' ),
	],

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( -1 !== validAlignments.indexOf( align ) ) {
			return { 'data-align': align };
		}
	},

	edit,

	save: () => {
		return null
	},
} );
