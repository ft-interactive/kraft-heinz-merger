import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as expander from 'o-expander'; // eslint-disable-line
import _ from 'lodash';

import Card from './components/card';
import Range from './components/range';
import Heatmap from './components/heatmap';
import Select from './components/select';

function roundToTenth(num) {
  return (Math.round(num * 10) / 10).toFixed(1);
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
      buffettContribution: 5,
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
        customValues: false,
        premium: null,
        stockConsideration: null,
        buffettContribution: null,
      };
    }).sort((a, b) => b.enterpriseValue - a.enterpriseValue);

    this.updateHeatmap();

    this.updateData = this.updateData.bind(this);
    this.updateHeatmap = this.updateHeatmap.bind(this);
    this.addCompany = this.addCompany.bind(this);
    this.removeCompany = this.removeCompany.bind(this);
  }

  componentDidMount() {
    expander.init(null, {});
  }

  updateData(label, value, category) {
    console.log('update heatmap', label, value, category);

    if (category === 'default') {
      this.setState({
        premium: (label === 'premium' ? value : this.state.premium),
        buffettContribution: (label === 'buffett' ? value : this.state.buffettContribution),
        stockConsideration: (label === 'stock' ? value : this.state.stockConsideration),
      });
    } else {
      if (_.find(this.state.data, { category })) {
        switch (label) {
          case 'premium':
            _.find(this.state.data, { category }).premium = value;
            break;
          case 'buffett':
            _.find(this.state.data, { category }).buffettContribution = value;
            break;
          case 'stock':
            _.find(this.state.data, { category }).stockConsideration = value;
            break;
          default:
            break;
        }
      }

      const data = this.state.data;

      this.setState({
        data,
      });
    }
  }

  addCompany(company) {
    if (company) {
      _.find(this.state.data, { category: company }).customValues = true;
    }

    const data = this.state.data;

    this.setState({
      data,
    });
  }

  removeCompany(company) {
    if (company) {
      _.find(this.state.data, { category: company }).customValues = false;
      _.find(this.state.data, { category: company }).premium = null;
      _.find(this.state.data, { category: company }).buffettContribution = null;
      _.find(this.state.data, { category: company }).stockConsideration = null;
    }

    const data = this.state.data;

    this.setState({
      data,
    });
  }

  updateHeatmap() {
    const data = this.state.data;
    data.forEach((d) => {
      // set premium, buffettContribution and stockConsideration based on default inputs unless users has selected specific inputs for a company
      const premium = (d.premium ? d.premium / 100 : this.state.premium / 100); // needs to be in decimal format
      const buffettContribution = (d.buffettContribution ? d.buffettContribution * 1000 : this.state.buffettContribution * 1000); // (input is in billions)
      const stockConsideration = (d.stockConsideration ? d.stockConsideration / 100 : this.state.stockConsideration / 100); // needs to be in decimal format

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
      const value = roundToTenth(d.enterpriseValue / 1000);

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
      const value = roundToTenth(d.buffett3GOwnership - 50.1); // get percentage pt diff from 50.1

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

    let individualCompanyHeader;
    if (this.state.data.filter(d => d.customValues).length > 0) {
      individualCompanyHeader = (<div id="individual-company-sliders-header">
        <div>% premium</div>
        <div>% in stock</div>
        <div>Buffett/3G equity contribution ($bn)</div>
      </div>);
    }

    const individualCompanySliders = this.state.data.filter(d => d.customValues).map((d) => {
      return (<div className="company-slider-container">
        <div className="company-slider-container__company-name">
          {d.category}
          <button className="o-buttons o-buttons--small o-buttons--uncolored" onClick={() => this.removeCompany(d.category)}>Use default values</button>
        </div>
        <Range
          category={d.category}
          min={20}
          max={40}
          step={5}
          increments={6}
          overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
          thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
          labelName={'premium'}
          unit={'%'}
          onSubmit={this.updateData}
        />
        <Range
          category={d.category}
          min={0}
          max={25}
          step={5}
          increments={7}
          overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
          thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
          labelName={'stock'}
          unit={'%'}
          onSubmit={this.updateData}
        />
        <Range
          category={d.category}
          min={5}
          max={15}
          step={1}
          increments={11}
          overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
          thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
          labelName={'buffett'}
          unit={'$'}
          onSubmit={this.updateData}
        />
      </div>);
    });

    return (
      <div>
        <Card
          data={enterpriseValueData}
          headline={'Target values: between $30bn and $90bn'}
          subhead={'$bn'}
        />
        <div className="graphic" id="userinput-wrapper">
          <div id="userinput-container" className="o-grid-container">
            <h2 className="o-typography-heading3">Choose a target and name your price</h2>
            <div className="o-grid-row">
              <div data-o-grid-colspan="12 L9">
                <p>Kraft Heinz must pay enough to convince a target company to sell but also  guard against using too much debt to fund the purchase. Any deal will also require a swag of new equity, with shares to be issued to the Kraft Heinz 51 per cent backers, 3G and Warren Buffett, and even to the target shareholders. </p>

                <p>Using the sliding bars below, choose:</p>

                <ol>
                  <li>The premium Kraft Heinz will pay to target shareholders</li>
                  <li>The proportion of Kraft Heinz stock that would be issued to the target</li>
                  <li>How much equity will need to be issued to Buffett and 3G Capital</li>
                </ol>

                <p>Watch the changes in the table recording the impact on key measures.</p>
              </div>
              <div className="userinput-container__component" id="userinput-input" data-o-grid-colspan="12 M6">
                <Range
                  category={'default'}
                  min={20}
                  max={40}
                  step={5}
                  increments={6}
                  overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
                  thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
                  label={'% premium'}
                  labelName={'premium'}
                  unit={'%'}
                  onSubmit={this.updateData}
                />
                <Range
                  category={'default'}
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
                  category={'default'}
                  min={5}
                  max={15}
                  step={1}
                  increments={11}
                  overlayWidth={40} // Must match the overlay width in ./inputs/range/_main.scss
                  thumbWidth={28} // Must match the WebKit thumb width in ./inputs/range/_main.scss
                  label={'Buffett/3G equity contribution ($bn)'}
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
              <div data-o-component="o-expander" className="o-expander items" data-o-expander-shrink-to="0" data-o-expander-count-selector="div" data-o-expander-expanded-toggle-text="Show fewer options" data-o-expander-collapsed-toggle-text="Click to choose different values for individual companies" data-o-grid-colspan="12" id="more-options">
                <div className="o-expander__content">
                  <div>
                    {individualCompanyHeader}
                    {individualCompanySliders}
                    <Select
                      data={this.state.data}
                      onChange={this.addCompany}
                    />
                  </div>
                </div>
                <a className="o-expander__toggle o--if-js">Options</a>
              </div>
            </div>
          </div>
        </div>
        <div id="output-wrapper">
          <div className="output-container">
            <div className="inline-graphic">
              <h2 className="o-typography-subhead">Breaking down the key measures</h2>
              <p>See the choices you made above reflected in chart below. Compare and contrast.</p>
            </div>
            <Card
              data={epsAccretionData}
              text={'The goal in M&A is earnings per share growth. Kraft Heinz will acquire the target company\'s net income but will also owe interest on the new debt.  As new Kraft Heinz shares will also have to be issued to the target\'s shareholders and to Buffett/3G, this will cause further dilution. This calculation makes it obvious why Kraft Heinz ambitiously pursued Unilever: because of the sheer size of its earnings base. Another important factor is the relative valuation of the target companies. Colgate-Palmolive is a $70bn company that trades at 23 times earnings even without any premium, making it likely to dilute Kraft Heinz earnings on acquisition.'}
              headline={'1. Impact on Kraft-Heinz 2018 earnings'}
              subhead={'Values based on your inputs above'}
            />
          </div>

          <div className="output-container">
            <Card
              data={debtEBITDAData}
              yHighlight={6}
              text={'Typically net debt/EBITDA of more than 6 times is considered high. Kraft Heinz\'s standalone net debt to EBITDA ratio is 3.4 times and it has the lowest investment grade credit rating, making interest costs higher. Acquiring Unilever would likely have required a Buffett/3G cash infusion even greater than the $15bn contemplated here.'}
              headline={'2. Kraft Heinz leverage'}
              subhead={'Values based on your inputs above'}
            />
          </div>
          <div className="output-container">
            <Card
              data={buffett3GOwnershipData}
              text={'Buffett/3G presently own just over half of Kraft Heinz. In calculating any given Buffett/3G contribution to an acquisition, the smaller the target company, the greater proportion of Kraft Heinz these investors will own.'}
              headline={'3. Buffett/3G creeping ownership of Kraft Heinz'}
              subhead={'percentage point difference from current ownership, values based on your inputs above'}
            />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('react-container'));
