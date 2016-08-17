/* globals XMLHttpRequest, d3 */

(function() {
  var dataURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

  var getData = function(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        callback(data);
      } else {
        // We reached our target server, but it returned an error
        console.log('The Server Returned an Error');
      }
    };
    request.onerror = function() {
      // There was a connection error of some sort
      console.log('There was a connection error');
    };
    request.send();
  };

  var handleData = function(data) {
    var margin = {top: 200, right: 200, bottom: 70, left: 100},
      width = 900 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

    var svg = d3.select('.chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    data.forEach(function(d) {
      d.Place = +d.Place;
      d.Seconds = +d.Seconds;
      d.Year = +d.Year;
    });

    var dataMax = d3.max(data, function(d) {
      return d.Seconds;
    });

    var dataMin = d3.min(data, function(d) {
      return d.Seconds;
    });

    var y = d3.scale.linear().domain([data.length, 0]).range([height, 0]);
    var x = d3.scale.linear().domain([dataMax, dataMin]).range([0, width]);
    var minutes = [60, 120, 180];
    var formatMinutes = function(min) { return Math.floor((min - dataMin) / 60) + ':00';}

    var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient('right')
                  .innerTickSize(-width)
                  .outerTickSize(0)
                  .ticks(0);

    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom")
                  .innerTickSize(-height)
                  .outerTickSize(0)
                  .tickPadding(10)
                  .tickValues(minutes.map(function(d) { return d + dataMin;}))
                  .tickFormat(formatMinutes);

    var xAxis2 = d3.svg.axis()
                  .scale(x)
                  .orient("top")
                  .innerTickSize(0)
                  .outerTickSize(0)
                  .tickPadding(10)
                  .tickValues(minutes.map(function(d) { return d + dataMin;}))
                  .tickFormat(formatMinutes);

    svg.selectAll("dot")
        .data(data)
        .enter().append("svg:circle")
        .attr('class', 'circ')
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.Seconds); })
        .attr("cy", function(d, i) { return y(i); });

    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(' + width + ',' + 0 + ')')
        .call(yAxis);

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate( 0,' + (height) + ')')
        .call(xAxis);

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate( 0,' + (0) + ')')
        .call(xAxis2);
  };

  // setup
  getData(dataURL, handleData);
})();
