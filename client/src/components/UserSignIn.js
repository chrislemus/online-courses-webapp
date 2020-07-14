import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignIn extends Component {
    state = {
        emailAddress: '',
        password: '',
        errors: [],
    }

    render() {
        const {
            emailAddress,
            password,
            errors
        } = this.state;
        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign In</h1>
                    <div>
                        <Form
                            cancel={this.cancel}
                            errors={errors}
                            submit={this.submit}
                            submitButtonText="Sign In"
                            elements={() => (
                                <React.Fragment>
                                    <input 
                                        id="emailAddress" 
                                        name="emailAddress" 
                                        type="text" 
                                        value={emailAddress} 
                                        onChange={this.change} 
                                        placeholder="Email"/>
                                    <input
                                        id="password" 
                                        name="password" 
                                        type="password" 
                                        value={password} 
                                        onChange={this.change} 
                                        placeholder="password"/>
                                </React.Fragment>
                            )}
                        />
                    </div>
                    <p>&nbsp;</p>
                    <p>Don't have a user account? <Link to="signup">Click here</Link> to sign up!</p>
                </div>
            </div>
        );
    }

    /**
     * 
     * @param {input field} event updates corresponding component state based on user input
     */    
    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState(() => {
            return {
                [name]: value
            };
        })
    }

    //makes a GET user request to api. If user is authenticated, user is redirected to previous visited page or homepage
    submit = async() => {
        const { context } = this.props;
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { emailAddress, password } = this.state;

        await context.data.getUser(emailAddress, password).then(res => {
            const { data, error } = res
            if (data) {
                context.actions.signIn(data)
                this.props.history.push(from)
                context.actions.refreshPage() //this will refresh Header component to update user name
            } else if (error.type) {
                error.handleError(this)
            }
        })

    }

    //redirects user to courses page
    cancel = () => {
        this.props.history.push('/');
    }
}