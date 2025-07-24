package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/Brandon-G-Tripp/student_management_app/internal/model"
	"github.com/Brandon-G-Tripp/student_management_app/internal/repository"
)

type CreateStudentRequest struct {
	Name string `json:"name"`
	Grade int64 `json:"grade"`
}

type Handler struct {
	repo repository.StudentRepository // this is the interface to allow injection of mock for testing
}

func New(repo repository.StudentRepository) *Handler {
	return &Handler{
		repo: repo,
	}
}

func (h *Handler) GetStudents(w http.ResponseWriter, r *http.Request) {
	students, err := h.repo.GetStudents(r.Context())
	if err != nil {
		log.Printf("ERROR fetching students: %v", err)
		http.Error(w, "An internal server error occurred", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(students); err != nil {
		log.Printf("Error encoding students to JSON: %v", err)
		http.Error(w, "An internal server error occurred", http.StatusInternalServerError)
	}


}

func (h *Handler) CreateStudent(w http.ResponseWriter, r *http.Request) {
	var createStudentReq CreateStudentRequest

	if err := json.NewDecoder(r.Body).Decode(&createStudentReq); err != nil {
		log.Printf("Error from student creation: %v", err)
		http.Error(w, "Invalid body in the request", http.StatusBadRequest)
		return
	}

	studentToCreate := model.Student{
		Name: createStudentReq.Name,
		Grade: createStudentReq.Grade,
	}

	createdStudent, err := h.repo.CreateStudent(r.Context(), studentToCreate)
	if err != nil {
		http.Error(w, "Failed to create student", http.StatusBadRequest)
		return
	}

	w.Header().Set("Location", fmt.Sprintf("/students/%d", createdStudent.ID))

	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(createdStudent)
}

// for update we can grab the id off the path with  r.PathValue("id")
