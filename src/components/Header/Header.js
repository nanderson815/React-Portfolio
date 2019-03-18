import React from 'react';
import styles from './Header.module.css';
import Navbar from '../Navbar/Navbar';

const header = (props) => {
    return (
        <div id={styles.background}>
            <Navbar />
            <div id={styles.headerImage} className="valign-wrapper">
                <div className="row container center">
                    <div>
                        <h2 id={styles.TitleText} className="headerTxt white-text slideRight">Hello, I'm <span
                            className="blue-text text-accent-2">NoahAnderson</span>.</h2>
                        <h4 className="headerTxt white-text slideLeft">I'm a full-stack web developer. </h4>
                        <a href="#projectsCont" className="waves-effect waves-light blue darken-4 btn-large fadeIn">&lt; View my
                    Work /&gt;</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default header;