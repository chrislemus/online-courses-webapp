import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Cookies from 'js-cookie';


export default class CourseDetail extends Component {
    
    state = {
        course: '',
        creator: '',
        currentUser: Cookies.getJSON('authenticatedUser') || null
    }

    render() {
        const {
            course
        } = this.state;
        const courseETA = course.estimatedTime

        return (
            <>                  
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100">
                            {this.userIsCourseOwner() ? (
                                <span>
                                    <Link className="button" to={`/courses/${course.id}/update`}>Update Course</Link>
                                    <button className="button" onClick={this.submit}>Delete Course</button>
                                </span>
                            ) : (
                                null
                            )}
                            
                            <Link className="button button-secondary" to="/">Return to List</Link>
                        </div>
                    </div>
                </div>
                <div className="bounds course--detail">
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{course.title}</h3>
                            <p>By {this.state.creator}</p>
                        </div>
                        <div className="course--description">
                            <ReactMarkdown source={course.description} />
                        </div>
                    </div>
                <div className="grid-25 grid-right">
                    <div className="course--stats">
                        <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                                <h4>Estimated Time</h4>
                                {courseETA ? (
                                    <h3>{courseETA}</h3>
                                ) : (
                                    <h3>Unknown</h3>
                                )}
                            </li>
                            <li className="course--stats--list--item">
                                <h4>Materials Needed</h4>
                                {course.materialsNeeded ? (
                                    <>
                                        <ReactMarkdown source={course.materialsNeeded} />
                                    </>
                                ) : (
                                    <p>None</p>
                                )}
                                
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
            </>
        );

        
    }

    //fires necessary functions once component has mounted
    async componentDidMount() {
        const { context } = this.props;
        const courseId = this.props.match.params.id
        context.data.findCourse(courseId)
            .then(res => {
                const { data, error } = res

                if (data) {
                    const user = data.user
                    this.setState({
                        course: data,
                        creator: user.firstName + " " + user.lastName,
                    })
                } else if (error.type) {
                    error.handleError(this)
                }
            })
    }


    //checks if current user is course owner
    userIsCourseOwner() {
        const {currentUser} = this.state
        const courseOwner = this.state.course.user
        if (currentUser && courseOwner) {
            if (currentUser.id === courseOwner.id) {
                return true
            }
            return false   
        }
    }   

    //deletes current course
    submit = () => {
        const { context } = this.props;
        const {emailAddress} = this.state.currentUser;
        const courseId = this.state.course.id;
        const password = context.authenticatedUser.password;

        context.data.deleteCourse(emailAddress, password, courseId)
            .then(res => {
                const { data, error } = res
                if (data) {
                    this.props.history.push("/")
                } else if (error.type) {
                    error.handleError(this)
                }
            })
    }
}