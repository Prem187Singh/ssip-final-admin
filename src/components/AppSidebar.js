import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useContext } from 'react'
import { Store } from 'src/views/forms/validation/store'
import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import smartrollicon from '../smartroll_logo.png'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { accessToken, refreshToken, profileDetails } = state
  console.log("here")
  console.log(profileDetails)
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      palcement="end"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <img className="p-3" src={smartrollicon}></img>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={profileDetails["role"] === "admin" ? navigation.admin_role : navigation.teacher_role} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
