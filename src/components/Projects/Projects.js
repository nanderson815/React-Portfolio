import React, { Component } from "react";
import styles from "./Projects.module.css";
import Project from "./Project";
import projects from "../../data/projects.json";

class Projects extends Component {
  render() {
    return (
      <div id={styles.projectsCont} className="section grey lighten-4">
        <div className="row container">
          <div className="headerContainer">
            <h2 id="projectsHeader" className="header sectionHeader">
              Projects
            </h2>
          </div>

          {projects.data.map((project) => {
            const { title, tech, desc, github, demo, img } = project;
            return (
              <Project
                title={title}
                tech={tech.join(" | ")}
                desc={desc}
                github={github}
                demo={demo}
                img={img}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Projects;
