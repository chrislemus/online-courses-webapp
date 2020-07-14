import config from './config';

export default class Data {
    //fetches api
    api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
        const url = config.apiBaseUrl + path;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
        };

        if (body !== null) {
            options.body = JSON.stringify(body);
        }

        if (requiresAuth) {
            const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
        }
        return fetch(url, options)
    }

    /**
     * 
     * @param {string} emailAddress 
     * @param {string} password 
     */
    async getUser(emailAddress, password) {
        const response = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
        return this.handleApiReq(response)
    }

    /**
     * 
     * @param {object} user  required props are firstName, lastName, emailAddress, and password.
     */
    async createUser(user) {
        const response = await this.api('/users', 'POST', user);
        return this.handleApiReq(response)
    }

    /**
     * 
     * @param {strin} emailAddress 
     * @param {string} password 
     * @param {string} CourseId 
     */
    async deleteCourse(emailAddress, password, CourseId) {
        const response = await this.api(`/courses/${CourseId}`, 'DELETE', null, true, { emailAddress, password });
        return this.handleApiReq(response)
    }

    async getCourses() {
        const response = await this.api("/courses")
        return this.handleApiReq(response)
    }

    /**
     * 
     * @param {string} courseId 
     */
    async findCourse(courseId) {
        const response = await this.api(`/courses/${courseId}`)
        return this.handleApiReq(response)
    }

    /**
     * 
     * @param {object} newCourse "userId", "title", and "description". Optional props are "materialsNeeded" and "estimatedTime".
     * @param {object} user "email address" and "password".
     */
    async CreateCourse(newCourse, user) {
        const response = await this.api('/courses', 'POST', newCourse, true, user);
        return this.handleApiReq(response)
    }

    /**
     * 
     * @param {string} courseId 
     * @param {object} update any new updated content. "title", "description", "materialsNeeded", and "estimatedTime".
     * @param {object} user email address and password
     */
    async updateCourse(courseId, update, user) {
        const response = await this.api(`/courses/${courseId}`, 'PUT', update, true, user);
        return this.handleApiReq(response)
    }

    //iterates through api response data and returns a more clean object containing "data" and "error" properties
    //if api request was successful "data" property will be truthy
        // else if api returns data, data will be stored in data property
    //error property contains "type", "msg", and "handleError" function
        //if there are any errors, "error.type" will store error status and "error.msg" will contain any error messages from api
    async handleApiReq(res) {
        let  data  = false;
        let error = {
            type: null,
            msg: []
        };

        if (res.status === 200) {
            data =  await res.json().then( data => {
                return data
            })
        } else if (res.status === 201) {
            data = true
        } else if (res.status === 204) {
            data = true
        } else if (res.status === 304) {
            data =  await res.json().then( data => {
                return data
            })
        } else if (/^4/.test(res.status)) {
            error.type = res.status
        } else {
            error.type = 500
        }
        
        
        error.handleError = this.handleError(error.type, res);
        const apiRes = { data, error };
        return apiRes
    }

    /**
     * 
     * @param {*} err error type
     * @param {*} res api response
     * this will find corresponding error type and run commands accordingly
     */
    handleError(err, res) {
        return((component) => {
            if (err === 400) {
                res.json().then(errs => {
                    const errors = errs.errors
                    component.setState({errors})

                    if (component.cancelAuth) {
                        component.cancelAuth()
                    }
                })

            } else if (err === 401) {
                if (component.state.invalidPass) {
                    component.setState({ invalidPass: true })
                } else {
                    component.setState({ errors: ['Sign-in was unsuccessful '] })
                }
                
            } else if (err === 403) {
                component.props.history.push("/forbidden")
            } else if (err === 404) {
                component.props.history.push("/notfound")
            }else if (err === 500) {
                component.props.history.push("/error")
            }
        })
    }


}