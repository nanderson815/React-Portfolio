import React from 'react';
import styles from './Projects.module.css';

const project = (props) => {

    return (
        <div className={styles.project}>
            <div className="row">
                <div className="col s12 m6">
                    <h4>{props.title}</h4>
                    <h5>{props.tech}</h5>
                    <p>{props.desc}</p>
                    <a href={props.github} className={[styles.button, "waves-effect waves-light btn blue darken-4"].join(' ')}>Github</a>
                    <a href={props.demo} className={[styles.button, "waves-effect waves-light btn blue darken-4"].join(' ')}>Demo</a>
                    
                </div>
                <div className="col s12 m6">
                    <img className={[styles.portfolioImg, "z-depth-4"].join(' ')} alt="Pail Budger App" src={props.img}></img>
                </div>
            </div>
        </div>
    )
}

export default project;
