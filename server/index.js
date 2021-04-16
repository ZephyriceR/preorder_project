const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "preorder_project",
});

// ในส่วนนี้จะเป็น configของMulter ว่าจะให้เก็บไฟล์ไว้ที่ไหน และ Rename ชื่อไฟล์
const storage_prod = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/dist/img/product_img");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}` + path.extname(file.originalname));
  },
});

const storage_sku = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/dist/img/product_img/sku_img");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}` + path.extname(file.originalname));
  },
});

const storage_transaction = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/dist/img/transaction");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}` + path.extname(file.originalname));
  },
});

const upload_prod_img = multer({ storage: storage_prod })
const upload_transaction_img = multer({ storage: storage_transaction })
const upload_sku_img = multer({ storage: storage_sku })


function paddy(num, padlen, padchar) {
  var pad_char = typeof padchar !== "undefined" ? padchar : "0";
  var pad = new Array(1 + padlen).join(pad_char);
  return (pad + num).slice(-pad.length);
}

function generateDocID(table_name, primary_key, short_key, callback) {
  let docID = "";
  const todaysDate = new Date();
  const currentYear = todaysDate.getFullYear();
  const currentmonth = ("0" + (todaysDate.getMonth() + 1)).slice(-2);
  const check_date = short_key + currentYear.toString() + currentmonth
  db.query("select " + primary_key + " as PK_ID from " + table_name + " WHERE " + primary_key + " LIKE '" + check_date + "%' ORDER BY " + primary_key + " DESC LIMIT 1", (error, result) => {
    if (error) {
      console.log(error);
      return callback(error);
    } else if (!result.length) {
      docID = short_key + currentYear.toString() + currentmonth + paddy(1, 6, "0");
      return callback(docID);
    } else {
      let n = parseInt(result[0].PK_ID.slice(8)) + 1;
      docID = short_key + currentYear.toString() + currentmonth + paddy(n, 6, "0");
      return callback(docID);
    }
  });
}

// generateDocID("trans_preorderlot", "f_preorderlot_id", "OR", (result) => {
//     a = result;
//     console.log(result);
//   });

app.get("/preorder/getnew_preorderID", (req, res) => {
  generateDocID("trans_preorderlot", "f_preorderlot_id", "PO", function (result) {
    res.send(result);
  });
})

app.get("/saleorder/getnew_saleorderID", (req, res) => {
  generateDocID("trans_saleorder_head", "f_saleorder_id", "SO", function (result) {
    res.send(result);
  });
})

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

app.get("/saleorder/get_list", (req, res) => {
  const a = "";
  db.query(
    "Select * from trans_saleorder_head order by f_index Desc",
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/saleorder/saleorder_head/:saleorder_id", (req, res) => {
  const saleorder_id = req.params.saleorder_id;
  db.query(
    "Select * from trans_saleorder_head where f_saleorder_id = ?",
    [saleorder_id],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/saleorder/saleorder_detail/:saleorder_id", (req, res) => {
  const saleorder_id = req.params.saleorder_id;
  db.query(
    "Select trans_saleorder_detail.*,sys_sku.f_sku_img,sys_products.f_prod_name,f_sku_name from trans_saleorder_detail "
    + "left join sys_sku on trans_saleorder_detail.f_sku_id=sys_sku.f_sku_id "
    + "left join sys_products on sys_products.f_prod_id=sys_sku.f_prod_id "
    + "where f_saleorder_id = ? order by f_index Desc",
    [saleorder_id],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/saleorder/create", (req, res) => {
  const saleorder_id = req.body.saleorder_id;
  const saleorder_remark = req.body.saleorder_remark;
  const customer_account = req.body.customer_account;
  const customer_name = req.body.customer_name;
  const customer_address = req.body.customer_address;
  const customer_tel = req.body.customer_tel;
  const saleorder_total = req.body.order_total;
  const selected_prod = req.body.selected_prod;
  const saleorder_delivery = req.body.delivery_price;
  const saleorder_discount = req.body.discount_price;
  db.query(
    "INSERT INTO trans_saleorder_head VALUE "
    + "(NULL,?,NOW(),?,?,?,?,1,?,?,?,?)",
    [saleorder_id, saleorder_delivery, saleorder_discount, saleorder_total, saleorder_remark, customer_account, customer_name, customer_address, customer_tel],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        selected_prod.map((val, key) => {
          db.query(
            "INSERT INTO trans_saleorder_detail VALUE "
            + "(NULL,?,?,?,?,?,?,?)",
            [val.f_preorderlot_id, saleorder_id,val.f_prod_id, val.f_sku_id, val.f_sale_price, val.sku_qty, val.f_cost_price],
            (error, result) => {
              if (error) {
                console.log(error);
              } else {
                res.send(result);
              }
            }
          );
        })
      }
    }
  );
});

app.put('/saleorder/update_packing/:saleorder_id', (req, res) => {
  const f_saleorder_id = req.params.saleorder_id;
  db.query('Update trans_saleorder_head set f_saleorder_status = 3 where f_saleorder_id=?', [f_saleorder_id], (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send(result)
    }
  })
})

