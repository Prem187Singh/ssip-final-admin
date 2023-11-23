import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useRef } from 'react'
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
  CFormFeedback,
} from '@coreui/react'
import SignatureCanvas from 'react-signature-canvas'
import base_url from 'src/base_url'

const Student = () => {
  const [Branches, setBranches] = useState([])
  const [Semesters, setSemesters] = useState([])
  const [Subjects, setSubjects] = useState([])
  const [Password, setPassword] = useState('')
  const [Confirm, setConfirm] = useState('')
  const [Enrollment, setEnrollment] = useState('')
  const [current_student, setcurrent_student] = useState('')
  const [branch_slug, setbranch_slug] = useState('')
  const [semester_slug, setsemester_slug] = useState('')
  const [subject_slug, setsubject_slug] = useState([])
  const [signatureCanvas,SetSignatureCanvas] = useState(null)
  const [defaultBranchVal, setDefaultBranchVal] = useState('Select Branch')
  const [defaultSemesterVal, SetDefaultSemesterVal] = useState('Select Semester')  
  const [defaultSubjectVal, SetdefaultSubjectVal] = useState('Select Subject')  
  const [btn_disabled_steps, setbtn_disabled_steps] = useState({
    steps: { 1: false, 2: false, 3: false, 4: false, 5: false },
  })
  const signatureRef = useRef()

  const [Steps, setSteps] = useState(1)

  const handelClear = () => {
    signatureRef.current.clear()
  }
  const handleCanvasChange = () => {
        console.log(signatureRef.current.toDataURL())
  }

  const handleEnrollment = (e) => {
    e.preventDefault()
    if (Enrollment == '') {
      alert('Please enter the enrollement')
    } else {
      const header = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const body = {
        enrollment: Enrollment,
      }

      axios
        .post(`${base_url}/auth/api/set_student_creds_1`, body, { headers: header })
        .then((response) => {
          setSteps(response.data.steps)
          let steps = response.data.steps

          let steps_obj = btn_disabled_steps.steps
          for (let i = 1; i <= steps; i++) {
            steps_obj[i] = true
          }

          setbtn_disabled_steps((prevState) => ({
            ...prevState,
            ['steps']: steps_obj,
          }))

          console.log(btn_disabled_steps)
          if (steps == 2) {
            setBranches(response.data.branches)
            setSteps(steps)
          } else if (steps == 3) {            
            setSteps(steps)
            console.log(response.data.branch.branch_name)
            setDefaultBranchVal(response.data.branch.branch_name)
            setSemesters(response.data.semesters)
          }else if (steps == 4) {            
            setSteps(steps)            
            setDefaultBranchVal(response.data.branch.branch_name)
            SetDefaultSemesterVal(response.data.semester.no)
            setSubjects(response.data.subjects)
          }else if (steps == 5) {            
            setSteps(steps)            
            setDefaultBranchVal(response.data.branch.branch_name)
            SetDefaultSemesterVal(response.data.semester.no)
            setSubjects(response.data.subjects)
          }
          setcurrent_student(response.data.student_slug)
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
  const handleBraches = (branch_slug) => {
    console.log(branch_slug)
    setbranch_slug(branch_slug)
  }
  const handleSemesters = (semester_slug) => {
    console.log(semester_slug)
    setsemester_slug(semester_slug)
  }
  const handleSubjects = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value).filter(item => item !== '');
    if(selectedOptions.length > 0){
        setsubject_slug(selectedOptions)
    }else{
        setsubject_slug([])
    }

  }
  const handle_cred_2 = (e) => {
    e.preventDefault()
    const header = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const body = {
      student_slug: current_student,
      branch_slug: branch_slug,
    }

    axios
      .post(`${base_url}/auth/api/set_student_creds_2`, body, { headers: header })
      .then((response) => {
        console.log(response.data)
        setSteps(response.data.steps)
        let steps = response.data.steps
        let steps_obj = btn_disabled_steps.steps
          for (let i = 1; i <= steps; i++) {
            steps_obj[i] = true
          }

          setbtn_disabled_steps((prevState) => ({
            ...prevState,
            ['steps']: steps_obj,
          }))
        
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
  const handle_cred_3 = (e) => {
    e.preventDefault()
    const header = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    const body = {
      student_slug: current_student,
      semester_slug: semester_slug,
    }

    axios
      .post(`${base_url}/auth/api/set_student_creds_3`, body, { headers: header })
      .then((response) => {
        console.log(response.data)
        setSubjects(response.data.subjects)
        setSteps(response.data.steps)
        let steps = response.data.steps
        let steps_obj = btn_disabled_steps.steps
          for (let i = 1; i <= steps; i++) {
            steps_obj[i] = true
          }

          setbtn_disabled_steps((prevState) => ({
            ...prevState,
            ['steps']: steps_obj,
          }))
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
  const handle_cred_4 = (e) => {
    e.preventDefault()
    if(subject_slug.length <= 0){
        return
    }
    const header = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true,
    }
    console.log(current_student)
    const body = {
      student_slug: current_student,
      subject_arr: subject_slug,
    }

    axios
      .post(`${base_url}/auth/api/set_student_creds_4`, body, { headers: header })
      .then((response) => {             
        setSteps(response.data.steps)
        let steps = response.data.steps
        let steps_obj = btn_disabled_steps.steps
          for (let i = 1; i <= steps; i++) {
            steps_obj[i] = true
          }

          setbtn_disabled_steps((prevState) => ({
            ...prevState,
            ['steps']: steps_obj,
          }))
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
        <CCardHeader>Student Details</CCardHeader>
        <CCardBody>
          <CCardHeader>Step 1:</CCardHeader>
          <CForm>
            <CForm className="row g-3 needs-validation" noValidate>
              {Steps >= 1 ? (
                <>
                  <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom02">Student Enrollment:</CFormLabel>
                    <CFormInput
                      type="number"
                      id="validationCustom02"
                      onChange={(e) => {
                        console.log(e.target.value)
                        setEnrollment(e.target.value)
                      }}
                      disabled={btn_disabled_steps.steps[1]}
                    />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                  </CCol>
                  <CCol xs={12}>
                    <button                      
                      className={`btn btn-outline-dark form-control ${btn_disabled_steps.steps[1] || Steps[1] ? 'd-none': ''}`}
                      onClick={(e) => {
                        handleEnrollment(e)
                      }}
                    >
                      Set
                    </button>
                  </CCol>
                </>
              ) : null}
              <CCardHeader>Step 2:</CCardHeader>
              {Steps >= 2 ? (
                <>
                  <>
                    <CCol md={12}>
                      <CFormLabel htmlFor="validationCustom02">Select Branch</CFormLabel>
                      <CFormSelect
                        autoComplete="off"
                        id="classroom_select"                        
                        onChange={(e) => {
                          handleBraches(e.target.value)
                        }}
                        disabled={btn_disabled_steps.steps[3]}
                      >
                        <option value="">{defaultBranchVal}</option>
                        {Branches.length > 0
                          ? Branches.map((item, index) => (
                              <option key={index} value={item.slug}>
                                {item.branch_name}
                              </option>
                            ))
                          : null}
                      </CFormSelect>
                    </CCol>
                    <CCol xs={12}>
                      <button                        
                        className={`btn btn-outline-dark form-control ${btn_disabled_steps.steps[3] || Steps[3] ? 'd-none': ''}`}
                        onClick={(e) => {
                          handle_cred_2(e)
                        }}
                      >
                        Set
                      </button>
                    </CCol>
                  </>
                </>
              ) : null}

              <CCardHeader>Step 3:</CCardHeader>
              {Steps >= 3 ? (
                <>
                 <CCol md={12}>
                  <CFormLabel htmlFor="validationCustom01">Select Semester</CFormLabel>
                  <CFormSelect
                    autoComplete="off"
                    id="subject_select"
                    aria-label="Default select example"
                    onChange={(e) => {
                        handleSemesters(e.target.value)
                    }}
                    disabled={btn_disabled_steps.steps[4]}
                  >
                    <option value="">{defaultSemesterVal}</option>
                    {Semesters.length > 0
                          ? Semesters.map((item, index) => (
                              <option key={index} value={item.slug}>
                                Semester - {item.no}
                              </option>
                            ))
                    : null}
                  </CFormSelect>
                </CCol>
                <CCol xs={12}>
                      <button
                        className={`btn btn-outline-dark form-control ${btn_disabled_steps.steps[4] || Steps[4] ? 'd-none': ''}`}
                        onClick={(e) => {
                          handle_cred_3(e)
                        }}
                      >
                        Set
                      </button>
                    </CCol>
                </>
              ) : null}

              <CCardHeader>Step 4:</CCardHeader>
              {Steps >= 4 ? (
                 <>
                 <CCol md={12}>
                  <CFormLabel htmlFor="validationCustom01">Select Subject</CFormLabel>
                  <CFormSelect
                    multiple
                    autoComplete="off"
                    id="subject_select"
                    aria-label="Default select example"
                    onChange={handleSubjects}
                    disabled={btn_disabled_steps.steps[5]}
                  >                    
                    {Subjects.length > 0
                          ? Subjects.map((item, index) => (
                              <option key={index} value={item.slug} {...item ? 'selected' : ''}>
                                {item.subject_name}
                              </option>
                            ))
                    : null}
                  </CFormSelect>
                </CCol>
                <CCol xs={12}>
                      <button                        
                        className={`btn btn-outline-dark form-control ${btn_disabled_steps.steps[5] || Steps[5] ? 'd-none': ''}`}
                        onClick={(e) => {
                          handle_cred_4(e)
                        }}
                      >
                        Set
                      </button>
                    </CCol>
                </>
              ) : null}

              <CCardHeader>Step 5:</CCardHeader>
              {Steps >= 5 ? (
                <>
                  <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom02" style={{ display: 'block' }}>
                      Signature
                    </CFormLabel>
                    <button onClick={handelClear} className='btn btn-outline-secondary form-control mb-2'>Clear</button>
                    <SignatureCanvas
                      ref={signatureRef}
                      penColor="black"
                      canvasProps={{ className: 'sigCanvas w-100 border border-2 border-success' }}
                      className="text-center"
                      style={{ border: '1px solid red' }}
                      onEnd={handleCanvasChange}
                    />
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom02">Password</CFormLabel>
                    <CFormInput
                      type="password"
                      id="validationCustom02"
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                    />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                  </CCol>
                  <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom02">Confirm Password</CFormLabel>
                    <CFormInput
                      type="password"
                      id="validationCustom02"
                      onChange={(e) => {
                        setConfirm(e.target.value)
                      }}
                    />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                  </CCol>
                  <CCol xs={12}>
                <button className="btn btn-outline-dark form-control">Set</button>
              </CCol>
                </>
              ) : null}
            </CForm>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Student
