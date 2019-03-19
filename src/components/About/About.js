import React, { Component } from 'react';
import styles from './About.module.css';
import Skills from './Skills/Skills';

class About extends Component {

    render() {
        return (
            <div id={styles.skillsCont} className="section grey lighten-5">
                <div className="container">
                    <div className="row">
                        <h2 id={styles.skillsHeader} className="header">About</h2>
                    </div>
                    <div id="skillsContainer" className="row">
                        {this.props.skills.map((skill, index) => {
                            return (
                                <Skills
                                    style={[styles.skillIcons, "material-icons"].join(' ')}
                                    icon={skill.icon}
                                    title={skill.title}
                                    desc={skill.desc}
                                    key={skill.id}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

};

export default About;