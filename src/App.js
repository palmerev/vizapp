import React, { Component } from 'react'
import d3 from 'd3'
import _ from 'lodash'
import { getData, transactions } from './helpers'

class App extends Component {
  constructor() {
    super()
    this.state = {
      data: null
    }
    this.onButtonClick = this.onButtonClick.bind(this)
  }
  onButtonClick() {
    this.setState({ data: _.shuffle(this.state.data)})
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.data && !_.isEqual(nextState.data, this.state.data))
  }
  componentDidMount() {
    let svg = d3.select('.App').append('svg')
      .attr('width', 600)
      .attr('height', 250)
    svg.selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, index) => index * 35)
      .attr('y', data => 250 - data)
      .attr('width', 25)
      .style('height', data => data)
    this.setState({ svg: svg, data: this.props.data })
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log("nextState", nextState)
    this.state.svg.selectAll('rect')
      .data(nextState.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, index) => index * 35)
      .attr('y', data => 250 - data)
      .attr('width', 25)
      .style('height', data => data)
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.onButtonClick}>Update</button>
      </div>
    )
  }
}

export default App;
