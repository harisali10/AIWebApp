
import App from './App';
import Setups from './Setups/Setups';
import Privacy from './Privacy/Privacy';
import UpgradePlan from './UpgradePlan/UpgradePlan';
import Results from './views/Results';
import Logs from "./views/Logs";
import Dashboard from "./views/Dashboard";
// import test from "./views/test"
import TopBar from './components/TopBar'

import { Route, Link, withRouter, Switch } from "react-router-dom";

const AppRoutes = () => {
    return (
        <div>
            <Switch>
                <Route path="/" exact={true} component={Results} />
                <Route path="/dashboard" exact={true} component={Dashboard} />
                <Route path="/logs" exact={true} component={Logs} />
                <Route path="/setup" exact={true} component={Setups} />
                <Route path="/privacy" exact={true} component={Privacy} />
                <Route path="/upgradeplan" exact={true} component={UpgradePlan} />
            </Switch>

        </div>
    )

}
export default withRouter(AppRoutes);


