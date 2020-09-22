import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { RestaurantsContextProvider } from "./context/RestaurantsContext";
import Home from "./routes/Home";
import RestaurantDetailPage from "./routes/RestaurantDetailPage";
import UpdatePage from "./routes/UpdatePage";

const App = () => {
  return (
    <RestaurantsContextProvider>
      <div className="container">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/restaurants/:id/update"
              component={UpdatePage}
            />
            <Route
              exact
              path="/restaurants/:id"
              component={RestaurantDetailPage}
            />
            <Redirect to="/" />
          </Switch>
        </Router>
      </div>
    </RestaurantsContextProvider>
  );
};

export default App;
