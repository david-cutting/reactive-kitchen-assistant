import React, { Component } from 'react';
import './App.css';
import InterfaceFramework from './components/InterfaceFramework';
import { Route, Router } from "react-router-dom";
import createHistory from 'history/createBrowserHistory'
import Nav from './App.json'

import MyPantry from "./components/MyPantry";

const history = createHistory();
history.listen((location, action) => {
    for (let NavItem in Nav.App["primary-nav"]) {
        if(Nav.App["primary-nav"][NavItem].path === location.pathname) {
            document.getElementById('page-title').innerHTML = Nav.App["primary-nav"][NavItem].name;
            return;
        }
    }
    for (let NavItem in Nav.App["secondary-nav"]) {
        if(Nav.App["secondary-nav"][NavItem].path === location.pathname) {
            document.getElementById('page-title').innerHTML = Nav.App["secondary-nav"][NavItem].name;
            break;
        }
    }
});


class App extends Component {
    state = {users: []}

    componentDidMount() {
        fetch('/users')
            .then(res => res.json())
            .then(users => this.setState({ users }));
    }

    render() {
        return (
            <Router history={history}>
                <div className="App">
                    <InterfaceFramework>
                        <h1>Users</h1>
                        {this.state.users.map(user =>
                            <div key={user.id}>{user.username}</div>
                        )}
                        <Route path="/my-pantry" component={MyPantry}/>
                    </InterfaceFramework>
                </div>
            </Router>
        );
    }
}

export default App;