import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';

class ColumnChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <img src="images/demo-chart.png" alt="chart" />
    );
  }
}

export default ColumnChart;
