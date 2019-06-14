import React, { Component } from 'react';
import './App.css';
import InterfaceFramework from './components/InterfaceFramework';
import { Route, Router } from "react-router-dom";
import { createBrowserHistory } from 'history'
import Nav from './App.json'

import MyPantry from "./components/MyPantry";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseui from 'firebaseui';
import firebaseuicss from 'firebaseui/dist/firebaseui.css'

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

function getUiConfig() {
    return {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                document.getElementById('user-id-text').innerHTML = authResult.user.displayName;
                // Do not redirect.
                return false;
            },
            uiShown: function() {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: '<url-to-redirect-to-on-success>',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '<your-tos-url>',
        // Privacy policy url.
        privacyPolicyUrl: '<your-privacy-policy-url>'
    }
}

let ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', getUiConfig());

const history = createBrowserHistory();
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
    render() {
        return (
            <Router history={history}>
                <div className="App">
                    <InterfaceFramework>
                        <Route path="/my-pantry" component={MyPantry}/>

                        <h1>Welcome to My Awesome App</h1>
                        <div id={"signin"}>
                            <link type="text/css" rel="stylesheet" href={firebaseuicss}/>
                            <div id="loader">Loading...</div>
                            <div id="firebaseui-auth-container"></div>
                        </div>
                    </InterfaceFramework>
                </div>
            </Router>


        );
    }
}

export default App;