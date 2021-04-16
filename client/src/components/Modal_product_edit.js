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
export default function Modal_product_edit(props) {
  const [Prod_img, setProd_img] = useState("");
  const [Prod_id, setProd_id] = useState("");
  const [Prod_name, setProd_name] = useState("");
  const [Prod_detail, setProd_detail] = useState("");
  const [Prod_link, setProd_link] = useState("");
  
  const v_toggle  = (event) =>{
      props.toggle(!props.modal)
      onLoadForm(props.prod_id)
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const url = URL.createObjectURL(event.target.files[0]);
      setProd_img(url);
    }
  };

 const onLoadForm = (prod_id) =>{
  if (prod_id===""){
    setProd_id("")
    setProd_detail("")
    setProd_img("")
    setProd_name("")
  }else{
    Axios.get(`http://localhost:3001/product_detail/${prod_id}`).then((response) => {
        // console.log(response.data)
        console.log(response.data[0].f_prod_id)
        setProd_img(response.data[0].f_prod_img);
        setProd_id(response.data[0].f_prod_id);
        setProd_name(response.data[0].f_prod_name);
        setProd_detail(response.data[0].f_prod_detail)
    });
  }
 }

  const updateProduct = (prod_id) => {
    Axios.put("http://localhost:3001/product_list/edit", {
      prod_name: Prod_name,
      prod_id: Prod_id,
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

  return (
    <Modal isOpen={props.modal} toggle={v_toggle}  className={props.className}>
      <ModalHeader toggle={v_toggle}>เพิ่มรายการสินค้า</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="prod_id">รหัสสินค้า</Label>
            <Input
              type="text"
              name="prod_id"
              id="prod_id"
              placeholder="รหัสสินค้า..."
              onChange={(event) => {
                setProd_id(event.target.value);
              }}
              value={Prod_id}
            />
          </FormGroup>
          <FormGroup>
            <Label for="prod_name">ชื่อสินค้า</Label>
            <Input
              type="text"
              name="prod_name"
              id="prod_name"
              placeholder="ชื่อสินค้า..."
              onChange={(event) => {
                setProd_name(event.target.value);
              }}
              value={Prod_name}
            />
          </FormGroup>
          <FormGroup>
            <Label for="prod_name">รายละเอียดสินค้า</Label>
            <textarea className="form-control" rows="3" name="prod_detail" id="prod_detail" placeholder="รายละเอียดสินค้า..." onChange={(event) => {
                setProd_detail(event.target.textarea);
              }}></textarea>
          </FormGroup>
          <FormGroup>
            <Label for="prod_id">ลิงค์ร้านค้า</Label>
            <Input
              type="text"
              name="prod_link"
              id="prod_link"
              placeholder="ลิงค์ร้านค้า..."
              onChange={(event) => {
                setProd_link(event.target.value);
              }}
              value={Prod_id}
            />
          </FormGroup>
          <FormGroup>
            <Label for="prod_img">เลือกรูปสินค้า</Label>
            <Input
              type="file"
              name="file"
              id="exampleFile"
              onChange={(event) => {
                onImageChange(event);
                
              }}
            />
          </FormGroup>
         
          <FormGroup className="text-center">
            <img src={Prod_img} className="mr-2 img-fluid" />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            updateProduct(Prod_id);
          }}
        >
          บันทึก
        </Button>{" "}
        <Button color="secondary" onClick={v_toggle}>
          ยกเลิก
        </Button>
      </ModalFooter>
    </Modal>
  );
}
