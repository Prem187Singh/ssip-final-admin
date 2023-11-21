import React from 'react';
import { useState , useContext , useEffect } from 'react';
import 'src/scss/panel.css'
import { Store } from '../forms/validation/store'
import axios from 'axios'
import base_url from 'src/base_url'
import { useSelector, useDispatch } from 'react-redux'
import expireToken from 'src/global_function/unauthorizedToken'
import ManageSubjects from './ManageSubjects';
import { useNavigate } from 'react-router-dom';
import { APIMiddleware } from 'src/global_function/GlobalFunctions';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CRow,
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CTableDataCell,
    COffcanvas,
    COffcanvasHeader,
    COffcanvasTitle,
    CCloseButton,
    COffcanvasBody,
    CFormCheck,
    
  } from '@coreui/react'




const CustomStyles = (setTeacherlist) => {
    const [validated, setValidated] = useState(false)
    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { accessToken,refreshToken , currentBatch} = state

    const [Teacher_name, setTeacher_name] = useState("");
    const [Teacher_email, setTeacher_email] = useState("");
    const [Teacher_ph, setTeacher_ph] = useState("");
    const [Teacher_password, setTeacher_password] = useState("");
    console.log(currentBatch);
    const add_Teacher = async(body)=>{
      const header = {
        "Content-Type":"application/json",      
        'ngrok-skip-browser-warning':true
      }
      const axiosInstance = axios.create()
      let endpoint = `/manage/add_teacher`;let method='post';let headers = header;
      let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,body,null)
      if(response_obj.error == false){
        let response = response_obj.response
        setTeacherlist(prevArray => [...prevArray, response.data.teacher])
      }else{  
        console.log(response_obj.error)
      }    
    }

    const handleSubmit = (event) => {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      }
      event.preventDefault()
      setValidated(true)
      const body = {
        name:Teacher_name,
        email:Teacher_email,
        ph_no:Teacher_ph,
        password:Teacher_password
      }
      add_Teacher(body)
    }
    return (
      <CForm
        className="row g-3 needs-validation"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        <CCol md={6}>
          <CFormLabel htmlFor="validationCustom01">Teacher Name</CFormLabel>
          <CFormInput type="text" id="validationCustom01"  required onChange={e => setTeacher_name(e.target.value)} />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="validationCustom01">Teacher Moblie No</CFormLabel>
          <CFormInput type="tel" id="validationCustom02" pattern="[0-9]{10}"  required onChange={e => setTeacher_ph(e.target.value)}/>
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="validationCustom01">Teacher E-mail</CFormLabel>
          <CFormInput type="email" id="validationCustom02"  required  onChange={e => setTeacher_email(e.target.value)}/>
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>
        <CCol md={6}>
          <CFormLabel htmlFor="validationCustom02">Teacher Password</CFormLabel>
          <CFormInput type="password" id="validationCustom02"  required onChange={e => setTeacher_password(e.target.value)}/>
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>
        <CCol xs={12}>
          <button className='btn btn-outline-dark form-control' type="submit">
            Submit form
          </button>
        </CCol>
      </CForm>
    )
  }

const Teacher = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false)
  const [SelectedTeacher,setSelectedTeacher] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
    
  const [Teacherlist, setTeacherlist] = useState([]);
  
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken} = state
  const load_teacher = async () =>{
    const header = {
      "Content-Type":"application/json",        
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_teachers`;let method='get';let headers = header;
    let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers)
    if(response_obj.error == false){
      let response = response_obj.response
      setTeacherlist(response.data.teachers)
    }else{  
      console.log(response_obj.error)
    }
  }
  
  
  useEffect(()=>{
      load_teacher()
  },[])

  const checkboxOptions = [
    'Option 1',
    'Option 2',
    'Option 3'
  ];
  
  return (
    <>
    
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Teachers</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles(setTeacherlist)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Teacher History</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>E-mail</CTableHeaderCell>
                    <CTableHeaderCell>Mobile No</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Teacherlist.map((item, index) => (
                    <CTableRow v-for="item in tableItems" onClick={() => {setSelectedTeacher(item); setVisible(true)}} key={index}>
                      <CTableDataCell>
                        <div>{item.profile.name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.profile.email}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.profile.ph_no}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      
      {SelectedTeacher?(<ManageSubjects visible={visible} setVisible={setVisible} SelectedTeacher={SelectedTeacher}/>):null}
        
    </>
  );
}

export default Teacher;
