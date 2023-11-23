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
  CToaster
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
import SetLecture from './SetLecture'
import { useNavigate } from 'react-router-dom'
import { APIMiddleware } from 'src/global_function/GlobalFunctions'
const Timetable = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const [visible, setVisible] = useState(false)
  const { accessToken, refreshToken, currentBatch } = state
  const [Semesters, setSemesters] = useState([])
  const [currentSelectSemester, setcurrentSelectSemester] = useState(null)
  const [timeTable, settimeTable] = useState([])
  const [lectureObj,setLectureObj] = useState(null)
  const [scheduleObj,setscheduleObj] = useState(null)
  const [update_timetabel,setupdate_timetable] = useState(0)

  const [visibleLectureToast,setVisibleLectureToast] = useState(false)


  const naivgate = useNavigate()
  useEffect(() => {
    if (currentBatch.slug) {
      load_semester(currentBatch.slug)
    }
  }, [currentBatch])
  const load_semester = async (batchslug) => {
    const header = {
      "Content-Type":"application/json",
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/get_semesters`;let method='get';let headers = header;
    let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,null,{batch_slug: batchslug })
    if(response_obj.error == false){
      let response = response_obj.response
      setSemesters(response.data.data)
    }else{
      console.log(response_obj.error)
    }
  }
  const load_time_tale = async () => {
    const header = {
      "Content-Type":"application/json",
      'ngrok-skip-browser-warning':true
    }
    const axiosInstance = axios.create()
    let endpoint = `/manage/timetable/get_timetable`;let method='get';let headers = header;
    let response_obj = await APIMiddleware(axiosInstance,endpoint,method,headers,null,{ semester_slug: currentSelectSemester })
    if(response_obj.error == false){
      let response = response_obj.response
      console.log(response)
      settimeTable(response.data.timetable)
      const setVisibleTost = {}
        response.data.timetable.schedules.map((item,index)=>{
            item.lectures.map((lecture,index)=>{
              setVisibleTost[lecture.slug] = false
            })
        })
        console.log(setVisibleTost);
        setVisibleLectureToast(setVisibleTost)
    }else{
      console.log(response_obj.error)
    }
  }
  useEffect(() => {
    if (currentSelectSemester) {
      load_time_tale()
    }
  }, [currentSelectSemester,update_timetabel])
  const editLecture = (lecture, schedule) => {
      console.log(lecture)
      console.log(schedule)
      setLectureObj(lecture)
      setscheduleObj(schedule)
    }
    const onMouseEnterHandel = (lecture_slug)=>{
      console.log("enter");
      setVisibleLectureToast(prevState => ({
        ...prevState,
        [lecture_slug]: true
      }));
    }
    const onMouseLeaveHandel = (lecture_slug)=>{
      setVisibleLectureToast(prevState => ({
        ...prevState,
        [lecture_slug]: false
      }));
    }
  return (
    <>
      <CRow className="mb-3">
        <CCol>
          <CCard>
            <CCardHeader>Semester</CCardHeader>
            <CCardBody>
              <CFormSelect
                aria-label="Default select example"
                onChange={(e) => {
                  setcurrentSelectSemester(e.target.value)
                }}
              >
                <option value="">Select Semester</option>
                {Semesters.map((item, index) => (
                  <option key={index} value={item.slug}>
                    Semester - {item.no}
                  </option>
                ))}
              </CFormSelect>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>TimeTable</CCardHeader>
            <CCardBody  style={!currentSelectSemester ? {display:'flex',justifyContent:'center'} : {}}>
              {!currentSelectSemester ? (
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
                      <rect width="100%" height="100%" fill="#007AFF"></rect>
                    </svg>
                    <div className="fw-bold me-auto">SMARTROLL ADMINISTRATION</div>
                  </CToastHeader>
                  <CToastBody>Please select a semester!!</CToastBody>
                </CToast>
              ) : (
                <CTable align="middle" className="w-100 mb-0 border text-center" hover responsive>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell rowSpan={2} style={{ width: '5rem', height: 'auto' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Schedule_or_Calendar_Flat_Icon.svg"></img>
                      </CTableHeaderCell>
                      <CTableHeaderCell>10:30</CTableHeaderCell>
                      <CTableHeaderCell>11:30</CTableHeaderCell>
                      <CTableHeaderCell>1:00</CTableHeaderCell>
                      <CTableHeaderCell>2:00</CTableHeaderCell>
                      <CTableHeaderCell>3:15</CTableHeaderCell>
                      <CTableHeaderCell>4:15</CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell>11:30</CTableHeaderCell>
                      <CTableHeaderCell>12:30</CTableHeaderCell>
                      <CTableHeaderCell>2:00</CTableHeaderCell>
                      <CTableHeaderCell>3:00</CTableHeaderCell>
                      <CTableHeaderCell>4:15</CTableHeaderCell>
                      <CTableHeaderCell>5:15</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {timeTable.schedules && timeTable.schedules.length > 0
                      ? timeTable.schedules.map((schedule, index) => (
                          <CTableRow key={schedule.slug}>
                            <CTableHeaderCell key={index}>{schedule.day}</CTableHeaderCell>
                            {schedule.lectures.map((lecture, lectureindex) => (
                              <CTableDataCell
                                key={lecture.slug}
                                onClick={(e) => {editLecture(lecture, schedule); setVisible(true)}}
                                onMouseEnter={(e) => {onMouseEnterHandel(lecture.slug)}}
                                onMouseLeave={(e) => {onMouseLeaveHandel(lecture.slug)}}
                                >

                                  <CToaster placement="top-start">
                                  <CToast autohide={false} visible={visibleLectureToast[lecture.slug]}>

                                    <CToastHeader closeButton>
                                      <svg
                                        className="rounded me-2"
                                        width="20"
                                        height="20"
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="xMidYMid slice"
                                        focusable="false"
                                        role="img"
                                      >
                                        <rect width="100%" height="100%" fill="#007AFF"></rect>
                                      </svg>
                                      <div className="fw-bold me-auto">Lecture Details</div>
                                      
                                    </CToastHeader>
                                    <CToastBody>
                                      <strong>Classroom</strong> - {lecture.classroom.class_name}
                                      <br></br>
                                      <strong>Teacher</strong> - {lecture.teacher.profile.name}
                                      <br></br>
                                      <strong>Time</strong> - {lecture.start_time} <strong>To</strong> {lecture.end_time}
                                    </CToastBody>
                                  </CToast>
                                </CToaster>
                                {lecture.subject ? (<div><strong style={{color:'gray'}}>{lecture.subject.subject_name}</strong></div>) : '-'}
                              </CTableDataCell>
                            ))}
                          </CTableRow>
                        ))
                      : null}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {lectureObj && scheduleObj ?(<SetLecture visible={visible} setupdate_timetable={setupdate_timetable} setVisible={setVisible} scheduleObj={scheduleObj} lectureObj={lectureObj} currentSelectSemester={currentSelectSemester} />):null}
    </>
  )
}
export default Timetable