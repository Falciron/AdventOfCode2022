/* Magic Numbers */

// Maximum size of directories that are good candidates for deletion.
const sizeThreshold = 100000;
// Total disk space available to the filesystem.
const totalSpace = 70000000;
// Disk space required for part two update.
const requiredSpace = 30000000;

// Finish reading the full text file containing the commands before proceeding.
const text = await Deno.readTextFile(Deno.args[0]);

// Split the text by new line character, allowing us to iterate over the commands.
const terminalOutputLines: string[] = text.split("\n");

// Sum of the size of all directories (including subdirectories) that fall under the size threshold.
let totalOfSmallDirectorySizes = 0;

// The size of the directory best suited for deletion to enable the update.
let minDirectorySize = 0;

// An array of the current path's (currently summed) directory sizes.
const currentPathDirectorySizes: number[] = [];

// An array of all fully summed directories' sizes.
const allDirectorySizes: number[] = [];

// Iterate over each terminal output line.
terminalOutputLines.forEach(terminalOutputLine => {

	// Split the terminal output line by space in order to get the individual words.
	const terminalOutputWords: string[] = terminalOutputLine.split(" ");

	// If the terminal output line starts with $, that indicates an input command.
	if (terminalOutputWords[0] === "$") {
		handleCommand(terminalOutputWords);
	}
	// Otherwise, we know it was content output.
	else {
		handleContent(terminalOutputWords);
	}
});

// Once we finish parsing all the output lines, we may not be back at root.

// Number of remaining directories in the path.
const numRemainingDirectories = currentPathDirectorySizes.length;

// Iterate over the remaining directories, moving up one level at a time.
for (let index = 0; index < numRemainingDirectories; index++){
	moveUpOneDirectory();
}

// Sort the array of directory sizes from smallest to largest.
allDirectorySizes.sort(function (a, b) {
	return a - b;
});

// Total size of the root directory and its contents.
const rootDirectorySize = allDirectorySizes[allDirectorySizes.length - 1];

// Minimum size of directory to clear for the update to proceed.
const sizeToClear = requiredSpace - (totalSpace - rootDirectorySize);

// If minimum size is negative, no additional space is needed.
if (sizeToClear <= 0) {
	console.log("No directories need to be deleted.");
}

// If it's positive, find the smallest directory that can be deleted to gain all the needed space.
else {
	// Iterate over the sorted directories (from smallest to largest).
	allDirectorySizes.every(directorySize => {

		// If the current directory is smaller than the size we're looking for, move on to the next.
		if (directorySize < sizeToClear) {
			return true;
		}
		// If it's the first directory we find that is larger than the size we're looking for, print that size and break the loop.
		else {
			minDirectorySize = directorySize;
			return false;
		}
	});
}

// (Part 1 Answer)

// Print the sum total of small directories.
console.log(`The sum total size of directories under the size threshold of ${sizeThreshold} is ${totalOfSmallDirectorySizes}.`);

// (Part 2 Answer)

// Print the size of the most suitable directory to be deleted.
console.log(`To allow the update to proceed, delete the directory with size ${minDirectorySize}.`);

/**
 * Actions taken when a directory has been fully tallied, and rolls up to the parent.
 */
function moveUpOneDirectory(): void {
	// Remove the current directory from the path while holding onto its size.
	const lastDirectorySize = currentPathDirectorySizes.pop();

	// If it has no size (for some reason), return early.
	if (lastDirectorySize === undefined) return;

	// Otherwise, add that directory's size to our array of directory sizes.
	allDirectorySizes.push(lastDirectorySize);

	// If the directory was smaller than our threshold, add it to our running total.
	if (lastDirectorySize <= sizeThreshold) {
		totalOfSmallDirectorySizes += lastDirectorySize;
	}

	// As long as we're not in the root directory, add the directory size to the parent directory.
	const currentPathLength = currentPathDirectorySizes.length;
	if (currentPathLength > 0) {
		currentPathDirectorySizes[currentPathLength - 1] += lastDirectorySize;
	}
}

/**
 * Parses commands from terminal output, ensuring that we move up and down the path array with cd commands.
 * @param commandWords An array of strings, with [0] being '$' and [1] being either 'cd' or 'ls'.
 */
function handleCommand(commandWords: string[]): void {
	// We only care about cd - that means we need to move up or down.
	if (commandWords[1] === "cd") {
		// '..' indicates that we need to finish the directory we're working in and then move up a directory in the path.
		if (commandWords[2] === "..") {
			moveUpOneDirectory();
		}
		// Anything else means we need to create a new directory, size 0 by default, and add it to the stack.
		else {
			currentPathDirectorySizes.push(0);
		}
	}
}

/**
 * Any lines that aren't prefaced with $ are content listings (either files or directories).
 * Parse a content listing and add its size to the current directory (if a file).
 * @param commandWords An array of strings, with [0] being either 'dir' or a number.
 */
function handleContent(commandWords: string[]): void {
	// dirs can be ignored, as they have no innate size.
	if (commandWords[0] !== "dir") {
		// Get the last index of the path directory array.
		const lastDirectoryIndex = currentPathDirectorySizes.length - 1;
		// Add the file size to the directory at that index.
		currentPathDirectorySizes[lastDirectoryIndex] += Number(commandWords[0]);
	}
}