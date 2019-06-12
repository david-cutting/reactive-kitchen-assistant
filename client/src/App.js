import React, { Component } from 'react';
import './App.css';
import InterfaceFramework from './components/InterfaceFramework';
import { Route, Router } from "react-router-dom";
import Landing from "./components/Landing";
import MyRecipes from "./components/MyRecipes";
import Pantry from "./components/Pantry";
import createHistory from 'history/createBrowserHistory'

const history = createHistory();
history.listen((location, action) => {



    console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
    console.log(`The last navigation action was ${action}`)
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
                        <Route path="/home" component={Landing}/>
                        <Route path="/my-recipes" component={MyRecipes}/>
                        <Route path="/my-pantry" component={Pantry}/>
                    </InterfaceFramework>
                </div>
            </Router>
        );
    }
}

export default App;