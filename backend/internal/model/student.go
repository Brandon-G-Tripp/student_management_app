package model

// Could add this for tag validation - https://github.com/go-playground/validator

type Student struct {
	ID int64 `json:"id"`
	Name string `json:"name"`
	Grade int64 `json:"grade"`
}
