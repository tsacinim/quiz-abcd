// const moment = require('moment')
const moment = window.moment;
// const PouchDB = require('pouchdb')
const PouchDB = window.PouchDB;
// const d3 = require('d3')
const d3 = window.d3;

// document.getElementById('startdate').value = '2016-08-28'
document.getElementById('startdate').value = moment().format('YYYY-MM-DD')
// document.getElementById('starttime').value = '16:00'
document.getElementById('starttime').value = moment().format('HH:mm')

document.getElementById('filter').addEventListener('click', filterTimeInterval)
document.getElementById('filter').addEventListener('touchend', filterTimeInterval)

syncGraphData()

function extract (list) {
  var a = 0
  var b = 0
  var c = 0
  var d = 0
  list.forEach(x => {
    if (x === 'A') a++
    if (x === 'B') b++
    if (x === 'C') c++
    if (x === 'D') d++
  })
  return [
    { letter: 'A', votes: a },
    { letter: 'B', votes: b },
    { letter: 'C', votes: c },
    { letter: 'D', votes: d }
  ]
}

function getPostsSince (when) {
  $.get('/stats', function(stats) {
    const qstats = stats.filter(x => x.key.quizChoice)
      .filter(x => x.id >= when)
      .map(x => x.key.quizChoice);
    const total = qstats.length
    const data = extract(qstats)
    showGraph(data, total)
  });
}

function filterTimeInterval () {
  const startMillis = Date.parse(document.getElementById('startdate').value + 
    ' ' + document.getElementById('starttime').value)
  getPostsSince(startMillis.toString())
}

function syncGraphData () {
  $.get('/stats', function(stats) {
    const qstats = stats
      .filter(x => x.key.quizChoice)
      .map(x => x.key.quizChoice);
    const total = qstats.length
    const data = extract(qstats)
    showGraph(data, total)
  });
}

function showGraph (data, total) {

  var margin = {top: 20, right: 20, bottom: 30, left: 40}
  var width = 280 - margin.left - margin.right
  var height = 200 - margin.top - margin.bottom

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1)

  var y = d3.scale.linear()
    .range([height, 0])

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickSize(0)

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5, '%')

  d3.select('#graph svg').remove()
  var svg = d3.select('#graph')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  x.domain(data.map(function (d) { return d.letter }))
  y.domain([0, d3.max(data, function (d) { return d.votes })])

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + (height + 5) + ')')
    .call(xAxis)
    .style('fill', 'darkgreen')
    .style('font-size', '20px')

  var bar = svg.selectAll('.bar')
    .data(data)
    .enter().append('g')
    .attr('class', 'bar')

  bar.append('rect')
    .attr('x', function (d) { return x(d.letter) })
    .attr('width', x.rangeBand())
    .attr('y', function (d) { return y(d.votes) })
    .attr('height', function (d) { return height - y(d.votes) })

  bar.append('text')
    .attr('dy', function (d) { return d.votes <= 3 ? '-.2em' : '1.3em' })
    .attr('dx', '1.4em')
    .attr('y', function (d) { return y(d.votes) })
    .attr('x', function (d) { return x(d.letter) })
    .attr('text-anchor', 'middle')
    .text(
      function (d) { return +(d.votes).toFixed(2) }
    )

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('x', 6)
    .attr('dy', '-0.71em')
    .attr('dx', '-.5em')
    .style('text-anchor', 'end')
    .text('Total  ' + total + '  votes')
    .style('fill', 'mediumaquamarine')
}
