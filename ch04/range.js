function range(start, end, step){
	step = step ? step : 1;
	var range = [];

	for(var i = start; (step > 0) ? (i <= end) : (i >= end); i = i + step){
		range.push(i);
	}
	
	return range;
}

function sum(numbers){
	return numbers.reduce(function(previousValue, currentValue, index, array){
		return previousValue + currentValue;
	});
}

console.log(sum(range(1, 10)));
console.log(range(1, 10, 2));
console.log(range(5, 2, -1));
