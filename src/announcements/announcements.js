/**
 * BLOCK: hero
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss'
import './editor.scss'

// Import block dependencies and components
import edit from './edit';

const { __ } = wp.i18n
const { registerBlockType } = wp.blocks

registerBlockType('milieux-blocks/announcements', {
	title: __('Announcements'),
	description: 'Display a list of custom announcements',
	icon: 'megaphone',
	category: 'milieux-blocks',
	keywords: [
		__('Announcements'),
		__('Newsletter'),
		__('Milieux'),
	],

	attributes: {
		announcements: {
			source: '',
			default : [],
			selector: '',
			query: {
				image: {
					source: 'attribute',
					selector: 'img',
					attribute: 'src',
				},
			},
		},
	},

	// edit: props => {
	// 	const { attributes, setAttributes } = props
	// 	const {
	// 		banner,
	// 		ctaCopy,
	// 		displayBanner,
	// 		displayCTA,
	// 		link,
	// 	} = attributes

	// 	const ALLOWED_MEDIA_TYPES = ['image']

	// 	function toggleDisplayBanner() {
	// 		setAttributes({ displayBanner: !displayBanner })
	// 	}

	// 	function toggleDisplayCTA() {
	// 		setAttributes({ displayCTA: !displayCTA })
	// 	}

	// 	const inspectorControls = (
	// 		<InspectorControls>
	// 			<PanelBody title={__('Banner Options')}>
	// 				<TextControl
	// 					label={__('Banner link')}
	// 					placeholder="https://example.com"
	// 					onChange={(newLink) => {
	// 						setAttributes({ link: newLink })
	// 					}}
	// 				/>
	// 				<ToggleControl
	// 					label={__('Show Image')}
	// 					checked={displayBanner}
	// 					onChange={toggleDisplayBanner}
	// 				/>
	// 				<ToggleControl
	// 					label={__('Show CTA text')}
	// 					checked={displayCTA}
	// 					onChange={toggleDisplayCTA}
	// 				/>
	// 				{displayBanner && banner.id !== null &&
	// 					<img src={banner.url} alt={banner.alt} title={banner.title} />
	// 				}
	// 				{displayBanner &&
	// 					<MediaUpload
	// 						onSelect={(media) => {
	// 							setAttributes({
	// 								banner: {
	// 									id: media.id,
	// 									url: media.url,
	// 									alt: media.alt,
	// 									title: media.title,
	// 								},
	// 							})
	// 						}}
	// 						allowedTypes={ALLOWED_MEDIA_TYPES}
	// 						value={banner.id || null}
	// 						render={({ open }) => (
	// 							<div>
	// 								<Button onClick={open} isDefault={true}>
	// 									Update Image
	// 								</Button>
	// 								<hr />
	// 							</div>
	// 						)}
	// 					/>
	// 				}

	// 				{displayCTA && <div>
	// 					<TextControl
	// 						label={__('Banner Title')}
	// 						placeholder="Say, 'Join the Newsletter'"
	// 						onChange={(copy) => {
	// 							setAttributes({ ctaCopy: copy })
	// 						}}
	// 					/>
	// 				</div>}
	// 			</PanelBody>
	// 		</InspectorControls>
	// 	);

	// 	const isEmpty = banner.url === '' && ctaCopy === '' && !displayCTA;
	// 	if (isEmpty) {
	// 		return (
	// 			<Fragment>
	// 				{inspectorControls}
	// 				<Placeholder
	// 					icon="carrot"
	// 					label={__('Milieux Banner Block')}
	// 				/>
	// 			</Fragment>
	// 		);
	// 	}

	// 	// final return statement
	// 	return ([
	// 		inspectorControls,
	// 		<section className={props.className}>
	// 			{ctaCopy !== '' && <h2 className="mlx-banner__title">{ctaCopy}</h2>}
	// 			<div className="mlx-banner__container">
	// 				{displayBanner && banner.id !== null &&
	// 					<a href={link}>
	// 						<img src={banner.url} alt={banner.alt} title={banner.title} />
	// 					</a>
	// 				}
	// 			</div>
	// 		</section>,
	// 	])
	// },

	edit,

	save: props => {
		const { attributes, className } = props
		const { announcements } = attributes

		if (announcements.length > 0) {
			return (
				<section className={className}>
					<h2 className="section-title t-up">{__('Announcements')}</h2>
					<div className="mlx-banner__container">doot
					</div>
				</section>
			)
		}
		return null
	},
})

