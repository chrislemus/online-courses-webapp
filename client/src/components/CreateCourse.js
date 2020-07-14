import React, { Component } from 'react';
import PasswordAuth from './passwordAuth';
import Form from './Form';
import Cookies from 'js-cookie';

export default class CreateCourse extends Component {

    state = {
        authRequired: false, //display password authentication
        invalidPass: false, //display "invalid password" message in lightbox
        password: "",
        currentUser: Cookies.getJSON('authenticatedUser') || null,
        errors: [],
        title: "",
        description: "",
        estimatedTime: "",
        materialsNeeded: "",
    }


    render() {
        const {
            authRequired,
            invalidPass,
            password,
            currentUser,
            title,
            description,
            estimatedTime,
            materialsNeeded
        } = this.state
        const {
            errors,
        } = this.state;

        return (
            <div> 
                {authRequired ? (
                    <>
                        <PasswordAuth
                            cancel={this.cancelAuth}
                            invalidPass={invalidPass}
                            submit={this.submit}
                            submitButtonText="Delete"
                            elements={() => (
                                <React.Fragment>
                                    <input 
                                        id="password" 
                                        name="password" 
                                        type="password" 
                                        value={password}
                                        onChange={this.change}  
                                        placeholder="Password"/>
                                </React.Fragment>
                            )}
                        />

                    </>) : (
                        null
                )}
                <div className="courseForm">
                    <Form
                        cancel={this.cancel}
                        errors={errors}
                        submit={this.requireAuth}
                        submitButtonText="Create Course"
                        elements={() => (
                            <React.Fragment>
                                <div className="grid-66">
                                    <div className="course--header">
                                        <h4 className="course--label">Course</h4>
                                        <div>
                                            <input 
                                                id="title" 
                                                name="title" 
                                                type="text" 
                                                className="input-title course--title--input" 
                                                placeholder="Course title..." 
                                                onChange={this.change}
                                                value={title} />
                                        </div>
                                        <p>By {currentUser.name}</p>
                                    </div>
                                    <div className="course--description">
                                        <div>
                                        <textarea 
                                            id="description" 
                                            name="description" 
                                            className="" 
                                            onChange={this.change}
                                            value={description}
                                            placeholder="Course description..."/>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid-25 grid-right">
                                    <div className="course--stats">
                                        <ul className="course--stats--list">
                                            <li className="course--stats--list--item">
                                                <h4>Estimated Time</h4>
                                                <div>
                                                    <input 
                                                        id="estimatedTime" 
                                                        name="estimatedTime" 
                                                        type="text" 
                                                        className="course--time--input"placeholder="Hours" 
                                                        onChange={this.change}
                                                        value={estimatedTime}/>
                                                </div>
                                            </li>
                                            <li className="course--stats--list--item">
                                                <h4>Materials Needed</h4>
                                                <div>
                                                    <textarea 
                                                        id="materialsNeeded" 
                                                        name="materialsNeeded" 
                                                        className="" 
                                                        placeholder="List materials..."
                                                        onChange={this.change}
                                                        value={materialsNeeded} />
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                
                            </React.Fragment>
                        )}
                    />
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

    //triggers password authentication lightbox if user action requires authentication
    requireAuth = () => {
        this.setState({
            authRequired: true
        })
    }
    
    //removes password authentication lightbox
    cancelAuth = () => {
        this.setState({
            authRequired: false,
            password: ""
        })
    }

    //post new course to api
    submit = async() => {
        const { context } = this.props;
        const {
            currentUser,
            password,
            title,
            description,
            estimatedTime,
            materialsNeeded

        } = this.state

        const user = {
            emailAddress: currentUser.emailAddress,
            password
        }

        const newCourse = {
            userId: currentUser.id,
            estimatedTime,
            materialsNeeded
        }

        if (title.length ) {
            newCourse.title = title
        }
        if (description.length) {
            newCourse.description = description
        }
        

        await context.data.CreateCourse(newCourse, user)
            .then(res => {
                const { data, error } = res
                console.log(data)
                if (data) {
                    this.props.history.push("/")
                } else if (error.type) {
                    error.handleError(this)
                }
            })
    }

    //stops creating course and redirects to homepage
    cancel = () => {
        this.props.history.push('/');
    }
}

