import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>    
      <div className="mx-auto">
        <span className="ms-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          SmartRoll
          {/* CoreUI React Admin &amp; Dashboard Template */}
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
