var worldGrid = valley.grid;
var xTicks = worldGrid.width;
var yTicks = worldGrid.height;
var animationSpeed = 500;

var selection;
var svg;
var grid;
var width; // in px
var height; // in px
var oldElements = [];
var newElements = [];

init();

function init(){
	selection = d3.selectAll(".world-container");
	createSVG();
	drawGrid();
	window.setInterval(makeWorldAlive, animationSpeed);
}

function createSVG(){
	var container = selection.node().getBoundingClientRect();
	width = container.width;
	height = container.height;

	svg = selection.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "world");

	svg.append("defs")
		.append("polygon")
			.attr("id", "plant")
			.attr("points", getCellWidth()/2 + ",0 " + getCellWidth() + "," + getCellHeight() + " 0," + getCellHeight())
			.attr("class", "plant");		
}

function drawGrid(){
	grid = svg .append("g").attr("id", "world-grid").style("opacity", 0);
		
	drawXTicks();
	drawYTicks();

	function drawXTicks(){
		for(var i = 0; i <= xTicks; i++){
			var xPosition = getXCornerPosition(i);
			grid.append("line")
				.attr("x1", xPosition)
				.attr("y1", 0)
				.attr("x2", xPosition)
				.attr("y2", height)
				.attr("class", "grid-line");
		}
	}

	function drawYTicks(){
		for(var i = 0; i <= yTicks; i++){
			var yPosition = getYCornerPosition(i);
			grid.append("line")
				.attr("x1", 0)
				.attr("y1", yPosition)
				.attr("x2", width)
				.attr("y2", yPosition)
				.attr("class", "grid-line");
		}
	}
}

function toggleGrid(){
	var worldGrid = selection.select("#world-grid");
	if(0 == worldGrid.style("opacity")) worldGrid.style("opacity", 1);
	else worldGrid.style("opacity", 0);
}

function makeWorldAlive(){
	valley.turn();
	drawWorldElements();
}

function drawWorldElements(){
	oldElements = newElements;
	newElements = [];

	worldGrid.forEach(
		function(element, position){
			newElements.push(element);
			var elementGraphic = element.graphic;
			if(elementGraphic) elementGraphic.animate(position);
			else element.graphic = createGraphic(element, position);
		}, 
		this,
		removeDeadElements
	);
}

function createGraphic(element, position){
	var elementName = element.constructor.name;
	if("Wall" == elementName) return new WallGraphic(element, position);
	else if("PlantEater" == elementName) return new PlantEaterGraphic(element, position);
	else if("Plant" == elementName) return new PlantGraphic(element, position);
}

function removeDeadElements(){
	var deadElements = oldElements.filter(function(oldElement){return newElements.indexOf(oldElement) == -1});
	deadElements.forEach(function(element){
		var graphic = element.graphic.graphic;
		graphic
			.transition()
			.duration(animationSpeed)
				.style("opacity", 0)
			.each("end", function(){graphic.remove();}); 
	});
}

function WallGraphic(element, position){
	var graphic = svg.append("rect");
	graphic.attr("x", getXCornerPosition(position.x))
		.attr("y", getYCornerPosition(position.y))
		.attr("width", getCellWidth())
		.attr("height", getCellHeight())
		.attr("class", "wall");			
	this.graphic = graphic;
}

WallGraphic.prototype.animate = function(position){

}

function PlantGraphic(element, position){
	var graphic = svg.append("use");
	graphic.attr("xlink:href", "#plant")
		.attr("x", getXCornerPosition(position.x))
		.attr("y", getYCornerPosition(position.y))
		.attr("width", getCellWidth())
		.attr("height", getCellHeight())
		.style("opacity", 0);		
	graphic.transition()
		.duration(animationSpeed)
			.style("opacity", 1);
	this.graphic = graphic;
}

PlantGraphic.prototype.animate = function(position){

}

function PlantEaterGraphic(element, position){
	var x = position.x;
	var y = position.y;

	var graphic = svg.append("g");
	var circle = graphic.append("circle");
	circle.attr("cx", getXCenterPosition(x))
		.attr("cy", getYCenterPosition(y))
		.attr("class", "plant-eater")
		.attr("r", 0);
	circle.transition()
		.duration(animationSpeed)
			.attr("r", getCellSmallerSide()/2);

	var text = graphic.append("text");
		text
			.attr("x", getXCornerPosition(x))
			.attr("y", getYCornerPosition(y))
			.text(formatEnergy(element.energy));
	this.graphic = graphic;
	this.element = element;
}

PlantEaterGraphic.prototype.animate = function(position){
	var x = position.x;
	var y = position.y;

	var circle = this.graphic.select("circle");
	circle.transition()
		.duration(animationSpeed)
			.attr("cx", getXCenterPosition(x))
			.attr("cy", getYCenterPosition(y));	
	var text = this.graphic.select("text");
	text.text(formatEnergy(this.element.energy));
	text.transition()
		.duration(animationSpeed)
			.attr("x", getXCornerPosition(x))
			.attr("y", getYCornerPosition(y));
}

function formatEnergy(number){
	return d3.format(".1f")(number);
};

function getXCornerPosition(tickNumber){
	return tickNumber * width/xTicks;
}

function getYCornerPosition(tickNumber){
	return tickNumber * height/yTicks;
}

function getXCenterPosition(x){
	return getXCornerPosition(x) + getCellWidth()/2;
}

function getYCenterPosition(y){
	return getYCornerPosition(y) + getCellHeight()/2;
}

function getCellWidth(){
	return width/xTicks;
}

function getCellHeight(){
	return height/yTicks;
}

function getCellSmallerSide(){
	return getCellWidth() < getCellHeight() ? getCellWidth() : getCellHeight();
}
