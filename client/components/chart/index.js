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

    const visuallyHiddenEls = document.querySelectorAll('.n-util-visually-hidden');
    Array.from(visuallyHiddenEls).forEach((elements) => {
      elements.addEventListener('click', () => {
        const eventLabel = elements.getAttribute('data-label');
        ga('send', {
          hitType: 'event',
          eventCategory: 'a11y-skip-to-chart-table',
          eventAction: 'click',
          eventLabel,
          transport: 'beacon',
        });
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.drawChart(nextProps.data);
  }

  drawChart(inputData = this.props.data) {
    const data = inputData;

    const margin = { // Mike Bostock's margin convention
      top: 20,
      right: 20,
      bottom: 30,
      left: 0,
    };

    const width = this.node.offsetWidth - margin.left - margin.right;
    const calculatedHeight = Math.max(150, (this.node.offsetWidth / 3.2) + 14);
    const height = ((calculatedHeight - margin.top) - margin.bottom) + 14;
    const breakpoint = 400;

    const yDomainMin = Math.min((5 * Math.ceil(d3.min(data.map(d => +d.value)) / 5)) - 5, 0);
    let yDomainMax = (5 * Math.ceil(d3.max(data.map(d => +d.value)) / 5)) + 5;

    if (this.props.yHighlight) {
      yDomainMax = Math.max(this.props.yHighlight, yDomainMax);
    }

    let companyNames = data.map(d => d.category);
    if (width < breakpoint) {
      companyNames = data.map(d => d.mobileCategory);
    }

    const xScale = d3.scaleBand()
        .domain(companyNames)
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
          .attr('role', 'graphic')
          .attr('aria-hidden', 'true')
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

      // remove y-axis except origin and y-highlight values
      const clear = svg.selectAll('.y .tick').filter(d => !(d === 0 || d === this.props.yHighlight));
      clear.select('text').remove();

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
        .attr('transform', (d) => {
          if (width < breakpoint) {
            return `translate(${xScale(d.mobileCategory) + (xScale.bandwidth() / 4)}, 0)`;
          }
          return `translate(${xScale(d.category) + (xScale.bandwidth() / 4)}, 0)`;
        });

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
        .attr('y', yScale(0) - 5)
        .attr('text-anchor', 'middle');

      if (this.props.yHighlight) {
        chartContainer.append('line')
          .attr('class', 'yHighlight')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', yScale(this.props.yHighlight))
          .attr('y2', yScale(this.props.yHighlight));
      }

      if (this.props.yHighlightLabel) {
        chartContainer.append('text')
          .attr('class', 'yHighlightLabel')
          .text(this.props.yHighlightLabel)
          .attr('x', width)
          .attr('y', yScale(this.props.yHighlight) - 5)
          .attr('text-anchor', 'end');
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

      // remove y-axis except origin and y-highlight values
      const clear = svg.selectAll('.y .tick').filter(d => !(d === 0 || d === this.props.yHighlight));
      clear.select('text').remove();

      svg.select('g.x.axis')
          .attr('class', 'x axis')
          .attr('transform', `translate(${margin.left}, ${height + margin.top})`)
          .call(xAxis);

      // @TODO Figure out why Mondelez doubles itself. Use hack for now.
      svg.selectAll('.x .tick text')
        .attr('y', (d) => {
          const secondRowNames = ['Mondelez', 'Kimberly-Clark', 'Kim.-Clark', 'Kellogg'];
          if (secondRowNames.indexOf(d) > -1) {
            return 30;
          }
          return 9;
          // if (i % 2 === 1) {
          //   return 30;
          // }
          // return 9;
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
        .attr('transform', (d) => {
          if (width < breakpoint) {
            return `translate(${xScale(d.mobileCategory) + (xScale.bandwidth() / 4)}, 0)`;
          }
          return `translate(${xScale(d.category) + (xScale.bandwidth() / 4)}, 0)`;
        });

      bar.select('text.column-chart__label')
        .text(d => d.value)
        .attr('x', xScale.bandwidth() / 4)
        .attr('y', yScale(0) - 5)
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

      if (this.props.yHighlightLabel) {
        chartContainer.select('text.yHighlightLabel')
          .attr('x', width)
          .attr('y', yScale(this.props.yHighlight) - 5);
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
          <a data-trackable="a11y-skip-to-chart-table" className="n-util-visually-hidden" href="#heatmap" data-label={this.props.label}>Skip to chart values</a>
        </div>
      </div>
    );
  }
}

ColumnChart.propTypes = {
  data: React.PropTypes.array,
  label: React.PropTypes.string,
  yHighlight: React.PropTypes.number,
  yHighlightLabel: React.PropTypes.string,
};

export default ColumnChart;
