import React, { Component } from 'react';

import ColumnChart from '../chart';

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="inline-graphic" id="chart-enterprise-value">
        <h2 className="o-typography-subhead">{this.props.headline}</h2>
        <p>{this.props.text}</p>
        <ColumnChart data={this.props.data} yHighlight={this.props.yHighlight} />
      </div>
    );
  }
}

Card.propTypes = {
  data: React.PropTypes.any,
  headline: React.PropTypes.string,
  text: React.PropTypes.string,
  yHighlight: React.PropTypes.number,
};

export default Card;
