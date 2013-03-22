
var margin = {top: 30, right: 10, bottom: 10, left: 10},
    width = 1060 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var offenseX = width/2 + 50;
var defenseX = width/2 - 50;
var positions = [
                        {name: 'FS', point: [160, 200], count: 0},
                        {name: 'FS', point: [160, 380], count: 0},
                        {name: 'CB', point: [250, 110], count: 0},
                        {name: 'CB', point: [250, 460], count: 0},
                        {name: 'DB', point: [200, 290], count: 0},
                        {name: 'LB', point: [350, 190], count: 0},
                        {name: 'LB', point: [350, 290], count: 0},
                        {name: 'LB', point: [350, 390], count: 0},
                        {name: 'DE', point: [defenseX, 190], count: 0},
                        {name: 'DE', point: [defenseX, 390], count: 0},
                        {name: 'DT', point: [defenseX, 240], count: 0},
                        {name: 'DT', point: [defenseX, 340], count: 0},
                        {name: 'T', point: [offenseX, 190], count: 0},
                        {name: 'T', point: [offenseX, 390], count: 0},
                        {name: 'TE', point: [590, 440], count: 0},
                        {name: 'G', point: [offenseX, 240], count: 0},
                        {name: 'G', point: [offenseX, 340], count: 0},
                        {name: 'C', point: [offenseX, 290], count: 0},
                        {name: 'QB', point: [650, 290], count: 0},
                        {name: 'WR', point: [750, 110], count: 0},
                        {name: 'WR', point: [750, 460], count: 0},
                        {name: 'FB', point: [710, 260], count: 0},
                        {name: 'RB', point: [790, 290], count: 0},
                        {name: 'K', point: [950, 240], count: 0},
                        {name: 'P', point: [950, 340], count: 0}
                       ]

var offense = ['T', 'G', 'C', 'QB', 'WR', 'FB', 'RB', 'K', 'P', 'TE'];
var defense = ['FS', 'CB', 'DB', 'LB', 'DE', 'DT'];

var csvData, startYear, endYear, yearDividers, playerCircles, positionCircles;
var yPositions = {};
var radius = 5;
var vizMode = "individual"; //individual = show all the draft picks, group = grouped by position
var leftBuffer = 30; 

 
//Custom interpolation so faded colors are assigned to round > 10   
var categoryRange = d3.scale.category20().range();
var colorRange = _.filter(categoryRange, function(color, index) { return index % 2 == 0 });
colorRange = colorRange.concat( _.filter(categoryRange, function(color, index) { return index % 2 == 1 }) );
var color = d3.scale.ordinal()
                     .domain(_.range(1, 21))
                     .range(colorRange);
                     
var positionColor = d3.scale.quantize()
                            .range(colorbrewer.Blues[9]);
                            
var labelColor = "#174545";

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Use 2 groups for 2 separate graph views
var heatmap = svg.append("g")
var individual = svg.append("g");
//var heatmap = svg.append("g"); //.style("display", "none");
var positionCircles = heatmap.selectAll("circle")
         .data(positions)
      .enter().append("circle")
         .style("stroke-width", 0.5)
         .attr("r", 0)
         .attr("cx", function(d) { return d.point[0]; })
         .attr("cy", function(d) { return d.point[1]; });
         
        
var individualLegends = individual.append("g").style("display", "none");
var heatmapLegends = heatmap.append("g").style("display", "none");

heatmapLegends.selectAll(".position")
        .data(positions)
      .enter().append("text")
        .attr("class", "position")
        .style("fill", labelColor)
        .attr("x", function(d, i) { return i < 12 ? (d.point[0] - 55) : (d.point[0] + 30); })
        .attr("y", function(d) { return d.point[1] + 4; })
        .text(function(d) { return d.name; });
        
heatmapLegends.selectAll(".label")
        .data(positions)
      .enter().append("text")
        .attr("class", "label")
        .style("fill", labelColor)
        .attr("x", function(d, i) { return i < 12 ? (d.point[0] - 55) : (d.point[0] + 30); })
        .attr("y", function(d) { return d.point[1] + 16; })
        .text("");

