package main

import (
	"database/sql"
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

	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

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
	mux.HandleFunc("GET /students", studentHandler.GetStudents)
	mux.HandleFunc("POST /students", studentHandler.CreateStudent)

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatal(err)
	}

}
