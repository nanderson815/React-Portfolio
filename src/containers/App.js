import React, { Component } from 'react';
import './App.css';
import Header from '../components/Header/Header';
import About from '../components/About/About';
import Projects from '../components/Projects/Projects';
import Contact from '../components/Contact/Contact';

class App extends Component {
  state = {
    isTop: true,
    skills: [
      {
        id: '1', icon: 'person_pin', title: 'User Focused', desc: "I understand that it's not enough for your project to just 'work'. It needs to work beautifully." },
      {
        id: '2', icon: 'group', title: 'Team Oriented', desc: 'I have extensive experience working in groups to deliver the best possible service and results for every stakeholder.' },
      {
        id: '3', icon: 'settings', title: 'Results Driven', desc: 'No matter what the task, I ensure that it is completed to the best of my ability.' },
    ],
    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "jQuery",
      "Node",
      "Express",
      "React",
      "SQL",
      "Firebase",
      "MongoDB",
      "Photoshop",
      "Illustrator",
      "Wordpress",
      "Git",
      "Materialize"
    ]
  };

  // Changes the scroll bar transparency. Only rerenders when boolean changes.
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
        <Header scroll={this.state.isTop} />
        <About 
        skills={this.state.skills}
        tech={this.state.tech}
        />
        <Projects />
        <Contact />

      </div>
    );
  }
}

export default App;
