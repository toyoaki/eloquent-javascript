function reverseArray(array){
	var reverse = [];
	for(var i = array.length - 1 ; i >= 0 ; i--){
		reverse.push(array[i]);
	}
	return reverse;
}

function reverseArrayInPlace(array){
	for(var i = 0; i < array.length/2; i++){
		var tailIndex = array.length - 1 - i;
		var a = array[i];
		var b = array[tailIndex];
		array[i] = b;
		array[tailIndex] = a;
	}
	return array;
}

console.log(reverseArray([4,5,6,7]));
console.log(reverseArrayInPlace([4,5,6,7]));
console.log(reverseArrayInPlace([4,5,6,7,8]));