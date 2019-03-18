import React, { Component } from 'react';
import './App.css';
import Navbar from '../components/Navbar/Navbar';
import Header from '../components/Header/Header';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <header className="App-header">
         <h1>Hello, I am a react app.</h1>
        </header>

      </div>
    );
  }
}

export default App;
