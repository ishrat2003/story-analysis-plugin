var lcColor = {
  "proper_noun": "#9FEE15",
  "noun": "#87CA11",
  "adjective": "#F06B08",
  "adverb": "#FB4C37",
  "verb": "#58BBF5",
  "positive": "E4F633",
  "negative": "#F7C27C"
};
function displayLc(data){
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 460 - margin.left - margin.right,
  height = 460 - margin.top - margin.bottom,
  innerRadius = 100,
  outerRadius = Math.min(width, height) / 4;   // the outerRadius goes from the middle of the SVG area to the border

  // append the svg object
  var svg = d3.select("#lcVizualization")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
  
  // X scale: common for 2 data series
  var x = d3.scaleBand()
    .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
    .align(0)                  // This does nothing
    .domain(data.map(function(d) { return d.name; })); // The domain of the X axis is the list of states.

  // Y scale outer variable
  var y = d3.scaleRadial()
    .range([innerRadius, outerRadius])   // Domain will be define later.
    .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

  // Second barplot Scales
  var ybis = d3.scaleRadial()
    .range([innerRadius, 1])   // Domain will be defined later.
    .domain([0, 100]);

  // Add the bars
  // svg.append("g")
  //   .selectAll("path")
  //   .data(data)
  //   .enter()
  //   .append("path")
  //   .attr("fill", "#69b3a2")
  //   .attr("class", "yo")
  //   .attr("d", d3.arc()     // imagine your doing a part of a donut plot
  //       .innerRadius(innerRadius)
  //       .outerRadius(function(d) { return y(d.size); })
  //       .startAngle(function(d) { return x(d.name); })
  //       .endAngle(function(d) { return x(d.name) + x.bandwidth(); })
  //       .padAngle(0.01)
  //       .padRadius(innerRadius));
  
  //Add the labels
  svg.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
      .style("fill", function(d){return lcColor[d.color];})
      .attr("text-anchor", function(d) { return (x(d.name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function(d) { return "rotate(" + ((x(d.name) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.size)+10) + ",0)"; })
    .append("text")
      .text(function(d){return(d.name)})
      .attr("transform", function(d) { return (x(d.name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "11px")
      .attr("alignment-baseline", "middle");

  //Add the second series
  svg.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("fill", function(d) { return lcColor[d.color]; })
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
      .innerRadius( function(d) { return ybis(0) })
      .outerRadius( function(d) { return ybis(d.size); })
      .startAngle(function(d) { return x(d.name); })
      .endAngle(function(d) { return x(d.name) + x.bandwidth(); })
      .padAngle(0.01)
      .padRadius(innerRadius));
}
