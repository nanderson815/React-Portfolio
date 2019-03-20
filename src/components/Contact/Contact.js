import React from 'react';
import styles from './Contact.module.css';

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            message: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        console.log(this.state);
        event.preventDefault();
    }

    render() {
        return (
            <div id={styles.contactCont} className="section grey lighten-5">
                <div className="row container ">
                    <div className="headerContainer">
                        <h2 id={styles.contactHeader} className="header">Contact</h2>
                    </div>

                    <form onSubmit={this.handleSubmit} className="col s12">
                        <div className="row">
                            <div className="input-field col s6">
                                <input name="firstName" type="text" value={this.state.firstName} onChange={this.handleChange} />
                                <label>
                                    First Name
                                </label>
                            </div>
                            <div className="input-field col s6">
                                <input name="lastName" type="text" value={this.state.lastName} onChange={this.handleChange} />
                                <label>
                                    Last Name
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input name="email" type="email" value={this.state.email} onChange={this.handleChange} />
                                <label>
                                    Email
                                </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <textarea name="message" className="materialize-textarea" value={this.state.message} onChange={this.handleChange} />
                                <label>
                                    Your Message
                                </label>
                            </div>
                        </div>

                        <button type="submit" value="Submit" className="btn waves-effect waves-light blue darken-4">
                            Submit</button>

                    </form>
                </div>
            </div >
        );
    }
}

export default Contact;