var widthT=1000, heightT=500, trans_dur = 500;

var margin_ts = {top: 20, right: 20, bottom: 5, left: 42.5},
    width_ts = widthT - margin_ts.left - margin_ts.right,
    height_ts = heightT - margin_ts.top - margin_ts.bottom;


var svg = d3.select("#area_TimeSeries") 
            .append("svg")
            .attr("width", widthT + margin_ts.left + margin_ts.right)
            .attr("height", heightT + margin_ts.top + margin_ts.bottom);

var g = svg.append("g").attr("transform", "translate(" + margin_ts.left + "," + margin_ts.top + ")");

var parseDate = d3.timeParse("%m/%d/%Y"),
    formatDate = d3.timeFormat("%Y"),
    formatDate_tip = d3.timeFormat("%m/%d/%Y");

var x = d3.scaleTime()
    .rangeRound([0, width_ts]);

var y = d3.scaleLinear()
    .rangeRound([height_ts, 0]);

// legends
cat = [{name:"Non injured nor killed", col:"blue"}, 
        {name:"Injured", col:"green"}, 
        {name:"Killed", col:"red"}]

var legend = g.append("g")
  .attr("class", "x axis")
  .attr("text-anchor", "end")
  .selectAll("g")
  .data(cat)
  .enter().append("g")
  .attr("transform", function(d, i) { return "translate(" + (-150 + i * 60) + ",0)"; });

legend.append("rect")
  .attr("x", width_ts - 19)
  .attr("width", 13)
  .attr("height", 3)
  .style('fill', function(d) { return d.col; })
  .style('opacity', 0.5);
  
legend.append("text")
  .attr("x", width_ts - 24)
  .attr("y", 4.25)
  .text(function(d) { return d.name; })

var formatDecimal = d3.format(".3f");
// tip tool
var tip_non = d3.tip()
  .attr('class', 'd3-tip')
  .attr("transform", "translate(" + x(function(d) { return x(d.date); }) + "," + y(function(d) { return y(d.non); }) + ")")
  .offset([-10, 0])
  .html(function(d) { return "Date: " + formatDate_tip(d.date) + "<br/>" +  "Non injured or killed: "+ "&nbsp" + formatDecimal(d.non) + "<br/>"  + "Injured: " + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + formatDecimal(d.inj) + "<br/>"  + "Killed: " + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"  + formatDecimal(d.kill) ; });

var tip_inj = d3.tip()
  .attr('class', 'd3-tip')
  .attr("transform", "translate(" + x(function(d) { return x(d.date); }) + "," + y(function(d) { return y(d.inj); }) + ")")
  .offset([-10, 0])
  .html(function(d) { return "Date: " + formatDate_tip(d.date) + "<br/>" +  "Non injured or killed: "+ "&nbsp" + formatDecimal(d.non) + "<br/>"  + "Injured: " + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + formatDecimal(d.inj) + "<br/>"  + "Killed: " + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"  + formatDecimal(d.kill) ; });

var tip_kill = d3.tip()
  .attr('class', 'd3-tip')
  .attr("transform", "translate(" + x(function(d) { return x(d.date); }) + "," + y(function(d) { return y(d.kill); }) + ")")
  .offset([-10, 0])
  .html(function(d) { return "Date: " + formatDate_tip(d.date) + "<br/>" +  "Non injured or killed: "+ "&nbsp" + formatDecimal(d.non) + "<br/>"  + "Injured: " + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + formatDecimal(d.inj) + "<br/>"  + "Killed: " + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"  + formatDecimal(d.kill) ; });

g.call(tip_inj);  
g.call(tip_kill);
g.call(tip_non);   

var y_min = 0, y_max = 1;

// insert data
d3.json("data/ts/ts_ped_NYC.json", function(error, data) {
  data.forEach(function(d) { d.date = parseDate(d.date); });
  if (error) throw error;
  
  var line1 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.non); });

  var line2 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.inj); });

  var line3 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.kill); });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([y_min,y_max]);

  // 
  g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_ts + ")")
      .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));

  g.append("path")
    .attr("class", "ts line non")
    .datum(data)
    .attr("stroke", "blue")
    .attr("d", line1);

  g.append("path")
    .attr("class", "ts line inj")
    .datum(data)
    .attr("stroke", "green")
    .attr("d", line2);

  g.append("path")
    .attr("class", "ts line kill")
    .datum(data)
    .attr("stroke", "red")
    .attr("d", line3);

  // Add the scatterplot for tip-tool
  g.selectAll("dot")  
    .data(data)     
    .enter().append("circle")
    .attr("class", "tip inj")
    .style("fill","none")
    .style("stroke","none")
    .style("pointer-events","all")               
    .attr("r", 8)   
    .attr("cx", function(d) { return x(d.date); })     
    .attr("cy", function(d) { return y(d.inj); })   
    .on('mouseover', tip_inj.show)
    .on('mouseout', tip_inj.hide);

  g.selectAll("dot")  
    .data(data)     
    .enter().append("circle")
    .attr("class", "tip kill")
    .style("fill","none")
    .style("stroke","none")
    .style("pointer-events","all")               
    .attr("r", 8)   
    .attr("cx", function(d) { return x(d.date); })     
    .attr("cy", function(d) { return y(d.kill); })   
    .on('mouseover', tip_kill.show)
    .on('mouseout', tip_kill.hide);

  g.selectAll("dot")  
    .data(data)     
    .enter().append("circle")
    .attr("class", "tip non")
    .style("fill","none")
    .style("stroke","none")
    .style("pointer-events","all")               
    .attr("r", 8)   
    .attr("cx", function(d) { return x(d.date); })     
    .attr("cy", function(d) { return y(d.non); })   
    .on('mouseover', tip_non.show)
    .on('mouseout', tip_non.hide);
});

