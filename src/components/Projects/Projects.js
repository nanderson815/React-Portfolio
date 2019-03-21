import React, { Component } from 'react';
import styles from './Projects.module.css';
import Project from './Project';

class Projects extends Component {

    render() {
        return (
            <div id={styles.projectsCont} className="section grey lighten-4">
                <div className="row container ">
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
                        img="./images/Pail-screenshot.PNG" />

                    <Project 
                        title="AI Marketplace"
                        tech="HTML | CSS | JavaScript | Node.js | Express.js | jQuery | Handlebars | Materialize | Heroku | SQL | Sequelize | IBM Watson"
                        desc="A user-driven marketplace application that uses IBM Watson to title and tag listings automatically. 
                        AI Marketplace ensures listing are input correctly by integrating AI image recognition to the product upload process."
                        github="https://github.com/nanderson815/AI-Marketplace"
                        demo="https://serene-coast-26233.herokuapp.com/"
                        img="./images/ai-marketplace.PNG" />

                    <Project 
                        title="InstaPicker"
                        tech="HTML | CSS | JavaScript | Node.js | Express.js | jQuery | Materialize | Puppeteer | Cheerio | Google Cloud Platform"
                        desc="A node application for picking winners of Instagram Comment Contests.
                        Automates the manual process of selecting a contest winner by using a headless browser to scrape comments 
                        from an Instagram post submitted by the user. Randomly selects a winner from the comments and links to 
                        the winner’s Instagram profile."
                        github="https://github.com/nanderson815/instaGiveaway"
                        demo="http://instapicker.appspot.com/"
                        img="./images/instapicker.PNG" />
                </div>
            </div>
        )
    }
}

export default Projects;