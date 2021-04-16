import React from "react";
import { userState } from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Product_list from "./components/Product_list";
import Product_detail from "./components/Product_detail";
import Preorder_detail from "./components/Preorder_Detail";
import Preorderlot_list from "./components/Preorderlot_list";
import Saleorder_list from "./components/Saleorder_list";
import Saleorder_detail from "./components/Saleorder_detail";
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
          <Route path="/order_list" component={Saleorder_list}/>
          <Route path="/saleorder_detail/:saleorder_id" component={Saleorder_detail}/>
          <Route path="/product_detail/:prod_id" component={Product_detail}/>
          <Route path="/preorder_detail/:preorder_id" component={Preorder_detail}/>
          <Route path="/" component={Product_list}/>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
