import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';
import throttle from 'lodash/throttle';

class ColumnChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Placeholder content displayed before chart render
      chart: 'Loading chart…',
      width: 600,
      height: 300,
    };

    this.handleResize = this.handleResize.bind(this);
    this.drawChart = this.drawChart.bind(this);

    for (const mixin in ReactFauxDOM.mixins.anim) { // eslint-disable-line
      if ({}.hasOwnProperty.call(ReactFauxDOM.mixins.anim, mixin)) {
        this[mixin] = ReactFauxDOM.mixins.anim[mixin].bind(this);
      }
    }

    for (const mixin in ReactFauxDOM.mixins.core) { // eslint-disable-line
      if ({}.hasOwnProperty.call(ReactFauxDOM.mixins.core, mixin)) {
        this[mixin] = ReactFauxDOM.mixins.core[mixin].bind(this);
      }
    }
  }

  componentDidMount() {
    this.drawChart();

    // Add window resize event listener
    window.addEventListener('resize', throttle(this.handleResize, 750));
  }

  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps.data);
  }

  drawChart(inputData=this.props.data) {
    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }

    let data = inputData;

    const chart = this.connectFauxDOM('svg', 'chart');
    const margin = { // Mike Bostock's margin convention
      top: 20,
      right: 40,
      bottom: 30,
      left: 0,
    };
    const width = this.state.width - margin.left - margin.right;
    const height = ((this.state.height - margin.top) - margin.bottom) + 14;
    const yDomainMin = Math.min((5 * Math.ceil(d3.min(data.map(d => d.value)) / 5)) - 5, 0);
    const yDomainMax = (5 * Math.ceil(d3.max(data.map(d => d.value)) / 5)) + 5;
    const breakpoint = 400;

    if (width < breakpoint) {
      data = data.slice(0, -2);
    }

    const svg = d3.select(chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'column-chart');

    const xScale = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, width])
        .paddingInner([0.1])
        .paddingOuter([0.3]);

    const yScale = d3.scaleLinear()
        .domain([yDomainMin, yDomainMax])
        .range([height, 0]);

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(10);

    const yAxis = d3.axisRight()
        .scale(yScale)
        .ticks(5)
        .tickSize(width, 0)
        .tickPadding(10);

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .selectAll('text')
        .style('text-anchor', 'start');

    svg.select('.y')
      .append('text')
        .attr('class', 'label')
        .attr('x', width)
        .attr('y', -4)
        .style('text-anchor', 'end');

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);
      // .selectAll('.tick text')
      //   .call(wrap, xScale.bandwidth());

    svg.selectAll('.x .tick text')
      .attr('y', (d, i) => {
        if (i % 2 === 1) {
          return 30;
        }
        return 9;
      });

    const bar = svg.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', d => `translate(${xScale(d.category) + (xScale.bandwidth() / 4)}, 0)`);

    const rect = bar.append('rect')
        .attr('x', 1)
        .attr('y', yScale(0))
        .attr('width', xScale.bandwidth() / 2)
        .attr('height', 0)
        .attr('fill', d => (d.value < 0 ? '#F19F9E' : '#A5526A'));

    rect.transition()
      .delay((d, i) => i * 7.5)
      .duration(500)
      .attr('y', (d) => {
        if (d.value < 0) {
          return yScale(0);
        }
        return yScale(d.value || 0)
      })
      .attr('height', (d) => {
        if (d.value < 0) {
          return yScale(d.value || 0) - yScale(0);
        }
        return yScale(0) - yScale(d.value || 0)
      });

    this.animateFauxDOM(800);
  }

  handleResize() {
    // Repeat height calculation with fallback value as above
    const calculatedHeight = (this.node.offsetWidth / 3.2) + 14;
    const height = calculatedHeight < 125 ? 125 : calculatedHeight;

    this.setState({
      width: this.node.offsetWidth,
      height,
    });

    this.drawChart();
  }

  render() {
    return (
      <div>
        <div className="renderedD3" ref={node => { this.node = node; }}>
          {this.state.chart}
        </div>
      </div>
    );
  }
}

ColumnChart.propTypes = {
  data: React.PropTypes.array,
};

export default ColumnChart;
