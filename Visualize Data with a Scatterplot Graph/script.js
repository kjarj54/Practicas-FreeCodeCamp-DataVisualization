// script.js
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// Fetch data
d3.json(url)
  .then(data => {
    // Your D3 code here to create the scatter plot

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const svg = d3.select('#chart-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales and axes
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)])
      .range([0, width]);

    const yScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.Seconds * 1000)))
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

    // Append axes to the SVG
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .call(yAxis);

    // Create dots
    svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
      .attr('r', 5)
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => new Date(d.Seconds * 1000))
      .on('mouseover', showTooltip)
      .on('mouseout', hideTooltip);
  })
  .catch(error => console.error('Error loading data:', error));

function showTooltip(d) {
  const tooltip = d3.select('#chart-container')
    .append('div')
    .attr('id', 'tooltip')
    .attr('class', 'tooltip')
    .html(`<strong>${d.Name}</strong><br>Year: ${d.Year}<br>Time: ${d.Time}`);

  tooltip.transition()
    .duration(200)
    .style('opacity', 0.9);

  tooltip.style('left', (d3.event.pageX + 5) + 'px')
    .style('top', (d3.event.pageY - 28) + 'px')
    .attr('data-year', d.Year);
}

function hideTooltip() {
  d3.select('#tooltip').remove();
}