app.put('/saleorder/update_cancel', (req, res) => {
  const f_saleorder_id = req.body.f_saleorder_id;
  db.query('Update trans_saleorder_head set f_saleorder_status = 0 where f_saleorder_id=?', [f_saleorder_id], (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send(result)
    }
  })
})

app.post('/saleorder/update_transaction', upload_transaction_img.single('transaction_img'), (req, res) => {
  console.log(req.file)
  const f_saleorder_id = req.body.f_saleorder_id
  const f_transaction_img = "/dist/img/transaction_img/" + req.file.filename
  db.query('Update trans_saleorder_head set f_saleorder_status = 2 where f_saleorder_id=?', [f_saleorder_id], (error, result) => {
    if (error) {
      console.log(error);
    } else {
      db.query('Select f_transaction_img FROM trans_transaction WHERE f_saleorder_id=?', [f_saleorder_id], (error, result) => {
        if (result.length > 0) {
          fs.unlink(result.data.f_transaction_img, (err) => {
            if (err) {
              console.error(err)
              return
            }
            //file removed
            db.query('UPDATE trans_transaction SET f_transaction_img=? WHERE f_saleorder_id=?', [f_transaction_img, f_saleorder_id], (error, result) => {
              if (error) {
                console.log(error)
              } else {
                res.send(result)
              }
            })
          })
        } else {
          db.query('INSERT INTO trans_transaction VALUES(NULL,?,NOW(),?,1)', [f_saleorder_id, f_transaction_img], (error, result) => {
            if (error) {
              console.log(error)
            } else {
              res.send(result)
            }
          })
        }
      })
    }
  })
})

app.post('/saleorder/update_delivery',(req, res) => {
  const f_saleorder_id = req.body.f_saleorder_id
  const f_tracking_number =   req.body.f_tracking_number
  
  db.query('Update trans_saleorder_head set f_saleorder_status = 4 where f_saleorder_id=?', [f_saleorder_id], (error, result) => {
    if (error) {
      console.log(error);
    } else {
      db.query('Select f_tracking_number FROM trans_delivery WHERE f_saleorder_id=?', [f_saleorder_id], (error, result) => {
        if (result.length > 0) {
          db.query('UPDATE trans_delivery SET f_tracking_number=? WHERE f_saleorder_id=?', [f_tracking_number, f_saleorder_id], (error, result) => {
            if (error) {
              console.log(error)
            } else {
              res.send(result)
            }
          })
        } else {
          db.query('INSERT INTO trans_delivery VALUES(NULL,?,?,NOW(),1)', [f_saleorder_id, f_tracking_number], (error, result) => {
            if (error) {
              console.log(error)
            } else {
              res.send(result)
            }
          })
        }
      })
    }
  })
})

app.get("/available_preorderlot", (req, res) => {
  db.query(
    "SELECT f_preorderlot_id,f_prod_name,sys_sku.* FROM trans_preorderlot "
    + "left join sys_products on trans_preorderlot.f_prod_id=sys_products.f_prod_id "
    + "left join sys_sku on sys_products.f_prod_id=sys_sku.f_prod_id where f_preorderlot_status=1",
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/product/sku/get_sku_list/:prodID", (req, res) => {
  const prodID = req.params.prodID;
  db.query(
    "Select * from sys_sku where f_prod_id= ? ",
    [prodID],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/product/sku/get_sku_detail/:prod_id/:sku_id", (req, res) => {
  const sku_id = req.params.sku_id;
  const prod_id = req.params.prod_id;
  db.query(
    "Select * from sys_sku where f_prod_id = ? and f_sku_id = ?",
    [prod_id,sku_id],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result)
      }
    }
  );
});

app.get("/product/sku/get_sku_list/:prod_id", (req, res) => {
  const prod_id = req.params.prod_id;
  db.query(
    "Select * from sys_sku where f_prod_id = ?",
    [prod_id],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result)
      }
    }
  );
});

app.post("/product/sku/add_sku",upload_sku_img.single('sku_img'),(req,res)=>{
  const prod_id = req.body.prod_id;
  const sku_id =req.body.sku_id
  const sku_name = req.body.sku_name;
  const cost_price = req.body.cost_price;
  const sale_price = req.body.sale_price;
  const sku_img = "/dist/img/product_img/sku_img/" + req.file.filename;
      db.query("INSERT INTO sys_sku Values(NULL,?,?,?,1,?,?,?,NOW(),NOW())",[prod_id,sku_id,sku_name,cost_price,sale_price,sku_img],(error,result)=>{
        if (error) {
          console.log(error);
        } else {
          res.send(result);
        }
      })
    })

