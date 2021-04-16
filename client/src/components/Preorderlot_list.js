import { useState,useEffect } from "react";
import Axios from "axios"
import Modal_openpre from "./Modal_openpre";
import moment from 'moment';
import 'moment/locale/th'
import { Link } from "react-router-dom";
moment.locale('th');
function Preorderlot_list(){
  const [preorderlotList,setpreorderlotList] = useState([]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const getpreorderlotList=()=>{
    Axios.get('http://localhost:3001/preorderlot_list').then((response)=>{
      setpreorderlotList(response.data);
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
                        <th className="text-center">รหัสพรีออเดอร์</th>
                        <th className="text-center">รูปสินค้า</th>
                        <th className="text-center">สินค้าที่เปิดรอบ</th>
                        <th className="text-center">วันเปิด-ปิดรอบ</th>
                        <th className="text-center">สถานะ</th>
                        <th className="text-center">รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...preorderlotList].reverse().map((val,key)=>{

                   return(
                      <tr key={key}>
                        <td className="text-center">{val.f_preorderlot_id}</td>
                        <td className="text-center">
                          <img
                            src={val.f_prod_img}
                            alt="Product 1"
                            className="img-size-50 mr-2"
                          />
                        </td>
                        <td>{val.f_prod_id}<br/>{val.f_prod_name}</td>
                        <td className="text-center">{moment(val.f_open_date).add(543, "year").format('DD MMM YYYY')}<br/>-<br/>{moment(val.f_close_date).add(543, "year").format('DD MMM YYYY')}</td>
                        
                        <td className="text-center"><h5 className="mb-1">{val.f_preorderlot_status == 1 ? (<span className="badge badge-primary">กำลังเปิดรอบ</span>)
                        : val.f_preorderlot_status == 2 ? (<span className="badge badge-secondary">ปิดรอบแล้ว</span>) 
                        : (<span className="badge badge-danger">ยกเลิก</span>)}</h5></td>
                        <td className="text-center">
                        <Link to={`/preorder_detail/${val.f_preorderlot_id}`}>
                        <button className="btn btn-info">
                            <i className="fas fa-search" /> รายละเอียด
                          </button>
                          </Link>
                        </td>
                      </tr>
                   );
                         })}
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
      <Modal_openpre modal={modal} toggle={toggle} reloaddata={getpreorderlotList}>
      </Modal_openpre>
      {/* /.content */}
    </div>
  );
}

export default Preorderlot_list;