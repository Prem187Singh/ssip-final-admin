import React from 'react'

import { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CRow,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
  CTableHead,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CHeader,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from '@coreui/react'
import axios from 'axios'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import FormControl from '../forms/form-control/FormControl'
import Select from '../forms/input-group/InputGroup'
import Validation from '../forms/validation/Validation'
import { useContext, useEffect } from 'react'
import { Store } from 'src/views/forms/validation/store'
import base_url from 'src/base_url'
import Breadcrumbnav from '../breadcrum/Breadcrumbnav'
import expireToken from 'src/global_function/unauthorizedToken'
 import {SetLecture} from '../timetable/SetLecture'
import { useNavigate } from 'react-router-dom'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'

export default function Teacherview() {
  return (
   <>

<CRow className="mb-3">
        <CCol>
          <CCard>
            <CCardHeader>Semester</CCardHeader>
            <CCardBody>
              <CFormSelect aria-label="Default select example">
                {/* <option value="">Select Semester</option>
                {Semesters.map((item, index) => (
                  <option key={index} value={item.slug}>
                    Semester - {item.no}
                  </option>
                ))} */}
              </CFormSelect>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
<CTable>
  <CTableHead>
  <CAccordion activeItemKey={2}>
  <CAccordionItem itemKey={1}>
    <CAccordionHeader>Accordion Item #1</CAccordionHeader>
    <CAccordionBody>
      <strong>hello</strong>
    </CAccordionBody>
  </CAccordionItem>
</CAccordion>
  </CTableHead>
</CTable>
   </>
  )
}
