import React from 'react'
import { useState , useContext,useEffect } from 'react'
import PropTypes from 'prop-types'
import { Store } from '../validation/store'
import axios from 'axios'
import base_url from 'src/base_url'
import expireToken from 'src/global_function/unauthorizedToken'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'
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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
const CustomStyles = (semSlug,setsubjects) => {
  const [validated, setValidated] = useState(false)
  const [SName, setSName] = useState("");
  const [Scode, setScode] = useState("");
  const [Scredit, setScredit] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken, objectCount } = state
  const navigate = useNavigate()
  const add_subject = async (body) => {
    const header = {
      "Content-Type":"application/json",      
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/add_subjects`;let method='post';let headers = header;
    let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,body,null)
    if(response_obj.error == false){
        let response = response_obj.response
        let changeSubjectCount = {...objectCount}
        changeSubjectCount.subjects += 1
        console.log(changeSubjectCount);
        ctxDispatch({ type: 'GET_OBJECTS', payload: changeSubjectCount })
        setsubjects(prevArray => [...prevArray, response.data.subject])
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
    console.log(SName)
    console.log(Scode)
    console.log(Scredit);
    setValidated(true)
    const body = {
      semester_slug:semSlug,
      subject_name:SName,
      subject_code:Scode,
      subject_credit:Scredit
    }
    event.preventDefault()
    add_subject(body)
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Subject Name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" onChange={e => setSName(e.target.value)} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom01">Subject Code</CFormLabel>
        <CFormInput type="text" id="validationCustom02" onChange={e => setScode(e.target.value)} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom02">Subject Credit</CFormLabel>
        <CFormInput type="text" id="validationCustom02" onChange={e => setScredit(e.target.value)} required />
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

const Select = (props) => {

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken,refreshToken, semesters } = state
  const navigate = useNavigate()
  const {semSlug , chageSteps} = props
  console.log(semSlug);
  const [subjects, setsubjects] = useState([]);
  
  const load_subjects = async () => {
    const header = {
      "Content-Type":"application/json",        
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_subjects`;let method='get';let headers = header;
    let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,null,{ semester_slug: semSlug })
    if(response_obj.error == false){
      let response = response_obj.response
      setsubjects(response.data.data)
    }else{  
      console.log(response_obj.error)
    }
  }

  useEffect(() => {
      load_subjects()
  }, []);
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Subjects</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles(semSlug,setsubjects)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Subjects History</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Subject Name</CTableHeaderCell>
                    <CTableHeaderCell>Subject Code</CTableHeaderCell>
                    <CTableHeaderCell>Subject Credit</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {subjects.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div>{item.subject_name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.code}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.credit}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
Select.prototype = {
  chageSteps:PropTypes.func.isRequired,
  semSlug: PropTypes.string
}
export default Select
