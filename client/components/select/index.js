import React, { Component } from 'react';

class Select extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(label) {
    console.log('change', label);
    this.props.onChange(label);
  }

  render() {
    return (
      <div>
        <label htmlFor="addCompany">Choose a company to customize</label>
        <select id="addCompany" onChange={event => this.handleChange(event.target.value)}>
          <option />
          {this.props.data.filter(d => !d.customValues).map(d => (<option>{d.category}</option>))}
        </select>
      </div>
    );
  }
}

Select.propTypes = {
  data: React.PropTypes.array,
  onChange: React.PropTypes.func,
};

export default Select;
