import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as expander from 'o-expander'; // eslint-disable-line

import Card from './components/card';
import Range from './components/range';
import Heatmap from './components/heatmap';

function roundToTenth(num) {
  return Math.round(num * 10) / 10;
}

function roundToHundredth(num) {
  return Math.round(num * 100) / 100;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line
      constantCompanyData: [{"key":"MDLZ","fullName":"Mondelez International, Inc.","displayName":"Mondelez","Current stock price":44.97,"shares outstanding":1544.4,"Net Debt":15458,"Minority Interest":54,"2017E Sales":25852,"2018E Sales":26421,"2019E Sales":27199,"2017E EBITDA":5102,"2018E EBITDA":5480,"2019E EBITDA":5791,"2017E EPS":2.1,"2018E EPS":2.33,"2019E EPS":2.55,"2017E SG&A":6532,"USD/ Euro exchange rate":1},{"key":"K","fullName":"Kellogg Company","displayName":"Kellogg","Current stock price":74.74,"shares outstanding":353.7,"Net Debt":7487,"Minority Interest":16,"2017E Sales":12652,"2018E Sales":12671,"2019E Sales":12740,"2017E EBITDA":2627,"2018E EBITDA":2780,"2019E EBITDA":2866,"2017E EPS":3.95,"2018E EPS":4.35,"2019E EPS":4.59,"2017E SG&A":3200,"USD/ Euro exchange rate":1},{"key":"CL","fullName":"Colgate-Palmolive Company","displayName":"Colgate-Palmolive","Current stock price":73.18,"shares outstanding":888.8,"Net Debt":5146,"Minority Interest":260,"2017E Sales":15468,"2018E Sales":16156,"2019E Sales":16805,"2017E EBITDA":4518,"2018E EBITDA":4836,"2019E EBITDA":5168,"2017E EPS":2.9,"2018E EPS":3.17,"2019E EPS":3.37,"2017E SG&A":5172,"USD/ Euro exchange rate":1},{"key":"KMB","fullName":"Kimberly-Clark Corporation","displayName":"Kimberly-Clark","Current stock price":134.64,"shares outstanding":358,"Net Debt":6707,"Minority Interest":219,"2017E Sales":18309,"2018E Sales":18944,"2019E Sales":19619,"2017E EBITDA":4204,"2018E EBITDA":4415,"2019E EBITDA":4617,"2017E EPS":6.28,"2018E EPS":6.75,"2019E EPS":7.2,"2017E SG&A":3294,"USD/ Euro exchange rate":1},{"key":"CLX","fullName":"The Clorox Company","displayName":"Clorox","Current stock price":135.44,"shares outstanding":130.8,"Net Debt":2135,"Minority Interest":0,"2017E Sales":6063,"2018E Sales":6245,"2019E Sales":6479,"2017E EBITDA":1329,"2018E EBITDA":1397,"2019E EBITDA":1444,"2017E EPS":5.58,"2018E EPS":5.89,"2019E EPS":6.29,"2017E SG&A":1420,"USD/ Euro exchange rate":1},{"key":"CPB","fullName":"Campbell Soup Company","displayName":"Campbell Soup","Current stock price":58.95,"shares outstanding":307.2,"Net Debt":3169,"Minority Interest":0,"2017E Sales":8003,"2018E Sales":8088,"2019E Sales":8139,"2017E EBITDA":1856,"2018E EBITDA":1906,"2019E EBITDA":1945,"2017E EPS":3.12,"2018E EPS":3.34,"2019E EPS":3.49,"2017E SG&A":1474,"USD/ Euro exchange rate":1},{"key":"ENXTAM:UNA","fullName":"Unilever N.V.","displayName":"Unilever","Current stock price":42.695,"shares outstanding":2839.7,"Net Debt":12614,"Minority Interest":626,"2017E Sales":55285,"2018E Sales":57485,"2019E Sales":60295,"2017E EBITDA":10224,"2018E EBITDA":10963,"2019E EBITDA":11767,"2017E EPS":2.01,"2018E EPS":2.19,"2019E EPS":2.38,"2017E SG&A":14400,"USD/ Euro exchange rate":1.06}],
      // eslint-disable-next-line
      kraftConstantData: [{"key":"KHC","fullName":"The Kraft Heinz Company","displayName":"Kraft Heinz","Current stock price":94.87,"shares outstanding":1230.1,"Net Debt":28200,"Minority Interest":216,"2017E Sales":26672,"2018E Sales":27202,"2019E Sales":27888,"2017E EBITDA":8392,"2018E EBITDA":8915,"2019E EBITDA":9259,"2017E EPS":3.76,"2018E EPS":4.16,"2019E EPS":4.37,"2017E SG&A":null,"USD/ Euro exchange rate":null}],
      constantsData: {
        existingBerkshire3GShares: 616.3,
        costOfDebt: 0.08,
        taxRate: 0.35,
        synergyRate: 0.25,
      },
      data: [],
      premium: 20,
      stockConsideration: 0,
      buffettContribution: 5000,
    };

    this.state.data = this.state.constantCompanyData.map((d) => {
      const enterpriseValue = (d['Current stock price'] * d['shares outstanding']) + d['Net Debt'] + d['Minority Interest'];
      const epsAccretion = null;
      const debtEBITDA = null;
      const buffett3GOwnership = null;

      return {
        category: d.displayName,
        enterpriseValue,
        epsAccretion,
        debtEBITDA,
        buffett3GOwnership,
        raw: d,
      };
    }).sort((a, b) => b.enterpriseValue - a.enterpriseValue);

    this.updateHeatmap();

    this.updateData = this.updateData.bind(this);
    this.updateHeatmap = this.updateHeatmap.bind(this);
  }

  componentDidMount() {
    expander.init(null, {});
  }

  updateData(label, value) {
    console.log('update heatmap', label, value);

    this.setState({
      premium: (label === 'premium' ? value : this.state.premium),
      buffettContribution: (label === 'buffett' ? value : this.state.buffettContribution),
      stockConsideration: (label === 'stock' ? value : this.state.stockConsideration),
    });
  }

  updateHeatmap() {
    const premium = this.state.premium / 100; // needs to be in decimal format
    const buffettContribution = this.state.buffettContribution; // (input is in thousands of millions)
    const stockConsideration = this.state.stockConsideration / 100; // needs to be in decimal format

    const data = this.state.data;
    data.forEach((d) => {
      // debtEBITDAA = Kraft standalone debt + target standalone net debt + [ (standalone target stock price * target share count * exchange rate)* (1+ premium) - Berkshire-3G contribution- ( (standalone target stock price * target share count * exchange rate)* (1+ premium) * % stock consideration)]
      const debtEBITDAA = this.state.kraftConstantData[0]['Net Debt'] +
            d.raw['Net Debt'] +
            d.raw['Current stock price'] * d.raw['shares outstanding'] * d.raw['USD/ Euro exchange rate'] * ( 1 + premium) -
            buffettContribution -
            (d.raw['Current stock price'] * d.raw['shares outstanding'] * d.raw['USD/ Euro exchange rate']) * ( 1 + premium ) * stockConsideration;
      // debtEBITDAB = Kraft 2017E EBITDA + (Target 2017E EBITDA * exchange rate)
      const debtEBITDAB = this.state.kraftConstantData[0]['2017E EBITDA'] + (d.raw['2017E EBITDA'] * d.raw['USD/ Euro exchange rate']);
      // debtEBITDA = a / b
      const debtEBITDA = roundToTenth(debtEBITDAA / debtEBITDAB);

      const totalDebt = d.raw['Current stock price'] * d.raw['shares outstanding'] * d.raw['USD/ Euro exchange rate'] * ( 1 + premium) -
      buffettContribution -
      (d.raw['Current stock price'] * d.raw['shares outstanding'] * d.raw['USD/ Euro exchange rate']) * ( 1 + premium ) * stockConsideration;

      // epsAccretionA = (Kraft 2018E EPS * Kraft shares)+ (Target 2018E EPS * Target Shares * exchange rate)
      const epsAccretionA = (this.state.kraftConstantData[0]['2018E EPS'] * this.state.kraftConstantData[0]['shares outstanding']) + ((d.raw['2018E EPS'] * d.raw['shares outstanding']) * d.raw['USD/ Euro exchange rate']);
      // epsAccretionB = [ (cost of debt * (debtEBITDAA - Kraft standalone debt - target standalone debt)) + synergy rate * target 2017E SG&A * exchange rate] * (1 - tax rate)
      const epsAccretionB = (-(this.state.constantsData.costOfDebt * totalDebt) + (this.state.constantsData.synergyRate * d.raw['2017E SG&A'] * d.raw['USD/ Euro exchange rate'])) * (1 - this.state.constantsData.taxRate);
      // epsAccretionC = Kraft standalone shares + ((target stock price * exchange rate) * (1+ premium)*target standalone shares* % stock)/Kraft stock price + (Berkshire_3G contribution/Kraft stock price)
      const epsAccretionC = this.state.kraftConstantData[0]['shares outstanding'] +
            ((d.raw['Current stock price'] * d.raw['USD/ Euro exchange rate']) * (1 + premium) * d.raw['shares outstanding'] * stockConsideration) / this.state.kraftConstantData[0]['Current stock price'] +
            (buffettContribution / this.state.kraftConstantData[0]['Current stock price']);
      // epsAccretionD = (a+ b) / c
      const epsAccretionD = (epsAccretionA + epsAccretionB) / epsAccretionC;
      // epsAccretion = d / stanalone 2018E Kraft EPS
      const epsAccretion = roundToTenth((epsAccretionD - this.state.kraftConstantData[0]['2018E EPS']) * 100 / this.state.kraftConstantData[0]['2018E EPS']);

      // Kraft standalone shares + ((target stock price * exchange rate) * (1+ premium)* % stock)*target shares/Kraft stock price + Berkshire_3G contribution/Kraft stock price
      const buffett3GOwnershipA = this.state.kraftConstantData[0]['shares outstanding'] + ((d.raw['Current stock price'] * d.raw['USD/ Euro exchange rate']) * (1 + premium) * stockConsideration) * d.raw['shares outstanding'] / (this.state.kraftConstantData[0]['Current stock price']) + (buffettContribution / this.state.kraftConstantData[0]['Current stock price']);
      // buffett3GOwnershipB = Berkshire_3G contribution/Kraft stock price
      const buffett3GOwnershipB = buffettContribution / this.state.kraftConstantData[0]['Current stock price'];
      // buffett3GOwnershipC = existing Berkshire_3G shares
      const buffett3GOwnershipC = this.state.constantsData.existingBerkshire3GShares;
      // buffett3GOwnership = (b + c)/a
      const buffett3GOwnership = roundToTenth((buffett3GOwnershipB + buffett3GOwnershipC) * 100 / buffett3GOwnershipA);

      console.log(premium, stockConsideration, buffettContribution);

      d.epsAccretion = epsAccretion;
      d.debtEBITDA = debtEBITDA;
      d.buffett3GOwnership = buffett3GOwnership;
    });
  }

  render() {
    this.updateHeatmap();

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
          headline={'Kraft is likely to look for a company with an aggregate value between $40bn and $100bn'}
        />
        <div className="graphic" id="userinput-wrapper">
          <div id="userinput-container" className="o-grid-container">
            <h2 className="o-typography-heading3">Make your own predictions</h2>
            <div className="o-grid-row">
              <div data-o-grid-colspan="12 L9">
                <p>Kraft Heinz must pay enough to convince a target company to sell themselves but also must guard against issuing too much debt to pay for the deal. We have included Unilever as a choice to use as a comparison.</p>

                <p>Therefore choose:</p>

                <ol>
                  <li>a premium that Kraft Heinz will have to pay to the target shareholders</li>
                  <li>the proportion of Kraft Heinz stock they will issue to the target company</li>
                  <li>How much equity they will sell collectively to Warren Buffett and 3G Capital</li>
                </ol>
              </div>
              <div className="userinput-container__component" id="userinput-input" data-o-grid-colspan="12 M6">
                <Range
                  min={20}
                  max={40}
                  step={5}
                  increments={7}
                  overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
                  thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
                  label={'% premium'}
                  labelName={'premium'}
                  unit={'%'}
                  onSubmit={this.updateData}
                />
                <Range
                  min={0}
                  max={25}
                  step={5}
                  increments={7}
                  overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
                  thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
                  label={'% in stock'}
                  labelName={'stock'}
                  unit={'%'}
                  onSubmit={this.updateData}
                />
                <Range
                  min={5000}
                  max={15000}
                  step={1000}
                  increments={7}
                  overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
                  thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
                  label={'Buffett/3G equity contribution ($m)'}
                  labelName={'buffett'}
                  unit={'$'}
                  onSubmit={this.updateData}
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
              data={epsAccretionData}
              text={'Earnings per share accretion is the metric companyies are trying to maximise in M&A deals. Kraft Heinz will acquire the target company\'s net income but, in exchange, owe interest expense on the new debt. And new Kraft Heinz shares will also have to be issued to the target\'s shareholders and to Buffett/3G for the equity they purchase. It is obvious why Kraft Heinz ambitiously pursued Unilever: because of its the sheer size of its earnings base, it could provide a huge boost to Kraft Heinz earnings. Another important factor is the relative valuation of the target companies. Colgate-Palmolive is a $70bn company that trades at 23x earnings without any premium, likely making an acquisition dilutive to Kraft Heinz earnings.'}
              headline={'1. 2018 estimated earnings impact to Kraft'}
            />
          </div>

          <div className="output-container">
            <Card
              data={debtEBITDAData}
              yHighlight={6}
              text={'Typically net debt/EBITDA over 6x is considered highly leveraged. Kraft Heinz\'s standalone net debt to EBITDA ratio is 3.4x and it has the lowest investment grade credit rating. Acquiring Unilever would like have required a Buffett/3G cash infusion even greater than the $15bn contemplated here.'}
              headline={'2. Kraft Heinz leverage'}
            />
          </div>
          <div className="output-container">
            <Card
              data={buffett3GOwnershipData}
              text={'Buffett/3G currently own half of Kraft Heinz. For any given Buffett/3G contribution in an acquisition, the smaller the target company, the greater proportion they will own of Kraft Heinz.'}
              headline={'3. Buffett/3G ownership of Kraft Heinz (percentage point difference for current)'}
            />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('react-container'));
