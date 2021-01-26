import React, { Component } from "react";
import "./App.css";
import Header from "../components/Header/Header";
import About from "../components/About/About";
import Projects from "../components/Projects/Projects";
import Contact from "../components/Contact/Contact";
import techSkills from "../data/tech.json";
import skills from "../data/skills.json";

class App extends Component {
  state = {
    isTop: true,
  };

  // Changes the scroll bar transparency. Only rerenders when boolean changes.
  componentDidMount() {
    document.addEventListener("scroll", () => {
      const isTop = window.scrollY < 100;
      if (isTop !== this.state.isTop) {
        this.setState({ isTop });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <Header scroll={this.state.isTop} />
        <About skills={skills.data} tech={techSkills.data} />
        <Projects />
        <Contact />
      </div>
    );
  }
}

export default App;
