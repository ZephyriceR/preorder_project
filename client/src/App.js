import React from "react";
import { userState } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Product_list from "./components/Product_list";
import Preorderlot_list from "./components/Preorderlot_list";
import Footer from "./components/Footer";
import Axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="wrapper">
        <Menu />
        <Header />
        <Switch>
          <Route path="/product_list" component={Product_list}/>
          <Route path="/preorderlot_list" component={Preorderlot_list}/>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
