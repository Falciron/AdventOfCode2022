// Finish reading the full text file containing the list of calories carried by the elves before proceeding.
const text = await Deno.readTextFile("./input.txt");

// Split the text by new line character, allowing us to iterate over the values.
const calorieStrings: string[] = text.split('\n');

// Create an array of integers to hold the total calorie count produced by each elf.
const totalCalories: number[] = [];

// Build a running total for each sublist of calories.
let currentCalorieTotal = 0;

// Iterate over each calorie string.
calorieStrings.forEach(calorieString => parseCurrentLine(calorieString));

// Parse a calorie string, ensuring it is accounted for properly.
function parseCurrentLine(calorieString: string) {
    // Convert the string into a number.
    const calorieNumber = Number(calorieString);

    // Number("") converts to 0. A 0 then indicates that a sublist is complete.
    // (This logic assumes all packed items have some calories.)
    if (calorieNumber == 0) {

        // Add the current totaled up calorie count to the array.
        totalCalories.push(currentCalorieTotal);

        // Reset the running total back to 0 in order to start totaling the next sublist.
        currentCalorieTotal = 0;
    }

    // A non-zero (positive) Number.
    else {
        // Add the current calorie amount to the running total for the sublist.
        currentCalorieTotal += calorieNumber;
    }
}

// After we run through all the entries, ensure the final running total is added to the array (no blank line at the end).
totalCalories.push(currentCalorieTotal);

// (Part 1 Answer)

// Calculate the max of the array of total calories.
const maxTotalCalories: number = Math.max(...totalCalories);

// Print the largest integer from the array of totalCalories (the largest amount of calories collected by a single elf).
console.log(`The elf carrying the most calories is carrying a total of ${maxTotalCalories} calories.`);

// (Part 2 Answer)

// Sort the array of total calories in descending order.
const sortedArray: number[] = totalCalories.sort((calTotal1: number, calTotal2: number) => calTotal2 - calTotal1);

// Add up the first (largest) three total calories.
const sumOfTopThreeTotalCalories = sortedArray[0] + sortedArray[1] + sortedArray[2];

// Print the combined total calories carried by the three elves with the most individual total calories.
console.log('The top three elves carrying the most calories are carrying a combined total of ' +
    `${sumOfTopThreeTotalCalories} calories.`);