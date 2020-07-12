import React, { Component } from 'react';
import PasswordAuth from './passwordAuth';
import Form from './Form';
import Cookies from 'js-cookie';


export default class UpdateCourse extends Component {

    state = {
        authRequired: false, //display "invalid password" message in lightbox
        invalidPass: false, //check whether password is valid
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
            <div> {authRequired ? (
                <>
                            
                            <PasswordAuth
                                cancel={this.cancelAuth}
                                invalidPass={invalidPass}
                                submit={this.submit}
                                submitButtonText="Update course"
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
                <Form
                    cancel={this.cancel}
                    errors={errors}
                    submit={this.requireAuth}
                    submitButtonText="Update course"
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
        );
    }

    //fires necessary functions once component has mounted
    async componentDidMount() {
        const { context } = this.props;
        const courseId = this.props.match.params.id
        //find course and updates form input fields
        await context.data.findCourse(courseId).then(res => {
            const {data, error} = res
            if(data) {
                const ownerId = data.user.id;
                const currentUserId = this.state.currentUser.id
                //confirms wether current user is course owner. Else user will be redirected
                if (ownerId !== currentUserId) {
                    this.props.history.push('/forbidden');
                }
        
                const {
                    title,
                    description,
                    estimatedTime,
                    materialsNeeded
                } = data
        
                this.setState({
                    title,
                    description,
                    estimatedTime,
                    materialsNeeded
                })
            } else if(error.type){
                error.handleError(this)
            }
        })



    }

    change = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
                [name]: value
        })
    }

    requireAuth = () => {
        this.setState({
            authRequired: true
        })
    }

    cancelAuth = () => {
        this.setState({
            authRequired: false,
            password: ""
        })
    }

    submit = () => {
        const { context } = this.props;
        const {
            currentUser,
            password,
            title,
            description,
            estimatedTime,
            materialsNeeded

        } = this.state

        const courseId = this.props.match.params.id

        const user = {
            emailAddress: currentUser.emailAddress,
            password
        }

        const newCourse = {
            userId: currentUser.id,
            estimatedTime,
            materialsNeeded
        }

        if (description.length) {
            newCourse.description = description
        }
        if (title.length) {
            newCourse.title = title
        }        

        context.data.updateCourse(courseId, newCourse, user)
            .then( res => {
                const {data, error} = res
                if(data) {
                    this.props.history.push(`/courses/${courseId}`);
                } else if(error.type){
                    error.handleError(this)
                }
            })
    }

    cancel = () => {
        this.props.history.push('/');
    }
}

