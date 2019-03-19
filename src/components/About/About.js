import React from 'react';
import styles from './About.module.css';

const about = (props) => {
    return (
        <div id="skillsCont" className="section grey lighten-5">
            <div className="container">
                <div className="row">
                    <h2 id="skillsHeader" className="header">About</h2>
                </div>

            <div id="skillsContainer" className="row">
                    <div className="col m4">
                        <div className="center promo promo-example">
                            <i className="material-icons skill-icons">person_pin</i>
                            <h4 className="promo-caption">User Focused</h4>
                            <p className="light center">I understand that it's not enough for your project to just "work". It
                            needs to work beautifully. </p>
                        </div>
                    </div>
                    <div className="col m4">
                        <div className="center promo promo-example">
                            <i className="material-icons skill-icons">group</i>
                            <h4 className="promo-caption">Team Oriented</h4>
                            <p className="light center">I have extensive experience working in groups to deliver the best
                                possible service and results
                            for every stakeholder.</p>
                        </div>
                    </div>
                    <div className="col m4">
                        <div className="center promo promo-example">
                            <i className="material-icons skill-icons">settings</i>
                            <h4 className="promo-caption">Results Driven</h4>
                            <p className="light center">No matter what the task, I ensure that it is completed to the best of
                            my ability.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default about;