individualLegends.selectAll("circle")
      .data(_.range(1, 21))
    .enter().append("circle")
      .attr("r", radius)
      .attr("cx", function(d, i) { return 100 + (i * 40); })
      .attr("cy", -14)
      .style("fill", function(d) { return color(d); });
      
individualLegends.append("text")
      .style("fill", labelColor)
      .attr("x", 20)
      .attr("y", -10)
      .text('Rounds: ');
      
individualLegends.selectAll(".individualLegends")
      .data(_.range(1, 21))
   .enter().append("text")
      .attr("class", "individualLegends")
      .style("fill", function(d) { return color(d); })
      .attr("x", function(d, i) { return 78 + (i * 40); })
      .attr("y", -10)
      .text(function(d) { return d; });
      


    
drawLine(0, 0, width, 0, 1); 
drawLine(0, 0, 0, height, 1); 
drawLine(0, height, width, height, 1); 
drawLine(width, 0, width, height, 1); 
var mid = drawLine(0, height/2, width, height/2, 0);
var midHeat = drawLine(width/2, 0, width/2, height, 0);

individualLegends.selectAll(".fieldLabel")
      .data(['OFFENSE', 'DEFENSE'])
    .enter().append("text")
      .attr("class", "fieldLabel")
      .attr("fill", labelColor)
      .attr("transform", function(d, i) { return "translate("  + (16) + "," + ((height/2 * i) + height/3) + ")" + "rotate(270, 0, 0)" ; })
      .text("");
      
heatmapLegends.selectAll(".fieldLabel")
      .data(['DEFENSE', 'OFFENSE'])
    .enter().append("text")
      .attr("class", "fieldLabel")
      .attr("fill", labelColor)
      .attr("x", function(d, i) { return width/4 + (width/2 * i); })
      .attr("y", height - 20)
      .text("");


function filterByRound(round) {
  if ( round == 'All' ) {
    playerCircles.transition().attr('r', 5).duration(500);
  } else if ( round == '8 and above') {
    playerCircles.each(function(d) {
      if ( d.Rnd >= 8 ) {
        d3.select(this).transition().attr('r', 5).duration(500);
      } else {
        d3.select(this).transition().attr('r', 0).duration(500);
      }
    });
    
  } else {
    playerCircles.each(function(d) {
      if ( d.Rnd != round ) {
        d3.select(this).transition().attr('r', 0).duration(500);
      } else {
        d3.select(this).transition().attr('r', 5).duration(500);
      }
    });
  }
}

function filterByPosition(position) {
  if ( position == 'All' ) {
    playerCircles.transition().attr('r', radius).duration(500);
  } else {
    playerCircles.each(function(d) {
      if ( d.Pos != position ) {
        d3.select(this).transition().attr('r', 0).duration(500);
      } else {
        d3.select(this).transition().attr('r', radius).duration(500);
      }
    });
  }
}
//Filter by given range
function filterByYear(startYr, endYr) {
  
  positions.forEach(function(pos) {
    pos.count = 0;
  });
  var filtered = csvData.filter(function(d) { return (d.Year && d.Year >= startYr && d.Year <= endYr); });
  filtered.forEach(function(player) {
    var position = player.Pos;
    
    positions.forEach(function(row) {
      if ( row.name == position )
        row.count += 1;
    });
  });
  var counts = positions.map(function(d) { return d.count; });
  positionColor.domain(d3.extent(counts));
  positionCircles.each(function(d) {
    d3.select(this).style("fill", function() { return positionColor(d.count); });
  });
  heatmapLegends.selectAll(".label").each(function(d) {
    d3.select(this).text(function() { return "(" + d.count + ")"; });
  });
}

function attachTooltips() {
  $(".playerCircle").tooltip({ position: { my: "left+15 center", at: "top center" }, show: true });
}

function tooltipText(d) {
  return (d[''] + " (" +  d.Year + ")<br/>Round: " + d.Rnd + ", Position: " + d.Pos + "<br/>College: " + d['College/Univ']);      
}
     
function cleanup() {
  individual.selectAll(".playerCircle").remove();
  individual.selectAll(".yearDivider").remove();
  individual.selectAll(".yearLabel").remove();
  positions.forEach(function(pos) {
    pos.count = 0;
  });
}

