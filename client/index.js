import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as expander from 'o-expander'; // eslint-disable-line
import EnterpriseValue from './components/enterprise-value';
import Range from './components/range';

class App extends Component {
  componentDidMount() {
    expander.init(null, {});
  }

  render() {
    return (
      <div>
        <EnterpriseValue />
        <div className="graphic" id="userinput-wrapper">
          <div id="userinput-container">
            <h2 className="o-typography-heading3">Make your own predictions</h2>
            <div className="o-grid-row">
              <div className="userinput-container__component" id="userinput-input" data-o-grid-colspan="12 M6">
                <p>Choose a per cent premium and cost cutting value prediction to see how it affects Krafts decision.</p>
                <Range
                  min={25}
                  max={50}
                  step={5}
                  increments={7}
                  overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
                  thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
                  label={'% premium'}
                  labelName={'premium'}
                />
                <Range
                  min={25}
                  max={50}
                  step={5}
                  increments={7}
                  overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
                  thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
                  label={'% Buffett/3G equity contribution'}
                  labelName={'buffett'}
                />
                <Range
                  min={25}
                  max={50}
                  step={5}
                  increments={7}
                  overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
                  thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
                  label={'% in stock'}
                  labelName={'stock'}
                />
              </div>
              <div className="userinput-container__component" id="userinput-output" data-o-grid-colspan="12 M6">
                <img src="images/demo-heatmap.png" alt="heatmap" />
              </div>
            </div>
            <div className="o-grid-row">
              <div data-o-component="o-expander" className="o-expander items" data-o-expander-shrink-to="0" data-o-expander-count-selector="div" data-o-expander-expanded-toggle-text="Fewer options" data-o-expander-collapsed-toggle-text="More options" data-o-grid-colspan="12" id="more-options">
                <div className="o-expander__content">
                  <div>
                    <h5>For more options:</h5>
                    <b>Campbell</b> (% premium): <input type="number" />
                    (% cost cut): <input type="number" />

                    <br />
                    <br />

                    <b>Clorox</b> (% premium): <input type="number" />
                    (% cost cut): <input type="number" />

                    <br />
                    <br />

                    <b>Colgate</b> (% premium): <input type="number" />
                    (% cost cut): <input type="number" />

                    <br />
                    <br />

                    <b>Kellogg</b> (% premium): <input type="number" />
                    (% cost cut): <input type="number" />
                  </div>
                </div>
                <a className="o-expander__toggle o--if-js">Toggle</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('react-container'));
