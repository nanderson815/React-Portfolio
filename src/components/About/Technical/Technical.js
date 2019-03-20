import React from 'react';
import styles from './Technical.module.css';

const technical = (props) => {
    return (
        <div className="col s6 m4">
            <div className="card blue darken-4">
                <div className="card-content white-text hoverable">
                   <p className={styles.techName}>{props.tech}</p>
                </div>
            </div>
        </div>
    )
}

export default technical;