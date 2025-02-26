import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
console.log("🚀 ~ container:", container);

// Load the CSV data
let data = await d3.csv("/waffle_houses_by_state.csv");
// console.log(data);
const counts = data.map((row) => parseInt(row.count));
const states = data.map((row) => row.state);
data = data.filter((row) => row.count > 0);

// Declare the chart dimensions and margins.
const marginTop = 30;
const marginRight = 0;
const marginBottom = 10;
const marginLeft = 100;
const width = window.innerWidth * 0.75;
const height = window.innerHeight * 0.75;
const fontSize = `${(Math.max((height / data.length) * 0.65), 14)}px`;

// Create the scales.
// https://d3js.org/d3-scale
const x = d3
  .scaleLinear() // quantitative data
  .domain([0, Math.max(...counts)])
  .range([marginLeft, width - marginRight]);

const y = d3
  .scaleBand() // categorical or ordinal data.
  .domain(d3.sort(data, (d) => -d.count).map((d) => d.state)) // high to low
  // .domain(d3.sort(data, (d) => d.state).map((d) => d.state))
  .rangeRound([marginTop, height - marginBottom])
  .padding(0.1);

// Create the SVG container.
const svg = d3
  .create("svg") // Same as document.createElement("svg")
  .attr("id", "graph") // Same as element.setAttribute("id", "graph")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", `max-width: 100%; height: auto; font-family: sans-serif;`);

// Make the bar for each state.
svg
  .append("g") // Creates and appends child element.
  .attr("fill", "#fff200")
  .attr("stroke", "black")
  .attr("stroke-width", 1)
  .selectAll()
  .data(data)
  .join("rect") // Add SVG rectangles.
  .attr("x", x(0))
  .attr("y", (d) => y(d.state))
  .attr("width", (d) => x(d.count) - x(0)) // Length of bar based on count.
  .attr("height", y.bandwidth()); // Proportional height for each bar.

// Append the count at the end of each bar.
svg
  .append("g")
  .attr("fill", "black")
  .attr("text-anchor", "end")
  .attr("font-size", fontSize)
  .selectAll()
  .data(data)
  .join("text")
  .attr("x", (d) => x(d.count))
  .attr("y", (d) => y(d.state) + y.bandwidth() / 2)
  .attr("dy", "0.35em")
  .attr("dx", -4)
  .text((d) => d.count)
  .call((text) =>
    text
      .filter((d) => x(d.count) - x(0) < 20) // short bars
      .attr("dx", +4)
      .attr("fill", "black")
      .attr("text-anchor", "start")
  );

// Create the axes.
svg
  .append("g")
  .attr("transform", `translate(0,${marginTop})`)
  .call(d3.axisTop(x));

svg
  .append("g")
  .attr("transform", `translate(0,${height - marginBottom * 2})`)
  .call(d3.axisBottom(x));

svg
  .append("g")
  .attr("transform", `translate(${marginLeft},0)`)
  .call(d3.axisLeft(y).tickSizeOuter(0))
  .selectAll("text")
  .attr("font-size", fontSize);

// Append the SVG element.
document.getElementById("container").appendChild(svg.node());
// container.append(svg.node());
