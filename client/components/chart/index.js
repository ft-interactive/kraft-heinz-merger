import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';

class ColumnChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Placeholder content displayed before chart render
      chart: 'Loading chart…',
      width: 600,
      height: 500,
    };

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
    console.log(this.props.data);
    const data = this.props.data.map(data => {
      const value = data['Current stock price'] * data['shares outstanding'] + data['Net Debt'] + data['Minority Interest'];
      return {
        category: data.key,
        value,
      }
    });

    console.log(data);

    const chart = this.connectFauxDOM('svg', 'chart');
    const margin = { // Mike Bostock's margin convention
      top: 20,
      right: 28,
      bottom: 30,
      left: 0,
    };
    const width = this.state.width - margin.left - margin.right;
    const height = ((this.state.height - margin.top) - margin.bottom) + 14;
    const yDomainMax = (5 * Math.ceil(d3.max(data) / 5)) + 5;
    const x1 = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);
    const y = d3.scaleLinear()
        .domain([0, yDomainMax])
        .range([height, 0]);
    const xAxis = d3.axisBottom()
        .scale(x1)
        .ticks(10)
        .tickSizeOuter(0);
    const yAxis = d3.axisRight()
        .scale(y)
        .tickValues([Math.ceil(yDomainMax / 2), yDomainMax])
        .tickFormat(d => `${d}%`)
        .tickSize(width, 0);

    const svg = d3.select(chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', 0)
        .attr('class', 'column-chart');

    this.animateFauxDOM(800);
  }

  render() {
    return (
      <div>
        <div className="renderedD3">
          {this.state.chart}
        </div>
        <img src="images/demo-chart.png" alt="chart" />
      </div>
    );
  }
}

ColumnChart.propTypes = {
  data: React.PropTypes.array,
};

export default ColumnChart;
