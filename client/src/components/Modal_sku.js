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
import Swal from "sweetalert2";

export default function Modal_sku(props) {
  const [sku_img, set_sku_img] = useState("");
  const [sku_id, set_sku_id] = useState("");
  const [sku_name, set_sku_name] = useState("");
  const [sku_cost_price, set_sku_cost_price] = useState(0.0);
  const [sku_sale_price, set_sku_sale_price] = useState(0.0);
  const props_prod_id = props.prod_id;
  const check_form = () => {
    if (sku_id === "") {
      return false;
    }
    if (sku_name === "") {
      return false;
    }
    if (sku_cost_price === "") {
      return false;
    }
    if (sku_sale_price === "") {
      return false;
    }
    return true;
  }
  const alerts_add_success = (title, text) =>
    Swal.fire({
      title: title,
      text: text,
      icon: "success",
      confirmButtonText: "ดำเนินการต่อ",
      allowOutsideClick: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        v_toggle();
        props.reload();
      }
    });
  const alerts_add_fail = (title, text) =>
    Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      confirmButtonText: "ตกลง",
    });
  const v_toggle = (event) => {
    props.toggle(!props.modal)
    // onLoadForm(props.prod_id)
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const url = URL.createObjectURL(event.target.files[0]);
      set_sku_img(url);
    }
  };

  function onLoadForm(sku_id) {
    if (props.data.type_process === "add") {
      set_sku_id("")
      set_sku_name("")
      set_sku_cost_price(0.0)
      set_sku_sale_price(0.0)
    } else {
      Axios.get(`http://localhost:3001/product/sku/get_sku_detail/${props_prod_id}/${sku_id}`).then((response) => {
        set_sku_id(response.data[0].f_sku_id);
        set_sku_name(response.data[0].f_sku_name);
        set_sku_cost_price(response.data[0].f_cost_price);
        set_sku_sale_price(response.data[0].f_sale_price);
        set_sku_img(response.data[0].f_sku_img)
      });
    }
  }

  const insertsku = () => {
    Axios.get(`http://localhost:3001/product/sku/get_sku_detail/${props_prod_id}/${sku_id}`).then(
      (response) => {
        if (response.length > 0) {
          alerts_add_fail("มี รหัสSKU นี้แล้ว", "กรุณาระบุรหัสSKUใหม่เนื่องจากซ้ำกับที่มีอยู่ในระบบ")
        } else {
          if (check_form()) {
            const img_file = document.querySelector('#file')
            const file = img_file.files[0]
            let formData = new FormData();
            formData.append('sku_img', file);
            formData.append('prod_id', props_prod_id);
            formData.append('sku_name', sku_name);
            formData.append('sku_id', sku_id);
            formData.append('cost_price', sku_cost_price);
            formData.append('sale_price', sku_sale_price);
            Axios.post("http://localhost:3001/product/sku/add_sku",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }).then((response) => {
                console.log(response)
                if (response.status == 200) {
                  alerts_add_success("ดำเนินการสำเร็จ","เพิ่ม SKU ใหม่เรียบร้อยแล้ว")
                } else {
                  alerts_add_fail("เพิ่มข้อมูลผิดพลาด", "พบปัญหาในการเพิ่มข้อมูลกรุณาลองใหม่อีกครั้ง")
                }
              })
          } else {
            alerts_add_fail("ไม่สามารถดำเนินการได้", "กรุณากรอกข้อมูลสินค้าให้ครบถ้วน")
          }
        }
      }
    )
  }

  const updateProduct = () => {
    const img_file = document.querySelector('#file')
    const file = img_file.files[0]
    let formData = new FormData();
    formData.append('sku_img', file);
    formData.append('prod_id', props_prod_id);
    formData.append('sku_name', sku_name);
    formData.append('sku_id', sku_id);
    formData.append('cost_price', sku_cost_price);
    formData.append('sale_price', sku_sale_price);
    Axios.put("http://localhost:3001/product_list/edit",
      formData,{headers: {"Content-Type": "multipart/form-data"}}).then((response) => {
        if (response.status == 200) {
          alerts_add_success("ดำเนินการสำเร็จ","แก้ไข SKU เรียบร้อยแล้ว")
        } else {
          alerts_add_fail("ไม่สามารถดำเนินการได้", "กรุณาลองดำเนินการใหม่อีกครั้ง")
        }
    });
  };

  useEffect(() => {
    //  console.log(props.type_process.sku_id)
    if (props.modal === true) {
      onLoadForm(props.data.sku_id)
    } else {
      if (props_prod_id != "") {
        props.reload();
      }
    }
  }, [props.modal]);
  return (
    <Modal isOpen={props.modal} toggle={v_toggle} className={props.className}>
      <ModalHeader toggle={v_toggle}>{props.data.type_process === 'add' ? ('เพิ่มรายการ SKU') : ('แก้ไขรายการ SKU')}</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="sku_id">รหัสSKU</Label>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon3">{props_prod_id}</span>
              </div>
              <input type="text" className="form-control" name="sku_id" id="sku_id" placeholder="รหัสSKU..."
                onChange={(event) => {
                  set_sku_id(event.target.value);
                }}
                value={sku_id}
                aria-describedby="basic-addon3" />
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="sku_name">ชื่อSKU</Label>
            <Input
              type="text"
              name="sku_name"
              id="sku_name"
              placeholder="ชื่อSKU..."
              onChange={(event) => {
                set_sku_name(event.target.value);
              }}
              value={sku_name}
            />
          </FormGroup>
          <FormGroup>
            <Label for="cost_price">ราคาทุนต่อหน่วย</Label>
            <Input
              type="number"
              name="cost_price"
              id="cost_price"
              placeholder="ราคาทุนต่อหน่วย..."
              value={sku_cost_price}
              onChange={(e) => set_sku_cost_price(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="cost_price">ราคาขายต่อหน่วย</Label>
            <Input
              type="number"
              name="sale_price"
              id="sale_price"
              placeholder="ราคาขายต่อหน่วย..."
              value={sku_sale_price}
              onChange={(e) => set_sku_sale_price(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="sku_img">เลือกรูปสินค้าSKU</Label>
            <Input
              type="file"
              name="file"
              id="file"
              onChange={(event) => {
                onImageChange(event);
              }}
            />
          </FormGroup>

          <FormGroup className="text-center">
            <img src={sku_img} className="mr-2 img-fluid" />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            if (props.data.type_process == 'add') {
              insertsku();
            } else {
              updateProduct();
            }
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
