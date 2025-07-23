# Student Management App


## Backend Documentation 

### Running the Go App and Postgres

1. Make sure a docker daemon is running
2. Run `docker compose up` to start Go App and Postgres
    - This will run init to create initial table in DB
    - run `docker compose down -v` to remove volume if needed before running compose up 
3. Test API with basic commands below


### Psql into Postgres Container

```
docker exec -it postgres psql -U postgres -d postgres
```


### Curl Requests to test Go API

#### Create Student

```
curl -X POST http://localhost:8080/students \
 -H "Content-Type: application/json" \
 -d '{
     "name": "Ann",
     "grade": "78"
 }'
```


```
curl -X GET http://localhost:8080/students
```
