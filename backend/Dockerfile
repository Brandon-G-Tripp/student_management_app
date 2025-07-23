FROM golang:1.24.3-alpine3.22 AS base

WORKDIR /app

RUN apk add --no-cache \
  curl \
  ca-certificates 

COPY go.mod go.sum ./
RUN go mod download

RUN go install github.com/air-verse/air@latest

COPY . .

EXPOSE 8000

ENTRYPOINT ["/go/bin/air"]

