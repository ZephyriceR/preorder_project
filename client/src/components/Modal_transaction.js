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


export default function Modal_transaction(props) {
    const [Prod_img, setProd_img] = useState("");
    const alerts_add_success = () =>
        Swal.fire({
            title: "สำเร็จ!",
            text: "อัปโหลดหลักฐานการชำระเงินเรียบร้อยแล้ว",
            icon: "success",
            confirmButtonText: "ดำเนินการต่อ",
            allowOutsideClick: false,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                props.reload_head();
                v_toggle();
            }
        });

    const alerts_add_fail = () =>
        Swal.fire({
            title: "ไม่สำเร็จ!",
            text: "รหัสสินค้าอาจซ้ำ กรุณาตรวจสอบ",
            icon: "warning",
            confirmButtonText: "ตกลง",
        });

    const v_toggle = (event) => {
        props.toggle(!props.modal)
    }

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const url = URL.createObjectURL(event.target.files[0]);
            setProd_img(url);
        }
    };

    const upload_transaction = () => {
        const img_file = document.querySelector('#file')
        const file = img_file.files[0]
        let formData = new FormData();
        formData.append('transaction_img',file);
        formData.append('f_saleorder_id',props.saleorder_id);
        Axios.post(`http://localhost:3001/saleorder/update_transaction`,formData,{headers: {"Content-Type": "multipart/form-data"}})
        .then((response) => {
              if (response.status==200){
                alerts_add_success();
              }else{
                alerts_add_fail();
              }
          }
        );
      }

    // function onLoadForm(prod_id) {
    //     if (prod_id === "") {
    //         setProd_id("")
    //         setProd_detail("")
    //         setProd_link("")
    //         setProd_img("")
    //         setProd_name("")
    //     } else {
    //         Axios.get(`http://localhost:3001/product_detail/${prod_id}`).then((response) => {
    //             setProd_img(response.data[0].f_transaction_img);
    //         });
    //     }
    // }
    useEffect(() => {
        if (props.modal == true) {
        } else {
        }
    }, [props.modal]);
    return (
        <Modal isOpen={props.modal} toggle={v_toggle} className={props.className}>
            <ModalHeader toggle={v_toggle}>ส่งหลักฐานการชำระเงิน</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="transaction_img">หลักฐานการชำระเงิน</Label>
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
                        upload_transaction();
                    }}
                >
                    ยืนยัน
        </Button>{" "}
                <Button color="secondary" onClick={v_toggle}>
                    ยกเลิก
        </Button>
            </ModalFooter>
        </Modal>
    );
}
