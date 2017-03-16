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
    const epsAccretionMinMax = d3.extent(this.props.data.map(d => +d.epsAccretion));
    const epsAccretionColorScale = d3.scaleLinear()
      .domain(epsAccretionMinMax)
      .range(['#A5526A', '#FFF1e0']);

    const debtEBITDAMinMax = d3.extent(this.props.data.map(d => +d.debtEBITDA));
    const debtEBITDAColorScale = d3.scaleLinear()
      .domain(debtEBITDAMinMax)
      .range(['#FFF1e0', '#A5526A']);

    const heatmapData = this.props.data.map((d) => {
      const epsAccretionStyle = {
        background: epsAccretionColorScale(+d.epsAccretion),
      };

      const debtEBITDAStyle = {
        background: debtEBITDAColorScale(+d.debtEBITDA),
      };

      const rowKey = `${d.raw.displayName}-row`;
      const cellEpsAccretion = `${d.epsAccretion}-epsaccretion`;
      const cellDebtEBITDA = `${d.debtEBITDA}-debtebitda`;
      const cellBuffett3GOwnership = `${d.buffett3GOwnership}-buffett3GOwnership`;

      return (<tr key={rowKey}>
        <td key={d.raw.displayName}>{d.raw.displayName}</td>
        <td key={cellEpsAccretion} style={epsAccretionStyle}>{d.epsAccretion}</td>
        <td key={cellDebtEBITDA} style={debtEBITDAStyle}>{d.debtEBITDA}x</td>
        <td key={cellBuffett3GOwnership}>{d.buffett3GOwnership}</td>
      </tr>);
    });

    return (
      <div id="heatmap">
        <div id="heatmap-key" role="presentation">
          <span>Worse for Kraft</span>
          <span id="heatmap-gradient" />
          <span>Better for Kraft</span>
        </div>
        <table>
          <thead>
            <tr>
              <th />
              <th>Earnings impact (%)</th>
              <th>Net debt to EBITDA</th>
              <th>Buffett/3G ownership (%)</th>
            </tr>
          </thead>
          <tbody>
            {heatmapData}
            <tr key={'Kraft standalone'}>
              <td key={'Kraft standalone name'}>Kraft Heinz (current)</td>
              <td key={'Kraft standalone earnings impact'}>—</td>
              <td key={'Kraft standalone debt'}>3.4x</td>
              <td key={'Kraft standalone buffettownership'}>50.1</td>
            </tr>
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
