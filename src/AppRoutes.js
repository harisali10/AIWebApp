
import App from './App';
import Setups from './Setups/Setups';
import Home from './views/home';
import Results from './views/Results';
import Logs from "./views/Logs";
import Dashboard from "./views/Dashboard";
import TopBar from './components/TopBar'
import { Route, Link, withRouter, Switch } from "react-router-dom";

const AppRoutes = () => {
    return (
        <div>
            <Switch>
                {/* <App/> */}
                <Route path="/" exact={true} component={Results} />
                <Route path="/dashboard" exact={true} component={Dashboard} />
                <Route path="/logs" exact={true} component={Logs} />
                <Route path="/haris" exact={true} component={Home} />
                <Route path="/setup" exact={true} component={Setups} />
            </Switch>

        </div>
    )

}
export default withRouter(AppRoutes);


