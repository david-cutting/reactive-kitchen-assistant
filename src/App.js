import React, { Component } from 'react';
import './App.css';
import InterfaceFramework from './components/InterfaceFramework';
import { Route, Router } from "react-router-dom";
import createHistory from 'history/createBrowserHistory'
import Nav from './App.json'

import MyPantry from "./components/MyPantry";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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

const firebaseConfig = {
    apiKey: "AIzaSyBP3lvakMyYri3P9dJnT_csrj4ksHOAtfk",
    authDomain: "reactive-kitchen-manager.firebaseapp.com",
    databaseURL: "https://reactive-kitchen-manager.firebaseio.com",
    projectId: "reactive-kitchen-manager",
    storageBucket: "reactive-kitchen-manager.appspot.com",
    messagingSenderId: "602819037461",
    appId: "1:602819037461:web:658ccc77b403162b"
};

firebase.initializeApp(firebaseConfig);
let db =firebase.firestore();



class App extends Component {
    render() {
        return (
            <Router history={history}>
                <div className="App">
                    <InterfaceFramework>
                        <Route path="/my-pantry" component={MyPantry}/>
                    </InterfaceFramework>
                </div>
            </Router>
        );
    }
}

export default App;