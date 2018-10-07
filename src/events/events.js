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

export const name = 'core/latest-events';

// Register the block
registerBlockType( 'milieux-blocks/events', {
	title: __( 'Events' ),
	description: __( 'Add a list of recent events and a highlighted one' ),
	icon: 'grid-view',
	category: 'milieux-blocks',
	keywords: [
		__( 'events' ),
		__( 'grid' ),
		__( 'milieux' ),
	],

	attributes: {
		mainEvent: {
			type: 'object',
			default: {},
		},
		displayMainEvent: {
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
		categories: {
			type: 'int',
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
