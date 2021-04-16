import { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label, Container } from "reactstrap";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "axios";
import Swal from "sweetalert2";
import Product_list from "./Product_list";
import Modal_Avaliable_Preorderlot from "./Modal_Avaliable_Preorderlot"



export default function Modal_saleorder(props) {
  const [Selected_prod_list, setSelected_prod_list] = useState([]);
  const [form_input, setForm_input] = useState({
    saleorder_id: "",
    saleorder_date: new Date(),
    saleorder_remark: "",
    customer_account: "",
    customer_name: "",
    customer_tel: "",
    customer_address: "",
    delivery_price: 0.0,
    discount_price: 0.0,
    order_total: 0.0,
    selected_prod: [],
  })

  const [SkuList_modal, setSkuList_modal] = useState(false);
  const addItem = (prod_detail) => {
    const exits = Selected_prod_list.find((x) => x.f_preorderlot_id === prod_detail.f_preorderlot_id && x.f_sku_id === prod_detail.f_sku_id);
    if (exits) {
      // setSelected_prod_list(Selected_prod_list.map((x) =>
      //   x.f_preorderlot_id === prod_detail.f_preorderlot_id && x.f_sku_id === prod_detail.f_sku_id
      //     ? { ...exits, sku_qty: exits.sku_qty + 1 }
      //     : x))
      alerts_add_prod_exits(prod_detail.f_prod_name + "-" + prod_detail.f_sku_name);
    } else {
      setSelected_prod_list([...Selected_prod_list, { ...prod_detail, sku_qty: 1 }])

      alerts_add_prod_success(prod_detail.f_prod_name + "-" + prod_detail.f_sku_name);

    }
  }

  const change_qty = (f_preorderlot_id, f_sku_id, value, key_name) => {
    let change_value = parseFloat(value);
    const newValue = Selected_prod_list.map(val => {
      // Does not match, so return the counter without changing.
      if (val.f_preorderlot_id == f_preorderlot_id && val.f_sku_id == f_sku_id) return { ...val, [key_name]: change_value };
      // Else (means match) return a new counter but change only the value
      return val;
    })
    setSelected_prod_list(newValue)


  }

  const cal_bill_total = () => {
    const get_product_total = Selected_prod_list.reduce((result, val) =>
      result + (val.sku_qty * val.f_sale_price), 0);
    setForm_input({ ...form_input, order_total: (get_product_total + parseFloat(form_input.delivery_price)) - parseFloat(form_input.discount_price) })
    // console.log(get_product_total+form_input.delivery_price-form_input.discount_price);
  }

  //  .then(result => {setForm_input({...form_input,order_total:result})})



  const v_toggle = (event) => {
    props.toggle(!props.modal);
  };

  const toggleSkuList_modal = async () => {
    setSkuList_modal(!SkuList_modal);
  };

  const updateFormState = (e) => {
    setForm_input({ ...form_input, [e.target.name]: e.target.value }
    )
  }

  const alerts_add_prod_success = (sku_name) =>
    cornerSwal.fire({
      title: "เพิ่มแล้ว!",
      text: sku_name + " ถูกเพิ่มลงรายการสั่งซื้อแล้ว",
      icon: "success",
    });

  const alerts_add_prod_exits = (sku_name) =>
    cornerSwal.fire({
      title: "ซ้ำจ้า!",
      text: sku_name + " มีในรายการสั่งซื้อแล้ว",
      icon: "warning",
    });

  const cornerSwal = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const alerts_success = () =>
    Swal.fire({
      title: "สำเร็จ!",
      text: "สร้างคำสั่งซื้อสำเร็จ",
      icon: "success",
      confirmButtonText: "ดำเนินการต่อ",
      allowOutsideClick: false,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        v_toggle();
        // props.reloaddata();
      }
    });

  const alerts_warning = () =>
    Swal.fire({
      title: "อย่าลืมเลือกสินค้า!",
      text: "กรุณาเลือกสินค้าเพื่อทำการสั่งซื้อ",
      icon: "warning",
      confirmButtonText: "ตกลง",
    });

  const alerts_warning_error = () =>
    Swal.fire({
      title: "สร้างรายการสั่งซื้อไม่สำเร็จ",
      text: "ไม่สามารถเพิ่มรายการสั่งซื้อได้โปรดลองอีกครั้ง",
      icon: "error",
      confirmButtonText: "ปิด",
    });

  const check_form = () => {
    if (form_input.saleorder_id === "") {
      return false;
    }

    if (form_input.customer_account == "") {
      return false;
    }

    if (form_input.customer_account == "") {
      return false;
    }

    if (form_input.customer_name == "") {
      return false;
    }

    if (form_input.customer_tel == "") {
      return false;
    }

    if (form_input.customer_address == "") {
      return false;
    }
    if (form_input.selected_prod.length === 0) {
      console.log(form_input.selected_prod)
      return false;
    }

    return true;
  }

  const createSaleorder = () => {
    setForm_input({ ...form_input, selected_prod: Selected_prod_list });
    if (check_form()) {
      Axios.post("http://localhost:3001/saleorder/create", form_input)
        .then((response) => {
          if (response.status == 200) {
            alerts_success();
          };
        })
        .catch((error) => {
          alerts_warning_error();
        })
    } else {
      alerts_warning();
    }
  }

  const get_newsaleorderID = () => {
    Axios.get("http://localhost:3001/saleorder/getnew_saleorderID").then(
      (response) => {
        setForm_input({ ...form_input, ["saleorder_id"]: response.data });
      }
    );
  };

  useEffect(() => {
    cal_bill_total();
  }, [form_input.delivery_price, form_input.discount_price]);

  useEffect(() => {
    cal_bill_total();
  }, [Selected_prod_list]);

  useEffect(() => {
    if (props.modal == true) {
      // onLoadForm(props.preorder_id)
    } else {
      // if (props.preorder_id != "") {
      get_newsaleorderID();
      setSelected_prod_list([]);
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
      <ModalHeader toggle={v_toggle}>เพิ่มรายการสั่งซื้อ</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="saleorder_id">รหัสใบสั่งซื้อ</Label>
            <Input
              type="text"
              name="saleorder_id"
              id="saleorder_id"
              placeholder="รหัสใบสั่งซื้อ..."
              value={form_input.saleorder_id}
              onChange={updateFormState}
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <Label for="saleorder_date">วันที่สั่งซื้อ: </Label>
            <Datepicker
              selected={form_input.saleorder_date}
              name="saleorder_date"
              onChange={updateFormState}
              readOnly
              className={"form-control"}
            ></Datepicker>
          </FormGroup>
          <hr />
          <FormGroup>
            <Label for="customer_account">ชื่อแอคเคาท์</Label>
            <Input
              type="text"
              name="customer_account"
              id="customer_account"
              placeholder="ชื่อแอคเคาท์..."
              onChange={updateFormState}
              value={form_input.customer_account}
            />
          </FormGroup>
          <FormGroup>
            <Label for="customer_name">ชื่อผู้รับ</Label>
            <Input
              type="text"
              name="customer_name"
              id="customer_name"
              placeholder="ชื่อผู้รับ..."
              onChange={updateFormState}
              value={form_input.customer_name}
            />
          </FormGroup>
          <FormGroup>
            <Label for="customer_tel">เบอร์ติดต่อ</Label>
            <Input
              type="text"
              name="customer_tel"
              id="customer_tel"
              placeholder="เบอร์ติดต่อ..."
              onChange={updateFormState}
              value={form_input.customer_tel}
            />
          </FormGroup>
          <FormGroup>
            <Label for="customer_address">ทึ่อยู่จัดส่ง</Label>
            <textarea className="form-control" rows="3" name="customer_address" id="customer_address" placeholder="ที่อยู่จัดส่ง..."
              onChange={updateFormState} />
          </FormGroup>
          <hr />
          <FormGroup className="text-center">
            <Button className="btn btn-info" onClick={toggleSkuList_modal}>
              เลือกสินค้า
            </Button>
            <Modal_Avaliable_Preorderlot modal={SkuList_modal} size={"lg"} toggle={toggleSkuList_modal} addItem={addItem}>
            </Modal_Avaliable_Preorderlot>
          </FormGroup>
          {Selected_prod_list.length == 0 ? <h6 className="text-center">...กรุณาเลือกรายการสินค้า...</h6> :
            <Container>
              <Label for="saleorder_date">รายการสินค้า: </Label>
              <div className="card">
                <div className="card-body table-responsive p-0">
                  <table className="table table-striped table-valign-middle">
                    <thead>
                      <tr>
                        <th className="text-center">รูปสินค้า</th>
                        <th className="text-center">รายละเอียด</th>
                        <th className="text-center">ราคาต่อหน่วย</th>
                        <th className="text-center">จำนวน</th>
                        <th className="text-center">ราคารวม</th>
                        <th className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Selected_prod_list.map((val, key) => {
                        return (
                          <tr>
                            <td className="text-center">
                              <img
                                src={val.f_sku_img}
                                className="img-size-ingrid mr-2"
                              />
                            </td>
                            <td>
                              <a href={`/preorder_detail/`} target="_blank">
                                [{val.f_preorderlot_id}]
                              </a>
                              <br />
                              <a href={`/product_detail/`} target="_blank">
                                {val.f_sku_id}
                              </a>
                              <br />
                              {val.f_sku_name}
                            </td>

                            {/* <td className="text-center">
                              <a href={val.f_prod_link} target="_blank">
                                ไปยังร้านค้า
                              </a>
                            
                            </td> */}

                            <td className="text-center">
                              <Input
                                type="number"
                                name="f_sale_price"
                                id="f_sale_price"
                                placeholder="ราคาต่อหน่วย..."
                                style={{ width: "150px" }}
                                value={val.f_sale_price}
                                min="1"
                                onChange={(e) => change_qty(val.f_preorderlot_id, val.f_sku_id, e.target.value, e.target.name)}
                              />
                            </td>
                            <td className="text-center">
                              <Input
                                type="number"
                                name="sku_qty"
                                id="sku_qty"
                                placeholder="จำนวน..."
                                style={{ width: "150px" }}
                                value={val.sku_qty}
                                min="1"
                                onChange={(e) => change_qty(val.f_preorderlot_id, val.f_sku_id, e.target.value, e.target.name)}
                              />
                            </td>
                            <td>{(val.f_sale_price * val.sku_qty).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="text-center">
                              <Button className="btn btn-info" onClick={() => alert("asda")}>
                                <i className="fas fa-trash-alt" />ลบ
                            </Button>
                              <br />
                            </td>
                          </tr>
                        );
                      })}

                      {/* );
                      })} */}
                    </tbody>
                  </table>
                </div>
              </div>
            </Container>}
          <hr />
          <FormGroup>
            <Label for="saleorder_date">ค่าจัดส่ง: </Label>
            <Input
              type="number"
              name="delivery_price"
              id="delivery_price"
              placeholder="ค่าจัดส่ง..."
              value={form_input.delivery_price}
              onChange={updateFormState}
            />
          </FormGroup>
          <FormGroup>
            <Label for="saleorder_date">ส่วนลด: </Label>
            <Input
              type="number"
              name="discount_price"
              id="discount_price"
              placeholder="ส่วนลด..."
              value={form_input.discount_price}
              onChange={updateFormState}
            />
          </FormGroup>
          <Container>
            <h3 className="text-right">รวมสุทธิ: {(form_input.order_total).toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท</h3>
          </Container>
          <hr />
          <FormGroup>
            <Label for="saleorder_remark">หมายเหตุ</Label>
            <textarea className="form-control" rows="3" name="saleorder_remark" id="saleorder_remark" placeholder="หมายเหตุ..."
              onChange={updateFormState} />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() =>
            // cal_bill_total
            createSaleorder()
          }
        >
          สร้างรายการสั่งซื้อ
        </Button>{" "}
        <Button color="secondary" onClick={() => v_toggle()}>
          ยกเลิก
        </Button>
      </ModalFooter>
    </Modal>
  );
}
