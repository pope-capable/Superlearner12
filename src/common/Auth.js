import React, { useState, useEffect } from 'react'
import "../styles/auth.css"
import {postWithHeaders } from '../utils/Externalcalls'
import {notification, Button, Alert } from 'antd';
import { antdNotification } from './misc';
import { AuthenticationContext } from "../utils/reducer";


function Auth(props) {
    const { dispatch } = React.useContext(AuthenticationContext);

    // initialize input identifiers
    const initialState = {
        identifier: "",
        password: "",
        user_name: "",
        email: "",
        isSubmitting: false,
        errorMessage: null,
        view: props.goto,
        cpassword: ""
      };

    //   map identifiers into state
    const [data, setdata] = useState(initialState)
    const [notready, setnotready] = useState(true)
    const [emailerr, setemailerr] = useState(false)
    const [usererr, setusererr] = useState(false)
    const [passerr, setpasserr] = useState(false)
    const [matcherr, setmatcherr] = useState(false)


    useEffect(() => {
            validateFields()
    }, [data])



    // function to update state with input
    function handleChange (event) {
        setdata({
            ...data,
            [event.target.name]: event.target.value
          });
    }

    function validateEmail() {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
        var duty2 = re.test(String(data.email).toLowerCase())
        var dut2 = (data.email ? data.email.length : 0)
        if(dut2 < 1 || duty2){
            setemailerr(false)
            return true
        }else{
            setemailerr(true)
            return false
        }
    }

    function validatePassword() {
        const re = /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()~¥=_+}{":;'?/>.<,`\-\|\[\]]{6,50}$/;
        var duty3 = re.test(String(data.password).toLowerCase());
        var dut3 = (data.password ? data.password.length : 0)
        if(dut3 < 1 || duty3){
            setpasserr(false)
            return true
        }else{
            setpasserr(true)
            return false
        } 
    }

    function validateUsername() {
        var duty1 = (data.user_name ? data.user_name.length : 0)
        if(duty1 > 5 || duty1 < 1) {
            setusererr(false)
            return true
        }else{
            setusererr(true)
            return false
        }
    }

    function matchPassword() {
        var dut4 = (data.cpassword ? data.cpassword.length : 0)
        console.log("MEEK", dut4, data.password, data.cpassword)
        if(dut4 < 1 || data.password == data.cpassword){
            setmatcherr(false)
            return true
        }else {
            setmatcherr(true)
            return false
        }
    }
    
    function validateFields () {
        if(data.view == "login"){

        } else {
            if(validateUsername() && validateEmail() && validatePassword() && matchPassword()){
                setnotready(false)
            }else {
                setnotready(true)
            }
            // validateUsername(data.user_name)
            // validateEmail(data.email)
            // validatePassword(data.password)
            // matchPassword()

        }
    }

    function toggle(change) {
        if(data.view !== change ) {
            return "inactive"
        }
    }

    function login() {
        setdata({...data, isSubmitting: true})
        postWithHeaders("users/authenticate", data, {"secret_key": "99.99%_accuracy"}).then(done => {
            if(done.data.status){
                dispatch({type: "LOGIN", payload: done.data.data})
                antdNotification("success", "Welcome", "Welcome to your dashboard, continue from where you left off or create new activities")
                window.location.href = "/dashboard"
            }else{
                setdata({...data, isSubmitting: false})
                antdNotification("error", "Login Failed", "Check your internet connection and provide valid login information")
            }
        }).catch(error => {
            setdata({...data, isSubmitting: false})
            antdNotification("error", "Login Failed", "Check your internet connection and provide valid login information")
        })
    }

    function signUp() {
        setdata({isSubmitting: true})
        postWithHeaders("users/sign-up", data, {"secret_key": "99.99%_accuracy"}).then(done => {
            if(done.data.status){
                antdNotification("success", "Registration Complete", "Welcome to your super-learner, kindly login to continue")
                setdata({...data, view: "login", password: ""})
                document.getElementById("login-form").reset();
            }else{
                setdata({...data, isSubmitting: false})
                antdNotification("error", "Sign-up Failed", "Check your internet connection and provide valid login information")
            }
        }).catch(error => {
            setdata({...data, isSubmitting: false})
            antdNotification("error", "Sign-up Failed", "Check your internet connection and provide valid login information")
        })
    }

    return (
        <div className = "gate">
            <div className = "entrance">
                <div onClick = {e => setdata({...data, view: "login"})} className = {toggle("login")}>Login</div>
                <div onClick = {e => setdata({...data, view: "signup"})} className = {toggle("signup")}>Sign-up</div>
            </div>
            <div className = "key">
            {
                data.view == "login" 
                ? 
                <div>
                    <form id = "login-form">
                    <input name = "identifier" onChange = {e => handleChange(e)} placeholder = "E-mail or Username" />
                    <input type = "password" name = "password" onChange = {e => handleChange(e)} placeholder = "Password" />
                    <button disabled = {data.isSubmitting} onClick = {login} className = "login-button">{data.isSubmitting ? "please wait..." : "Proceed"}</button>
                    </form>
                </div> 
                : 
                <div>
                    {usererr ? 
                    <Alert message={"Invalid username"} type="error"/> : 
                    <div></div>
                    }
                   <input name = "user_name" onChange = {e => handleChange(e)} placeholder = "Username" />
                   {emailerr ? 
                    <Alert message={"Invalid email address"} type="error"/> : 
                    <div></div>
                    }
                    <input name = "email" onChange = {e => handleChange(e)} placeholder = "E-mail" />
                    {passerr ? 
                    <Alert message={"Password must contain upper case & number"} type="error"/> : 
                    <div></div>
                    }
                    <input type = "password" name = "password" onChange = {e => handleChange(e)} placeholder = "Password" />
                    {matcherr ? 
                    <Alert message={"Password must match"} type="error"/> : 
                    <div></div>
                    }
                    <input type = "password" placeholder = "Confirm Password" name = "cpassword" onChange = {e => handleChange(e)}/>
                    <button disabled = {notready} onClick = {signUp} className = "signup-button">{data.isSubmitting ? "please wait..." : "Proceed"}</button>
                </div>
            }
            </div>
        </div>
    )
}

export default Auth