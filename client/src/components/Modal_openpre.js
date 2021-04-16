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
  ListGroup,
  ListGroupItem
} from "reactstrap";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "axios";
import Swal from "sweetalert2";
import Product_list from "./Product_list";

export default function Modal_openpre(props) {
  const [Prod_list, setProd_list] = useState([]);
  const [form_input, setForm_input] = useState({
    preorder_id: "",
    preorder_startdate: new Date(),
    preorder_closedate: new Date(),
    prod_id: "",
    prod_name: "",
  })
  // const [preoder_id, setpreoder_id] = useState("");
  // const [preoder_date, setpreoder_date] = useState(new Date());
  // const [prod_id, setProd_id] = useState("");
  // const [prod_name, setProd_name] = useState("");
  // const [preoder_closedate, setpreoder_closedate] = useState(new Date());
  const [Prodmodal, setProdmodal] = useState(false);

  const v_toggle = (event) => {
    props.toggle(!props.modal);
  };
  const toggleProdmodal = async () => {
    setProdmodal(!Prodmodal);
    if (Prodmodal == false) {
      get_productList();
    }

  };

  const updateFormState = (e) => {
    setForm_input({ ...form_input, [e.target.name]: e.target.value }
    )
  }
  const update_Preorder_startDate = (date) => {
    console.log(date);
    setForm_input({ ...form_input, preorder_closedate: date});
 }

  const get_productList = () => {
    Axios.get("http://localhost:3001/product_list").then((response) => {
      setProd_list(response.data);
    });
  };

  const alerts_success = () =>
    Swal.fire({
      title: "สำเร็จ!",
      text: "เปิดรายการพรีออเดอร์สำเร็จ",
      icon: "success",
      confirmButtonText: "ดำเนินการต่อ",
      allowOutsideClick:false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        v_toggle();
        props.reloaddata();
      }
    });

    const alerts_warning = () =>
    Swal.fire({
      title: "อย่าลืมเลือกสินค้า!",
      text: "กรุณาเลือกสินค้าก่อนเพื่อทำการเปิดพรีออเดอร์",
      icon: "warning",
      confirmButtonText: "ตกลง",
    });

    const alerts_warning_error = () =>
    Swal.fire({
      title: "เปิดพรีออเดอร์ไม่สำเร็จ",
      text: "ไม่สามารถเพิ่มรายการพรีออเดอร์ได้โปรดลองอีกครั้ง",
      icon: "error",
      confirmButtonText: "ปิด",
    });

  const createPreorder = () => {
    if (form_input.prod_id == ""){
      alerts_warning();
    }else{
      Axios.post("http://localhost:3001/preorder/create", form_input)
      .then((response)=>{
        if(response.status == 200) {
          alerts_success();
        }else{
          alerts_warning_error();
          };
        })
      .catch((error)=>{
        alerts_warning_error();
      })
    }
  };

  const get_newpreorderID = () => {
    Axios.get("http://localhost:3001/preorder/getnew_preorderID").then(
      (response) => {
        console.log(response)
        setForm_input({ ...form_input, ["preorder_id"]: response.data});
      }
    );
  };


  function selected_prod(p_prodID, p_prodname) {
    setForm_input({ ...form_input, ["prod_id"]: p_prodID,["prod_name"]: p_prodname });
    toggleProdmodal();
  }

  const updateProduct = (prod_id) => {
    Axios.put("http://localhost:3001/product_list/edit", {
      // prod_name: prod_name,
      // prod_id: prod_id,
    }).then((response) => {
      // setproductList(
      //   productList.map((val, key) => {
      //     return val.f_prod_id == prod_id
      //       ? {
      //           f_prod_id: val.f_prod_id,
      //           f_prod_name: val.f_prod_name,
      //         }
      //       : val;
      //   })
      // );
    });
  };

  useEffect(() => {
    if (props.modal == true) {
      // onLoadForm(props.preorder_id)
      get_newpreorderID();
    } else {
      // if (props.preorder_id != "") {
       
      // }
    }
  }, [props.modal]);

  return (
    <Modal
      isOpen={props.modal}
      toggle={v_toggle}
      size={"lg"}
      className={props.className}
    >
      <ModalHeader toggle={v_toggle}>เพิ่มรายการพรีออเดอร์</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="preorder_id">รหัสพรีออเดอร์</Label>
            <Input
              type="text"
              name="preorder_id"
              id="preorder_id"
              placeholder="รหัสพรีออเดอร์..."
              value={form_input.preorder_id}
              onChange={updateFormState}
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <Label for="preorder_date">วันที่เปิดพรี: </Label>
            <Datepicker
              selected={form_input.preorder_startdate}
              name="preorder_startdate"
              onChange={updateFormState}
              readOnly
              className={"form-control"}
            ></Datepicker>
          </FormGroup>
          <FormGroup>
            <Label for="preorder_closedate">วันที่ปิดพรี: </Label>
            <Datepicker
              selected={form_input.preorder_closedate}
              name="preorder_closedate"
              onChange={(date) => {update_Preorder_startDate(date)}}
              className={"form-control"}
            ></Datepicker>
          </FormGroup>
          <FormGroup className="text-center">
            <Button className="btn btn-info" onClick={toggleProdmodal}>
              เลือกสินค้า
            </Button>


            <Modal isOpen={Prodmodal}  size={"lg"} toggle={toggleProdmodal}>
              <ModalHeader>เลือกรายการสินค้าที่ต้องการเปิดพรี</ModalHeader>
              <ModalBody>
                <div className="card-body table-responsive p-0">
                  <table className="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th className="text-center">ลำดับ</th>
                        <th className="text-center">รูปสินค้า</th>
                        <th className="text-center">รหัสสินค้า</th>
                        <th className="text-center">ชื่อสินค้า</th>
                        <th className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Prod_list].reverse().map((val, key) => {
                        return (
                          <tr key={key}>

                            <td className="text-center">{val.f_index}</td>
                            <td className="text-center">
                              <img
                                src={val.f_prod_img}
                                className="img-size-50 mr-2"
                              />
                            </td>
                            <td>{val.f_prod_id}</td>
                            <td>{val.f_prod_name}</td>
                            {/* <td className="text-center">
                              <a href={val.f_prod_link} target="_blank">
                                ไปยังร้านค้า
                              </a>
                            
                            </td> */}
                            <td className="text-center">
                              <button className="btn btn-info " onClick={() => { selected_prod(val.f_prod_id, val.f_prod_name) }}>
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
                <Button color="primary" onClick={toggleProdmodal}>
                  ปิด  </Button>
              </ModalFooter>
            </Modal>


          </FormGroup>
          <FormGroup>
            <Label for="prod_id">รหัสสินค้า</Label>
            <Input
              type="text"
              name="prod_id"
              id="prod_id"
              placeholder="รหัสสินค้า..."
              onChange={updateFormState}
              value={form_input.prod_id}
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <Label for="prod_name">ชื่อสินค้า</Label>
            <Input
              type="text"
              name="prod_name"
              id="prod_name"
              placeholder="ชื่อสินค้า..."
              onChange={updateFormState}
              value={form_input.prod_name}
              readOnly
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            createPreorder();
          }}
        >
          เปิดพรี
        </Button>{" "}
        <Button color="secondary" onClick={v_toggle}>
          ยกเลิก
        </Button>
      </ModalFooter>
    </Modal>
  );
}