function loadCSV(team) {
  var file = "draftdata/" + team + ".csv";
  cleanup();
  d3.csv(file, function(data) {
    var year = 0;
    csvData = data.filter(function(d) { return (d.Year && d.Pos && d.Year != 'Year') && d.Year > 1959 }); //extract real data, sans the header for each year
    csvData.forEach(function(player) {
      var position = player.Pos;
      year = player.Year;
      if ( position == 'NT' )
        console.log("Position is NT for " + player['']);
      if ( position == 'HB' )
        position = 'RB';
      else if ( position == 'DL' )
        position = 'DT';
      else if ( position == 'NT' )
        position = 'DT';
      else if ( position == 'OL' )
        position = 'T';
      else if ( position == 'ILB' )
        position = 'LB';
      else if ( position == 'SS' )
        position = 'FS';
      else if ( position == 'OLB' )
        position = 'LB';
      else if ( position == 'E' )
        position = 'WR' //60s and earlier
      else if ( position == 'B' ) //Back of somekind
        position = 'RB';
      else if ( position == 'SE' ) //Split END
        position = 'WR';
      player.Pos = position;
      
      positions.forEach(function(row) {
        if ( row.name == position ) {
          row.count += 1;
          //console.log("Matched to : " + row.name);
        }
      });
      if ( !endYear )
        endYear = parseInt(year);
      
      startYear = parseInt(year);
    });
    attachXYpositions();
    console.log("Drawing...");    
    draw();    
  });
}

//Memoize the yPosition into d itself so it can be re-used in transitions without recomputing every time
function attachXYpositions() {
  var years = _.range(startYear, endYear + 1);
  _.each(years, function(year) {
    yPositions[year] = {'defense': [height/2], 'offense': [height/2]};
  });
  csvData.forEach(function(player) {
    player.yPosition = yearY(player);
    player.xPosition = yearX(player);
  })
}

function drawIndividual() {
  individualLegends.transition()
          .delay(700)
          .style("display", "block");
          
  heatmapLegends.transition()
          .delay(700)
          .style("display", "none");
          
  positionCircles.transition()
      .duration(700)
      .attr("r", 0);
      
  individual.selectAll(".fieldLabel").transition()
      .delay(500)
      .text(function(d) { return d; });
  
  mid.transition()
      .delay(500)
      .duration(100)
      .style("stroke-width", 1);
      
  midHeat.transition()
      .duration(700)
      .style("stroke-width", 0);
      
  playerCircles.transition()
      .delay(500)
      .attr("r", radius)
      .duration(700)
      .attr("cy", function(d) { return d.yPosition; });
      
  individual.selectAll(".yearDivider").transition()
      .delay(500)
      .duration(700)
      .attr("y1", 0)
      .attr("y2", height - 40);
      
      
  _.each(yPositions, function(year) {
    year = {"offense": [], "defense": []};
  });
}

function drawHeatmap() {
  individualLegends.transition()
          .delay(700)
          .style("display", "none");
          
  heatmapLegends.transition()
          .delay(700)
          .style("display", "block");

      
  playerCircles.transition()
      //.delay(delay)
      .duration(700)
      .attr("r", 0)
      .attr("cy", height/2);
      
  individual.selectAll(".yearDivider").transition()
      .duration(700)
      .attr("y1", height/2)
      .attr("y2", height/2);
      
  // individual.selectAll(".yearLabel").transition()
  //     .duration(700)
  //     .text("");
      
  mid.transition()
    .duration(700)
    .style("stroke-width", 0);

  midHeat.transition()
      .delay(500)
      .duration(100)
      .style("stroke-width", 1);
      
  // positionLabels.transition()
  //     .delay(700)
  //     .text(function(d) { return d.name; });
    
  heatmap.selectAll(".fieldLabel").transition()
      .delay(700)
      .text(function(d) { return d; })
      
  positionCircles.transition()
      .delay(500)
      .duration(700)
      .attr("r", 25);
      
  // labels.transition()
  //     .delay(700)
  //     .text(function(d) { return "(" + d.count + ")"; });
}

