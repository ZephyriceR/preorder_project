import { useState, useEffect } from "react";
import Axios from "axios";
import moment from 'moment';
import Modal_transaction from "./Modal_transaction";
import Modal_delivery from "./Modal_delivery";
import 'moment/locale/th';
import Swal from "sweetalert2";
moment.locale("th");

export default function Saleorder_detail(props) {
  const [saleorderDetail, setsaleorderDetail] = useState([]);
  const [saleorderHead, setsaleorderHead] = useState([]);
  const [modal_transaction, setmodal_transaction] = useState(false);
  const [modal_delivery, setmodal_delivery] = useState(false);
  const toggle_modal_transaction = () => setmodal_transaction(!modal_transaction);
  const toggle_modal_delivery = () => setmodal_delivery(!modal_delivery);
  const saleorder_id = props.match.params.saleorder_id;
  const alert_choice_update_packing = () => Swal.fire({
    title: 'แพคเสร็จแล้ว?',
    text: "ต้องการอัปเดตสถานะแพคของใช่หรือไม่?",
    showCancelButton: true,
    confirmButtonColor: '#8DBE57',
    cancelButtonColor: '#242526',
    confirmButtonText: 'พร้อมจัดส่ง!',
    cancelButtonText: 'ปิด',
  }).then((result) => {
    if (result.isConfirmed) {
      Axios.put(`http://localhost:3001/saleorder/update_packing/${saleorder_id}`).then(
      (response) => {
        if (response.status==200){
          getSaleorderHead()
        }
      }
    );
    }
  });

  const getSaleorderDetail = () => {
    Axios.get(`http://localhost:3001/saleorder/saleorder_detail/${saleorder_id}`).then(
      (response) => {
        setsaleorderDetail(response.data)
      }
    );
  };

  const getSaleorderHead = () => {
    Axios.get(`http://localhost:3001/saleorder/saleorder_head/${saleorder_id}`).then(
      (response) => {
        setsaleorderHead(response.data[0]);
      }
    );
  };

  useEffect(() => {
    getSaleorderHead();
    getSaleorderDetail();
  }, []);

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0 text-dark">รายละเอียดคำสั่งซื้อ &nbsp;
              {saleorderHead.f_saleorder_status == 1 ? (<span className="badge badge-danger">รอชำระเงิน</span>)
              : saleorderHead.f_saleorder_status == 2 ? (<span className="badge badge-warning">รอแพคของ</span>)
              : saleorderHead.f_saleorder_status == 3 ? (<span className="badge badge-primary">รอจัดส่ง</span>)
              : saleorderHead.f_saleorder_status == 4 ? (<span className="badge badge-success">สั่งซื้อสำเร็จ</span>)
              : (<span className="badge badge-dark">ยกเลิก</span>)}</h1>
            </div>
            {saleorderHead.f_saleorder_status == 1 ? (<div className="col-sm-2 mt-2">
              <button
                className="btn btn-warning container-fluid"
              >
                <i className="fas fa-edit" /> แก้ไขคำสั่งซื้อ
              </button>
            </div>) : (<div className="col-sm-2 mt-2"></div>)}


          </div>

          <div className="row">
            <div className="col-sm-7">
              <div className="card">
                <div className="card-header">
                  <div className="col-sm-12">
                    <div><b>เลขที่ใบสั่งซื้อ : </b> <span className="float-right">{saleorderHead.f_saleorder_id}</span></div>
                    <div><b>วันที่ออกใบสั่งซื้อ : </b> <span className="float-right">{moment(saleorderHead.f_saleorder_date).add(543, "year").format("DD MMM YYYY HH:mm น.")}</span></div>
                    <div><b>หมายเหตุ :</b> <span className="float-right">{saleorderHead.f_saleorder_remark}</span></div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">

                  </div>
                  <div className="row">
                    <div className="card w-100">
                      <div className="card-header">
                        <h3 className="card-title">รายการสินค้าสั่งซื้อ</h3>
                      </div>
                      <div className="card-body p-0">
                        <ul className="products-list product-list-in-card pl-2 pr-2">
                          {saleorderDetail.map((val, key) => {
                            return (
                              <li className="item" key={key}>
                                <div className="product-img">
                                  <img src={val.f_sku_img} alt="Product Image" className="img-size-64" />
                                </div>
                                <div className="product-info">
                                  <div className="product-title">[{val.f_preorderlot_id}]
                                <span className="badge badge-dark mt-1 float-right"><h6 className="mb-1">x {val.f_prod_qty}</h6></span>
                                  </div>
                                  <span className="product-description">
                                    รหัส SKU : {val.f_sku_id}
                                  </span>
                                  <span className="product-description">
                                    ชื่อสินค้า : {val.f_prod_name} - {val.f_sku_name}
                                  </span>
                                  <span className="product-description">
                                    ราคารวม :
                                <span className="badge badge-danger mt-1 ml-2">{val.f_prod_qty * val.f_prod_price}.-</span>
                                  </span>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                      <div className="card-footer text-right">
                        <div><span className="text-bold">ค่าจัดส่ง : {parseFloat(saleorderHead.f_saleorder_delivery).toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท</span></div>
                        <div><span className="text-bold">ส่วนลด : {parseFloat(saleorderHead.f_saleorder_discount).toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท</span></div>
                        <div><span className="text-bold">ราคาสุทธิ : {parseFloat(saleorderHead.f_saleorder_saletotal).toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-center">
                  {saleorderHead.f_saleorder_status == 1 ?
                    (<button className="btn btn-primary text-center" onClick={() => toggle_modal_transaction()}>
                      <i className="fas fa-file-upload"/> อัปโหลดหลักฐานการชำระเงิน</button>)
                    : saleorderHead.f_saleorder_status == 2 ?
                    (<button className="btn btn-warning text-center" onClick={() => alert_choice_update_packing()}>
                      <i className="fas fa-box-open"/> แพคของแล้ว</button>)
                    : saleorderHead.f_saleorder_status == 3 ?
                    (<button className="btn btn-primary text-center" onClick={() => toggle_modal_delivery()}>
                      <i className="fas fa-shipping-fast"/> อัปเดตการจัดส่ง</button>)
                    : saleorderHead.f_saleorder_status == 4 ? 
                    (<h5><span className="badge badge-success">จัดส่งสำเร็จแล้ว</span></h5>)
                    : (<span className="badge badge-dark">ยกเลิก</span>)}
                </div>
              </div>
            </div>
            <div className="col-sm-5">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">ข้อมูลการจัดส่ง</h5>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item"><b>ชื่อแอคเค้า : </b> <span className="float-right">{saleorderHead.f_customer_accid}</span></li>
                  <li className="list-group-item"><b>ชื่อผู้สั่ง : </b> <span className="float-right">{saleorderHead.f_customer_name}</span></li>
                  <li className="list-group-item"><b>เบอร์โทร : </b> <span className="float-right">{saleorderHead.f_customer_tel}</span></li>
                  <li className="list-group-item"><b>ที่อยู่จัดส่ง : </b> <span className="float-right">{saleorderHead.f_customer_address}</span></li>
                </ul>

              </div>
            </div>
          </div>

          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      {/* Main content */}

      {/* /.content */}
      {/* <Modal_sku modal={modalskuadd} toggle={toggleskuadd}></Modal_sku> */}
      <Modal_transaction
        modal={modal_transaction}
        toggle={toggle_modal_transaction}
        saleorder_id={saleorder_id}
        reload_head={getSaleorderHead}
      ></Modal_transaction>
      <Modal_delivery
        modal={modal_delivery}
        toggle={toggle_modal_delivery}
        saleorder_id={saleorder_id}
        reload_head={getSaleorderHead}
      ></Modal_delivery>
    </div>
  );
}


