import React, { useState } from 'react'
import StudentList from '../features/students/StudentList'

// can add other navbar items later
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('list')

  const [selectedAction, setSelectedAction] = useState('create')

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <div className='navbar bg-base-300 rounded-box mb-6 shadow-lg'>
        <a className='btn btn-ghost text-xl'> Student Management System</a>
      </div>

      <div role='tablist' className='tabs tabs-lifted'>
        <a
          role='tab'
          className={`tab ${activeTab === 'list' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Students In System
        </a>
        <a
          role='tab'
          className={`tab ${activeTab === 'actions' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          Actions
        </a>
        <a role='tab' className='tab [--tab-bg:transparent]'></a>
      </div>

      <div className='bg-base-200 p-6 rounded-b-box rounded-tr-box shadow-md'>
        {activeTab === 'list' && <StudentList />}
      </div>
    </div>
  )
}

export default HomePage
