// Finish reading the full text file containing the paired section assignments before proceeding.
const text = await Deno.readTextFile(Deno.args[0]);

// Split the text by new line character, allowing us to iterate over the assigned pairs.
const sectionAssignmentStrings: string[] = text.split("\n");

// Maintain counts of overlapping assignments.
let numFullyOverlappedAssignments = 0;
let numPartlyOverlappedAssignments = 0;

// Iterate over the assigned pairs.
sectionAssignmentStrings.forEach(sectionAssignmentString => {
	// Split the assignment string into an array of four strings. "2-4,6-8" becomes ["2","4","6","8"]
	const rangeStrings: string[] = sectionAssignmentString.split(/[-,]/);

	// Convert the array of range strings into an array of integers.
	const rangeInts: number[] = rangeStrings.map(rangeString => parseInt(rangeString, 10));

	// Build some helpful shorthands for the four integers.
	const firstElfStart: number = rangeInts[0];
	const firstElfEnd: number = rangeInts[1];
	const secondElfStart: number = rangeInts[2];
	const secondElfEnd: number = rangeInts[3];

	// Determine which range has the lower starting section:

	// First elf's assigned range is the possible superset.
	if (firstElfStart < secondElfStart) {

		// Check for full overlap. (1s < 2s <= 2e <= 1e)
		if (secondElfEnd <= firstElfEnd) {
			numFullyOverlappedAssignments++;
		}

		// Check for partial overlap. (1s < 2s <= 1e)
		if (secondElfStart <= firstElfEnd) {
			numPartlyOverlappedAssignments++;
		}
	}

	// Second elf's assigned range is the possible superset.
	else if (secondElfStart < firstElfStart) {

		// Check for full overlap. (2s < 1s <= 1e <= 2e)
		if (firstElfEnd <= secondElfEnd) {
			numFullyOverlappedAssignments++;
		}

		// Check for partial overlap. (2s < 1s <= 2e)
		if (firstElfStart <= secondElfEnd) {
			numPartlyOverlappedAssignments++;
		}
	}

	// If both elves start with the same camp, then at least one's assigned range is a superset.
	else {

		// Increment both counts (superset = fully and partly overlapping).
		numFullyOverlappedAssignments++;
		numPartlyOverlappedAssignments++;
	}
});

// Part 1 Answer

// Print the number of fully overlapped assignments pairs.
console.log(`There are ${numFullyOverlappedAssignments} assignment pairs where one range fully contains the other.`);

// Part 2 Answer

// Print the number of (at least) partly overlapped assignment pairs.
console.log(`There are ${numPartlyOverlappedAssignments} assignment pairs where the ranges overlap.`);