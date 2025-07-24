import React, { useEffect, useState } from 'react'
import StudentList from '../features/students/StudentList'
import ActionForm from '../features/students/ActionForm'
import apiClient from '../api/apiClient'
import type { Student } from '../types'

// can add other navbar items later
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('list')
  const [selectedAction, setSelectedAction] = useState('create')

  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    apiClient.get<Student[]>('/students')
      .then(resp => {
        setStudents(resp.data)
      })
      .catch(e => {
        console.error("Failed to fetch students:", e)
      })
  }, [])

  const handleCreateStudent = async (data: Partial<Student>) => {
    try {
      const newStudent = await apiClient.post<Student>('/students', data);

      setStudents(currentStudents => [...currentStudents, newStudent]);

      // setActiveTab('list');

    } catch (error) {
      console.error("Failed to create student:", error);
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

              {selectedAction === 'delete' && (
                  <div className="p-4 bg-base-100 rounded-lg">
                      <p>UI for selecting a student to **delete** will go here.</p>
                  </div>
              )}

            */}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
