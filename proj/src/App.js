import React, { Component } from 'react';
import './App.css';
import ShowData from './ShowData';

import firebase, { auth, provider } from './firebase.js';

class App extends Component {

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            }
        });
    }

    constructor() {
        super();
        this.state = {
            currentItem: '',
            username: '',
            user: null
        };

        this.handleClick = this.handleClick.bind(this);
        this.login = this.login.bind(this); // <-- add this line
        this.logout = this.logout.bind(this); // <-- add this line

    }

    handleClick(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('items');
        const item = {
            title: this.state.currentItem,
            user: this.state.username
        }
        itemsRef.push(item);
        this.setState({
            currentItem: '',
            username: ''
        });
    }

    handleChange(e) {
      /* ... */
    }
    logout() {
        auth.signOut()
            .then(() => {
                this.setState({
                    user: null
                });
            });
    }

    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({
                    user
                });
            });
    }


    render() {
        return (
            <div className='app'>
              <header>
                <div className="wrapper">
                    <div className="title">
                        <h1>GetMyPassword</h1>
                    </div>
                    <div className="buttons">
                        {this.state.user ?
                            <button onClick={this.logout}>Log Out</button>
                            :
                            <button onClick={this.login}>Log In</button>
                        }
                    </div>
                </div>
              </header>
              <div className='container'>
                  {this.state.user ?
                      <ShowData/>
                      :
                      <div className="notlogged">sss</div>
                  }
              </div>
            </div>
        );
    }
}

export default App;
