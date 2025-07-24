import React, { useState } from 'react'
import type { Student } from '../../types';

// action: 'create' | 'update';
interface ActionFormProps {
  action: 'create' | 'update';
  onSubmit: (data: Partial<Student>) => void;
}

const ActionForm: React.FC<ActionFormProps> = ({ action, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    grade: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: Partial<Student> = {
      name: formData.name,
      grade: parseInt(formData.grade, 10) || 0,
    }

    if (action === 'update') {
      submissionData.id = parseInt(formData.id, 10)
    }

    onSubmit(submissionData);

    setFormData({
      id: '',
      name: '',
      grade: '',
    })
  }

  // stubbed the options for update as well
  const title = action === 'create' ? 'Add New Student' : 'Update Student';
  const buttonText = action === 'create' ? 'Create' : 'Save Changes';

  return (
    <div className="p-4 mt-8 bg-base-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <form onSubmit={handleSubmit}>
        {action === 'update' && (
          <div className="form-control">
            <label className="label">
              <span className="label-text">Student ID to Update</span>
            </label>
            <input
              type="number"
              name="id"
              value={formData.id}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
              required
            />
          </div>
        )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full max-w-xs"
              required
            />
          </div>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Grade</span>
          </label>
          <input
            type="number"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            className="input input-bordered w-full max-w-xs mb-4"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-6">
          {buttonText}
        </button>
      </form>
    </div>
  )
}

export default ActionForm
