import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext();

export class Provider extends Component {

    state = {
        authenticatedUser: Cookies.getJSON('authenticatedUser') || null
    };

    constructor() {
        super();
        this.data = new Data();
    }

    render() {
        const { 
            authenticatedUser,
        } = this.state;
        const value = {
            authenticatedUser,
            data: this.data,
            actions: {
                signIn: this.signIn,
                signOut: this.signOut,
                refreshPage: this.refreshPage
            }
        };
        return (
            <Context.Provider value={value}>
                {this.props.children}
            </Context.Provider>
        );
    }

    //saves user information in cookie as well as component state
    signIn = async (user) => {
        this.setState(() => {
            return {
                authenticatedUser: user,
            }
        });
        const cookieOptions = {
            expires: 1 //1 day
        };
        Cookies.set('authenticatedUser', JSON.stringify({
            id: user.Id, 
            name: user.Name, 
            emailAddress: user.Email
        }), cookieOptions);
    }

    //deletes user information from cookie as well as component state
    signOut = () => {
        this.setState({ authenticatedUser: null });
        Cookies.remove('authenticatedUser');
    }

    //reloads page. helps update component info
    refreshPage = () => {
        window.location.reload(false);
    }

}

export const Consumer = Context.Consumer;

/**
* A higher-order component that wraps the provided component in a Context Consumer component.
* @param {class} Component - A React component.
* @returns {function} A higher-order component.
*/

export default function withContext(Component) {
    return function ContextComponent(props) {
        return (
            <Context.Consumer>
                {context => <Component {...props} context={context} />}
            </Context.Consumer>
        );
    }
}