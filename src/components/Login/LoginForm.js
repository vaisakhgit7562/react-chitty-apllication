import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { API_BASE_URL, headersConfig, ACCESS_TOKEN_NAME, ACCESS_TOKEN_START } from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
import qs from 'qs';


function LoginForm(props) {
    const [state, setState] = useState({
        email: "",
        password: "",
        successMessage: null
    })
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();

        let playload = qs.stringify({
            userName: state.email,
            userPassword: state.password
        })



        axios.post(API_BASE_URL + 'login', playload, headersConfig)
            .then(function (response) {
                if (response.data.status === 'success') {
                    setState(prevState => ({
                        ...prevState,
                        'successMessage': 'Login successful. Redirecting to home page..'
                    }))
                    localStorage.setItem(ACCESS_TOKEN_NAME, ACCESS_TOKEN_START + response.data.data.token);
                    redirectToHome();
                    props.showError(null)
                }
                else if (response.data.status === 'error') {
                    props.showError("Username and password do not match");
                }
                else {
                    props.showError("Username does not exists");
                }
            })
            .catch(function (err) {
                if (err.response) {
                    props.showError(err.response.data.message);
                    // client received an error response (5xx, 4xx)
                } else if (err.request) {
                    props.showError("Some error ocurred");
                    // client never received a response, or request never left
                } else {
                    // anything else
                    props.showError("Some error ocurred");
                }
            });
    }
    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }
    const redirectToRegister = () => {
        props.history.push('/register');
        props.updateTitle('Register');
    }
    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputEmail1">Email Or Phone</label>
                    <input type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        placeholder="Enter email Or Phone"
                        value={state.email}
                        onChange={handleChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-check">
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >Submit</button>
            </form>
            <div className="alert alert-success mt-2" style={{ display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            <div className="registerMessage">
                <span>Dont have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register</span>
            </div>
        </div>
    )
}

export default withRouter(LoginForm);