app.get(`/product_detail/:prodID`, (req, res) => {
  const prodID = req.params.prodID;
  db.query(
    "Select * from sys_products where f_prod_id= ? ",
    [prodID],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result);
      }
    }
  );
});



app.post("/product_list/add_prod", upload_prod_img.single('prod_img'), (req, res) => {
  console.log(req.file)
  const f_prod_id = req.body.prod_id;
  const f_prod_name = req.body.prod_name;
  const f_prod_detail = req.body.prod_detail;
  const f_prod_link = req.body.prod_link;
  const f_prod_img = "/dist/img/product_img/" + req.file.filename
  db.query(
    "INSERT INTO sys_products VALUE(NULL,?,?,?,?,?,?)",
    [f_prod_id, f_prod_name, f_prod_detail, f_prod_img, f_prod_link, 1],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/product_list/edit", upload_prod_img.single('prod_img'), (req, res) => {
  const f_prod_id = req.body.prod_id;
  const f_prod_name = req.body.prod_name;
  const f_prod_detail = req.body.prod_detail;
  const f_prod_link = req.body.prod_link;
  let sql = ""
  let data_column
  if (req.file===undefined){
    sql =  "UPDATE sys_products SET f_prod_name= ?,f_prod_detail=?,f_prod_link=? WHERE f_prod_id= ?"
    data_column =  [f_prod_name,f_prod_detail,f_prod_link,f_prod_id]
  }else{
    const f_prod_img = "/dist/img/product_img/" + req.file.filename
    sql =  "UPDATE sys_products SET f_prod_name= ?,f_prod_detail=?,f_prod_link=?,f_prod_img=? WHERE f_prod_id= ?"
    data_column =  [f_prod_name,f_prod_detail,f_prod_link, f_prod_img,f_prod_id]
  }
  db.query(
    sql,data_column,(error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/preorderlot_list", (req, res) => {
  db.query("Select trans_preorderlot.*,f_prod_name,f_prod_img from trans_preorderlot left join sys_products on trans_preorderlot.f_prod_id=sys_products.f_prod_id", (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send(result);
    }
  });
});

app.post("/preorder/create", (req, res) => {
  const preorder_id = req.body.preorder_id;
  const prod_id = req.body.prod_id;
  const preorder_startdate = req.body.preorder_startdate;
  const preorder_closedate = req.body.preorder_closedate;
  db.query(
    "INSERT INTO trans_preorderlot VALUE(NULL,?,?,NOW(),?,?,?)",
    [preorder_id, prod_id, 1, preorder_startdate, preorder_closedate],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result);
      }
    }
  );
});


app.get(`/preorder/get_detail/:preorderID`, (req, res) => {
  const preorderID = req.params.preorderID;
  db.query(
    "Select trans_saleorder_detail.*,f_sku_name,f_saleorder_status,f_customer_name,f_customer_accid FROM trans_saleorder_detail "
    + "left join trans_saleorder_head on trans_saleorder_detail.f_saleorder_id=trans_saleorder_head.f_saleorder_id "
    + "left join sys_sku on trans_saleorder_detail.f_sku_id = sys_sku.f_sku_id where f_preorderlot_id= ? order by f_saleorder_id Desc",
    [preorderID],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(result);
        res.send(result);
      }
    }
  );
});

app.get(`/preorder/get_head/:preorderID`, (req, res) => {
  const preorderID = req.params.preorderID;
  db.query(
    "SELECT trans_preorderlot.*,f_prod_name,f_prod_detail,f_prod_link,f_prod_img FROM trans_preorderlot left join sys_products on trans_preorderlot.f_prod_id=sys_products.f_prod_id  WHERE f_preorderlot_id=?",
    [preorderID],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(result);
        res.send(result);
      }
    }
  );
});

app.get(`/preorder/get_conclude/:preorderID`, (req, res) => {
  const preorderID = req.params.preorderID;
  db.query(
    "Select trans_saleorder_detail.f_sku_id,f_sku_name,sum(f_prod_qty) as sum_total,f_saleorder_status,f_sku_img FROM trans_saleorder_detail "
    + "left join trans_saleorder_head on trans_saleorder_detail.f_saleorder_id=trans_saleorder_head.f_saleorder_id "
    + "left join sys_sku on trans_saleorder_detail.f_sku_id = sys_sku.f_sku_id where f_preorderlot_id= ? group by f_sku_id,f_sku_name,f_saleorder_status,f_sku_img",
    [preorderID],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(result);
        res.send(result);
      }
    }
  );
});

app.put(`/preorder/update_status`, (req, res) => {
  const preorder_id = req.body.preorder_id;
  const status = req.body.status;
  db.query("UPDATE trans_preorderlot set f_preorderlot_status=? where f_preorderlot_id =?", [status, preorder_id], (error, result) => {
    if (error) {
      console.log(error)
    } else {
      console.log(result)
      res.send(result)
    }
  })
})


app.listen("3001", () => {
  console.log("server is running 3001");
});
