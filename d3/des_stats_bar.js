// Width and height of the canvas
var w_bar = 1000, h_bar = 500, trans_dur = 500;
// Plotting margin
var margin_bar = {top: 20, right: 20, bottom: 87, left: 60};
var width_bar = w_bar - margin_bar.left - margin_bar.right;
var height_bar = h_bar - margin_bar.top - margin_bar.bottom;

// Set the ranges
var xScale_bar = d3.scaleBand().rangeRound([10, width_bar]).padding(0.05);
var yScale_bar = d3.scaleLinear().range([height_bar, 0]);

// Define the axis
var xAxis_bar = d3.axisBottom(xScale_bar);
var yAxis_bar = d3.axisLeft(yScale_bar);

//Create SVG element
var svg_bar = d3.select("#area_bar_stats") 
            .append("svg")
            .attr("width", width_bar + margin_bar.left + margin_bar.right)
            .attr("height", height_bar + margin_bar.top + margin_bar.bottom)
            .append("g")
            .attr("transform",  "translate(" + margin_bar.left + "," + margin_bar.top + ")");
// tip
var tip_bar = d3.tip().attr('class', 'd3-tip').offset([-10, 0])
    .html(function(d) { return "Frequency: " + d.value; });
svg_bar.call(tip_bar);  

// load initial NYC data
d3.json("data/bar/bar_dict_NYC.json", function(error, data) {
    // scale the range of the data
    xScale_bar.domain(data.map(function(d) { return d.key; }));
    yMax_bar = d3.max(data, function(d) { return d.value; });
    yScale_bar.domain([0, yMax_bar]);
    //Create bars
     svg_bar.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale_bar(d.key); })
        .attr("width", xScale_bar.bandwidth())
        .attr("y", function(d) { return yScale_bar(d.value); })
        .attr("height", function(d) { return height_bar - yScale_bar(d.value); })
        .style("fill", "teal")
        .style("hover", "black")
        .on('mouseover', tip_bar.show)
        .on('mouseout', tip_bar.hide);
    // add axis
    // x-axis
    svg_bar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_bar + ")")
        .call(xAxis_bar)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)" );
    // y-axis
    svg_bar.append("g").attr("class", "y axis").call(yAxis_bar);
});

// Toggle values
var borough_bar = "NYC", type_bar = ""

d3.select("#area_bar_stats_level1").on("change", function() {
  borough_bar = this.value
  toggle_bars(file = "data/bar/bar_dict_" + borough_bar + type_bar + ".json")
});
d3.select("#area_bar_stats_level2").on("change", function() {
  type_bar = this.value
  toggle_bars(file = "data/bar/bar_dict_" + borough_bar + type_bar + ".json")
});

// toggle between boroughs function
function toggle_bars(file) {
    d3.json(file, function(error, data) {
    // scale the range of the data
    yMax_bar = d3.max(data, function(d) { return d.value; });
    yScale_bar.domain([0, yMax_bar]);
    //Create bars
     svg_bar.selectAll("rect")
        .data(data) 
        .transition() 
        .delay(function(d, i) { return i * trans_dur/24; })
        .duration(trans_dur) 
        .attr("y", function(d) { return yScale_bar(d.value); })
        .attr("height", function(d) { return height_bar - yScale_bar(d.value); });
    //Update Y axis
    svg_bar.select(".y.axis").transition().duration(trans_dur).call(yAxis_bar);
    });
}
