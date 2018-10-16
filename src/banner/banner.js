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
const { Fragment } = wp.element;
const { registerBlockType } = wp.blocks
const { InspectorControls, MediaUpload } = wp.editor

const {
	Button,
	PanelBody,
	Placeholder,
	RichText,
	TextControl,
	ToggleControl,
} = wp.components

registerBlockType('milieux-blocks/banner', {
	title: __('Banner'),
	description: 'Display a call to action banner, such as a newsletter signup',
	icon: 'carrot',
	category: 'milieux-blocks',
	keywords: [
		__('Banner'),
		__('Newsletter'),
		__('Milieux'),
	],

	attributes: {
		link: {
			type: 'string',
			default: '',
		},
		displayBanner: {
			type: 'boolean',
			default: true,
		},
		displayCTA: {
			type: 'boolean',
			default: false,
		},
		ctaCopy: {
			type: 'string',
			default: '',
		},
		banner: {
			type: 'object',
			default: {
				id: null,
				url: '',
				alt: '',
				title: '',
			},
		},
	},

	edit: props => {
		const { attributes, setAttributes } = props
		const {
			banner,
			ctaCopy,
			displayBanner,
			displayCTA,
			link,
		} = attributes

		const ALLOWED_MEDIA_TYPES = ['image']

		function toggleDisplayBanner () {
			setAttributes({ displayBanner: !displayBanner })
		}

		function toggleDisplayCTA() {
			setAttributes({ displayCTA: !displayCTA })
		}

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={__('Banner Options')}>
					<TextControl
						label={__('Banner link')}
						placeholder="https://example.com"
						onChange={(newLink) => {
							setAttributes({ link: newLink })
						}}
					/>
					<ToggleControl
						label={__('Show Image')}
						checked={displayBanner}
						onChange={toggleDisplayBanner}
					/>
					<ToggleControl
						label={__('Show CTA text')}
						checked={displayCTA}
						onChange={toggleDisplayCTA}
					/>
					{displayBanner && banner.id !== null &&
						<img src={banner.url} alt={banner.alt} title={banner.title} />
					}
					{displayBanner &&
						<MediaUpload
							onSelect={(media) => {
								setAttributes({
									banner: {
										id: media.id,
										url: media.url,
										alt: media.alt,
										title: media.title,
									},
								})
							}}
							allowedTypes={ALLOWED_MEDIA_TYPES}
							value={banner.id || null}
							render={({ open }) => (
								<div>
									<Button onClick={open} isDefault={true}>
										Update Image
									</Button>
									<hr />
								</div>
							)}
						/>
					}

					{displayCTA && <div>
						<TextControl
							label={__('Banner Title')}
							placeholder="Say, 'Join the Newsletter'"
							onChange={(copy) => {
								setAttributes({ ctaCopy: copy })
							}}
						/>
					</div>}
				</PanelBody>
			</InspectorControls>
		);

		const isEmpty = banner.url === '' && ctaCopy === '' && !displayCTA;
		if (isEmpty) {
			return (
				<Fragment>
					{inspectorControls}
					<Placeholder
						icon="carrot"
						label={__('Milieux Banner Block')}
					/>
				</Fragment>
			);
		}

		// final return statement
		return([
			inspectorControls,
			<section className={props.className}>
				{ctaCopy !== '' && <h2 className="mlx-banner__title">{ctaCopy}</h2>}
				<div className="mlx-banner__container">
					{displayBanner && banner.id !== null &&
						<a href={link}>
							<img src={banner.url} alt={banner.alt} title={banner.title} />
						</a>
					}
				</div>
			</section>,
		])
	},

	save: props => {
		const { attributes, className } = props
		const {
			banner,
			ctaCopy,
			displayBanner,
			link,
		} = attributes

		return (
			<section className={className}>
				{ctaCopy !== '' && <h2 className="mlx-banner__title">{ctaCopy}</h2>}
				<div className="mlx-banner__container">
					{displayBanner && banner.id !== null &&
						<a href={link}>
							<img src={banner.url} alt={banner.alt} title={banner.title} />
						</a>
					}
				</div>
			</section>
		)
	},
})

