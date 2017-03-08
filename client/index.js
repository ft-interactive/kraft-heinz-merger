import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import * as expander from 'o-expander'; // eslint-disable-line

import Card from './components/card';
import Range from './components/range';
import Heatmap from './components/heatmap';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constantData: [{"key":"MDLZ","fullName":"Mondelez International, Inc.","Current stock price":44.97,"shares outstanding":1544.4,"Net Debt":15458,"Minority Interest":54,"2017E Sales":25852,"2018E Sales":26421,"2019E Sales":27199,"2017E EBITDA":5102,"2018E EBITDA":5480,"2019E EBITDA":5791,"2017E EPS":2.1,"2018E EPS":2.33,"2019E EPS":2.55,"2017E SG&A":6532,"USD/ Euro exchange rate":1},{"key":"K","fullName":"Kellogg Company","Current stock price":74.74,"shares outstanding":353.7,"Net Debt":7487,"Minority Interest":16,"2017E Sales":12652,"2018E Sales":12671,"2019E Sales":12740,"2017E EBITDA":2627,"2018E EBITDA":2780,"2019E EBITDA":2866,"2017E EPS":3.95,"2018E EPS":4.35,"2019E EPS":4.59,"2017E SG&A":3200,"USD/ Euro exchange rate":1},{"key":"CL","fullName":"Colgate-Palmolive Company","Current stock price":73.18,"shares outstanding":888.8,"Net Debt":5146,"Minority Interest":260,"2017E Sales":15468,"2018E Sales":16156,"2019E Sales":16805,"2017E EBITDA":4518,"2018E EBITDA":4836,"2019E EBITDA":5168,"2017E EPS":2.9,"2018E EPS":3.17,"2019E EPS":3.37,"2017E SG&A":5172,"USD/ Euro exchange rate":1},{"key":"KMB","fullName":"Kimberly-Clark Corporation","Current stock price":134.64,"shares outstanding":358,"Net Debt":6707,"Minority Interest":219,"2017E Sales":18309,"2018E Sales":18944,"2019E Sales":19619,"2017E EBITDA":4204,"2018E EBITDA":4415,"2019E EBITDA":4617,"2017E EPS":6.28,"2018E EPS":6.75,"2019E EPS":7.2,"2017E SG&A":3294,"USD/ Euro exchange rate":1},{"key":"CLX","fullName":"The Clorox Company","Current stock price":135.44,"shares outstanding":130.8,"Net Debt":2135,"Minority Interest":0,"2017E Sales":6063,"2018E Sales":6245,"2019E Sales":6479,"2017E EBITDA":1329,"2018E EBITDA":1397,"2019E EBITDA":1444,"2017E EPS":5.58,"2018E EPS":5.89,"2019E EPS":6.29,"2017E SG&A":1420,"USD/ Euro exchange rate":1},{"key":"CPB","fullName":"Campbell Soup Company","Current stock price":58.95,"shares outstanding":307.2,"Net Debt":3169,"Minority Interest":0,"2017E Sales":8003,"2018E Sales":8088,"2019E Sales":8139,"2017E EBITDA":1856,"2018E EBITDA":1906,"2019E EBITDA":1945,"2017E EPS":3.12,"2018E EPS":3.34,"2019E EPS":3.49,"2017E SG&A":1474,"USD/ Euro exchange rate":1},{"key":"ENXTAM:UNA","fullName":"Unilever N.V.","Current stock price":42.7,"shares outstanding":2839.7,"Net Debt":12614,"Minority Interest":626,"2017E Sales":55285,"2018E Sales":57485,"2019E Sales":60295,"2017E EBITDA":10224,"2018E EBITDA":10963,"2019E EBITDA":11767,"2017E EPS":2.01,"2018E EPS":2.19,"2019E EPS":2.38,"2017E SG&A":14400,"USD/ Euro exchange rate":1.06},{"key":"KHC","fullName":"The Kraft Heinz Company","Current stock price":94.87,"shares outstanding":1230.1,"Net Debt":28200,"Minority Interest":216,"2017E Sales":26672,"2018E Sales":27202,"2019E Sales":27888,"2017E EBITDA":8392,"2018E EBITDA":8915,"2019E EBITDA":9259,"2017E EPS":3.76,"2018E EPS":4.16,"2019E EPS":4.37,"2017E SG&A":null,"USD/ Euro exchange rate":null}],
      data: [],
    };

    this.state.data = this.state.constantData.map((d) => {
      const enterpriseValue = (d['Current stock price'] * d['shares outstanding']) + d['Net Debt'] + d['Minority Interest'];
      const epsAccretion = Math.random() * 100;
      const debtEBITDA = Math.random() * 100;
      const buffett3GOwnership = Math.random() * 100;

      return {
        category: d.key,
        enterpriseValue,
        epsAccretion,
        debtEBITDA,
        buffett3GOwnership,
        raw: d,
      };
    }).sort((a, b) => b.enterpriseValue - a.enterpriseValue);

    this.updateHeatmap = this.updateHeatmap.bind(this);
  }

  componentDidMount() {
    expander.init(null, {});
  }

  updateHeatmap() {
    console.log('update heatmap');
  }

  render() {
    const enterpriseValueData = this.state.data.map((d) => {
      const cat = d.category;
      const value = d.enterpriseValue;

      return {
        category: cat,
        value,
      };
    });

    const epsAccretionData = this.state.data.map((d) => {
      const cat = d.category;
      const value = d.epsAccretion;

      return {
        category: cat,
        value,
      };
    });

    const buffett3GOwnershipData = this.state.data.map((d) => {
      const cat = d.category;
      const value = d.buffett3GOwnership;

      return {
        category: cat,
        value,
      };
    });

    const debtEBITDAData = this.state.data.map((d) => {
      const cat = d.category;
      const value = d.debtEBITDA;

      return {
        category: cat,
        value,
      };
    });

    return (
      <div>
        <Card
          data={enterpriseValueData}
          headline={'Kraft is likely to look for a company with an enterprise value between $40bn and $100bn'}
        />
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
                  onSubmit={this.updateHeatmap}
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
                  onSubmit={this.updateHeatmap}
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
                  onSubmit={this.updateHeatmap}
                />
              </div>
              <div className="userinput-container__component" id="userinput-output" data-o-grid-colspan="12 M6">
                <Heatmap data={this.state.data} />
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
        <div id="output-wrapper">
          <div className="output-container">
            <Card
              data={debtEBITDAData}
              text={"This is some dummy text"}
              headline={'1. Debt v EBITDA — Best value: Mondelez'}
            />
          </div>

          <div className="output-container">
            <Card
              data={buffett3GOwnershipData}
              text={"This is some more dummy text"}
              headline={'2. Buffett/3G ownership — Best value: Colgate'}
            />
          </div>
          <div className="output-container">
          <Card
            data={epsAccretionData}
            text={"This is even more dummy text"}
            headline={'3. 2018 EPS Accretion to Kraft — Best value: Clorox'}
          />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('react-container'));
