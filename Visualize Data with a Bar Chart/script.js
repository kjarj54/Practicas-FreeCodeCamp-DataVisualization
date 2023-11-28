fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => createChart(data.data));

  // Create the chart
  function createChart(dataset) {
    const width = 800;
    const height = 400;
    const padding = 50;

    // Create SVG container
    const svg = d3.select("#chart-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create x and y scales
    const xScale = d3.scaleTime()
      .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
      .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1])])
      .range([height - padding, padding]);

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", "translate(0, " + (height - padding) + ")")
      .attr("id", "x-axis")
      .call(xAxis);

    svg.append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .attr("id", "y-axis")
      .call(yAxis);

    // Create bars
    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .attr("class", "bar")
      .attr("x", d => xScale(new Date(d[0])))
      .attr("y", d => yScale(d[1]))
      .attr("width", (width - 2 * padding) / dataset.length)
      .attr("height", d => height - padding - yScale(d[1]))
      .on("mouseover", showTooltip)
      .on("mouseout", hideTooltip);

    // Create tooltip
    const tooltip = d3.select("#chart-container")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);

    // Show tooltip function
    function showTooltip(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(d[0] + '<br>' + '$' + d[1] + ' Billion')
        .attr("data-date", d[0])
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    }

    // Hide tooltip function
    function hideTooltip() {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0);
    }
  }
