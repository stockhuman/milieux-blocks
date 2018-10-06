/**
 * Forked from @vermiliondesign's Gutenberg PostSelector
 * @link https://github.com/vermiliondesign/gutenberg-post-selector
 */

// Styles
import './editor.scss'

import PostSelector from './PostSelector'

const { __ } = wp.i18n
const { registerBlockType } = wp.blocks
const { Fragment, RawHTML } = wp.element
const { InspectorControls } = wp.editor
const { PanelBody } = wp.components

registerBlockType('milieux-blocks/post-select', {
	title: __('Post Selector'),
	icon: 'shield',
	category: 'milieux-blocks',
	keywords: [''],
	attributes: {
		posts: {
			type: 'array',
			default: [],
		},
	},

	edit({ attributes, setAttributes }) {
		return (
			<Fragment>
				<InspectorControls>
					<PanelBody title="Post Selector">

						<PostSelector
							onPostSelect={post => {
								attributes.posts.push(post);
								setAttributes({ posts: [...attributes.posts] });
							}}
							posts={attributes.posts}
							onChange={newValue => {
								setAttributes({ posts: [...newValue] });
							}}
						/>

					</PanelBody>
				</InspectorControls>
				<div>
					{attributes.posts.map(post => (
						<div>
							#{post.id}
							<h2>{post.title}</h2>
							<RawHTML>{post.excerpt}</RawHTML>
						</div>
					))}
				</div>
			</Fragment>
		);
	},

	save({ attributes }) {
		return (
			<div>
				{attributes.posts.map(post => (
					<div>
						#{post.id}
						<h2>{post.title}</h2>
						<RawHTML>{post.excerpt}</RawHTML>
					</div>
				))}
			</div>
		)
	},
});
