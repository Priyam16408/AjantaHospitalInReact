import React from 'react'

const SubmenuComponent = ({ isOpen, onClose, children }) => {
  return (
    <>
        <div className={`submenusidebar ${isOpen ? 'open' : ''}`}>
      <div className="submenusidebar-content">
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
    </>
  )
}

export default SubmenuComponent