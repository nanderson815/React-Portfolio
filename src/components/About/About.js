import React from 'react';
import styles from './About.module.css';
import Skills from './Skills/Skills';

const about = (props) => {
    return (
        <div id={styles.skillsCont} className="section grey lighten-5">
            <div className="container">
                <div className="row">
                    <h2 id={styles.skillsHeader} className="header">About</h2>
                </div>

                <div id="skillsContainer" className="row">
                    <Skills
                        style={[styles.skillIcons, "material-icons"].join(' ')}
                        icon="person_pin"
                        title="User Focused"
                        desc="I understand that it's not enough for your project to just 'work'. It needs to work beautifully."
                    />
                    <Skills
                        style={[styles.skillIcons, "material-icons"].join(' ')}
                        icon="group"
                        title="Team Oriented"
                        desc="I have extensive experience working in groups to deliver the best possible service and results
                            for every stakeholder."
                    />
                    <Skills
                        style={[styles.skillIcons, "material-icons"].join(' ')}
                        icon="settings"
                        title="Results Driven"
                        desc="No matter what the task, I ensure that it is completed to the best of
                            my ability."
                    />
                </div>
            </div>
        </div>
    )
};

export default about;