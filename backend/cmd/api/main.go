package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Brandon-G-Tripp/student_management_app/internal/handlers"
	"github.com/Brandon-G-Tripp/student_management_app/internal/repository"
	_ "github.com/jackc/pgx/v5/stdlib"
)

// can add maybe gin in order to get URL params easier

func main() {

	dbHost := os.Getenv("POSTGRES_HOST")
	dbPort := os.Getenv("POSTGRES_PORT")
	dbUser := os.Getenv("POSTGRES_USER")
	dbPassword := os.Getenv("POSTGRES_PASSWORD")
	dbName := os.Getenv("POSTGRES_DB")

	connString := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName)
	db, err := sql.Open("pgx", connString)
	if err != nil {
		log.Printf("ERROR: failed to connect to DB with error: %v", err)
	}

	studentRepo := repository.New(db)

	studentHandler := handlers.New(studentRepo)

	mux := http.NewServeMux()

	// Reference for builtin pattern matching for the Mux - https://pkg.go.dev/net/http@go1.24.5#ServeMux
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		if err := json.NewEncoder(w).Encode("HELLO"); err != nil {
			http.Error(w, "An internal server error occurred", http.StatusInternalServerError)
		}
	})
	mux.HandleFunc("GET /students", studentHandler.GetStudents)
	mux.HandleFunc("POST /students", studentHandler.CreateStudent)

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}

}
