/**
 * BLOCK: Milieux Blocks Page Grid
 */

const { __ } = wp.i18n // Components
const { registerBlockType } = wp.blocks; // Register block controls

// Import block dependencies and components
import edit from './edit';

// Import CSS
import './style.scss';
import './editor.scss';

// Register alignments
const validAlignments = [ 'center', 'wide' ]

export const name = 'core/latest-posts';

// Register the block
registerBlockType( 'milieux-blocks/features', {
	title: __( 'Features' ),
	description: __( 'Add a grid or list of customizable posts to your page.' ),
	icon: 'format-aside',
	category: 'milieux-blocks',
	keywords: [
		__( 'features' ),
		__( 'grid' ),
		__( 'milieux' ),
	],

	attributes: {
		featuredPost: {
			type: 'object',
			default: {},
		},
		displayFeaturedPost: {
			type: 'boolean',
			default: false,
		},
		postsToShow: {
			type: 'int',
			default: 10,
		},
		displayPostImage: {
			type: 'boolean',
			default: false,
		},
		displayPostLink: {
			type: 'boolean',
			default: false,
		},
		displayPostDate: {
			type: 'boolean',
			default: false,
		},
		displayPostExcerpt: {
			type: 'boolean',
			default: false,
		},
		displayPostAuthor: {
			type: 'boolean',
			default: false,
		},
		categories: {
			type: 'string',
			default: 'all',
		},
		order: {
			type: 'string',
			default: 'asc',
		},
	},

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
