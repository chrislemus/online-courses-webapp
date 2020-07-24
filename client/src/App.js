import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';



import Header from './components/Header';
import CourseDetail from './components/CourseDetail';
import Courses from './components/Courses';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import UserSignUp from './components/UserSignUp';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import error from './components/UnhandledError'

import PrivateRoute from './PrivateRoute'; //authemnticates user before giving access to page

import withContext from './Context';// gives components acces to Context Provider

const HeaderWithContext = withContext(Header);
const CoursesWithContext = withContext(Courses);
const CourseDetailWithContext = withContext(CourseDetail)
const UserSignInWithContext = withContext(UserSignIn);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignOutWithContext = withContext(UserSignOut)
const UpdateCourseWithContext = withContext(UpdateCourse);
const CreateCourseWithContext = withContext(CreateCourse);

export default () => (
  <Router>
    <div>
      <HeaderWithContext />

      <Switch>
        <Route exact path="/" component={CoursesWithContext} />
        <PrivateRoute path="/courses/create" component={CreateCourseWithContext} />
        <PrivateRoute path="/courses/:id/update" component={UpdateCourseWithContext} />
        <Route path="/courses/:id" component={CourseDetailWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route path="/forbidden" component={Forbidden} />
        <Route path="/error" component={error} />
        <Route path="/notfound" component={NotFound} />
        <Redirect from='*' to='/notfound' />

      </Switch>


    </div>
  </Router>
);

