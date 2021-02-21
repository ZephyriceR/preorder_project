import { useState,useEffect } from "react";
import Axios from "axios"
import Modal_openpre from "./Modal_openpre";

function Preorderlot_list(){
  const [preorderlotList,setpreorderlotList] = useState([]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const getpreorderlotList=()=>{
    Axios.get('http://localhost:3001/preorderlot_list').then((response)=>{
      setpreorderlotList(response);
    })
  }

useEffect(() => {
  getpreorderlotList();
},[]);

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0 text-dark">รายการเปิดพรีออเดอร์</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-2">
              <button className="btn btn-info container-fluid" onClick={()=>{toggle()}}>
                <i className="fas fa-plus" /> เปิดรอบพรี
              </button>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      {/* Main content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              {/* /.card */}
              <div className="card">
                {/* <div className="card-header border-0">
                  <h3 className="card-title">รายการพรีออเดอร์</h3> */}
                  {/* <div className="card-tools">
                    <a href="#" className="btn btn-tool btn-sm">
                      <i className="fas fa-download" />
                    </a>
                    <a href="#" className="btn btn-tool btn-sm">
                      <i className="fas fa-bars" />
                    </a>
                  </div> */}
                {/* </div> */}
                <div className="card-body table-responsive p-0">
                  <table className="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th>รหัสรอบพรี</th>
                        <th>รูปสินค้า</th>
                        <th>สินค้าเปิดพรี</th>
                        <th>วันเปิดพรี</th>
                        <th>จำนวนออเดอร์</th>
                        <th>รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td >LOT20210200001</td>
                        <td>
                          <img
                            src="https://images.unsplash.com/photo-1613337802611-cccb1d8c9448?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                            alt="Product 1"
                            className="img-size-50 mr-2"
                          />
                        </td>
                        <td>กล่องใส่กระดาษ <br/>asdsad</td>
                        <td>2/17/2021 10.00น.</td>
                        <td>105</td>
                        <td>
                          <button className="btn btn-info">
                            <i className="fas fa-search" /> รายละเอียด
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* /.card */}
            </div>
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      <Modal_openpre modal={modal} toggle={toggle}>
      </Modal_openpre>
      {/* /.content */}
    </div>
  );
}

export default Preorderlot_list;