import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useRef } from 'react';
import {
    COffcanvas,
    COffcanvasHeader,
    COffcanvasTitle,
    COffcanvasBody,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormCheck,
    CTableDataCell,
    CToast,
    CToastHeader,
    CToastBody,
    CForm,
    CFormSelect,
    CFormLabel,
    CFormInput,
    CFormFeedback
} from '@coreui/react'
import SignatureCanvas from 'react-signature-canvas'
import base_url from 'src/base_url';

const Student = () => {
    const [Branches, setBranches] = useState([]);
    const [Semensters, setSemensters] = useState([]);
    const [Teacher, setTeacher] = useState([]);
    const [Password, setPassword] = useState("");
    const [Confirm, setConfirm] = useState("");
    const [Enrollment, setEnrollment] = useState("");
    const [current_student, setcurrent_student] = useState("");
    const [branch_slug, setbranch_slug] = useState("");
    const [btn_disabled_steps, setbtn_disabled_steps] = useState({"steps":{1:false,
        2:false,
        3:false,
        4:false,
        5:false,
    }    
    });
    const signatureRef = useRef();

    const [Steps, setSteps] = useState(1);

    const handelClear = () => {
        signatureRef.current.clear()
    }

    
    const handleEnrollment = (e) => {
        e.preventDefault()
        if (Enrollment == "") {
            alert("Please enter the enrollement")
        }
        else {
            const header = {
                "Content-Type": "application/json",
                'ngrok-skip-browser-warning': true
            }
            const body = {
                enrollment: Enrollment,
            }

            axios.post(`${base_url}/auth/api/set_student_creds_1`, body, { headers: header })
                .then((response) => {
                    setSteps(response.data.steps)
                    let steps = response.data.steps
                    console.log(steps);
                    let steps_obj = btn_disabled_steps.steps
                    for(let i = 1;i<steps-1;i++)
                    {
                           steps_obj[i] = true
                    }
                    console.log(steps_obj);
                    setbtn_disabled_steps(prevState => ({
                        ...prevState,
                        ["steps"]: steps_obj
                      }));
                    setBranches(response.data.branches)
                    setcurrent_student(response.data.student_slug)
                    
                      console.log(btn_disabled_steps);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        alert(error.response.data)
                    }
                    if (error.response.status === 500) {
                        alert(error.response.data)
                    }
                })
        }
    }
    const handleBraches = (branch_slug)=>{
        console.log(branch_slug);
        setbranch_slug(branch_slug)
        
    }

    const handle_cred_2 = (e) =>{
        e.preventDefault()
        const header = {
            "Content-Type": "application/json",
            'ngrok-skip-browser-warning': true
        }
        const body = {
            student_slug:current_student,
            branch_slug: branch_slug,
        }

        axios.post(`${base_url}/auth/api/set_student_creds_2`, body, { headers: header })
            .then((response) => {
                console.log(response.data);
                setSteps(response.data.steps)
                // setBranches(response.data.branches)
                // setSemensters(response.data.semesters)
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    alert(error.response.data)
                }
                if (error.response.status === 500) {
                    alert(error.response.data)
                }
            })
    }
    return (
        <>
            <CCard>
                <CCardHeader>
                    Student Details
                </CCardHeader>
                <CCardBody>
                    <CCardHeader>Step 1:</CCardHeader>
                    <CForm>
                        <CForm className="row g-3 needs-validation" noValidate>
                            {Steps >= 1 ? (
                                <>
                                    <CCol md={12}>
                                        <CFormLabel htmlFor="validationCustom02">Student Enrollment:</CFormLabel>
                                        <CFormInput type="number" id="validationCustom02" onChange={(e) => { console.log(e.target.value); setEnrollment(e.target.value) }} disabled={btn_disabled_steps.steps[1]} />
                                        <CFormFeedback valid>Looks good!</CFormFeedback>
                                    </CCol>
                                    <CCol xs={12}>
                                        <button disabled={btn_disabled_steps.steps[1]} className='btn btn-outline-dark form-control' onClick={(e) => { handleEnrollment(e) }}>
                                            Set
                                        </button>
                                    </CCol>
                                </>
                            ) : null}
                            <CCardHeader>Step 2:</CCardHeader>
                            {
                                Steps >= 2 ? (<>
                                <>
                                    <CCol md={12}>
                                        <CFormLabel htmlFor="validationCustom02">Select Branch</CFormLabel>
                                        <CFormSelect autoComplete='off' id='classroom_select' aria-label="Default select example" onChange={(e) => { handleBraches(e.target.value) }} disabled={btn_disabled_steps.steps[2]}>
                                            <option value="">Select Branch</option>
                                                {
                                                    Branches.length > 0 ? (
                                                       Branches.map((item,index)=>(
                                                        <option key={index} value={item.slug}>
                                                              {item.branch_name}
                                                        </option>
                                                       ))
                                                        
                                                    ):null
                                                }

                                        </CFormSelect>
                                    </CCol>
                                    <CCol xs={12}>
                                        <button disabled={btn_disabled_steps.steps[2]} className='btn btn-outline-dark form-control' onClick={(e) => { handle_cred_2(e) }}>
                                            Set
                                        </button>
                                    </CCol>
                                    </>
                                </>) : null
                            }

                            <CCardHeader>Step 3:</CCardHeader>
                            {
                                Steps >= 3 ? (
                                    <CCol md={12}>
                                        <CFormLabel htmlFor="validationCustom01">Select Semester</CFormLabel>
                                        <CFormSelect disabled="false" autoComplete='off' id='subject_select' aria-label="Default select example" >
                                            <option value="">Select Subject</option>

                                        </CFormSelect>
                                    </CCol>
                                ) : null
                            }

                            <CCardHeader>Step 4:</CCardHeader>
                            {
                                Steps > 4 ? (
                                    <CCol md={12}>
                                        <CFormLabel htmlFor="validationCustom02">Select Subject</CFormLabel>

                                        <CTable align="middle" className="mb-0 border" hover responsive>
                                            <CTableHead color="light">
                                                <CTableRow>
                                                    <CTableHeaderCell>Subject Name</CTableHeaderCell>
                                                    <CTableHeaderCell className='text-center'>Action</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>

                                            </CTableBody>
                                        </CTable>
                                    </CCol>
                                ) : null
                            }

                            <CCardHeader>Step 5:</CCardHeader>
                            {
                                Steps >= 5 ? (
                                    <>
                                        <CCol md={12}>
                                            <CFormLabel htmlFor="validationCustom02" style={{ display: "block" }}>Signature</CFormLabel>
                                            <SignatureCanvas ref={signatureRef} penColor='green' canvasProps={{ width: 300, height: 200, className: 'sigCanvas' }} className="text-center" style={{ border: "1px solid" }} />,
                                        </CCol>
                                        <CCol md={12}>
                                            <CFormLabel htmlFor="validationCustom02">Password</CFormLabel>
                                            <CFormInput type="password" id="validationCustom02" onChange={(e) => { setPassword(e.target.value) }} />
                                            <CFormFeedback valid>Looks good!</CFormFeedback>
                                        </CCol>
                                        <CCol md={12}>

                                            <CFormLabel htmlFor="validationCustom02">Confirm Password</CFormLabel>
                                            <CFormInput type="password" id="validationCustom02" onChange={(e) => { setConfirm(e.target.value) }} />
                                            <CFormFeedback valid>Looks good!</CFormFeedback>
                                        </CCol>
                                    </>
                                ) : null
                            }

                            <CCol xs={12}>
                                <button className='btn btn-outline-dark form-control'>
                                    Set
                                </button>
                            </CCol>

                        </CForm>
                    </CForm>
                </CCardBody>
            </CCard >
        </>
    );
}

export default Student;
