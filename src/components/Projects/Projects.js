import React, { Component } from 'react';
import styles from './Projects.module.css';
import Project from './Project';

class Projects extends Component {

    render() {
        return (
            <div id={styles.projectsCont} className="section grey lighten-4">
                <div className="row container">
                    <div className="headerContainer">
                        <h2 id={styles.projectsHeader} className="header">Projects</h2>
                    </div>
                    <Project
                        title="Pail - Simple Budgeting App"
                        tech="HTML | CSS | Firebase | Plaid API | JavaScript | jQuery | Node.js | Materialize"
                        desc="A mobile-first web application that simplifies budgeting by sorting expenses 
                        into two primary categories: Recurring Expenses (Rent, Mortgage, Car Payment, Groceries, etc.) 
                        and Discretionary Income (Bars, Shopping, etc.)."
                        github="https://github.com/nanderson815/Pail---Budget-Application"
                        demo="https://fathomless-stream-39221.herokuapp.com/"
                        img="./images/pail-screenshot.PNG" />
                </div>
            </div>
        )
    }
}

export default Projects;