d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json').then(data => {
      // Set up the treemap
      const treemap = d3.treemap()
        .size([800, 600])
        .paddingInner(1);

      const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

      treemap(root);

      // Create SVG container
      const svg = d3.select('body')
        .append('svg')
        .attr('width', 900)
        .attr('height', 700);

      // Add tiles
      svg.selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
        .attr('class', 'tile')
        .attr('data-name', d => d.data.name)
        .attr('data-category', d => d.data.category)
        .attr('data-value', d => d.data.value)
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', (d, i) => d3.schemeCategory10[i % 10])
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip);

      // Add legend
      const legend = d3.select('#legend')
        .selectAll('.legend-item')
        .data(root.leaves())
        .enter()
        .append('div')
        .attr('class', 'legend-item');

      legend.append('div')
        .style('width', '15px')
        .style('height', '15px')
        .style('background-color', (d, i) => d3.schemeCategory10[i % 10]);

      legend.append('span')
        .text(d => d.data.name);

      // Tooltip functions
      function showTooltip(d) {
        const tooltip = d3.select('#tooltip');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`<strong>${d.data.name}</strong><br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
          .attr('data-value', d.data.value)
          .style('left', (d3.event.pageX + 5) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      }

      function hideTooltip() {
        d3.select('#tooltip').transition().duration(500).style('opacity', 0);
      }
    });
