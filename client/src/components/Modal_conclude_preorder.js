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
export default function Modal_conclude_preorder(props) {
  const [conclude_List, setconclude_list] = useState([]);
  
  const vtoggle  = (event) =>{
      props.toggle(!props.modal)
  }

 function getconclude_list(){
   Axios.get(`http://localhost:3001/preorder/get_conclude/${props.preorder_id}`).then((response) => {
    setconclude_list(response.data)
    });
 }

  useEffect(() => {
    if (props.modal == true){
        getconclude_list();
    }else{
    }
  }, [props.modal]);
  return (
            <Modal isOpen={props.modal}  size={"lg"} toggle={vtoggle}>
              <ModalHeader>สรุปรายการพรีออเดอร์</ModalHeader>
              <ModalBody>
                <div className="card-body table-responsive p-0">
                  <table className="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                      <th className="text-center">รูปสินค้า</th>
                        <th className="text-center">รายละเอียด</th>
                        <th className="text-center">ยอดพรีออเดอร์(ที่ชำระเงินแล้ว)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conclude_List.map((val, key) => {
                        return (
                          <tr key={key}>
                            <td className="text-center">
                              <img
                                src={val.f_sku_img}
                                className="img-size-ingrid mr-2"
                              />
                            </td>
                            <td>           
                            [{val.f_sku_id}]
                                <br/>
                            {val.f_sku_name}
                              </td>
                            <td className="text-center"><h4><span className="badge badge-primary">{val.sum_total.toLocaleString(undefined, {minimumFractionDigits:2})} ชิ้น</span></h4></td>
                            {/* <td className="text-center">
                              <a href={val.f_prod_link} target="_blank">
                                ไปยังร้านค้า
                              </a>
                            
                            </td> */}
                            {/* <td className="text-center">
                            {val.sum_total}
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </ModalBody>
              <ModalFooter>
                  {props.preorderlot_status == 1 ? <Button color="primary" onClick={()=>props.update_status(props.preorder_id,2)}>
                  ยืนยันการปิดรับยอด  </Button> : <Button color="warning" onClick={()=>props.update_status(props.preorder_id,1)}>
                  เปิดรับยอดอีกครั้ง </Button>}
              
                <Button color="danger" onClick={vtoggle}>
                  ปิด  </Button>
              </ModalFooter>
            </Modal>
  );
}
