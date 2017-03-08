import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import * as d3 from 'd3';

class Heatmap extends Component {
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

  }

  render() {
    const heatmapData = this.props.data.map(d =>
      <tr>
        <td>{d.raw.fullName}</td>
        <td>{d.epsAccretion}</td>
        <td>{d.debtEBITDA}</td>
        <td>{d.buffett3GOwnership}</td>
      </tr>,
    );

    return (
      <div>
        <img src="images/demo-heatmap.png" alt="chart" />
        <table>
          <thead>
            <tr>
              <th />
              <th>EPS Accretion</th>
              <th>Debt to EBITDA</th>
              <th>Buffett/3G Ownership</th>
            </tr>
          </thead>
          <tbody>
            {heatmapData}
          </tbody>
        </table>
      </div>
    );
  }
}

Heatmap.propTypes = {
  data: React.PropTypes.array,
};

export default Heatmap;
