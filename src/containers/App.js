import React, { Component } from 'react';
import './App.css';
import Header from '../components/Header/Header';

class App extends Component {
  state = {
    isTop: true,
  };

  componentDidMount() {
    document.addEventListener('scroll', () => {
      const isTop = window.scrollY < 100;
      if (isTop !== this.state.isTop) {
        this.setState({ isTop })
      }
    });
  }

  render() {
    
    return (
      <div className="App">
        <Header scroll={this.state.isTop}/>
        
      </div>
    );
  }
}

export default App;
