$(document).foundation();

var snap = Snap("#svg");
//var bigCircle = snap.circle(150, 150, 100);
var bigCircle = snap.paper.polyline([103, 211], [292, 214], [308, 83], [65, 104]);
///var background = snap.paper.rect(0,0, 912,912).attr({fill: pattern});

bigCircle.attr({
    fill: "#bada55",
    stroke: "#000",
    strokeWidth: 5
});