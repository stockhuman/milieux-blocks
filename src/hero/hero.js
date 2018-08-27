/**
 * BLOCK: hero
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss'
import './editor.scss'

const { __ } = wp.i18n
const { registerBlockType } = wp.blocks

// see https://github.com/WordPress/gutenberg/tree/master/packages/components/
const {
	Placeholder,
	FormFileUpload,
	Button,
	PanelBody,
	UrlInput,
} = wp.components

const {
	MediaPlaceholder,
	MediaUpload,

	RichText,

	InspectorControls,
	ColorPalette,
	PanelColor,
	PanelColorSettings,
} = wp.editor

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'milieux-blocks/hero', {
	title: __( 'Page Hero' ), // Block title.
	description: 'Showcase a featured post, event or similar with an eye-catching banner',
	icon: 'shield',
	category: 'milieux-blocks',
	keywords: [
		__( 'Hero' ),
		__( 'Milieux' ),
		__( 'guten-block' ),
	],

	attributes: {
		textString: {
			type: 'array',
			source: 'children',
			selector: 'h2',
		},
		fontColor: { // NEW attribute!
			type: 'string',
			default: 'black',
		},
		backgroundImage: {
			type: 'string',
			default: null, // no image by default!
		},
	},

	supports: {
		useOnce: true,
	},

	edit: props => {
		const {
			setAttributes,
			attributes,
			className,
		} = props

		const { fontColor, backgroundImage } = props.attributes;

		function onTextChange( changes ) {
			setAttributes( {
				textString: changes,
			} )
		}

		//create a handler that will set the color when you click on the ColorPalette
		function onTextColorChange( changes ) {
			setAttributes( {
				fontColor: changes,
			} )
		}

		function onImageSelect( imageObject ) {
			setAttributes( {
				backgroundImage: imageObject.sizes.full.url,
			} )
		}

		function onLinkChange( link ) {
			setAttributes( {
				link: link,
			} )
		}

		return ( [
			<InspectorControls key="this">

				<PanelBody>
					<p>Select a background image:</p>
					<MediaUpload
						onSelect={ onImageSelect }
						type="image"
						value={ backgroundImage }
						render={ ( { open } ) => (
							<Button isDefault onClick={ open }>Change Hero Image</Button>
						) }
					/>
				</PanelBody>

				<PanelBody>
					<p>CTA Link</p>
					<UrlInput onChange={ onLinkChange } showSuggestions posts={ 4 } />
				</PanelBody>

				<PanelColorSettings // one can have more than one label group,
					// see : https://github.com/WordPress/gutenberg/commit/288fe7897002f14c04f552b563d22af566742277
					title={ __( 'Color Settings' ) }
					initalOpen={ false }
					colorSettings={ [
						{
							value: fontColor,
							onChange: onTextColorChange,
							label: __( 'Text Color' ),
						},
					] }
				/>

			</InspectorControls>,

			<section className={ className + ' block mlx-hero' } key="that">
				{ /* Adding an overlay element */ }
				<div className="overlay"
					style={ {
						backgroundImage: `url(${ backgroundImage })`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					} }></div>

				<div className="mlx-hero__title-container">
					<RichText
						tagName="h2"
						className="mlx-hero__title" // adding a class we can target
						value={ attributes.textString }
						onChange={ onTextChange }
						placeholder="Title Text"
						style={ { color: fontColor } }
					/>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 14.241">
						<path fill={ fontColor } d="M68.039,14.241,67.6,13.8l6.65-6.65L67.6.439,68.039,0l7.152,7.152Z" transform="translate(-25.191)" />
						<path fill={ fontColor } d="M0,10.9H49.5v.69H0Z" transform="translate(0 -4.062)" />
					</svg>
				</div>

				<MediaPlaceholder
					type="image"
					accept="image/*"
					icon="shield"
					labels={ { title: 'Hero Image', name: 'a new banner image' } }
					onSelect={ onImageSelect }
				/>
			</section>,
		] )
	},

	save: props => {
		const { attributes, className } = props
		const { fontColor, backgroundImage } = props.attributes

		return (
			<section
				className={ className + ' block mlx-hero' }
				style={ {
					backgroundImage: `url(${ backgroundImage })`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				} }>
				<div className="overlay"></div>
				<h2 className="content" style={ { color: fontColor } }>{ attributes.textString }</h2>
			</section>
		)
	},
} )

