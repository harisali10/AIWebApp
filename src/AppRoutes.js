import About from './haris';
import App from './App';
import Setups from './Setups/Setups';
import { Routes, Route, Link, withRouter, Switch } from "react-router-dom";

const AppRoutes = () => {
    return (<>
        <Switch>
            <Route path="/cd" component={App} />
            <Route path="/about" component={About} />
            <Route path="/setup" component={Setups} />
            {/* Setups */}
            {/* <Route path='/about' component={About}> */}
            {/*<Route path='/about' component={About}> */}
        </Switch>  </>)

}
export default withRouter(AppRoutes);


