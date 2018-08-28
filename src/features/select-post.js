import isUndefined from 'lodash/isUndefined'
import pickBy from 'lodash/pickBy'
// import levenshtein from './levenshtein.js'

const { __ } = wp.i18n
const { Component, Fragment } = wp.element
const { decodeEntities } = wp.htmlEntities

const { Placeholder, Spinner/*, TextControl */ } = wp.components
const {} = wp.editor

// const { withState } = wp.compose
const { withSelect } = wp.data

/* eslint-disable no-undef */
// imported as a dependency from https://github.com/humanmade/hm-gutenberg-tools/
const { PostSelectButton } = hm.components;
/* eslint-enable no-undef */

// const PostSelectInput = withState({
// 	query: '',
// 	results: [],
// })(({ query, setState }) => (
// 	<TextControl
// 		label={__('Search Featured Post')}
// 		value={query}
// 		placeholder={ __('Post Name') }
// 		onChange={ (newQueryString) => {
// 			setState({ query: newQueryString })
// 			levenshtein(newQueryString, 'toast')

// 		}}
// 	/>
// ) );

class PostSelectBlock extends Component {
	constructor() {
		super(...arguments)

		this.setFeaturedPost = this.setFeaturedPost.bind( this );
		this.state = {featuredPost: null}
	}

	setFeaturedPost(id) {
		console.log(id);
		const { setAttributes } = this.props
		setAttributes({ featuredPost : id })
	}

	render() {
		const { postq, setAttributes } = this.props

		const inspectorControls = (
			<Fragment>
				<PostSelectButton
					onSelect={posts => setAttributes({ postIds: posts.map(p => p.id) })}
					postType="feature"
					maxPosts={3}
					btnProps={{ isLarge: true }}
				>
					{__('Search all features')}
				</PostSelectButton>
			</Fragment>
		);

		const hasPosts = Array.isArray(postq) && postq.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ inspectorControls }
					<Placeholder icon="admin-post" label={ __('Milieux Features Block') }>
						{ !Array.isArray(postq) ? <Spinner/> : __('No posts found.') }
					</Placeholder>
				</Fragment>
			);
		}

		// Removing posts from display should be instant.
		const displayPosts = postq.length > 4 ? postq.slice(0, 4) : postq;

		return (
			<Fragment>
				{ inspectorControls }
				{displayPosts.map( (post, i ) =>
					<button key={i}
						onClick={this.setFeaturedPost(i)}
						onKeyDown={this.setFeaturedPost(i)}
					>
						{decodeEntities(post.title.rendered)}
					</button>
				)}
			</Fragment>
		)
	}
}

export default withSelect( ( select ) => {
	const {
		getEntityRecords,
	} = select('core');
	const postQuery = pickBy( {
		order: 'asc',
		per_page: 4,
	}, (value) => ! isUndefined( value ));

	return {
		postq: getEntityRecords('postType', 'feature', postQuery ),
	};
} )( PostSelectBlock );
