package config

import (
	"os"
)

type Config struct {
	ServerPort string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string
	TimeZone   string
	JWTSecret  string
	JWTExpiry  string // e.g. "24h"
}

func Load() *Config {
	return &Config{
		ServerPort: getEnv("SERVER_PORT", "8087"),
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", "admin"),
		DBName:     getEnv("DB_NAME", "postgres"),
		DBSSLMode:  getEnv("DB_SSL_MODE", "disable"),
		TimeZone:   getEnv("TZ", "Asia/Bangkok"),
		JWTSecret:  getEnv("JWT_SECRET", "change-me-in-production"),
		JWTExpiry:  getEnv("JWT_EXPIRY", "24h"),
	}
}

func (c *Config) DSN() string {
	return "host=" + c.DBHost +
		" port=" + c.DBPort +
		" user=" + c.DBUser +
		" password=" + c.DBPassword +
		" dbname=" + c.DBName +
		" sslmode=" + c.DBSSLMode +
		" TimeZone=" + c.TimeZone
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
