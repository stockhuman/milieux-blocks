/**
 * BLOCK: hero
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss'
import './editor.scss'

import PostSelector from '../postSelect/PostSelector.js'

const { __ } = wp.i18n
const { registerBlockType } = wp.blocks
const { InspectorControls, MediaUpload } = wp.editor

const {
	BaseControl,
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} = wp.components

registerBlockType('milieux-blocks/post', {
	title: __('Inline Post'), // Block title.
	description: 'Showcase a featured post, event or similar with an eye-catching banner',
	icon: 'pressthis',
	category: 'milieux-blocks',
	keywords: [
		__('Post'),
		__('Milieux'),
		__('guten-block'),
	],

	attributes: {
		thePost: {
			type: 'object',
			default: {},
		},
		displayPostImage: {
			type: 'boolean',
			default: true,
		},
		displayPostExcerpt: {
			type: 'boolean',
			default: false,
		},
		displayCTA: {
			type: 'boolean',
			default: false,
		},
		ctaCopy: {
			type: 'string',
			default: '',
		},
		ctaLink: {
			type: 'string',
			default: '',
		},
		blockTitle: {
			type: 'string',
			default: '',
		},
		postImage: {
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
			blockTitle,
			ctaCopy,
			ctaLink,
			displayCTA,
			displayPostExcerpt,
			displayPostImage,
			postImage,
			thePost,
		} = attributes

		const ALLOWED_MEDIA_TYPES = ['image']

		function toggleDisplayPostImage () {
			setAttributes({ displayPostImage: !displayPostImage })
		}

		function toggleDisplayPostExerpt() {
			setAttributes({ displayPostExcerpt: !displayPostExcerpt })
		}

		function toggleDisplayCTA() {
			setAttributes({ displayCTA: !displayCTA })
		}

		return([
			<InspectorControls>
				<PanelBody title={__('Post Selection')}>
					{(thePost !== undefined) &&
						<div className="mlx-featured-post-title">
							<h2>Selected: { thePost.title || __('Untitled') }</h2>
						</div>
					}
					<BaseControl
						id="post-select-btn"
						label="Select or update the featured event">
						<PostSelector
							posts={[]}
							onPostSelect={post => {
								console.log(post)
								setAttributes({ thePost: post })
							}}
							onChange={newValue => {
								setAttributes({ thePost: { ...newValue } })
							}}
						/>
					</BaseControl>
				</PanelBody>
				<PanelBody title={__('Layout Options')}>
					<ToggleControl
						label={__('Show Image')}
						checked={displayPostImage}
						onChange={toggleDisplayPostImage}
					/>
					{displayPostImage && postImage.id !== null &&
						<img src={postImage.url} alt={postImage.alt} title={postImage.title} />
					}
					{displayPostImage &&
						<MediaUpload
							onSelect={(media) => {
								setAttributes({
									postImage: {
										id: media.id,
										url: media.url,
										alt: media.alt,
										title: media.title,
									},
								})
							}}
							allowedTypes={ALLOWED_MEDIA_TYPES}
							value={postImage.id || null}
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
					<ToggleControl
						label={__('Show Post Exerpt')}
						checked={displayPostExcerpt}
						onChange={toggleDisplayPostExerpt}
					/>
					<ToggleControl
						label={__('Show Link CTA')}
						checked={displayCTA}
						onChange={toggleDisplayCTA}
					/>
					{displayCTA && <div>
						<p>Settings for the arrow CTA</p>
						<TextControl
							label={__('CTA link')}
							placeholder="https://example.com"
							onChange={(link) => {
								setAttributes({ ctaLink: link })
							}}
						/>
						<TextControl
							label={__('CTA text')}
							placeholder="Say, 'See all Announcements'"
							onChange={(copy) => {
								setAttributes({ ctaCopy: copy })
							}}
						/>
						<hr />
					</div>}
					<TextControl
						label={__('Alternate Title')}
						placeholder="Leave blank to unset"
						onChange={(newTitle) => {
							const alt = { altTitle: newTitle }
							setAttributes({ thePost: {...thePost, ...alt }})
							console.log(thePost)
						}}
					/>
					<TextControl
						label={__('Block Title')}
						placeholder="Leave blank to unset"
						onChange={(newTitle) => {
							setAttributes({ blockTitle: newTitle })
						}}
					/>
				</PanelBody>
			</InspectorControls>,
			<section className={props.className}>
				{blockTitle !== '' && <h3 className="page-type-title">{blockTitle}</h3>}
				<div className="mlx-post__container">
					{displayPostImage && postImage.id !== null &&
						<a href={thePost.url}>
							<img src={postImage.url} alt={postImage.alt} title={postImage.title} />
						</a>
					}

					<div className="mlx-post__meta">
						{displayPostExcerpt && <p>{thePost.excerpt}</p>}
						{thePost.title && <a href={thePost.url}>
							<h2 className="mlx-post__title">{thePost.altTitle ? thePost.altTitle : thePost.title}</h2>
						</a>}
					</div>
					{displayCTA && <a className="mlx-post__cta" href={ctaLink}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 14.241">
							<path fill="#000" d="M68.039,14.241,67.6,13.8l6.65-6.65L67.6.439,68.039,0l7.152,7.152Z" transform="translate(-25.191)" />
							<path fill="#000" d="M0,10.9H49.5v.69H0Z" transform="translate(0 -4.062)" />
						</svg>
						<p className="mlx-post__cta-copy">{ctaCopy}</p>
					</a>}
				</div>
			</section>,
		])
	},

	save: props => {
		const { attributes, className } = props
		const {
			blockTitle,
			ctaCopy,
			ctaLink,
			displayCTA,
			displayPostExcerpt,
			displayPostImage,
			postImage,
			thePost,
		} = attributes

		return (
			<section className={className}>
				{blockTitle !== '' && <h3 className="page-type-title">{blockTitle}</h3>}
				<div className="mlx-post__container">
					{displayPostImage && postImage.id !== null &&
						<a href={thePost.url}>
							<img src={postImage.url} alt={postImage.alt} title={postImage.title} />
						</a>
					}

					<div className="mlx-post__meta">
						{displayPostExcerpt && <p>{thePost.excerpt}</p>}
						{thePost.title && <a href={thePost.url}>
							<h2 className="mlx-post__title">{thePost.altTitle ? thePost.altTitle : thePost.title}</h2>
						</a>}
					</div>
					{displayCTA && <a className="mlx-post__cta" href={ctaLink}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 14.241">
							<path fill="#000" d="M68.039,14.241,67.6,13.8l6.65-6.65L67.6.439,68.039,0l7.152,7.152Z" transform="translate(-25.191)" />
							<path fill="#000" d="M0,10.9H49.5v.69H0Z" transform="translate(0 -4.062)" />
						</svg>
						<p className="mlx-post__cta-copy">{ctaCopy}</p>
					</a>}
				</div>
			</section>
		)
	},
})

