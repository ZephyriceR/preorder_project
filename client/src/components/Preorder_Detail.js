import { useState, useEffect } from "react";
import Axios from "axios";
import Modal_conclude_preorder from "./Modal_conclude_preorder";
import moment from "moment"
moment.locale("th")
function Preorder_detail(props) {
  const [saleorderList, setsaleorderList] = useState([]);
  const [preorderHead, setpreorderHead] = useState([]);
  const [modal_conclude, setModal_conclude] = useState(false);
  // const [modalpreorderedit, setModalpreorderedit] = useState(false);
  // const [prodDetail, setprodDetail] = useState([]);
  // const [prodid, setprodid] = useState("");
  // const [prodname, setprodname] = useState("");
  // const [prodimg, setprodimg] = useState("");
  // const [prod_name,setProd_name] = useState("");
  // const [prod_id, setProd_id] = useState("");
  const toggleModal_conclude = () => setModal_conclude(!modal_conclude);
  // const togglepreorderedit = () => setModalpreorderedit(!modalpreorderedit);
  const preorder_id = props.match.params.preorder_id;

  const getSaleorderList = () => {
    Axios.get(`http://localhost:3001/preorder/get_detail/${preorder_id}`).then(
      (response) => {
        setsaleorderList(response.data)
      }
    );
  };

  const getpreorderHead = () => {
    Axios.get(`http://localhost:3001/preorder/get_head/${preorder_id}`).then(
      (response) => {
        setpreorderHead(response.data[0])
      }
    );
  };

  const update_Status = (preorder_id,status) => {
    Axios.put(`http://localhost:3001/preorder/update_status/`, { preorder_id: preorder_id, status: status }).then(
      (response) => {
        getSaleorderList()
        getpreorderHead()
        toggleModal_conclude()
      }
    );
  };

  useEffect(() => {
    getSaleorderList();
    getpreorderHead();
  }, []);

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-9">
              <h1 className="m-0 text-dark">รายละเอียดการพรีออเดอร์</h1>
            </div>
            {preorderHead.f_preorderlot_status == 1 ? <div className="col-sm-3">
              <button
                className="btn btn-warning container-fluid"
                onClick={() => {
                  toggleModal_conclude()
                }}
              >
                <i className="fas fa-edit" /> สรุปรายการและปิดยอด
              </button>
            </div> : <div className="col-sm-3">
              <button
                className="btn btn-warning container-fluid"
                onClick={() => {
                  toggleModal_conclude()
                }}
              >
                <i className="fas fa-edit" /> ดูยอดรวม
              </button>
            </div>}
            
          </div>
          <div className="card text-center">
            <div className="row ml-2 mb-2 mt-2">
              <div className="col-sm-3">
                <img
                  className="img-rounded"
                  src={preorderHead.f_prod_img}
                  style={{ height: 200 + "px" }}
                />
              </div>
              <div className="col-sm-4">
                <div className="row ml-2 mb-2 mt-2">เลขที่พรีออเดอร์ : {preorderHead.f_preorderlot_id}</div>
                <div className="row ml-2 mb-2 mt-2">วันที่เปิดพรี : {moment(preorderHead.f_create_date).add(543, "year").format("DD MMM YYYY")}</div>
                <div className="row ml-2 mb-2 mt-2">กำหนดปิดพรี : {moment(preorderHead.f_close_date).add(543, "year").format("DD MMM YYYY")}</div>
                <div className="row ml-2 mb-2 mt-2">สถานะ : <h5 className="mb-1">{preorderHead.f_preorderlot_status == 1 ? (<span className="badge badge-success">กำลังเปิดรอบ</span>) :
                  preorderHead.f_preorderlot_status == 2 ? (<span className="badge badge-secondary">ปิดรอบแล้ว</span>) :
                    (<span className="badge badge-danger">ยกเลิก</span>)}</h5></div>
              </div>
              <div className="col-sm-5">
                <div className="row ml-2 mb-2 mt-2">รหัสสินค้า : {preorderHead.f_prod_id}</div>
                <div className="row ml-2 mb-2 mt-2">ชื่อสินค้า : {preorderHead.f_prod_name}</div>
                <div className="row ml-2 mb-2 mt-2">รายละเอียดสินค้า : {preorderHead.f_prod_detail}</div>
                <div className="row ml-2 mb-2 mt-2"><a href={preorderHead.f_prod_link} target="_blank">ลิงค์ร้านค้า</a></div>
              </div>
            </div>
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
                <div className="card-header border-0">
                  <h3 className="card-title">รายการสั่งซื้อ</h3>
                  {/* <div className="card-tools">
                    <a href="#" className="btn btn-tool btn-sm">
                      <i className="fas fa-download" />
                    </a>
                    <a href="#" className="btn btn-tool btn-sm">
                      <i className="fas fa-bars" />
                    </a>
                  </div> */}
                </div>
                <div className="card-body table-responsive p-0">
                  <table className="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th className="text-center">เลขที่คำสั่งซื้อ</th>
                        <th className="text-center">ข้อมูลลูกค้า</th>
                        <th className="text-center">สินค้าที่สั่ง(SKU)</th>
                        <th className="text-center">จำนวน</th>
                        <th className="text-center">สถานะคำสั่งซื้อ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleorderList.map((val, key) => {
                        return (
                          <tr key={key}>
                            <td className="text-center">
                              <a href={`/saleorder_detail/${val.f_saleorder_id}`} target="_blank">
                                {val.f_saleorder_id}
                              </a>

                            </td>
                            <td>[{val.f_customer_accid}]<br />{val.f_customer_name}</td>
                            <td>{val.f_sku_id}<br />{val.f_sku_name}</td>
                            <td className="text-right">{val.f_prod_qty}</td>
                            <td className="text-center"><h5 className="mb-1">{val.f_saleorder_status == 1 ? (<span className="badge badge-dark">รอชำระเงิน</span>)
                              : val.f_saleorder_status == 2 ? (<span className="badge badge-warning">รอแพคของ</span>)
                                : val.f_saleorder_status == 3 ? (<span className="badge badge-primary">รอจัดส่ง</span>)
                                  : val.f_saleorder_status == 4 ? (<span className="badge badge-success">สั่งซื้อสำเร็จ</span>)
                                    : (<span className="badge badge-danger">ยกเลิก</span>)}</h5></td>
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
      {/* /.content */}
      <Modal_conclude_preorder modal={modal_conclude} preorder_id={preorder_id} preorderlot_status={preorderHead.f_preorderlot_status} toggle={toggleModal_conclude} update_status={update_Status}>

      </Modal_conclude_preorder>
    </div>
  );
}

export default Preorder_detail;
