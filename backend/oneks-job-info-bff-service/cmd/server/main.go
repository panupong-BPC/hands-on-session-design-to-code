package main

import (
	"database/sql"
	"log/slog"
	"net/http"
	"os"

	_ "github.com/lib/pq"

	"oneks-job-info-bff-service/internal/config"
	"oneks-job-info-bff-service/internal/handler"
	"oneks-job-info-bff-service/internal/repository"
	"oneks-job-info-bff-service/internal/router"
	"oneks-job-info-bff-service/internal/service"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	slog.SetDefault(logger)

	cfg := config.Load()

	// Database
	db, err := sql.Open("postgres", cfg.DSN())
	if err != nil {
		slog.Error("failed to open database connection", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		slog.Error("failed to ping database", "error", err)
		os.Exit(1)
	}
	slog.Info("database connected")

	// Wire dependencies
	repo := repository.NewJobInfoRepository(db)
	svc := service.NewJobInfoService(repo)
	h := handler.NewJobInfoHandler(svc)

	// Start server
	r := router.New(h)
	addr := ":" + cfg.ServerPort
	slog.Info("server starting", "addr", addr)

	if err := http.ListenAndServe(addr, r); err != nil {
		slog.Error("server failed", "error", err)
		os.Exit(1)
	}
}
