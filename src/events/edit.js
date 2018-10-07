/*
 * External dependencies
 */

import isUndefined from 'lodash/isUndefined';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import classnames from 'classnames';

import PostSelector from '../postSelect/PostSelector.js'

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
const MAX_EVENTS = 12;

class LatestPostsBlock extends Component {
	constructor() {
		super( ...arguments );

		this.toggleDisplayPostExcerpt = this.toggleDisplayPostExcerpt.bind( this );
		this.toggleDisplayPostImage = this.toggleDisplayPostImage.bind( this );
		this.toggleDisplayPostLink = this.toggleDisplayPostLink.bind( this );
		this.toggleDisplayMainEvent = this.toggleDisplayMainEvent.bind( this );
	}

	toggleDisplayPostExcerpt() {
		const { displayPostExcerpt } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostExcerpt: ! displayPostExcerpt } );
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

	toggleDisplayMainEvent() {
		const { displayMainEvent } = this.props.attributes
		const { setAttributes } = this.props

		setAttributes( { displayMainEvent: ! displayMainEvent } )
	}

	render() {
		const { attributes, categoriesList, setAttributes, latestPosts } = this.props;

		const {
			align,
			categories,
			columns,
			displayMainEvent,
			displayPostExcerpt,
			displayPostImage,
			displayPostLink,
			mainEvent,
			imageCrop,
			order,
			orderBy,
			postLayout,
			postsToShow,
		} = attributes;

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Featured Event' ) }>
					<ToggleControl
						label={__('Show Featured Event')}
						checked={displayMainEvent}
						onChange={this.toggleDisplayMainEvent}
					/>
					{displayMainEvent &&
					<BaseControl
						id="post-select-btn"
						label="Select or update the featured event">
						<PostSelector
							posts={[]}
							onPostSelect={post => {
								setAttributes({ mainEvent: post })
								console.log(post)
							}}
							onChange={newValue => {
								setAttributes({ mainEvent: {...newValue} })
							}}
						/>
					</BaseControl>
					}
					{((mainEvent !== undefined) && displayMainEvent) &&
						<div className="mlx-featured-post-title">
							<span>{__('Currently Selected:')}</span>
							<h2>{mainEvent.title}</h2>
						</div>
					}

				</PanelBody>
				<PanelBody title={ __( 'Display Settings' ) }>
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
						label={ __( 'Display Post Excerpt' ) }
						checked={ displayPostExcerpt }
						onChange={ this.toggleDisplayPostExcerpt }
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
						label={ __( 'Milieux Events Block' ) }
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No Current Events found.' )
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
						'mlx-events',
					) }
				>
					<div
						className={ classnames( {
							'is-grid': postLayout === 'grid',
							'is-list': postLayout === 'list',
							[ `columns-${ columns }` ]: postLayout === 'grid',
							'mlx-events__items': 'mlx-events__items',
						} ) }
					>
						<h2 className="section-title t-up">{ __('Events') }</h2>
						{((mainEvent !== undefined) && displayMainEvent) &&
							<div className="mlx-main-event"
								hasImage={mainEvent.image !== null ? true : false}
							>
								{this.hasImage ? (
									<img
										className="mlx-main-event__image"
										src={mainEvent.image.source_url}
										alt={mainEvent.image.alt_text || __('(Untitled)')}
									/>
								) : (
								 	null
								 )
							 	}
								<div className="mlx-main-event__meta">
									<h2 className="main-event__title">{mainEvent.title || __('(Untitled)')}</h2>
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
								<div className="mlx-block-post-grid-text">
									<h2 className="entry-title">
										<a href={ post.link } target="_blank" rel="noopener noreferrer">
											{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }
										</a>
									</h2>

									<div className="mlx-block-post-grid-byline">
										{ post.date_gmt &&
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
		latestPosts: getEntityRecords( 'postType', 'event', latestPostsQuery ), // this is where the magic happened
		categoriesList: getEntityRecords( 'taxonomy', 'category', categoriesListQuery ),
	};
} )( LatestPostsBlock );
