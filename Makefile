# Make scripts for convenient testing and deployment
# Author: Yuxuan Zhang, admin@yuxuanzhang.net
# =========================================================
# Makefile: https://www.gnu.org/software/make/manual/make.html
# Preset parameters
SERVER_PORT ?= 8080
SERVER_VAR  ?= $(PWD)/var
# Optional attiaional make scripts
include scripts/*.mk
# Frontend Related
frontend.init:
	cd frontend && npm install

frontend.dev: frontend.init
	cd frontend && \
	PROXY="http://localhost:$(SERVER_PORT)" \
	npx vite dev

frontend: frontend.init
	cd frontend && npx vite build --outDir $(SERVER_VAR)/static

# Backend Related
backend.init:
	cd backend && npm install

# Install backend server as a systemd service
backend.install: backend.init
	@echo "Not implemented"

# Start backend server as a systemd service
backend.start: backend.install
	@echo "Not implemented"

# Run backend server on this terminal
backend: backend.init
	@ PORT=$(SERVER_PORT) VAR_PATH=$(SERVER_VAR) \
	node backend/index.js
