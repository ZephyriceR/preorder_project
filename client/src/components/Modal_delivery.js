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


export default function Modal_delivery(props) {
    const [tracking_number,set_tracking_number]=useState("");
    const alerts_add_success = () =>
        Swal.fire({
            title: "สำเร็จ!",
            text: "อัปเดตเป็นจัดส่งแล้ว",
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
            text: "เลขที่ขนส่งอาจซ้ำ กรุณาตรวจสอบ",
            icon: "warning",
            confirmButtonText: "ตกลง",
        });

    const v_toggle = (event) => {
        props.toggle(!props.modal)
    }

    const update_delivery = () => {
        Axios.post(`http://localhost:3001/saleorder/update_delivery`, {f_saleorder_id:props.saleorder_id,f_tracking_number:tracking_number})
            .then((response) => {
                if (response.status == 200) {
                    alerts_add_success();
                } else {
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
            <ModalHeader toggle={v_toggle}>ยืนยันการจัดส่ง</ModalHeader>
            <ModalBody>
                <Form>
                    <FormGroup>
                        <Label for="transaction_img">เลขที่การจัดส่ง</Label>
                        <Input
                            type="text"
                            name="tracking_number"
                            id="tracking_number"
                            placeholder="เลขที่จัดส่ง..."
                            onChange={(event) => {
                                set_tracking_number(event.target.value);
                            }}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    onClick={() => {
                        update_delivery();
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
