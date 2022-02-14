import React from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import SignUp from "./component/signUp"
import SignUpFreelance from "./component/signUpFreelance"
import SignIn from "./component/signIn"
import 'bootstrap/dist/css/bootstrap.css';
import HomePage from "./component/homepage"
import HomePageMe from "./component/homepage-me"
import TargetSetting from "./component/targetSetting"

// import "../src/assets/jquery/jquery-3.6.0.min"
import "../src/assets/script/script"
// import "../src/assets/autosize/autosize"

function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/">
              <Redirect to="/sign-in" />
          </Route>
          <Route path="/sign-in" component={SignIn}/>
          <Route path="/sign-up" component={SignUp}/>
          <Route path="/sign-up-freelance" component={SignUpFreelance} />
          <Route path="/homepage-me" component={HomePageMe} />
          <Route path='/testing' component={TargetSetting} />
          <Route path='/homepage' component={HomePage} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;