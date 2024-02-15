import "./SigninPage.css";
import React, { useEffect } from "react";
import { ReactComponent as Logo } from "../components/svg/logo.svg";
import { Link } from "react-router-dom";
import { getCurrentUser } from 'aws-amplify/auth'

// [TODO] Authenication
import { signIn } from "aws-amplify/auth";
export default function SigninPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState("");
  const [cognitoErrors, setCognitoErrors] = React.useState("");
  
  useEffect(() => {
    getCurrentUser().then((user) => user ? window.location.href = '/' : null )
  }, [])
  const onsubmit = async (event) => {
    setCognitoErrors("");
    event.preventDefault();
    try {
      signIn({ username: email, password })
        .then((user) => {
          console.log(user)
          localStorage.setItem(
            "access_token",
            user.signInUserSession.accessToken.jwtToken
          );
          window.location.href = "/";
        })
        .catch((err) => {
          
          setErrors(err.message);
          if(err.message.indexOf('UserAlreadyAuthenticatedException')) {
            window.location.href = '/'
          }
          console.log("Error!", err);
        });
    } catch (error) {
      if(error.type === 'UserAlreadyAuthenticatedException'){
        window.location.href = "/";
      }
      if (error.code == "UserNotConfirmedException") {
        window.location.href = "/confirm";
      }
      setCognitoErrors(error.message);
    }
    return false;
  };
  const email_onchange = (event) => {
    setEmail(event.target.value);
  };
  const password_onchange = (event) => {
    setPassword(event.target.value);
  };

  if (cognitoErrors) {
    return <div className="errors">{cognitoErrors}</div>;
  }
  
  return (
    <article className="signin-article">
      <div className="signin-info">
        <Logo className="logo" />
      </div>
      <div className="signin-wrapper">
        <form className="signin_form" onSubmit={onsubmit}>
          <h2>Sign into your Cruddur account</h2>
          <div className="fields">
            <div className="field text_field username">
              <label>Email</label>
              <input type="text" value={email} onChange={email_onchange} />
            </div>
            <div className="field text_field password">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={password_onchange}
              />
            </div>
          </div>
          <div style={{ backgroundColor: "rebeccapurple", padding: "10px" }}>
            <span style={{ color: "whitesmoke" }}>{errors}</span>
          </div>

          <div className="submit">
            <Link to="/forgot" className="forgot-link">
              Forgot Password?
            </Link>
            <button type="submit">Sign In</button>
          </div>
        </form>
        <div className="dont-have-an-account">
          <span>Don't have an account?</span>
          <Link to="/signup">Sign up!</Link>
        </div>
      </div>
    </article>
  );
}
