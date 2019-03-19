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
                        {this.props.skills.map((skill) => {
                            return (
                                <Skills
                                    style={[styles.skillIcons, "material-icons"].join(' ')}
                                    icon={skill.icon}
                                    title={skill.title}
                                    desc={skill.desc}
                                    key={skill.id}
                                />
                            )
                        })
                        }
                    </div>
                    <div id="aboutMeRow" class="row">
                        <div class="col s12 m4">
                            <div class="center">
                                <img alt="Noah Anderson" id={styles.bioImage} class={styles.shadowed} src="./images/professionalPhoto2.png" />
                                <h4>About Me</h4>
                                <p class="light center">Full-Stack web developer and financial professional in Atlanta.
                                    I am passionate about using technology to solve financial problems.
                        </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

};

export default About;