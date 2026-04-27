SERVICE_NAME := oneks-auth-bff-service
BIN_DIR := bin
CMD_DIR := cmd/server

.PHONY: build run test test-cover lint fmt tidy clean

## Build the server binary
build:
	go build -o $(BIN_DIR)/server ./$(CMD_DIR)

## Run the server
run:
	go run ./$(CMD_DIR)

## Run all tests
test:
	go test ./...

## Run tests with coverage
test-cover:
	go test -cover ./...

## Run go vet
lint:
	go vet ./...

## Format code
fmt:
	gofmt -w .

## Tidy modules
tidy:
	go mod tidy

## Clean build artifacts
clean:
	rm -rf $(BIN_DIR)