//1. assume data is already bound to playerCircles and positionCircles
//2. playerCircles.transition() to appear in view, 
function draw() {
  //Individual
    setupYears(startYear, endYear);
    playerCircles = individual.selectAll(".playerCircle")
      .data(csvData)
    .enter().append("circle")
      .attr("r", 0)
      .attr("cx", function(d) { return d.xPosition; })
      .attr("cy", height/2)
      .style("fill", function(d) { return color(d.Rnd); })
      .attr("class", "playerCircle")
      .attr("title", tooltipText)
      .on("mouseover", mouseOver)
      .on("mouseout", mouseOut);
    attachTooltips();
    redraw('individual');
    

    initSlider(startYear, endYear);
    initDecadeLinks(startYear, endYear);
    
    var counts = positions.map(function(d) { return d.count; });
    positionColor.domain(d3.extent(counts));
    positionCircles.each(function(d) {
      d3.select(this).style("fill", function() { return positionColor(d.count); });
    });
    heatmapLegends.selectAll(".label").each(function(d) {
      d3.select(this).text(function() { return "(" + d.count + ")"; });
    });
  
}

function redraw(mode) {
  if ( mode == 'individual' ) {
    $("#round-filter").show();
    $("#decade-filter").hide();
    $("#sliderContainer").hide();
    drawIndividual();
  } else {
    $("#round-filter").hide();
    $("#decade-filter").show();
    $("#sliderContainer").show();
    drawHeatmap();
  }
}

function mouseOver(d) {
  d3.select(this).style('stroke-width', 2);
}

function mouseOut(d) {
  d3.select(this).style('stroke-width', 0);
}

//Custom delay based on the year of the draft, mimics propagation of draft from left to right
function delay(d) {
  var years = (endYear + 1) - startYear;
  var counter = d.Year - startYear;
  return counter * 10;
}
    

//For given year value, return the x position
function yearX(d) {
  console.log("Calling yearXX");
  var years = (endYear + 1) - startYear;
  var yearWidth = (width - leftBuffer)/ years;
  var counter = d.Year - startYear;
  return leftBuffer + yearWidth * counter;
}

//For given year value, retuen the position
function yearY(d) {
  var isOffensive = _.find(offense, function(position) { return position == d.Pos; });
  var isDefensive = _.find(defense, function(position) { return position == d.Pos; });
  var last, available;
  if ( isOffensive ) {
    last = _.last(yPositions[d.Year]['offense']);
    available = last - 2*radius;
    yPositions[d.Year]['offense'].push(available)
  } else if ( isDefensive ) {
    last = _.last(yPositions[d.Year]['defense']);
    available = last + 2*radius;
    yPositions[d.Year]['defense'].push(available)
  } else {
    console.log("Not found for: " + d.Pos);
    last = _.last(yPositions[d.Year]['defense']);
    available = last + 2*radius;
    yPositions[d.Year]['defense'].push(available)
  }
  return available;
}

function handleSlide(ui) {
  $("#info p").html("[" + ui.values[0] + " .. " + ui.values[1] + "]");
  filterByYear(ui.values[0], ui.values[1]);
}

function slideByDecade(min, max) {
  $("#slider").slider("values", [min, max]);
}

function initSlider(min, max) {
  $("#slider").slider({
    orientation: "horizontal",
    range: true,
    min: min,
    max: max,
    values: [min, max],
    slide: function (event, ui) {
      handleSlide(ui);
    },
    change: function (event, ui) {
      handleSlide(ui);
    }
  });
}

function initDecadeLinks() {
  $("#info p").html("[" + startYear + " .. " + endYear + "]");
  $("#start span").text(startYear);
  $("#end span").text(endYear);
  var $links = $("#decade-links");
  var sStart = startYear.toString();
  var decadeStart = parseInt(sStart[2]);
  $links.html("");
  if ( parseInt(sStart[0]) == 1) {
    var range = _.range(decadeStart, 10);
    _.each(range, function(d) {
      var str = d.toString() + "0";
      var li = "<li><a href=\"#" + str +  "\">" + str + "s</a></li>"
      $links.append(li);
    });
  }
  $links.append("<li><a href=\"#2000\">2000s</a></li>");
  $links.append("<li><a href=\"#2010\">2010s</a></li>");
  $links.prepend("<li class=\"active\"><a href=\"#\">All</a></li>");
}


