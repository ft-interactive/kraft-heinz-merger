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
      initialDraw: true,
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

  drawChart(inputData = this.props.data) {
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

    const data = inputData;

    const margin = { // Mike Bostock's margin convention
      top: 10,
      right: 40,
      bottom: 30,
      left: 0,
    };

    const width = this.node.offsetWidth - margin.left - margin.right;
    const calculatedHeight = Math.max(150, (this.node.offsetWidth / 3.2) + 14);
    const height = ((calculatedHeight - margin.top) - margin.bottom) + 14;
    // @TODO Hide smallest two companies on mobile, but don't screw up resize
    // const breakpoint = 400;
    //
    // if (width < breakpoint) {
    //   data = data.slice(0, -2);
    // }

    const yDomainMin = Math.min((5 * Math.ceil(d3.min(data.map(d => +d.value)) / 5)) - 5, 0);
    const yDomainMax = (5 * Math.ceil(d3.max(data.map(d => +d.value)) / 5)) + 5;

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

    if (this.state.initialDraw) {
      const chart = this.connectFauxDOM('svg', 'chart');

      const svg = d3.select(chart)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom + margin.bottom)
          .attr('class', 'column-chart');

      svg.append('g')
          .attr('class', 'y axis')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
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
          .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
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

      const chartContainer = svg.append('g')
        .attr('class', 'chart-container')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // baseline
      chartContainer.append('line')
        .attr('class', 'baseline')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0));

      const bar = chartContainer.selectAll('.bar')
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
          return yScale(d.value || 0);
        })
        .attr('height', (d) => {
          if (d.value < 0) {
            return yScale(d.value || 0) - yScale(0);
          }
          return yScale(0) - yScale(d.value || 0);
        });

      bar.append('text')
        .text(d => d.value)
        .attr('class', 'column-chart__label')
        .attr('x', xScale.bandwidth() / 4)
        .attr('y', d => yScale(d.value) - 7)
        .attr('text-anchor', 'middle');

      if (this.props.yHighlight) {
        chartContainer.append('line')
          .attr('class', 'yHighlight')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', yScale(this.props.yHighlight))
          .attr('y2', yScale(this.props.yHighlight));
      }

      this.setState({
        initialDraw: false,
      });
    } else { // after initial draw
      const chart = this.connectedFauxDOM.chart;
      const svg = d3.select(chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + margin.bottom);

      svg.select('g.y.axis')
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
          .call(yAxis)
        .selectAll('text')
          .style('text-anchor', 'start');

      svg.select('.y text')
        .attr('class', 'label')
        .attr('x', width)
        .attr('y', -4)
        .style('text-anchor', 'end');

      svg.select('g.x.axis')
          .attr('class', 'x axis')
          .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
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

      const chartContainer = svg.select('g.chart-container')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // baseline
      chartContainer.select('line.baseline')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(0))
        .attr('y2', yScale(0));

      const bar = chartContainer.selectAll('.bar')
        .data(data)
        .attr('transform', d => `translate(${xScale(d.category) + (xScale.bandwidth() / 4)}, 0)`);


      bar.select('text.column-chart__label')
        .text(d => d.value)
        .attr('x', xScale.bandwidth() / 4)
        .attr('y', d => yScale(d.value) - 7)
        .attr('text-anchor', 'middle');

      bar.select('rect')
        .transition()
        .attr('x', 1)
        .attr('width', xScale.bandwidth() / 2)
        .attr('y', (d) => {
          if (d.value < 0) {
            return yScale(0);
          }
          return yScale(d.value || 0);
        })
        .attr('height', (d) => {
          if (d.value < 0) {
            return yScale(d.value || 0) - yScale(0);
          }
          return yScale(0) - yScale(d.value || 0);
        })
        .attr('fill', d => (d.value < 0 ? '#F19F9E' : '#A5526A'));

      if (this.props.yHighlight) {
        chartContainer.select('line.yHighlight')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', yScale(this.props.yHighlight))
          .attr('y2', yScale(this.props.yHighlight));
      }
    }

    this.animateFauxDOM(800);
  }

  handleResize() {
    this.drawChart();
  }

  render() {
    return (
      <div>
        <div className="renderedD3" ref={(node) => { this.node = node; }}>
          {this.state.chart}
        </div>
      </div>
    );
  }
}

ColumnChart.propTypes = {
  data: React.PropTypes.array,
  yHighlight: React.PropTypes.number,
};

export default ColumnChart;
