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
        this.sendMail = this.sendMail.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event) {
        console.log(this.state);
        let form = this.refs.form1;
        if (form.checkValidity()) {

            event.preventDefault();

            let data = {
                service_id: 'gmail',
                template_id: 'template_mjYN8BQS',
                user_id: 'user_MXAiEo7cocXKDbNvoFujf',
                template_params: {
                    from_name: this.state.firstName + " " + this.state.lastName,
                    message_html: this.state.message,
                    from_email: this.state.email,
                    reply_to: 'nanderson815@gmail.com'
                }
            }
            this.sendMail(data);
        };
        
    }

    sendMail(data) {
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function () {
            alert("Message Sent!");
            window.location.reload();
        });
    }

    render() {
        return (
            <div id={styles.contactCont} className="section grey lighten-5">
                <div className="row container ">
                    <div className="headerContainer">
                        <h2 id={styles.contactHeader} className="header">Contact</h2>
                    </div>

                    <form id="form1" ref="form1" onSubmit={this.handleSubmit} className="col s12">
                        <div className="row">
                            <div className="input-field col s6">
                                <input id="firstName" className="validate" required aria-required="true" name="firstName" type="text" value={this.state.firstName} onChange={this.handleChange} />
                                <label htmlFor="firstName">First Name</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="lastName" className="validate" required aria-required="true" name="lastName" type="text" value={this.state.lastName} onChange={this.handleChange} />
                                <label htmlFor="lastName">Last Name </label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="email" className="validate" required aria-required="true" name="email" type="email" value={this.state.email} onChange={this.handleChange} />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <textarea id="message" required aria-required="true" name="message" className="materialize-textarea validate" value={this.state.message} onChange={this.handleChange} />
                                <label htmlFor="message">Your Message</label>
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