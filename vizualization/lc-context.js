var lcColor = {
  "proper_noun": "#2d7b30",
  "noun": "#259328bf",
  "adjective": "#f58207",
  "adverb": "#616361",
  "verb": "#181b1d",
  "positive": "#ffd700",
  "negative": "#f71f07",
  "person": "#1b2bde",
  "location": "#784698",
  "organization": "#43a9a7",
  "others": "#5e615e",
};

function displayLc(data, statFiedName){
  console.log('displayLc', data);
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 400 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom,
  innerRadius = 100,
  outerRadius = Math.min(width, height) / 4;   // the outerRadius goes from the middle of the SVG area to the border

  d3.select("#lcVizualization").select("div").remove();

  // append the svg object
  var svg = d3.select("#lcVizualization")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
  
  var tooltip = d3.select("#lcVizualization").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 1);

  // X scale: common for 2 data series
  var x = d3.scaleBand()
    .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
    .align(0)                  // This does nothing
    .domain(data.map(function(d) { return d.pure_word  + '-' + d.count; })); // The domain of the X axis is the list of states.

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
  //   .attr("fill", function(d){return lcColor[d.color_group];})
  //   .attr("d", d3.arc()     // imagine your doing a part of a donut plot
  //       .innerRadius(innerRadius)
  //       .outerRadius(function(d) { return y(d[outerStatFiedName]); })
  //       .startAngle(function(d) { return x(d.pure_word + '-' + d.count); })
  //       .endAngle(function(d) { return x(d.pure_word + '-' + d.count) + x.bandwidth(); })
  //       .padAngle(0.01)
  //       .padRadius(innerRadius));
  
  //Add the labels
  svg.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
      .style("fill", function(d){return lcColor[d.color_group];})
      .attr("text-anchor", function(d) { return (x(d.pure_word + '-' + d.count) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function(d) { return "rotate(" + ((x(d.pure_word + '-' + d.count) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d[statFiedName])+10) + ",0)"; })
    .append("text")
      .text(function(d){return(d.pure_word + '-' + d.count)})
      .attr("transform", function(d) { return (x(d.pure_word + '-' + d.count) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "11px")
      .attr("alignment-baseline", "middle");

  //Add the second series
  svg.append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("fill", function(d) { return lcColor[d.color_group]; })
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
      .innerRadius( function(d) { return ybis(0) })
      .outerRadius( function(d) { return ybis(d[statFiedName]); })
      .startAngle(function(d) { return x(d.pure_word + '-' + d.count); })
      .endAngle(function(d) { return x(d.pure_word + '-' + d.count) + x.bandwidth(); })
      .padAngle(0.01)
      .padRadius(innerRadius));

    svg.selectAll('text')
      .on("mouseover", function(d) {
        console.log(d);
        var html = '<h3 style="color:green;" class="center">' + d.pure_word + '</h3>'
        + '<b>Category: </b>' + ( d.category || d.type || '') + '<br>'
        + '<b>Sentiment: </b>' + ( d.sentiment || '') + '<br>'
        + '<b>Occurrence: </b>' + d.count + '<br>'
        + '<b>Forward position weight: </b>' + d.position_weight_forward.toFixed(2) + '<br>'
        + '<b>Backward position weight: </b>' + d.position_weight_backward.toFixed(2) + '<br>';
        if (d.tooltip !== d.pure_word){
          html += '<p>' + d.tooltip + '</p>';
        }
        
        tooltip.style("display", "inline");	
        tooltip.transition()		
            .duration(200)		
            .style("opacity", .9);		
        tooltip.html(html);	
        })					
        .on("mouseout", function(d) {
            tooltip.style("display", "none");		
            tooltip.transition()
                .duration(500)		
                .style("opacity", 0);	
        })
}
