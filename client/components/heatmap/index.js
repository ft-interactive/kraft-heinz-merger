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
    const epsAccretionMinMax = d3.extent(this.props.data.map(d => d.epsAccretion));
    const epsAccretionColorScale = d3.scaleLinear()
      .domain(epsAccretionMinMax)
      .range(['#FFF1e0', '#A5526A']);

    const debtEBITDAMinMax = d3.extent(this.props.data.map(d => d.debtEBITDA));
    const debtEBITDAColorScale = d3.scaleLinear()
      .domain(debtEBITDAMinMax)
      .range(['#FFF1e0', '#A5526A']);

    const buffett3GOwnershipMinMax = d3.extent(this.props.data.map(d => d.buffett3GOwnership));
    const buffett3GOwnershipColorScale = d3.scaleLinear()
      .domain(buffett3GOwnershipMinMax)
      .range(['#FFF1e0', '#A5526A']);

    const heatmapData = this.props.data.map((d) => {
      const epsAccretionStyle = {
        background: epsAccretionColorScale(d.epsAccretion),
      };

      const debtEBITDAStyle = {
        background: debtEBITDAColorScale(d.debtEBITDA),
      };

      const buffett3GOwnershipStyle = {
        background: buffett3GOwnershipColorScale(d.buffett3GOwnership),
      };

      return (<tr>
        <td>{d.raw.displayName}</td>
        <td style={epsAccretionStyle}>{d.epsAccretion}</td>
        <td style={debtEBITDAStyle}>{d.debtEBITDA}</td>
        <td style={buffett3GOwnershipStyle}>{d.buffett3GOwnership}</td>
      </tr>);
    });

    return (
      <div>
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
