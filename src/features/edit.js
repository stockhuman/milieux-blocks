/*
 * External dependencies
 */

import isUndefined from 'lodash/isUndefined';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import classnames from 'classnames';

import PostSelector from './select-post.js'

const { Component, Fragment } = wp.element;
const { __ } = wp.i18n;
const { decodeEntities } = wp.htmlEntities;
const { withSelect } = wp.data;

const {
	PanelBody,
	Placeholder,
	QueryControls,
	RangeControl,
	SelectControl,
	Spinner,
	ToggleControl,
	Toolbar,
	BaseControl,
} = wp.components;

const {
	InspectorControls,
	BlockAlignmentToolbar,
	BlockControls,
} = wp.editor;

const MAX_POSTS_COLUMNS = 4;

class LatestPostsBlock extends Component {
	constructor() {
		super( ...arguments );

		this.toggleDisplayPostDate = this.toggleDisplayPostDate.bind( this );
		this.toggleDisplayPostExcerpt = this.toggleDisplayPostExcerpt.bind( this );
		this.toggleDisplayPostAuthor = this.toggleDisplayPostAuthor.bind( this );
		this.toggleDisplayPostImage = this.toggleDisplayPostImage.bind( this );
		this.toggleDisplayPostLink = this.toggleDisplayPostLink.bind( this );
		this.toggleDisplayFeaturedPost = this.toggleDisplayFeaturedPost.bind( this );
	}

