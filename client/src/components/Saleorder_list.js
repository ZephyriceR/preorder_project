import { useState, useEffect } from "react";
import Axios from "axios";
import Modal_saleorder from "./Modal_saleorder";
import moment from 'moment';
import 'moment/locale/th'
import { Link } from "react-router-dom";

function Saleorder_list() {
  const [saleorderList, setsaleorderList] = useState([]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const getsaleorderList = () => {
    Axios.get("http://localhost:3001/saleorder/get_list").then((response) => {
      setsaleorderList(response.data);
    });
  };

  useEffect(() => {
    getsaleorderList();
  }, []);

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0 text-dark">รายการสั่งซื้อ</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-2">
              <button
                className="btn btn-info container-fluid"
                onClick={() => {
                  toggle();
                }}
              >
                <i className="fas fa-plus" /> สั่งซื้อ
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
                        <th className="text-center">#</th>
                        <th className="text-center">รหัสคำสั่งซื้อ</th>
                        <th className="text-center">วันที่สั่ง</th>
                        <th className="text-center">ผู้สั่ง</th>
                        <th className="text-center">สถานะ</th>
                        <th className="text-center">รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleorderList.map((val, key) => {
                        return (
                          <tr key={key}>
                            <td className="text-center">{val.f_index}</td>
                            <td className="text-center">{val.f_saleorder_id}</td>
                            <td className="text-center">{moment(val.f_saleorder_date).add(543,"year").format('DD MMM YYYY')}</td>
                            <td>{val.f_customer_accid}<br></br>{val.f_customer_name}</td>
                            <td className="text-center"><h5 className="mb-1">{val.f_saleorder_status == 1 ? (<span className="badge badge-danger">รอชำระเงิน</span>)
                            :val.f_saleorder_status == 2 ? (<span className="badge badge-warning">รอแพคของ</span>)
                            :val.f_saleorder_status == 3 ? (<span className="badge badge-primary">รอจัดส่ง</span>)
                            :val.f_saleorder_status == 4 ? (<span className="badge badge-success">สั่งซื้อสำเร็จ</span>)
                                : (<span className="badge badge-dark">ยกเลิก</span>)}</h5></td>
                            <td className="text-center">
                              <Link to={`/saleorder_detail/${val.f_saleorder_id}`}>
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
      <Modal_saleorder modal={modal} toggle={toggle}></Modal_saleorder>
      {/* /.content */}
    </div>
  );
}

export default Saleorder_list;
