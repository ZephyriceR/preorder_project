import { useState, useEffect } from "react";
import Axios from "axios";
import Modal_product from "./Modal_product";



function Product_list(props) {
  const [productList, setproductList] = useState([]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const getproductList = () => {
    Axios.get("http://localhost:3001/product_list").then((response) => {
      setproductList(response.data);
    });
  };



  useEffect(() => {
    getproductList();
  }, []);

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0 text-dark">รายการสินค้า</h1>
            </div>
            <div className="col-sm-2">
              <button className="btn btn-info container-fluid" onClick={()=>{toggle()}}>
                <i className="fas fa-plus" /> เพิ่มสินค้า
              </button>
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
                {/* <div className="card-header border-0">
                  <h3 className="card-title">รายการสินค้า</h3> */}
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
                        <th className="text-center">รูปสินค้า</th>
                        <th className="text-center">รหัสสินค้า</th>
                        <th className="text-center">ชื่อสินค้า</th>
                        <th className="text-center">แก้ไข</th>
                        <th className="text-center">รายละเอียด</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.map((val, key) => {
                        return (
                          <tr>
                            <td className="text-center">
                              <img
                                src={val.f_prod_img}
                                className="img-size-ingrid mr-2"
                              />
                            </td>
                            <td>{val.f_prod_id}</td>
                            <td>{val.f_prod_name}</td>
                            <td className="text-center">
                              <button className="btn btn-warning" onClick={()=>{toggle()}}>
                                <i className="fas fa-edit" /> แก้ไข
                              </button>
                            </td>
                            <td className="text-center">
                              <button className="btn btn-info ">
                                <i className="fas fa-search" /> รายละเอียด
                              </button>
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
      {/* /.content */}
      <Modal_product modal={modal} toggle={toggle}>
      </Modal_product>
    </div>
  );
}

export default Product_list;
