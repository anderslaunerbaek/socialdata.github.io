var width = 800, height = 500, centered, trans_dur = 500;

var projection = d3.geoMercator()
                    .scale(55000)
                    .translate([width / 2 - 10, height / 2 - 10]);

var svg = d3.select("#area_KNN")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

d3.json("data/nyc.geojson", function(nyc_map) {
    // after loading geojson, use d3.geo.centroid to find out 
    // where you need to center your map
    var center = d3.geoCentroid(nyc_map);
    projection.center(center);
    // now you can create new path function with 
    // correctly centered projection
    var path = d3.geoPath().projection(projection);
    var g = svg.append("g");
    // and finally draw the actual polygons
    svg.selectAll("g")
        .attr("id", "boroughs")
        .selectAll(".state")
        .data(nyc_map.features)
        .enter()
        .append("path")
        .attr("class", function(d) { return d.properties.name; })
        .attr("d", path)
        .style("fill","white")
        .attr("stroke-width", 0.5)
        .style("stroke","black");

    // d3.json("data/knn_json.json", function(data) {
    d3.json("data/knn/knn_pre_json.json", function(data) {
        svg.selectAll("g")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "knn_circles")
            .attr("cx", function (d) {return projection([d.lon, d.lat])[0] ;})
            .attr("cy", function (d) {return projection([d.lon, d.lat])[1] ;})
            .attr("r", 1.75)
            .style('opacity', 1.0)
            .style("fill", function(d) {  if (d.class == 0) {return 'blue'} 
                                          else if (d.class == 1) {return 'green'} 
                                          else if (d.class == 2) {return 'red'} 
                                          else if (d.class == 3) {return 'black'} 
                                          else { return 'none' };});
        });

    // append legend
    d3.json('data/knn/knn_pre_leg_json.json', function(error, data) { 
      cat_knn = data
      // 
      var legend_knn = svg.append("g")
        .attr("class", "x axis")
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(cat_knn)
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 5) + ")"; });
      //
      legend_knn.append("circle")
        .attr("cx", width - 19)
        .attr("r", 2.5)
        .attr("cy", 0)
        .attr("width", 10)
        .attr("height", 1)
        .style('fill', function(d) { return d.col; })
        .style('opacity', 1.0);
      //  
      legend_knn.append("text")
        .attr("x", width - 24)
        .attr("y", 4)
        .text(function(d) { return d.name; })
    });
});

// Toggle values
var key_knn = "knn_class_all"

d3.select("#area_KNN_level1").on("change", function() {
  key_knn = this.value
  
  toggle_accidents(key = key_knn)
});

// toggle function
function toggle_accidents( key ) {      
  var p_color = "", s_color = "";
  if (key == "knn_class_0") {
    svg.selectAll("circle.knn_circles")
      .transition().delay(function(d, i) { return i * 0.25; }).duration(trans_dur)
      .style("fill", function(d) {  if (d.class == 0) {return 'blue'} 
                                    else if (d.class == 1) {return 'none'} 
                                    else if (d.class == 2) {return 'none'} 
                                    else if (d.class == 3) {return 'none'} 
                                    else { return 'none' };});
  } else if (key == "knn_class_1") {
    svg.selectAll("circle.knn_circles")
      .transition().delay(function(d, i) { return i * 0.25; }).duration(trans_dur)
      .style("fill", function(d) {  if (d.class == 0) {return 'none'} 
                                    else if (d.class == 1) {return 'green'} 
                                    else if (d.class == 2) {return 'none'} 
                                    else if (d.class == 3) {return 'none'} 
                                    else { return 'none' };});
  } else if (key == "knn_class_2") {
    svg.selectAll("circle.knn_circles")
      .transition().duration(trans_dur)
      .style("fill", function(d) {  if (d.class == 0) {return 'none'} 
                                    else if (d.class == 1) {return 'none'} 
                                    else if (d.class == 2) {return 'red'} 
                                    else if (d.class == 3) {return 'none'} 
                                    else { return 'none' };});
  } else if (key == "knn_class_3") {
    svg.selectAll("circle.knn_circles")
      .transition().delay(function(d, i) { return i * 0.25; }).duration(trans_dur)
      .style("fill", function(d) {  if (d.class == 0) {return 'none'} 
                                    else if (d.class == 1) {return 'none'} 
                                    else if (d.class == 2) {return 'none'} 
                                    else if (d.class == 3) {return 'black'} 
                                    else { return 'none' };});
  } else {
    svg.selectAll("circle.knn_circles")
      .transition().delay(function(d, i) { return i * 0.25; }).duration(trans_dur)
      .style("fill", function(d) {  if (d.class == 0) {return 'blue'} 
                                    else if (d.class == 1) {return 'green'} 
                                    else if (d.class == 2) {return 'red'} 
                                    else if (d.class == 3) {return 'black'} 
                                    else { return 'none' };});
  }
}

