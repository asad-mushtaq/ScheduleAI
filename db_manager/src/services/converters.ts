export function stringToInteger(num: String): number {
    if (isNaN(+num) || +num % 1 != 0) {
		throw new Error("Not a valid number"); 
	}
    return +num
}