import React, { useEffect, useState, useContext } from 'react'
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
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
} from '@coreui/react'
import axios from 'axios';
import base_url from 'src/base_url';
import { Store } from '../forms/validation/store';
import { useNavigate } from 'react-router-dom';
import { APIMiddleware } from 'src/global_function/GlobalFunctions';
import { showAlert } from 'src/global_function/GlobalFunctions'
function SetLecture({ visible, setVisible, scheduleObj, lectureObj , currentSelectSemester , setupdate_timetable }) {
  

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken, refreshToken, batches, currentBatch , objectCount } = state
  const navigate = useNavigate()
  const [classroom, setclassroom] = useState([]);
  const [subjects, setsubjects] = useState([]);
  const [teacher, setteacher] = useState([]);
  const [classroom_slug, setclassroom_slug] = useState(null);
  const [subject_slug, setsubject_slug] = useState(null);
  const [teacher_slug, setteacher_slug] = useState(null);


  useEffect(() => {
    console.log(teacher_slug);
  }, [teacher_slug]);
  const load_object_for_lecture = async()=>{
    const header = {
      "Content-Type":"application/json",        
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/timetable/get_objects_for_lecture`;let method='get';let headers = header;
    let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,null,{semester_slug : currentSelectSemester})
    if(response_obj.error == false){
      let response = response_obj.response      
      setclassroom(response.data.classrooms)
      setsubjects(response.data.subjects)
    }else{  
      console.log(response_obj.error)
    }
  }
  const selectTeacher = (subjectslug) =>{
      subjects.map((item,index)=>{
        if(item.slug === subjectslug){
          console.log(item.teachers);
          setteacher(item.teachers)
        } 
      })
  }

  const handelsubmit = async (event) =>{
    event.preventDefault()
    if(classroom_slug !== ""  && subject_slug !== "" && teacher_slug !== ""){
        const header = {
          "Content-Type":"application/json",      
          'ngrok-skip-browser-warning':true
        }
        const axiosInstance = axios.create()
        let endpoint = `/manage/timetable/set_lecture_attributes`;let method='post';let headers = header;
        const body = {
          lecture_slug: lectureObj.slug,
          teacher_id:teacher_slug,
          subject_slug:subject_slug,
          classroom_slug: classroom_slug,
        }
        let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,body,null)
        if(response_obj.error == false){
          let response = response_obj.response
          setupdate_timetable(preval=> preval+1)
          setVisible(false)
        }else{  
          console.log(response_obj.error)
        }    
        showAlert("success","Lecture Added successfully...!")
      }
  }
  const setDefaultValue = ()=>{
     document.getElementById('teacher_select').options[0].selected=true
     document.getElementById('subject_select').options[0].selected=true
    document.getElementById('classroom_select').options[0].selected=true
  }

  useEffect( () => {
    if (visible) {
        setDefaultValue()
       load_object_for_lecture()
    }
  }, [visible])
  return (
    <>
      <COffcanvas className='card w-100' style={{ background: '#3c4b64' }} placement="end" visible={visible} onHide={() => setVisible(false)} data-coreui-backdrop="static">
        <COffcanvasHeader className='card-header text-light' style={{ background: '#303c54' }}>
          <COffcanvasTitle>Manage Lecture</COffcanvasTitle>
          <button className='btn btn-outline-light' onClick={() => setVisible(false)} >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
          </button>
        </COffcanvasHeader>
        <COffcanvasHeader className='card-header text-light' style={{ background: '#303c54' }}>
          <COffcanvasTitle>Day: {scheduleObj.day} | Slot: {lectureObj.start_date} - {lectureObj.end_time}</COffcanvasTitle>
        </COffcanvasHeader>
        <COffcanvasBody>
          <CRow>
            <CCol xs>
              <CCard>
                <CCardHeader>
                  Add Lecture
                </CCardHeader>
                <CCardBody>
                  <CForm
                    className="row g-3 needs-validation"
                    noValidate
                  >
                    <CCol md={12}>
                      <CFormLabel htmlFor="validationCustom02">Select Classroom</CFormLabel>
                      <CFormSelect autoComplete='off' id='classroom_select' aria-label="Default select example" onChange={e => setclassroom_slug(e.target.value)}>
                      <option value="">Select classroom</option>
                        {
                          classroom.length> 0 ? (classroom.map((item,index)=>(
                            <option key={index} value={item.slug}>
                              {item.class_name}
                            </option>
                          ))
                          ):null}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="validationCustom01">Select Subject</CFormLabel>
                      <CFormSelect autoComplete='off'id='subject_select' aria-label="Default select example"  onChange={(e)=>{selectTeacher(e.target.value); setsubject_slug(e.target.value)}}>
                      <option value="">Select Subject</option>
                      {
                          subjects.length > 0 ? (subjects.map((item,index)=>(
                            <option key={index} value={item.slug}>
                              {item.subject_name}
                            </option>
                          ))
                        ):null}
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="validationCustom02">Select Teacher</CFormLabel>
                      <CFormSelect autoComplete='off' id='teacher_select' aria-label="Default select example" onChange={e => setteacher_slug(e.target.value)}>
                      <option value="">Select Teacher</option>
                        {
                          teacher.length > 0 ? (teacher.map((item, index) => (
                            <option key={index} value={item.id}>
                               {item.profile.name}
                            </option>
                          ))
                          ) : null
                        }
                      </CFormSelect>
                    </CCol>
                    <CCol xs={12}>
                      <button className='btn btn-outline-dark form-control'  onClick={e => {handelsubmit(e)}}>
                          Set
                      </button>
                    </CCol>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </COffcanvasBody>
      </COffcanvas>
    </>
  )
}

export default SetLecture