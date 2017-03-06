import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';

class ColumnChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Placeholder content displayed before chart render
      chart: 'Loading chart…',
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
    const faux = this.connectFauxDOM('div.renderedD3', 'chart');

    d3.select(faux)
      .append('div')
      .html('Hello World!');

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

export default ColumnChart;
