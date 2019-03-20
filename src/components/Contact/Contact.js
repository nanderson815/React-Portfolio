import React from 'react';
import styles from './Contact.module.css';

const contact = (props) => {

    return (
        <div id={styles.contactCont} className="section grey lighten-5">
            <div className="row container ">
                <div className="headerContainer">
                    <h2 id={styles.contactHeader} className="header">Contact</h2>
                </div>
            </div>
        </div>
    )

}

export default contact;