package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/Brandon-G-Tripp/student_management_app/internal/model"
)

type mockRepo struct{}

func (m *mockRepo) GetStudents(ctx context.Context) ([]model.Student, error) {
	return []model.Student{{ID: 1, Name: "Mock Student", Grade: 10}}, nil
}

func (m *mockRepo) CreateStudent(ctx context.Context, student model.Student) (model.Student, error) {
	student.ID = 99
	return student, nil
}


func TestGetStudents(t *testing.T) {
	handler := &Handler{repo: &mockRepo{}}

	req := httptest.NewRequest("GET", "/students", nil)
	rr := httptest.NewRecorder()

	handler.GetStudents(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("expected status OK; got %v", rr.Code)
	}

	if !strings.Contains(rr.Body.String(), "Mock Student") {
		t.Errorf("expected body to contain 'Mock Student'; got %s", rr.Body.String())
	}
}

func TestCreateStudent(t *testing.T) {
	handler := &Handler{repo: &mockRepo{}}
	requestBody := `{"name": "Test", "grade": "12"}`

	req := httptest.NewRequest("POST", "/students", strings.NewReader(requestBody))
	rr := httptest.NewRecorder()

	handler.CreateStudent(rr, req)

	if rr.Code != http.StatusCreated {
		t.Errorf("expected status Created; got %v", rr.Code)
	}

	var createdStudent model.Student
	json.Unmarshal(rr.Body.Bytes(), &createdStudent)
	if createdStudent.ID != 99 {
		t.Errorf("expected student ID 99; got %d", createdStudent.ID)
	}
}
