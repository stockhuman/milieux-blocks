
// import levenshtein from './levenshtein.js'

const { __ } = wp.i18n
const { Component, Fragment } = wp.element
// const { decodeEntities } = wp.htmlEntities

const { Placeholder, Spinner/*, TextControl */ } = wp.components
const { } = wp.editor

// const { withState } = wp.compose
// const { withSelect } = wp.data

export default class PostSelectBlock extends Component {

	render() {
		const { postq } = this.props

		const inspectorControls = (
			<Fragment>

			</Fragment>
		);

		const hasPosts = Array.isArray(postq) && postq.length;

		if (!hasPosts) {
			return (
				<Fragment>
					{inspectorControls}
					<Placeholder icon="admin-post" label={__('Milieux Features Block')}>
						{!Array.isArray(postq) ? <Spinner /> : __('No posts found.')}
					</Placeholder>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{inspectorControls}
			</Fragment>
		)
	}
}
