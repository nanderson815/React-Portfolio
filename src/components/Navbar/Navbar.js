import React from 'react';
import styles from './Navbar.module.css';

const navbar = (props) => {

    let navBarClass = '';

    if (props.scroll){
        navBarClass = 'transparent z-depth-0';
    } else {
        navBarClass = 'z-depth-0 blue darken-4'
    }

    return (
        <div>
            <ul className="sidenav" id="mobile-menu">
                <li>
                    <div className="user-view">
                        <div className="background">
                            <img alt="Portfolio Background" className="responsive-img" src="./images/portfolio-background.jpg" />
                        </div>
                        <a href="#user"><img alt="Noah Anderson" className="circle" src="./images/professionalPhoto2.jpg" /></a>

                        <a href="#name"><span className="white-text name">Noah Anderson</span></a>
                        <a href="mailto:NAnderson815@gmail.com"><span className="white-text email">Nanderson815@gmail.com</span></a>
                    </div>
                </li>
                <li><a className="waves-effect" href="#skillsCont">About</a></li>
                <li><a className="waves-effect" href="#projectsCont">Projects</a></li>
                <li><a className="waves-effect" href="#contactCont">Contact</a></li>
                <li>

                    <a href="https://www.linkedin.com/in/noah-anderson-ba844b6b/"><i className="fab fa-linkedin-in fa-2x"></i></a>
                    <a href="https://github.com/nanderson815"><i className="fab fa-github fa-2x"></i></a>

                </li>
            </ul>

            <div id={styles.navbarFixed} className='navbar-fixed'>
                <nav id={styles.navBar} className={navBarClass}>
                    <div className="container nav-wrapper">
                        <div id={styles.headerName} className="brand-logo">Noah Anderson</div>
                        <a href="#!" data-target="mobile-menu" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                        <ul className="right hide-on-med-and-down">
                            <li><a href="#skillsCont">About</a></li>
                            <li><a href="#projectsCont">Projects</a></li>
                            <li><a href="#contactCont">Contact</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    );
}




export default navbar;