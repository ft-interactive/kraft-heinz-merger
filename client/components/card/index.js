import React, { Component } from 'react';

import ColumnChart from '../chart';

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="inline-graphic">
        <h2 className="o-typography-subhead">{this.props.headline}</h2>
        <p>{this.props.text}</p>
        <p className="o-typography-lead--small">{this.props.subhead}</p>
        <ColumnChart data={this.props.data} yHighlight={this.props.yHighlight} yHighlightLabel={this.props.yHighlightLabel} label={this.props.headline} />
      </div>
    );
  }
}

Card.propTypes = {
  data: React.PropTypes.any,
  headline: React.PropTypes.string,
  subhead: React.PropTypes.string,
  text: React.PropTypes.string,
  yHighlight: React.PropTypes.number,
  yHighlightLabel: React.PropTypes.string,
};

export default Card;
