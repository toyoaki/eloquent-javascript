/*
Chapter 3
Recursion
*/

function isEven(N){
	if(N < 0) 
		return isEven(N * -1);
	else if(N == 0) 
		return true;
	else if(N == 1) 
		return false;
	else 
		return isEven(N - 2);
}

console.log(isEven(50))
console.log(isEven(75))
console.log(isEven(-1))
console.log(isEven(-100))
