/**
 * Returns the levenshtein distance between two strings
 * @param {string} source
 * @param {string} target
 * @returns {int} distance between source and target
 */
export default function levenshteinDistance(source, target) {
	if (source.length === 0) {
		console.log('Source length of 0');
		return target.length
	}
	if (target.length === 0) {
		console.log('Target length of 0')
		return source.length
	}

	const matrix = [];

	// increment along the first column of each row
	for (let i = 0; i <= target.length; i++) {
		matrix[ i ] = [i];
	}

	// increment each column in the first row
	for (let j = 0; j <= source.length; j++) {
		matrix[ 0 ][ j ] = j;
	}

	// Fill in the rest of the matrix
	for (let i = 1; i <= target.length; i++) {
		for (let j = 1; j <= source.length; j++) {
			if (target.charAt(i - 1) === source.charAt(j - 1)) {
				matrix[ i ][ j ] = matrix[ i - 1 ][ j - 1 ];
			} else {
				matrix[ i ][ j ] = Math.min(matrix[ i - 1 ][ j - 1 ] + 1, // substitution
					Math.min(matrix[ i ][ j - 1 ] + 1, // insertion
						matrix[ i - 1 ][ j ] + 1)); // deletion
			}
		}
	}
	console.log(`levenshtein distance between ${source} and ${target} is ${matrix[ target.length ][ source.length ]}`)
	return matrix[ target.length ][ source.length ];
}
