// Load data
Promise.all([
    d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'),
    d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
  ]).then(([countyData, educationData]) => {
    // Append the title and description
    d3.select('#title').text('US Choropleth Map');
    d3.select('#description').text('Percentage of Adults with Bachelor\'s Degree or Higher (2010-2014)');

    // Create a color scale
    const colorScale = d3.scaleQuantize()
      .domain([0, d3.max(educationData, d => d.bachelorsOrHigher)])
      .range(d3.schemeBlues[5]);

    // Append counties
    d3.select('#choropleth')
      .selectAll('path')
      .data(topojson.feature(countyData, countyData.objects.counties).features)
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('data-fips', d => d.id)
      .attr('data-education', d => {
        const county = educationData.find(e => e.fips === d.id);
        return county ? county.bachelorsOrHigher : 0;
      })
      .attr('fill', d => colorScale(
        educationData.find(e => e.fips === d.id).bachelorsOrHigher
      ))
      .attr('d', d3.geoPath())
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);

    // Append legend
    const legendColors = colorScale.range();
    d3.select('#legend')
      .selectAll('.legend-item')
      .data(legendColors)
      .enter()
      .append('div')
      .attr('class', 'legend-item')
      .style('background-color', d => d)
      .text(d => {
        const extent = colorScale.invertExtent(d);
        return `${extent[0].toFixed(1)}% - ${extent[1].toFixed(1)}%`;
      });

    // Tooltip functions
    function handleMouseOver(event, d) {
      const county = educationData.find(e => e.fips === d.id);
      const tooltip = d3.select('#tooltip');
      tooltip.html(`<strong>${county.area_name}, ${county.state}</strong><br>${county.bachelorsOrHigher}%`);
      tooltip.style('left', (event.pageX + 10) + 'px');
      tooltip.style('top', (event.pageY - 10) + 'px');
      tooltip.style('display', 'block');
    }

    function handleMouseOut() {
      d3.select('#tooltip').style('display', 'none');
    }
  });