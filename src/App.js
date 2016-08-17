import React, { Component } from 'react';
import d3 from 'd3';

const getData = (filerId, url) => new Promise((res,rej) => {

    d3.json(url(filerId) , (err,data) => {
      if(err) {
        rej('failed at promise',err);
      }
      res(data);
    })
  });

class App extends Component {
  constructor() {
    super()
    this.state = {
      data: null
    }
    this.transactions = this.transactions.bind(this)
  }

  transactions(filer_id) {
    return `${this.state.API_ROOT}current_candidate_transactions_in/${filer_id}/`;
  }

  componentWillMount(nextProps, nextState) {
    this.setState({
      API_ROOT: `http://54.213.83.132/hackoregon/http/`,
      filerId: 5591 })
    getData(this.state.filerId, this.transactions).then(data => {
      let dataSet = d3.nest()
        .key((d) => {
          switch (d.book_type) {
          case null:
            return 'not needed';
          case 'Business Entity':
          case 'Political Committee':
          case 'Individual':
            return d.book_type;
          default:
            return 'not needed';
          }
        })
      .key(d => {
          return d.contributor_payee;
        })
        .rollup((v) => ({ sum: d3.sum(v, d => d.amount)}))
        .entries(this.state.data)
      dataSet.shift();
      console.log('nest:', dataSet)
      let donorTransactions =  `${this.state.API_ROOT}transactions_by_alias/${this.state.data.name}/`
      let dataSetTwo = {
        "name": this.state.data[0].filer,
        "children": dataSet.map(bookTypes => {
            return {
              "name": bookTypes.key,
              "children": bookTypes.values.filter(transactions => transactions.values.sum > 5000).map(transactions => ({
                "name": transactions.key,
                "amount": transactions.values.sum
              }))
            }})
          }
      this.setState({ data: dataSetTwo });
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.data) {
      return this.state.data.name === nextState.data.name
    } else {
      return false
    }
  }

  render() {
    console.log("hello from render")
      const width = 800,
        height = 600,
        nodeRadius = 4;
      const svg = d3.select('.App')
        .append('svg')
        .attr({
          width: width,
          height: height
        });
      const radius = width / 3;
      const mainGroup = svg.append('g')
        .attr("transform", "translate(" + radius + "," + radius + ")");
      const cluster = d3.layout.cluster()
        .size([360, radius - 40]);
      const nodes = cluster.nodes(data);
      const links = cluster.links(nodes);
      const diagonal = d3.svg.diagonal.radial()
        .projection(d => {
          return [
            d.y,
            d.x / 180 * Math.PI
          ];
        });
      mainGroup.selectAll('path')
        .data(links)
        .enter()
        .append('path')
        .attr({
          'd': diagonal,
          fill: 'none',
          stroke: '#ccc',
          'stroke-width': 1
        });
      const nodeGroups = mainGroup.selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .attr("transform", d => {
          return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
        });
      nodeGroups.append("circle")
        .attr({
          r: nodeRadius,
          fill: '#fff',
          stroke: 'tomato',
          'stroke-width': 1.5
        });
      nodeGroups.append("text")
        .attr({
          dy: ".31em",
          'text-anchor': d => {
            return d.x < 180 ? "start" : "end";
          },
          'transform': d => {
            return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
          }
        })
        .style('font', '10px Open Sans')
        .text(d => {
          return d.name;
        });
    return (
      <div className="App"></div>
    );
  }
}

export default App;