// Toggle values
var borough_ts = "NYC", type_ts = "ped", type_ts_2 = "all"

d3.select("#area_TimeSeries_level1").on("change", function() {
  borough_ts = this.value
  toggle_ts(file = "data/ts/ts_" + type_ts + "_" + borough_ts + ".json", cat = type_ts_2)
});
d3.select("#area_TimeSeries_level2").on("change", function() {
  type_ts = this.value
  toggle_ts(file = "data/ts/ts_" + type_ts + "_" + borough_ts + ".json", cat = type_ts_2)
});
d3.select("#area_TimeSeries_level3").on("change", function() {
  type_ts_2 = this.value
  toggle_ts(file = "data/ts/ts_" + type_ts + "_" + borough_ts + ".json", cat = type_ts_2)
});

// toggle function
function toggle_ts(file, cat, ymin = y_min, ymax = y_max) {
  d3.json(file, function(error, data) {
    data.forEach(function(d) { d.date = parseDate(d.date); });

  if (error) throw error;
  // scale the range of the data
  var line1 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.non); });

  var line2 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.inj); });

  var line3 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.kill); });

  // new domains
  x.domain(d3.extent(data, function(d) { return d.date; }));
  if (cat == "non") { y.domain(d3.extent(data, function(d) { return d.non; })); }
  else if (cat == "kill") { y.domain(d3.extent(data, function(d) { return d.kill; })); }
  else if (cat == "inj") { y.domain(d3.extent(data, function(d) { return d.inj; })); }
  else { y.domain([ymin,ymax]); }

  //Update bars
  g.selectAll("path.ts.line.non")
    .datum(data).attr("d", line1)
    .transition().duration(trans_dur)
    .attr("stroke", function(d) {            
        if (cat == "all") {return "blue"}  // <== Add these
        else if (cat == "non") {return "blue"}  // <== Add these
        else    { return "none" }          // <== Add these
    ;})

  g.selectAll("path.ts.line.inj")
    .datum(data).attr("d", line2)
    .transition().duration(trans_dur)
    .attr("stroke", function(d) {            
        if (cat == "all") {return "green"}  // <== Add these
        else if (cat == "inj") {return "green"}  // <== Add these
        else    { return "none" }          // <== Add these
    ;})

  g.selectAll("path.ts.line.kill")
    .datum(data).attr("d", line3)
    .transition().duration(trans_dur)
    .attr("stroke", function(d) {            
        if (cat == "all") {return "red"}  // <== Add these
        else if (cat == "kill") {return "red"}  // <== Add these
        else    { return "none" }          // <== Add these
    ;})

  // // update tips
  g.selectAll("circle.tip.kill")
    .data(data).transition().duration(trans_dur)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.kill); });
  g.selectAll("circle.tip.inj")
    .data(data).transition().duration(trans_dur)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.inj); });
  g.selectAll("circle.tip.non")
    .data(data).transition().duration(trans_dur)
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.non); });
  
  // Update Y axis
  g.select(".y.axis").transition().duration(trans_dur).call(d3.axisLeft(y));
  });
}