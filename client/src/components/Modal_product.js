import { useState, use } from "react";
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
export default function Modal_product(props) {
  const [Prod_img, setProd_img] = useState("");
  const [Prod_id, setProd_id] = useState("");
  const [Prod_name, setProd_name] = useState("");

  const v_toggle  = (event) =>{
      props.toggle(!props.modal)
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const url = URL.createObjectURL(event.target.files[0]);
      setProd_img(url);
    }
  };

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
            />
          </FormGroup>
          <FormGroup>
            <Label for="exampleFile">เลือกรูปสินค้า</Label>
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
