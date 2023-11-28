d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json').then(data => {

    // Extract data properties
    const baseTemp = data.baseTemperature;
    const monthlyData = data.monthlyVariance;

    // Set up chart dimensions
    const width = 1200;
    const height = 500;
    const padding = 60;

    // Create SVG container
    const svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(monthlyData, d => d.year), d3.max(monthlyData, d => d.year)])
      .range([padding, width - padding]);

    const yScale = d3.scaleBand()
      .domain(monthlyData.map(d => d.month))
      .range([padding, height - padding])
      .padding(0.1);

    const colorScale = d3.scaleQuantize()
      .domain([d3.min(monthlyData, d => baseTemp + d.variance), d3.max(monthlyData, d => baseTemp + d.variance)])
      .range(d3.schemeRdYlBu[9]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0, ' + (height - padding) + ')')
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + padding + ', 0)')
      .call(yAxis);

    // Create cells
    svg.selectAll('.cell')
      .data(monthlyData)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(d.year))
      .attr('y', d => yScale(d.month))
      .attr('width', (width - 2 * padding) / (d3.max(monthlyData, d => d.year) - d3.min(monthlyData, d => d.year)))
      .attr('height', yScale.bandwidth())
      .attr('data-year', d => d.year)
      .attr('data-month', d => d.month - 1) // Adjusting month to be 0-based
      .attr('data-temp', d => baseTemp + d.variance)
      .style('fill', d => colorScale(baseTemp + d.variance))
      .on('mouseover', function(d) {
        const tooltip = d3.select('#tooltip');
        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9);
        tooltip.html(`${d.year} - ${d3.timeFormat('%B')(new Date(2000, d.month - 1))}<br>${(baseTemp + d.variance).toFixed(2)}°C<br>${d.variance.toFixed(2)}°C`)
          .attr('data-year', d.year)
          .style('left', (d3.event.pageX + 5) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        const tooltip = d3.select('#tooltip');
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });

    // Create legend
    const legendColors = colorScale.range().map(color => colorScale.invertExtent(color));
    const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', 'translate(' + (width - 300) + ',20)');

    legend.selectAll('rect')
      .data(legendColors)
      .enter()
      .append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('x', (d, i) => i * 20)
      .attr('fill', d => colorScale(d[0]));

    // Optional: Add legend labels
    // legend.selectAll('text')
    //   .data(legendColors)
    //   .enter()
    //   .append('text')
    //   .text(d => d[0].toFixed(2))
    //   .attr('x', (d, i) => i * 20)
    //   .attr('y', 30);

  }).catch(error => console.error('Error fetching data:', error));