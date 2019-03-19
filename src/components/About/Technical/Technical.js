import React from 'react';
import styles from './Technical.module.css';

const technical = (props) => {
    return (
        <div className="col s6 m3">
            <div className="card blue darken-4">
                <div className="card-content white-text hoverable">
                   <p>{props.tech}</p>
                </div>
            </div>
        </div>
    )
}

export default technical;