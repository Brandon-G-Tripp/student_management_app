import React, { useEffect, useState } from 'react'
import StudentList from '../features/students/StudentList'
import ActionForm from '../features/students/ActionForm'
import apiClient from '../api/apiClient'
import type { Student } from '../types'
import { useWebSocket } from '../hooks/useWebSocket'

// can add other navbar items later
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('list')
  const [selectedAction, setSelectedAction] = useState('create')
  const [students, setStudents] = useState<Student[]>([])

  const { isConnected, lastMessage, connect, disconnect } = useWebSocket('ws://localhost:8080/ws')
  const [toastMessage, setToastMessage] = useState('')

  // handle loading of the students for the list view
  useEffect(() => {
    apiClient.get<Student[]>('/students')
      .then(resp => {
        setStudents(resp.data)
      })
      .catch(e => {
        console.error("Failed to fetch students:", e)
      })
  }, [])

  // listening for updates from websocket
  useEffect(() => {
    if (lastMessage) {
      const newStudent: Student = JSON.parse(lastMessage)

      setStudents(currentStudents => {
        // check this first to prevent adding a duplicate to UI when the student is added in the same window
        const studentPresentInList = currentStudents.some(student => student.id === newStudent.id)

        if (studentPresentInList) {
          return currentStudents
        } else {
          return [...currentStudents, newStudent]
        }
      })

      setToastMessage(`New Student Added: ${newStudent.name}`)
      const timer = setTimeout(() => setToastMessage(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [lastMessage])

  const handleCreateStudent = async (data: Partial<Student>) => {
    try {
      const resp = await apiClient.post<Student>('/students', data)
      const newStudent = resp.data

      setStudents(currentStudents => [...currentStudents, newStudent])

      setActiveTab('list')

    } catch (error) {
      console.error("Failed to create student:", error)
    }
  };

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
        <a
          role='tab'
          className={`tab ${activeTab === 'realtime' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('realtime')}
        >
          Real Time Notifications
        </a>
        <a role='tab' className='tab [--tab-bg:transparent]'></a>
        <a role='tab' className='tab [--tab-bg:transparent]'></a>
      </div>

      <div className='bg-base-200 p-6 rounded-b-box rounded-tr-box shadow-md'>
        {activeTab === 'list' && <StudentList students={students} />}

        {activeTab === 'actions' &&  (
          <div>
            <label className='label'>
              <span className='label-text'>Choose An Action</span>
            </label>
            <div className='dropdown border-white'>
              <div tabIndex={0} role='button' className='btn btn-primary w-48 justify-between'>
                {selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)}
              </div>
              <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow border-white bg-base-100 w-48'>
                <li><a onClick={() => setSelectedAction('create')}>Create</a></li>
                <li className='disabled [&_a]:text-slate-400'><a>Update</a></li>
                <li className='disabled [&_a]:text-slate-400'><a>Delete</a></li>
              </ul>
            </div>

            <div className="divider my-8"></div>

            {selectedAction === 'create' && (
              <ActionForm
                action="create"
                onSubmit={handleCreateStudent}
              />
            )}

            {/* This is stubbed  to remember pattern if we implement later
              {selectedAction === 'update' && (
                  <div className="p-4 bg-base-100 rounded-lg">
                    can pass in the appropriate fields here for initial data
                  </div>
              )}

            */}
          </div>
        )}

        {activeTab === 'realtime' && (
          <div>
            <h3 className="text-lg font-bold">Live Updates</h3>
            <p className="py-2">Subscribe to receive live updates when new students are added.</p>
            <button className="btn btn-accent" onClick={isConnected ? disconnect : connect}>
              {isConnected ? 'Unsubscribe' : 'Subscribe'}
            </button>
            {isConnected && <p className="text-success mt-2">Connected to real-time feed.</p>}
          </div>
        )}

       {toastMessage && (
          <div className="toast toast-top toast-end">
            <div className="alert alert-info">
              <span>{toastMessage}</span>
            </div>
          </div>
       )}
      </div>

    </div>
  )
}

export default HomePage