	toggleDisplayPostDate() {
		const { displayPostDate } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostDate: ! displayPostDate } );
	}

	toggleDisplayPostExcerpt() {
		const { displayPostExcerpt } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostExcerpt: ! displayPostExcerpt } );
	}

	toggleDisplayPostAuthor() {
		const { displayPostAuthor } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostAuthor: ! displayPostAuthor } );
	}

	toggleDisplayPostImage() {
		const { displayPostImage } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostImage: ! displayPostImage } );
	}

	toggleDisplayPostLink() {
		const { displayPostLink } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostLink: ! displayPostLink } );
	}

	toggleDisplayFeaturedPost() {
		const { displayFeaturedPost } = this.props.attributes
		const { setAttributes } = this.props

		setAttributes( { displayFeaturedPost: ! displayFeaturedPost } )
	}

	render() {
		const { attributes, categoriesList, setAttributes, latestPosts } = this.props;

		const {
			align,
			categories,
			columns,
			displayFeaturedPost,
			displayPostAuthor,
			displayPostDate,
			displayPostExcerpt,
			displayPostImage,
			displayPostLink,
			featuredPost,
			imageCrop,
			order,
			orderBy,
			postLayout,
			postsToShow,
		} = attributes;

		// Thumbnail options
		const imageCropOptions = [
			{ value: 'landscape', label: __( 'Landscape' ) },
			{ value: 'square', label: __( 'Square' ) },
		];

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Featured Feature' ) }>
					<ToggleControl
						label={__('Show Featured Post')}
						checked={displayFeaturedPost}
						onChange={this.toggleDisplayFeaturedPost}
					/>
					{displayFeaturedPost &&
					<BaseControl
						id="post-select-btn"
						label="Select or update the featured post">
						<PostSelector
							posts={[]}
							subtype="feature"
							onPostSelect={post => {
								setAttributes({
									featuredPost: post,
								})
							}}
							onChange={newValue => {
								setAttributes({ featuredPost: {...newValue} })
							}}
						/>
					</BaseControl>
					}
					{((featuredPost !== undefined) && displayFeaturedPost) &&
						<div className="mlx-featured-post-title">
							<span>{__('Currently Selected:')}</span>
							<h2>{featuredPost.title}</h2>
						</div>
					}

				</PanelBody>
				<PanelBody title={ __( 'Post Grid Settings' ) }>
					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ postsToShow }
						categoriesList={ categoriesList }
						selectedCategoryId={ categories }
						onOrderChange={ ( value ) => setAttributes( { order: value } ) }
						onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
						onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
					/>
					{ postLayout === 'grid' &&
						<RangeControl
							label={ __( 'Columns' ) }
							value={ columns }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
							min={ 2 }
							max={ ! hasPosts ? MAX_POSTS_COLUMNS : Math.min( MAX_POSTS_COLUMNS, latestPosts.length ) }
						/>
					}
					<ToggleControl
						label={ __( 'Display Featured Image' ) }
						checked={ displayPostImage }
						onChange={ this.toggleDisplayPostImage }
					/>
					{ displayPostImage &&
						<SelectControl
							label={ __( 'Featured Image Style' ) }
							options={ imageCropOptions }
							value={ imageCrop }
							onChange={ ( value ) => this.props.setAttributes( { imageCrop: value } ) }
						/>
					}
					<ToggleControl
						label={ __( 'Display Post Author' ) }
						checked={ displayPostAuthor }
						onChange={ this.toggleDisplayPostAuthor }
					/>
					<ToggleControl
						label={ __( 'Display Post Date' ) }
						checked={ displayPostDate }
						onChange={ this.toggleDisplayPostDate }
					/>
					<ToggleControl
						label={ __( 'Display Post Excerpt' ) }
						checked={ displayPostExcerpt }
						onChange={ this.toggleDisplayPostExcerpt }
					/>
					<ToggleControl
						label={ __( 'Display Continue Reading Link' ) }
						checked={ displayPostLink }
						onChange={ this.toggleDisplayPostLink }
					/>

				</PanelBody>
			</InspectorControls>
		);

		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ inspectorControls }
					<Placeholder
						icon="admin-post"
						label={ __( 'Milieux Features Block' ) }
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found.' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > postsToShow ?
			latestPosts.slice( 0, postsToShow ) :
			latestPosts;

		const layoutControls = [
			{
				icon: 'grid-view',
				title: __( 'Grid View' ),
				onClick: () => setAttributes( { postLayout: 'grid' } ),
				isActive: postLayout === 'grid',
			},
			{
				icon: 'list-view',
				title: __( 'List View' ),
				onClick: () => setAttributes( { postLayout: 'list' } ),
				isActive: postLayout === 'list',
			},
		];

		return (
			<Fragment>
				{ inspectorControls }
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ ( value ) => {
							setAttributes( { align: value } );
						} }
						controls={ [ 'center', 'wide' ] }
					/>
					<Toolbar controls={ layoutControls } />
				</BlockControls>
				<div
					className={ classnames(
						this.props.className,
						'mlx-features',
					) }
				>
					<div
						className={ classnames( {
							'is-grid': postLayout === 'grid',
							'is-list': postLayout === 'list',
							[ `columns-${ columns }` ]: postLayout === 'grid',
							'mlx-features__items': 'mlx-features__items',
						} ) }
					>
						<h2 className="section-title t-up">{ __('Features') }</h2>
						{((featuredPost !== undefined) && displayFeaturedPost) &&
							<div className="mlx-featured-feature">
								{ featuredPost.image ? (
									<img
										className="mlx-featured-feature__image"
										src={featuredPost.image.source_url || ''}
										alt={featuredPost.image.alt_text || __('(Untitled)')}
									/>
								) : (
									null
								)
								}
								<div className="mlx-featured-feature__meta">
									<h1 className="ff__title">{featuredPost.title || __('(Untitled)')}</h1>
									<p className="ff__byline">{ `${__('by')} ${featuredPost.author.link || ''}` }</p>
								</div>
							</div>
						}
						{ displayPosts.map( ( post, i ) =>
							<article
								hasImage={ post.mlx_featured_image !== null ? true : false }
								key={ i }
								className={ classnames(
									this.hasImage && displayPostImage ? 'has-thumb' : 'no-thumb'
								) }
							>
								{
									displayPostImage && this.hasImage ? (
										<div className="mlx-block-post-grid-image">
											<a href={ post.link }	target="_blank" rel="noopener noreferrer" >
												<img
													src={ post.mlx_featured_image.source_url }
													alt={ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }
												/>
											</a>
										</div>
									) : (
										null
									)
								}

								<div className="mlx-block-post-grid-text">
									<h3 className="entry-title">
										<a href={ post.link } target="_blank" rel="noopener noreferrer">
											{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }
										</a>
									</h3>

									<div className="mlx-block-post-grid-byline">
										{ displayPostAuthor && post.author_info &&
											<div className="mlx-block-post-grid-author"><a className="mlx-text-link" target="_blank" rel="noopener noreferrer" href={ post.author_info.author_link }>{ post.author_info.display_name }</a></div>
										}

										{ displayPostDate && post.date_gmt &&
											<time dateTime={ moment( post.date_gmt ).utc().format() } className={ 'mlx-block-post-grid-date' }>
												{ moment( post.date_gmt ).local().format( 'MMMM DD, Y' ) }
											</time>
										}
									</div>

									<div className="mlx-block-post-grid-excerpt">
										{ displayPostExcerpt && post.excerpt &&
											<div dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } } />
										}

										{ displayPostLink &&
											<p><a className="mlx-block-post-grid-link mlx-text-link" href={ post.link } target="_blank" rel="bookmark noopener noreferrer">{ __( 'Continue Reading', 'milieux-blocks' ) }</a></p>
										}
									</div>
								</div>
							</article>
						) }
					</div>
				</div>
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy, categories } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const latestPostsQuery = pickBy( {
		categories,
		order,
		orderby: orderBy,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );
	const categoriesListQuery = {
		per_page: 40,
	};
	return {
		latestPosts: getEntityRecords( 'postType', 'feature', latestPostsQuery ), // this is where the magic happened
		categoriesList: getEntityRecords( 'taxonomy', 'category', categoriesListQuery ),
	};
} )( LatestPostsBlock );
