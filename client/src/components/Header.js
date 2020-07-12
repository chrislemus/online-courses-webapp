import React from 'react';
import { Link } from 'react-router-dom';


export default ({context}) => {
    const authUser = context.authenticatedUser;
    return (
        <header className="header">
            <div className="bounds">
                <h1 className="header--logo"><Link to="/">Courses</Link></h1>
                <nav>
                    {authUser ? (
                        <React.Fragment>
                            <span>Welcome, {authUser.name}!</span>
                            <Link to="/signout" onClick={() => context.actions.signOut()}>Sign Out</Link>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Link className="signup" to="/signup">Sign Up</Link>
                            <Link className="signin" to="/signin">Sign In</Link>
                        </React.Fragment>
                    )}
                </nav>
            </div>
        </header>
    );

 }
  
