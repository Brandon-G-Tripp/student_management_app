import React from 'react';
import type { Student } from '../../types'

interface StudentListProps {
  students: Student[]
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <th>{student.id}</th>
              <td>{student.name}</td>
              <td>{student.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}



export default StudentList
