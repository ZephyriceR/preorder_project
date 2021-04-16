import { useState, useEffect } from "react";
import Axios from "axios";
import Modal_sku from "./Modal_sku";
import Modal_product from "./Modal_product";
function Product_detail(props) {
  const [skuList, setskuList] = useState([]);
  const [modalskuadd, setModalskuadd] = useState(false);
  const [modal_sku_data,set_modal_sku_data] = useState({type_process:"add",sku_id:""});
  const [modalprodedit, setModalprodedit] = useState(false);
  const [prodDetail, setprodDetail] = useState([]);
  const [prodid, setprodid] = useState("");
  const [prodname, setprodname] = useState("");
  const [prodimg, setprodimg] = useState("");
  const [prodlink, setprodlink] = useState("");
  // const [prod_name,setProd_name] = useState("");
  // const [prod_id, setProd_id] = useState("");
  const toggleskuadd = () => {setModalskuadd(!modalskuadd)};
  const toggleprodedit = () => setModalprodedit(!modalprodedit);
  const prod_id=props.match.params.prod_id;
  const getskuList = () => {
    Axios.get(`http://localhost:3001/product/sku/get_sku_list/${prod_id}`).then(
      (response) => {
        console.log(response.data)
        setskuList(response.data);
      }
    );
  };

  function getProddetail(){
    Axios.get(`http://localhost:3001/product_detail/${prod_id}`).then(
      (response) => {
        setprodimg(response.data[0].f_prod_img);
        setprodid(response.data[0].f_prod_id);
        setprodname(response.data[0].f_prod_name);
        setprodDetail(response.data[0].f_prod_detail);
        setprodlink(response.data[0].f_prod_link);
      }
    );
  };

  useEffect(() => {
    getskuList();
    getProddetail();
  }, []);
  const img_style = {
    height: 200,
    width: 200,
    objectFit: "cover",
  };
  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-8">
              <h1 className="m-0 text-dark">รายละเอียดสินค้า</h1>
            </div>
            <div className="col-sm-2 mt-2">
              <button
                className="btn btn-warning container-fluid"
                onClick={() => {
                  toggleprodedit();
                }}
              >
                <i className="fas fa-edit" /> แก้ไขข้อมูล
              </button>
            </div>
            <div className="col-sm-2 mt-2">
              <button
                className="btn btn-info container-fluid"
                onClick={() => {
                  set_modal_sku_data({...modal_sku_data,type_process:"add",sku_id:""})
                  toggleskuadd();
                }}
              >
                <i className="fas fa-plus" /> เพิ่ม SKU

              </button>
            </div>
          </div>
          <div className="card text-center">
            <div className="row ml-2 mb-2 mt-2">
              <div className="col-sm-3">
                
                <img
                  className="img-rounded"
                  src={prodimg}
                  style={img_style}
                />
              </div>
              <div className="col-sm-4">
                <div className="row ml-2 mb-2 mt-2">รหัสสินค้า : {prodid}</div>
                <div className="row ml-2 mb-2 mt-2">ชื่อสินค้า : {prodname}</div>
                <div className="row ml-2 mb-2 mt-2">ร้านค้า : <a href={prodlink} target="_blank">ไปยังร้านค้า</a></div>

              </div>
              <div className="col-sm-4">
              <div className="row ml-2 mb-2 mt-2">รายละเอียดสินค้า :</div>
                <div className="row ml-2 mb-2 mt-2">{prodDetail}</div>
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
                  <h3 className="card-title">รายการ SKU</h3>
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
                        <th className="text-center">รูปสินค้า</th>
                        <th className="text-center">รหัสSKU</th>
                        <th className="text-center">ชื่อSKU</th>
                        <th className="text-center">แก้ไข</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skuList.map((val, key) => {
                        return (
                          <tr key={key}>
                            <td className="text-center">
                              <img
                                src={val.f_sku_img}
                                className="img-size-ingrid mr-2"
                              />
                            </td>
                            <td>{val.f_sku_id}</td>
                            <td>{val.f_sku_name}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-warning"
                                onClick={() => {
                                  set_modal_sku_data({...modal_sku_data,type_process:"edit",sku_id:val.f_sku_id})
                                  toggleskuadd();
                                }}
                              >
                                <i className="fas fa-edit" /> แก้ไข
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
      <Modal_sku modal={modalskuadd} data={modal_sku_data} prod_id={prod_id} toggle={toggleskuadd} reload={getskuList}></Modal_sku>
      <Modal_product
        modal={modalprodedit}
        prod_id={prod_id}
        type_process={'edit'}
        toggle={toggleprodedit}
        reload={getProddetail}
      ></Modal_product>
    </div>
  );
}

export default Product_detail;
