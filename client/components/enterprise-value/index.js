import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

import Card from '../../components/card';

class EnterpriseValue extends Card {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="inline-graphic" id="chart-enterprise-value">
        <h2 className="o-typography-subhead--crosshead">Kraft is likely to look for a company with an enterprise value between $40bn and $100bn</h2>
        <img src="images/demo-chart.png" />
      </div>
    );
  }
}

export default EnterpriseValue;
