import React, { useState  } from 'react'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { useContext } from 'react'
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
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Store } from '../validation/store'
import base_url from 'src/base_url'
import expireToken from 'src/global_function/unauthorizedToken'

const CustomStyles = (Batches,setBatches,setBatchCout) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken, refreshToken, batches } = state
  const [validated, setValidated] = useState(false)
  const currentYear = new Date().getFullYear() 
  const [Start, setStart] = useState(currentYear);
  const EndYear = (parseInt(Start, 10) + 1).toString();
  
  const addBatches = async(body) => {
    const headers = {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${accessToken}`,
      'ngrok-skip-browser-warning':true
    };
    axios.post(`${base_url}/manage/add_batch`,body,{headers})
    .then((response)=>{
      console.log(response.data.data);
      setBatches(prevArray => [...prevArray, response.data.data]);
      setBatchCout(preValue => preValue + 1);
    })
    .catch((error)=>{
      
      if(error.response.status === 401){
        expireToken(refreshToken,(error,result)=>{
          ctxDispatch({ type: 'ACCESS_TOKEN', payload: result.access });
          ctxDispatch({ type: 'REFRESH_TOKEN', payload: result.refresh });
        })
      }
      alert(error.response.data.data)
    })
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    const body = {
      batch_name: Start + "-" + EndYear
    }
    addBatches(body)
  }
  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom01">Start Year</CFormLabel>
        <CFormInput type="number" min={currentYear} max="2099" step="1" value={Start}  id="validationCustom01" onChange={e => setStart(e.target.value)} required maxLength={4} />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="validationCustom02">End Year</CFormLabel>
        <CFormInput type="number" value={EndYear}  readOnly step="1" id="validationCustom02"   required maxLength={4}/>
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <button className='btn btn-outline-dark form-control' type="submit" >
          Submit form
        </button>
      </CCol>
    </CForm>
  )
}

const Validation = (props) => {
  const {chageSteps} = props
  const {setSlug} = props
  const {setBatchCout} = props
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken, refreshToken, batches, currentBatch} = state
  const [Batches, setBatches] = useState(batches);


  useEffect(() => {
    setBatches(batches)
  }, [batches]);
  
  
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Batches</strong>
            </CCardHeader>
            <CCardBody>{CustomStyles(Batches,setBatches,setBatchCout)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Batches History</strong>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border text-center" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Batches</CTableHeaderCell>
                    <CTableHeaderCell>Activation Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {Batches.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        <div  onClick={() => {chageSteps('semester'); setSlug(item.slug);}}>{item.batch_name}</div>   
                      </CTableDataCell>
                      <CTableDataCell>
                        <div  onClick={() => {chageSteps('semester'); setSlug(item.slug);}}>
                          {item.active ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                          </svg>):<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                          </svg>}
                        </div>   
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

Validation.propTypes = {
  chageSteps: PropTypes.func.isRequired,
  setSlug: PropTypes.func.isRequired,
  setBatchCout:PropTypes.func.isRequired
}

export default Validation
