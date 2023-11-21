import React, { useEffect, useState, useContext} from 'react'
import { Store } from '../forms/validation/store'
import axios from 'axios'
import base_url from 'src/base_url'
import expireToken from 'src/global_function/unauthorizedToken'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'
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
    CToastBody
  } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
function ManageSubjects({visible,setVisible,SelectedTeacher}) {           
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { accessToken,refreshToken,currentBatch} = state                
    const [subjectsToRender,setSubjectsToRender] = useState([])    
    const navigate = useNavigate()
    const load_subjects_of_current_batch = async () =>{        
        const header = {
          "Content-Type":"application/json",        
          'ngrok-skip-browser-warning':true
        }
        const axiosInstance = axios.create()
        let endpoint = `/manage/get_subjects_of_current_batch`;let method='get';let headers = header;
        let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,null,{batch_slug:currentBatch.slug,teacher_id:SelectedTeacher.id})
        if(response_obj.error == false){
          let response = response_obj.response
          setSubjectsToRender(response.data.data)
        }else{  
            console.log(response_obj.error)
        }        
      }
      let checkedSubjects = subjectsToRender
      const subjectSelectionChanged = (value,obj) => {
        checkedSubjects.map((item) => {
            if(item == obj){
                item.selected = value                
            }            
        })
      }    

      const add_subject_to_teacher_api = async(body)=>{
        const header = {
          "Content-Type":"application/json",      
          'ngrok-skip-browser-warning':true
        }
        const axiosInstance = axios.create()
        let endpoint = `/manage/add_subjects_to_teacher`;let method='post';let headers = header;
        let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,body,null)
        if(response_obj.error == false){
          let response = response_obj.response
          console.log(response.data);
        }else{  
          console.log(response_obj.error)
        }
      }

      const add_subjects_to_teacher = async () =>{          
        setSubjectsToRender(checkedSubjects)
        // Now we can call the API
        let selectedSubjectSlugs = subjectsToRender.filter(item => item.selected === true).map(item => item.slug);        
        let requestBody = {
            teacher_id:SelectedTeacher.id,
            selected_subjects:selectedSubjectSlugs
        }
        await add_subject_to_teacher_api(requestBody)
      }      
      useEffect( () => {        
        if(visible){                                                   
            load_subjects_of_current_batch()            
        }
      },[visible])      
  return (
    <>
    <COffcanvas className='card w-100' style={{background:'#3c4b64'}} placement="end" visible={visible} onHide={() => setVisible(false)} data-coreui-backdrop="static">
    <COffcanvasHeader className='card-header text-light' style={{background:'#303c54'}}>
      <COffcanvasTitle>{SelectedTeacher.profile.name}</COffcanvasTitle>
      <button className='btn btn-outline-light' onClick={() => setVisible(false)} >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
        </svg>
      </button>      
    </COffcanvasHeader>
    <COffcanvasHeader className='card-header text-light' style={{background:'#303c54'}}>
      <COffcanvasTitle>Branch - {SelectedTeacher.branch.branch_name} | Batch - {currentBatch.batch_name}</COffcanvasTitle>      
    </COffcanvasHeader>
    <COffcanvasBody>    
    <CRow>
    <CCol xs style={subjectsToRender.length > 0 ? {} : { display: 'flex', justifyContent: 'center' }}>
  {subjectsToRender.length > 0 ? (
    <CCard className="mb-4">
      <CCardHeader className='text-center'>
        <strong>Subjects</strong>
      </CCardHeader>
      <CCardBody>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell className='text-center'>Code</CTableHeaderCell>
              <CTableHeaderCell className='text-center'>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {subjectsToRender.map((item, index) => (
              <CTableRow key={index}>
                <CTableDataCell>
                  <div>{item.subject_name}</div>
                </CTableDataCell>
                <CTableDataCell className='text-center'>
                  <div>{item.code}</div>
                </CTableDataCell>
                <CTableDataCell className='text-center'>
                  <div>
                    {item.selected ? (
                      <CFormCheck
                        id={`flexCheckChecked-${index}`}
                        defaultChecked
                        onChange={(e) => subjectSelectionChanged(e.target.checked, item)}
                      />
                    ) : (
                      <CFormCheck
                        id={`flexCheckDefault-${index}`}
                        onChange={(e) => subjectSelectionChanged(e.target.checked, item)}
                      />
                    )}
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <button className='btn btn-outline-dark form-control mt-4' type="submit" onClick={add_subjects_to_teacher}>
          Add Subjects
        </button>
      </CCardBody>
    </CCard>
  ) : (
    <CToast animation={false} autohide={false} visible={true}>
      <CToastHeader>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#007aff"></rect>
        </svg>
        <div className="fw-bold me-auto">SMARTROLL ADMINISTRATION</div>
      </CToastHeader>
      <CToastBody>There are no subjects available...Please add some!</CToastBody>
    </CToast>
  )}
</CCol>

      </CRow>
    </COffcanvasBody>
  </COffcanvas>
  </>
  )
}

export default ManageSubjects