/*
Chapter 3
Bean Counting
*/

function count(str, character){
	if(!str)
		return 0;

	var count=0;

	for(var i=0; i<str.length; i++){
		if(str.charAt(i) == character)
			count++;
	}

	return count;
}

function countBs(str){
	return count(str, "B");
}

console.log(count("abcdefdg", "d"));
console.log(countBs());
console.log(countBs(""));
console.log(countBs("abc"));
console.log(countBs("aBbcBaaBd"));
