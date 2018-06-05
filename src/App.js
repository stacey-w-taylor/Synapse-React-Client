import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as synapseClient from './SynapseClient.js';

class App extends Component {
  state = {}

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Synapse React Client Demo</h2>
        </div>
        <p className="App-intro">
          Synapse production version: {this.state.version}
        </p>
      </div>
    );
  }

  componentDidMount() {
    // Note, your component should have an optional property to change the endpoint (necessary for Synapse.org integration).
    // synapseClient.getVersion('https://repo-staging.prod.sagebase.org')
      synapseClient.getVersion()
      .then(data => this.setState(data))
      .catch(function (error) {
        // Handle HTTPError.  Has statusCode and message.
      });
  }
}

export default App;
