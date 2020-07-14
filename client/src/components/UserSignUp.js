import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignUp extends Component {
    state = {
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
        confirmPassword:'',
        errors: [],
    }

    render() {
        const {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword,
            errors,
        } = this.state;

        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    <div>
                        
                        <Form
                            cancel={this.cancel}
                            errors={errors}
                            submit={this.submit}
                            submitButtonText="Sign Up"
                            elements={() => (
                                <React.Fragment>
                                    <input 
                                        id="firstName" 
                                        name="firstName" 
                                        type="text" 
                                        value={firstName} 
                                        onChange={this.change} 
                                        placeholder="First Name"/>
                                    <input
                                        id="lastName" 
                                        name="lastName" 
                                        type="text" 
                                        value={lastName} 
                                        onChange={this.change} 
                                        placeholder="Last Name"/>
                                    <input 
                                        id="emailAddress" 
                                        name="emailAddress" 
                                        type="text" 
                                        value={emailAddress} 
                                        onChange={this.change} 
                                        placeholder="Email Address"/>
                                    <input 
                                        id="password" 
                                        name="password" 
                                        type="password" 
                                        value={password}
                                        onChange={this.change}  
                                        placeholder="Password"/>
                                    <input 
                                        id="confirmPassword" 
                                        name="confirmPassword" 
                                        type="password" 
                                        value={confirmPassword} 
                                        onChange={this.change} 
                                        placeholder="Confirm Password"/>
                                </React.Fragment>
                            )}
                        />
                    </div>
                    <p>&nbsp;</p>
                    <p>Already have a user account? 
                        <Link to="/signin">Click here</Link> to sign in!
                    </p>
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

    //makes a POST user request to api, if request is succesful, user is redirected to courses page
    submit = async() => {
        const { context } = this.props;
        const {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword
        } = this.state;

        //make sure password and confirm pass word matches
        if(password && password !== confirmPassword ) {
            this.setState({
                errors: ["password and confirm password does not match"]
            })
            return
        }

        const user = {};

        //property/value will only be added to user object if not empty
        if (firstName.length) {
            user.firstName = firstName
        }
        if (lastName.length) {
            user.lastName = lastName
        }

        if (emailAddress.length) {
            user.emailAddress = emailAddress
        }
        if (password) {
            user.password = password
        }

        await context.data.createUser(user)
            .then(res => {
                const { data, error } = res
                if (data) {
                    this.signInUser(emailAddress, password)
                } else if (error.type) {
                    error.handleError(this)
                }
            })
        

    }

    //makes a GET user request to api. If user is authenticated, user is redirected to previous visited page or homepage
    signInUser = async(emailAddress, password) =>{
        const { context } = this.props;
        await context.data.getUser(emailAddress, password).then(res => {
            const { data, error } = res
            if (data) {
                context.actions.signIn(data)
                this.props.history.push("/") //redirects to home page for courses
                context.actions.refreshPage() //this will refresh Header component to update user name
            } else if (error.type) {
                error.handleError(this)
            }
        })
    }

    //returns to courses page
    cancel = () => {
        this.props.history.push('/');
    }
}