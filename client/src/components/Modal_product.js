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


export default function Modal_product(props) {
  const [Prod_img, setProd_img] = useState("");
  const [Prod_id, setProd_id] = useState("");
  const [Prod_name, setProd_name] = useState("");
  const [Prod_detail, setProd_detail] = useState("");
  const [Prod_link, setProd_link] = useState("");
  const prod_id = props.prod_id;
  const check_form = () => {
    if (Prod_id === "") {
      return false;
    }
    if (Prod_name === "") {
      return false;
    }
    return true;
  }
  const alerts_add_success = () =>
    Swal.fire({
      title: "สำเร็จ!",
      text: "เพิ่มสินค้าสำเร็จ",
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

  const alerts_edit_success = () =>
    Swal.fire({
      title: "สำเร็จ!",
      text: "แก้ไขสินค้าสำเร็จ",
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
  const v_toggle = (event) => {
    props.toggle(!props.modal)
    onLoadForm(props.prod_id)
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const url = URL.createObjectURL(event.target.files[0]);
      setProd_img(url);
    }
  };

  function onLoadForm(prod_id) {
    if (props.type_process === 'add') {
      setProd_id("")
      setProd_detail("")
      setProd_link("")
      setProd_img("")
      setProd_name("")
    } else {
      Axios.get(`http://localhost:3001/product_detail/${prod_id}`).then((response) => {
        // console.log(response.data)
        setProd_img(response.data[0].f_prod_img);
        setProd_id(response.data[0].f_prod_id);
        setProd_name(response.data[0].f_prod_name);
        setProd_detail(response.data[0].f_prod_detail)
        setProd_link(response.data[0].f_prod_link)
      });
    }
  }



  const insertProduct = () => {
    Axios.get(`http://localhost:3001/product_detail/${prod_id}`).then(
      (response) => {
        if (response.lenght > 0) {
          alerts_add_fail("รหัสซ้ำ", "มีหรัสสินค้านี้แล้วกรุณาใช้รหัสอื่น");
        } else {
          if (check_form()) {
            const img_file = document.querySelector('#file')
            const file = img_file.files[0]
            let formData = new FormData();
            formData.append('prod_img', file);
            formData.append('prod_name', Prod_name);
            formData.append('prod_id', Prod_id);
            formData.append('prod_detail', Prod_detail);
            formData.append('prod_link', Prod_link);
            Axios.post("http://localhost:3001/product_list/add_prod",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }).then((response) => {
                if (response.status == 200) {
                  alerts_add_success()
                } else {
                  alerts_add_fail("ไม่สำเร็จ!", "รหัสสินค้าอาจซ้ำ กรุณาตรวจสอบ")
                }
              })
          } else {
            alerts_add_fail("ไม่สามารถดำเนินการได้", "กรุณากรอกข้อมูลสินค้าให้ครบถ้วน");
          }
        }
      }
    );

  }

  const updateProduct = () => {
    const img_file = document.querySelector('#file')
    const file = img_file.files[0]
    let formData = new FormData();
    formData.append('prod_img', file);
    formData.append('prod_name', Prod_name);
    formData.append('prod_id', props.prod_id);
    formData.append('prod_detail', Prod_detail);
    formData.append('prod_link', Prod_link);
    console.log(file)
    Axios.put("http://localhost:3001/product_list/edit",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((response) => {
        if (response.status == 200) {
          alerts_edit_success()
        } else {
          alerts_add_fail()
        }
      });
  };
  useEffect(() => {
    if (props.modal == true) {
      onLoadForm(props.prod_id)
    } else {
      if (props.prod_id != "") {
        props.reload();
      }
    }
  }, [props.modal]);
  return (
    <Modal isOpen={props.modal} toggle={v_toggle} className={props.className}>
      <ModalHeader toggle={v_toggle}>{props.type_process === 'add' ? ('เพิ่มรายการสินค้า') : ('แก้ไขรายการ')}</ModalHeader>
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
            <Label for="prod_detail">รายละเอียดสินค้า</Label>
            <textarea className="form-control" rows="3" name="prod_detail" id="prod_detail" placeholder="รายละเอียดสินค้า..." value={Prod_detail} onChange={(event) => {
              setProd_detail(event.target.value);
            }} />
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
              value={Prod_link}
            />
          </FormGroup>
          <FormGroup>
            <Label for="prod_img">เลือกรูปสินค้า</Label>
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
            <img src={Prod_img} className="mr-2 img-fluid" />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            if (props.type_process == 'add') {
              insertProduct();
            } else {
              updateProduct()
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
