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
const { PostSelectButton } = hm.components;

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

		this.searchForFeaturedPost = this.searchForFeaturedPost.bind( this );
		this.state = {doot: true}
		console.log(this);

	}

	searchForFeaturedPost() {
		console.log(this.searchQuery);
	}

	render() {
		const { postq, setAttributes } = this.props
		console.log(this)

		const inspectorControls = (
			<Fragment>
				<PostSelectButton
					onSelect={posts => setAttributes({ postIds: posts.map(p => p.id) })}
					postType="feature"
					btnProps={{ isLarge: true }}
				>
					{__('Select Featured Post')}
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
					<h2 key={i} >{decodeEntities(post.title.rendered)}</h2>
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
