package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/Brandon-G-Tripp/student_management_app/internal/model"
	"github.com/Brandon-G-Tripp/student_management_app/internal/repository"
)

type Handler struct {
	repo *repository.Repository
}

func New(repo *repository.Repository) *Handler {
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
	var studentToCreate model.Student

	if err := json.NewDecoder(r.Body).Decode(&studentToCreate); err != nil {
		http.Error(w, "Invalid body in the request", http.StatusBadRequest)
		return
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

