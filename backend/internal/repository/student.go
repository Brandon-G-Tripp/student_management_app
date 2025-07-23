package repository

import (
	"context"
	"database/sql"
	"log"

	"github.com/Brandon-G-Tripp/student_management_app/internal/model"
)

type Repository struct {
	db *sql.DB
}

// May want to add gorm for ORM https://gorm.io/docs/index.html#Traditional-API
// or we could use the pgx as the package and not just the driver

func New(db *sql.DB) *Repository {
	return &Repository{
		db: db,
	}
}

// QueryContext for getting all students
func (r *Repository) GetStudents(ctx context.Context) ([]model.Student, error) {
	rows, err := r.db.QueryContext(ctx, "SELECT id, name, grade FROM students")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var students []model.Student
	for rows.Next() {
		var s model.Student
		// this order should be the same as select statement
		if err := rows.Scan(&s.ID, &s.Name, &s.Grade); err != nil {
			return nil, err
		}
		students = append(students, s)
	}

	return students, nil
}

// QueryRowContext so we get back the db created id
func (r *Repository) CreateStudent(ctx context.Context, student model.Student) (model.Student, error) {
	err := r.db.QueryRowContext(ctx,
		"INSERT INTO students (name, grade) VALUES ($1, $2) RETURNING id",
		student.Name, student.Grade,
	).Scan(&student.ID)

	if err != nil {
		return model.Student{}, err
	}

	return student, nil
}


// Stubbed below for update and for get by id and delete

// QueryRowContext
// func (r *Repository) GetStudentById(id int64) (model.Student, error) {
// 	return model.Student{}, nil
// }
//
// QueryRowContext so we can get back the updated data
// func (r *Repository) UpdateStudentById(id int64) (model.Student, error) {
// 	return model.Student{}, nil
// }
//
// ExecContext because it doesn't return anything
// func (r *Repository) DeleteStudentById(id int64) (model.Student, error) {
// 	return model.Student{}, nil
// }
