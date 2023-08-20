# Make scripts for convenient testing and deployment
# Author: Yuxuan Zhang, admin@yuxuanzhang.net
# =========================================================
# Makefile: https://www.gnu.org/software/make/manual/make.html
# Preset parameters
SERVER_PORT ?= 8080
SERVER_VAR  ?= $(PWD)/var
# Help message
help:
	@echo \
	"Make targets:" \
	"\n" \
	"\n  help             show this message (default target)" \
	"\n" \
	"\n  preview          build frontend and start server" \
	"\n" \
	"\n  frontend         build frontend for distribution" \
	"\n  frontend.dev     start frontend dev server" \
	"\n" \
	"\n  backend          start backend server for development" \
	"\n  backend.install  install backend as a systemd service" \
	"\n  backend.start    start backend service (systemd)" \
	"\n  backend.stop     stop backend service (systemd)" \
	"\n" \
	"\n  convert          Convert csv file into student list." \
	"\n                   (This command takes input from stdin)" \
	"\n  convert.demo     Convert demo/students.csv for demostration." \
	"\n" \
	"\n  Author: Yuxuan Zhang" \
	"\n"

preview: frontend backend

# Frontend Related
frontend.init:
	@git submodule update --init --recursive > /dev/null
	@cd frontend && npm install > /dev/null

frontend.dev: frontend.init
	@cd frontend && \
	PROXY="http://localhost:$(SERVER_PORT)" \
	npx vite dev

frontend: frontend.init
	$(info Building frontend distribution...)
	@cd frontend && \
	npx vite build \
	--emptyOutDir \
	--outDir $(SERVER_VAR)/static > /dev/null 

# Backend Related
backend.init:
	@cd backend && npm install > /dev/null

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

# Optional attiaional make scripts
include scripts/*.mk