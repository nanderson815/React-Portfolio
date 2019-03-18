import React from 'react';
import styles from './Navbar.module.css';

const navbar = (props) => {
    return (
        <div id={styles.navbarFixed}className='navbar-fixed'>
            <nav id={styles.navBar} className="transparent z-depth-0">
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
    );
}




export default navbar;