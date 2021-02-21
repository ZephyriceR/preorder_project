const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "p1a2o31111",
  database: "preorder_project",
});

function generateDocID(table_name, primary_key, short_key, callback) {
  db.query("select "+primary_key+" from " + table_name, (error, result) => {
    if (error) {
      return callback(error);
    } else if (!result.length) {
    //   console.log("1234");
    //   const docID = "";
    //   const todaysDate = new Date();
    //   const currentYear = todaysDate.getFullYear();
    //   const currentmonth = ("0" + (todaysDate.getMonth() + 1)).slice(-2);
    //   docID = short_key + currentYear.toString() + currentmonth;
      return callback(result);
    } else {
      return callback("3");
    }
  });
}

// generateDocID("trans_preorderlot", "f_preorderlot_id", "OR", (result) => {
//     a = result;
//     console.log(result);
//   });

app.get("/product_list", (req, res) => {
  const a = "";
  db.query("Select * from sys_products", (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send(result);
    }
  });
});

app.post("/product_list/add", (req, res) => {
  const f_prod_id = req.body.f_prod_id;
  const f_prod_name = req.body.f_prod_name;
  const f_prod_img = req.body.f_prod_img;
  db.query(
    "INSERT INTO sys_products VALUE(?,?,?,?)",
    [f_prod_id, f_prod_name, f_prod_img, 1],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send("Products Inserted");
      }
    }
  );
});

app.put("/product_list/edit", (req, res) => {
  const prod_id = req.body.f_prod_id;
  const prod_name = req.body.f_prod_name;
  db.query(
    "UPDATE sys_products SET f_prod_name= ? WHERE f_prod_id= ?",
    [f_prod_name, f_prod_id, f_prod_img, 1],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send("Products Update Successfully");
      }
    }
  );
});

app.get("/preorderlot_list", (req, res) => {
  db.query("Select * from trans_preorderlot", (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send(result);
    }
  });
});

app.post("/preoderlot_list/add", (req, res) => {
  const f_preorderlot_id = req.body.f_preorderlot_id;
  const f_prod_id = req.body.f_prod_id;
  const f_open_date = req.body.f_open_date;
  db.query(
    "INSERT INTO trans_preorderlot VALUE(?,?,NOW(),?,NOW(),NOW())",
    [f_preorderlot_id, f_prod_id, 1],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send("Products Inserted");
      }
    }
  );
});

app.listen("3001", () => {
  console.log("server is running 3001");
});
