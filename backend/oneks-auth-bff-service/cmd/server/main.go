package main

import (
	"database/sql"
	"log/slog"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"

	"oneks-auth-bff-service/internal/config"
	"oneks-auth-bff-service/internal/handler"
	"oneks-auth-bff-service/internal/repository"
	"oneks-auth-bff-service/internal/router"
	"oneks-auth-bff-service/internal/service"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	slog.SetDefault(logger)

	cfg := config.Load()

	// Database
	db, err := sql.Open("postgres", cfg.DSN())
	if err != nil {
		slog.Error("failed to connect to database", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		slog.Error("failed to ping database", "error", err)
		os.Exit(1)
	}
	slog.Info("database connected")

	// Parse JWT expiry duration
	jwtExpiry, err := time.ParseDuration(cfg.JWTExpiry)
	if err != nil {
		slog.Error("invalid JWT_EXPIRY duration", "value", cfg.JWTExpiry, "error", err)
		os.Exit(1)
	}

	// Wire dependencies
	repo := repository.NewUserRepository(db)
	svc := service.NewAuthService(repo, cfg.JWTSecret, jwtExpiry)
	h := handler.NewAuthHandler(svc)

	// Start server
	r := router.New(h)
	addr := ":" + cfg.ServerPort
	slog.Info("server starting", "addr", addr)

	if err := http.ListenAndServe(addr, r); err != nil {
		slog.Error("server failed", "error", err)
		os.Exit(1)
	}
}
