import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import Axios from "axios";
export default function Modal_Avaliable_Preorderlot(props) {
  const [Available_sku_list, setAvailable_sku_list] = useState([]);
  
  const v_toggle  = (event) =>{
      props.toggle(!props.modal)
      onLoadForm()
  }

 function onLoadForm(){
   Axios.get(`http://localhost:3001/available_preorderlot`).then((response) => {
        setAvailable_sku_list(response.data)
    });
 }

  useEffect(() => {
    if (props.modal == true){
      onLoadForm();
    }else{
      if (props.prod_id != ""){
        // props.reload();
      }
    }
  }, [props.modal]);
  return (
            <Modal isOpen={props.modal}  size={"lg"} toggle={v_toggle}>
              <ModalHeader>สินค้าที่กำลังเปิดพรี</ModalHeader>
              <ModalBody>
                <div className="card-body table-responsive p-0">
                  <table className="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                      <th className="text-center">รูปสินค้า</th>
                        <th className="text-center">รายละเอียด</th>
                        <th className="text-center">ราคา</th>
                        <th className="text-center">เลือก</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Available_sku_list].reverse().map((val, key) => {
                        return (
                          <tr key={key}>
                            <td className="text-center">
                              <img
                                src={val.f_sku_img}
                                className="img-size-ingrid mr-2"
                              />
                            </td>
                            <td> 
                                <a href={`/preorder_detail/${val.f_preorderlot_id}`} target="_blank">
                            [{val.f_preorderlot_id}]
                              </a>
                                <br/>
                                <a href={`/product_detail/${val.f_prod_id}`} target="_blank">
                            {val.f_sku_id}
                              </a>
                              <br/>
                              {val.f_prod_name}-{val.f_sku_name}
                              </td>
                            <td>{val.f_sale_price.toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                            {/* <td className="text-center">
                              <a href={val.f_prod_link} target="_blank">
                                ไปยังร้านค้า
                              </a>
                            
                            </td> */}
                            <td className="text-center">
                              <button className="btn btn-info" onClick={() => props.addItem(val)}>
                                <i className="far fa-check-square" /> เลือก
                                </button>
                              <br />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={v_toggle}>
                  ปิด  </Button>
              </ModalFooter>
            </Modal>
  );
}