function setupYears(min, max) {
  //Clear existing

  console.log("Start.." + min + "...End" + max);
  var years = _.range(min, max + 1);
  var yearWidth = (width - leftBuffer) / years.length;
  individual.selectAll(".yearDivider")
      .data(years)
    .enter().append("line")
      .attr("class", "yearDivider")
      .attr("x1", function(d, i) { return leftBuffer + i * yearWidth; })
      .attr("y1", height/2)
      .attr("x2", function(d, i) { return leftBuffer + i * yearWidth; })
      .attr("y2", height/2)
      .style("stroke", "#9FC7DF")
      .style("stroke-width", 1);
      
  individualLegends.selectAll(".yearLabel")
      .data(years)
    .enter().append("text")
      .attr("class", "yearLabel")
      .attr("transform", function(d, i) { return "translate("  + (leftBuffer + 6 + i*yearWidth) + "," + (height - 4) + ")" + "rotate(270, 0, 0)" ; })
      .attr("fill", 174545)
      .text(function(d) { return d; });
}

function drawLine(x1, y1, x2, y2, width) {
  return svg.append("line")
    .attr('x1', x1)
    .attr("x2", x2)
    .attr("y1", y1)
    .attr("y2", y2)
    .style("stroke", "#000")
    .style("stroke-width", width);
}

function drawText(x, y, text) {
  svg.append("text")
    .attr("x", x)
    .attr("y", y)
    .attr("fill", "#000")
    .text(text);
    
}

$(function() {
  $(".playerCircle").tooltip();
  $(".dropdown-menu a").on("click", function(e) {
    e.preventDefault();
    var $team = $(e.currentTarget).data('team');
    var $fullname = $(e.currentTarget).html();
    $("#logo img").attr("src", "logos/" + $team + ".gif");
    $("#logo").show();
    $("#selected").html($fullname);
    $(':radio[name=VizMode]')[0].checked = true;
    loadCSV($team);
  });
  
  $(":radio").on("change", function(e) {
    var $selected = $(e.currentTarget).val();
    redraw($selected);
  });
  
  $(".btn-small").on("click", function(e) {
    var $toggle = $(e.currentTarget).text();
    if ( $toggle == 'Round' ) {
      $("#round-links").show();
      $("#position-links").hide();
    } else {
      $("#round-links").hide();
      $("#position-links").show();
    }
  });
  $("#round-filter").on("click", "#round-links a", function(e) {
    e.preventDefault();
    $("#round-links li.active").removeClass("active");
    $(e.currentTarget).parent().addClass("active");
    var $round = $(e.currentTarget).text();
    filterByRound($round);    
  });
  
  $("#round-filter").on("click", "#position-links a", function(e) {
    e.preventDefault();
    $("#position-links li.active").removeClass("active");
    $(e.currentTarget).parent().addClass("active");
    var $position = $(e.currentTarget).text();
    filterByPosition($position);    
  });
  
  $("#decade-filter").on("click", "#decade-links a", function(e) {
    e.preventDefault();
    $("#decade-links li.active").removeClass("active");
    $(e.currentTarget).parent().addClass("active");
    var $decade = $(e.currentTarget).attr('href');
    if ( $decade == '#90' )
      slideByDecade(1990, 1999);
    else if ( $decade == '#80' )
      slideByDecade(1980, 1989);
    else if ( $decade == '#70' )
      slideByDecade(1970, 1979);
    else if ( $decade == '#60' )
      slideByDecade(1960, 1969);
    else if ( $decade == '#50' )
      slideByDecade(1950, 1959);
    else if ( $decade == '#40' )
      slideByDecade(1940, 1949);
    else if ( $decade == '#30' )
      slideByDecade(1930, 1939);
    else if ( $decade == '#2000' )
      slideByDecade(2000, 2009);
    else if ( $decade == '#2010' )
      slideByDecade(2010, 2012);
    else
      slideByDecade(startYear, endYear);
    
  });
  
  //Init with a team selected in dropdown
  $(".dropdown-menu a")[0].click();
});
