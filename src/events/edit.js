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
const { InspectorControls } = wp.editor;

const {
	BaseControl,
	PanelBody,
	Placeholder,
	QueryControls,
	Spinner,
	ToggleControl,
} = wp.components;

const MAX_EVENTS = 14;

class LatestPostsBlock extends Component {
	constructor() {
		super( ...arguments );

		this.toggleDisplayPostExcerpt = this.toggleDisplayPostExcerpt.bind( this );
		this.toggleDisplayPostImage = this.toggleDisplayPostImage.bind( this );
		this.toggleDisplayPostLink = this.toggleDisplayPostLink.bind( this );
		this.toggleDisplayMainEvent = this.toggleDisplayMainEvent.bind( this );
		this.toggleDisplayPastPosts = this.toggleDisplayPastPosts.bind( this );
	}

	toggleDisplayPostExcerpt() {
		const { displayPostExcerpt } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostExcerpt: ! displayPostExcerpt } );
	}

	toggleDisplayPastPosts() {
		const { displayPastPosts } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes({ displayPastPosts: !displayPastPosts });
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
		const { setAttributes } = this.props;

		setAttributes( { displayMainEvent: ! displayMainEvent } );
	}

	render() {
		const { attributes, categoriesList, setAttributes, latestPosts } = this.props;

		const {
			categories,
			displayMainEvent,
			displayPostExcerpt,
			displayPostImage,
			displayPostLink,
			displayPastPosts,
			mainEvent,
			order,
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
							subtype="event"
							keys={['acf']} // request acf response
							onPostSelect={post => {
								setAttributes({ mainEvent: post })
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
				<PanelBody title={ __( 'Event list Settings' ) }>
					<QueryControls
						{ ...{ order, maxItems: MAX_EVENTS } }
						numberOfItems={ postsToShow }
						categoriesList={ categoriesList }
						selectedCategoryId={ categories }
						onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
					/>
					<ToggleControl
						label={ __( 'Display Featured Image' ) }
						checked={ displayPostImage }
						onChange={ this.toggleDisplayPostImage }
					/>
					<ToggleControl
						label={ __( 'Display Post Excerpt' ) }
						checked={ displayPostExcerpt }
						onChange={ this.toggleDisplayPostExcerpt }
					/>
					<ToggleControl
						label={__('Display Past Posts')}
						checked={displayPastPosts}
						onChange={this.toggleDisplayPastPosts}
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

		// returns whether the even has a date that is either in the present or future
		const isEventAttendable = (event) => {
			if (displayPastPosts) {
				return true
			}

			if (event.acf === undefined || null) {
				return false;
			}

			const today = parseInt(moment().format('YYYYMMDD'))
			let dateInPresentOrFuture = false

			switch (event.acf.event_type) {
				case 'single':
					dateInPresentOrFuture = (event.acf.event_date >= today) ? true : false; break;
				case 'multi':
					let dates = event.acf.event_dates
					dates.forEach(e => {
						if (parseInt(e.event_dates_date) >= today) {
							dateInPresentOrFuture = true
						}
					})
					break;
				case 'range':
					if (today <= parseInt(event.acf.event_date_end)) {
						dateInPresentOrFuture = true
					}
					break;
			}

			return dateInPresentOrFuture

		}

		const eventDate = (event, month = 'MMMM', day = 'DD', full = false) => {
			if (event.acf === undefined || null) {
				return (null)
			}
			const e = event.acf
			let date = moment(e.event_date, 'YYYYMMDD').local()
			const type = e.event_type

			if (type === 'multi') {
				date = moment(e.event_dates[ 0 ].event_dates_date, 'YYYYMMDD').local()
			}

			// build the mutiple dates string here, as it's rather large and cumbersome
			const multidate = (ev) => { // event object, 'e' above
				let m = '' // first month appearing in the dates array
				let out = '' // partial output string after the first month
				ev.event_dates.forEach(d => {
					let evntmonth = moment(d.event_dates_date, 'YYYYMMDD').local().format('MMMM')
					if (m !== evntmonth) { // we're in a different month
						if (m === '') { // .. because there is no string yet
							m = evntmonth
							out += evntmonth // start the string
						} else {
							out += ` and ${evntmonth} ` // ...because the last month is not the same as the current
						}

						// print the day after declaring the month
						out += ` ${moment(d.event_dates_date, 'YYYYMMDD').local().format('DD')} `
					} else {
						// or just add a day in the same month
						out += `, ${moment(d.event_dates_date, 'YYYYMMDD').local().format('DD')} `
					}
					// So as to build something like "August 06, 08 and September 03"
				})
				return out
			}

			// parse the acf event type and provide a preformatted line such as "April 23 @ 5:00PM - May 03 @ 2:00PM"
			return (
				<div className="mlx-t-number">
					<time dateTime={moment(event.date_gmt).utc().format()}>
						{ month !== '' && <span className="month">{date.format(month)}</span> } <span>{date.format(day)}</span>
						{ type === 'single' && full && <span>{e.event_time !== '' ? '@' : ''} {e.event_time} - {e.event_time_end}</span> }
						{ type === 'range' && full && <span> @ {e.event_time} - {moment(e.event_date_end, 'YYYYMMDD').local().format('MMMM DD')} @ {e.event_time_end}</span>}
						{ type === 'multi' && full && multidate(e)}
					</time>
				</div>
			)
		}

		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > postsToShow ?
			latestPosts.slice( 0, postsToShow ) :
			latestPosts;

		const hasMainEvent = (mainEvent !== undefined) && displayMainEvent

		return (
			<Fragment>
				{ inspectorControls }
				<div className={ classnames( this.props.className, 'mlx-events', ) } >
					<h2 className="section-title t-up">{__('Events')}</h2>
					<div className={ classnames( 'mlx-events__container', { 'has-main-event' : hasMainEvent })}>

						{ hasMainEvent &&
							<div className="mlx-main-event">
								{ mainEvent.image &&
									<div className="mlx-main-event__image"
										style={{backgroundImage: `url(${mainEvent.image.source_url || null})`}}
										data-title={mainEvent.image.title || __('Untitled')}
									/>
								}
								<div className="mlx-main-event__meta">
									<h2 className="mlx-main-event__title">{mainEvent.title || __('(Untitled)')}</h2>
									<div className="mlx-main-event__date mlx-t-number">{ eventDate(mainEvent, 'MMMM', 'DD') }</div>
								</div>
							</div>
						}

						<div className="mlx-events__items">
							{ displayPosts.filter((post) => isEventAttendable(post)).map( ( post, i ) =>
								<article
									hasImage={ post.mlx_featured_image !== null ? true : false }
									key={ i }
									className={ classnames(
										this.hasImage && displayPostImage ? 'has-thumb' : 'no-thumb'
									) }
								>
									<div className="mlx-events__day">{eventDate(post, '')}</div>
									<div className="mlx-events__text">
										<h2 className="entry-title">
											<a href={ post.link } target="_blank" rel="noopener noreferrer">
												{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }
											</a>
										</h2>

										{ eventDate(post, 'MMMM', 'DD', true) }

										<div className="mlx-events__excerpt">
											{ displayPostExcerpt && post.excerpt &&
												<div dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } } />
											}

											{ displayPostLink &&
												<p><a className="mlx-events__link mlx-events__text" href={ post.link } target="_blank" rel="bookmark noopener noreferrer">{ __( 'Continue Reading' ) }</a></p>
											}
										</div>
									</div>
								</article>
							) }
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, categories } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const latestPostsQuery = pickBy( {
		categories,
		order,
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
