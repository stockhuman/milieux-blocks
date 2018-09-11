/**
 * BLOCK: my-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
// import './style.scss';
// import './editor.scss';

const { __ } = wp.i18n
const { registerBlockType } = wp.blocks

const { Component, Fragment } = wp.element
const { apiFetch } = wp
const { InspectorControls } = wp.editor
const { SelectControl } = InspectorControls

class mySelectPosts extends Component {
	static getInitialState() {
		return {
			posts: [],
			selectedPost: undefined,
		};
	}

	constructor() {
		super(...arguments)
		console.log(this.props)
		this.state = this.constructor.getInitialState()
		this.getOptions = this.getOptions.bind(this)
		this.onChangeSelectPost = this.onChangeSelectPost.bind(this)
	}

	getOptions() {
		apiFetch('/wp/v2/feature/').then((posts) => {
			console.log(posts)
			this.setState({ posts })
		})
	}

	componentDidMount() {
		this.setState({ selectedPost: this.props.attributes.selectedPost });
		this.getOptions();
	}

	onChangeSelectPost(value) {
		this.props.setAttributes({ selectedPost: parseInt(value) })
		this.setState({ selectedPost: parseInt(value) });
	}

	render() {
		let output = 'Loading Posts...';
		let selectedPost = {};
		let options = [{ value: 0, label: 'Select a Post' }];
		if (this.state.posts.length > 0) {
			output = 'We have ' + this.state.posts.length + ' posts';
			this.state.posts.forEach((post) => {
				options.push({ value: post.id, label: post.title.rendered });
			});
		}
		if (0 === this.state.selectedPost) {
			output = 'Please Select a Post';
		} else {
			output = 'A post is selected';
		}
		return (
			<Fragment>
				{
					this.state.posts.length > 0 && <InspectorControls>
						<SelectControl
							onChange={this.onChangeSelectPost}
							value={this.props.attributes.selectedPost}
							label={__('Select a Post')}
							options={options} />
					</InspectorControls>
				}
				<div>{output}</div>
			</Fragment>
		)
	}
}
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('milieux-blocks/post-select', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __('Post Select'), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'milieux-blocks',
	keywords: [
		__('my-block — CGB Block'),
		__('CGB Example'),
		__('create-guten-block'),
	],

	attributes: {
		content: {
			type: 'array',
			source: 'children',
			selector: 'p',
		},
		alignment: {
			type: 'string',
		},
		selectedPost: {
			type: 'number',
			default: 0,
			selector: 'div',
		},
	},

	// The "edit" property must be a valid function.
	edit: mySelectPosts,

	// The "save" property must be specified and must be a valid function.
	save: function (props) {
		const { content, selectedPost } = props.attributes;
		console.log(selectedPost);
		return <div><p className={props.className}>{content}</p>{selectedPost}</div>
	},
})
