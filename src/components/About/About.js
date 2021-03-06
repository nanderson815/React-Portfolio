import React, { Component } from "react";
import styles from "./About.module.css";
import Skills from "./Skills/Skills";
import Technical from "./Technical/Technical";

class About extends Component {
  render() {
    return (
      <div id={styles.skillsCont} className="section grey lighten-5">
        <div className="row container">
          <div className="headerContainer">
            <h2 id="aboutHeader" className="header sectionHeader">
              About
            </h2>
          </div>
          <div id="skillsContainer" className="row">
            {this.props.skills.map((skill) => {
              return (
                <Skills
                  style={[styles.skillIcons, "material-icons"].join(" ")}
                  icon={skill.icon}
                  title={skill.title}
                  desc={skill.desc}
                  key={skill.id}
                />
              );
            })}
          </div>
          <div id="aboutMeRow" className="row">
            <div className="col s12 m4">
              <div className="center">
                <h4>About Me</h4>
                <img
                  alt="Noah Anderson"
                  id={styles.bioImage}
                  className={styles.shadowed}
                  src="./images/professionalPhoto2.png"
                />
                <p className="light center">
                  Software Engineer in Atlanta. I am passionate about using
                  technology to solve problems for people and businesses.
                </p>
              </div>
            </div>
            <div className="col s12 m7 offset-m1">
              <div className="row">
                <h4 id="skillsTxt" className="center">
                  Technical Skills
                </h4>
              </div>
              <div className="row">
                {this.props.tech.map((tech) => {
                  return <Technical tech={tech} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
