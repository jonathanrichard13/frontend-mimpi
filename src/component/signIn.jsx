import React, { Component } from 'react';
import "../componentStyle/signUp.css"
import { withRouter } from "react-router-dom";
import "../componentStyle/signIn.css"
import axios from 'axios';

const port = process.env.PORT || 5000;

class SignIn extends Component {
    constructor(props){
        super(props)
        this.onChangeUsername = this.onChangeUsername.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        
        this.onSubmitSignInForm = this.onSubmitSignInForm.bind(this);

        this.state = { 
            username: "",
            password: "",
         }
    }

    // componentDidMount() {
    //     axios.get('http://localhost:' + port +'/users/')
    //         .then(res => {
    //             if (res.data.length > 0) {
    //                 this.setState({
    //                     username: this.state.username,
    //                     password: this.state.password,
    //                     users: res.data
    //                 })
    //             }
    //         });
    // }

    onChangeUsername(p) {
        document.getElementById("username-password-invalid").style.display = 'none';
        this.setState({
            username: p.target.value,
        });

    }

    onChangePassword(p) {
        document.getElementById("username-password-invalid").style.display = 'none';
        this.setState({
            password: p.target.value,
        });
    }

    onSubmitSignInForm(p) {
        p.preventDefault();

        async function submitHelper(username, password, history){
            let res = axios.get('https://backend-mimpi.herokuapp.com/users/' + username + '/' + password)
                .then(res => res.data)
                .catch(err => console.log('Error: ' + err))

            let r = await res
            console.log(r)
            if (r === undefined) {
                document.getElementById("username-password-invalid").style.display = 'block';
                return
            }

            history.push({
                pathname: "/homepage",
                state: r,
            })
        }

        submitHelper(this.state.username, this.state.password, this.props.history)
    }
    
    
    render() { 
        return ( 
            <div className="sign-in-container">
                <div className="sign-in-top">
                    <div className="sign-in-icon">M</div>
                    <div className="sign-in-title">
                        <div className="sign-in-title1">Masuklah ke akun Mimpimu</div>
                        <div className="sign-in-title2">dan raih mimpimu!</div>
                    </div>
                </div>

                <div className="sign-in-main">
                    <form onSubmit={this.onSubmitSignUpForm}>
                        <div className="sign-in-input-wrapper">
                            <label className="sign-in-label">Username</label>
                            <input
                                type="text"
                                required
                                className="sign-in-input"
                                id="username-input"
                                value={this.state.username}
                                onChange={this.onChangeUsername}
                            />
                        </div>

                        <div className="sign-in-input-wrapper">
                            <label className="sign-in-label">Password</label>
                            <input
                                type="password"
                                required
                                className="sign-in-input"
                                value={this.state.password}
                                onChange={this.onChangePassword}
                            />
                        </div>

                        <div id="username-password-invalid">Username/Password salah</div>

                        <div className="sign-up-div-btn">
                        <input
                            type="submit"
                            value="Masuk"
                            id="sign-in-btn"
                            onClick={this.onSubmitSignInForm}
                        />
                        </div>

                        
                    </form>

                    <a className="to-sign-up" href="/sign-up">Belum punya akun?</a>
                </div>

            </div>

        );
    }
}
 
export default withRouter(SignIn);
