import React, { Component } from 'react';
import styles from './Projects.module.css';

class Projects extends Component {

    render() {
        return (
            <div id={styles.projectsCont} className="section grey lighten-4">
                <div className="row container">
                    <div className="headerContainer">
                        <h2 id={styles.projectsHeader} className="header">Projects</h2>
                    </div>
                </div>
            </div>
        )
    }
}

export default Projects;