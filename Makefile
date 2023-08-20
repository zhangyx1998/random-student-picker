# Make scripts for convenient testing and deployment
# Author: Yuxuan Zhang, admin@yuxuanzhang.net
# =========================================================
# Makefile: https://www.gnu.org/software/make/manual/make.html
# Preset parameters
SRV_PORT ?= 8080
SRV_VAR  ?= $(PWD)/var
# Help message
help:
	@echo \
	"Make targets:" \
	"\n" \
	"\n  help             show this message (default target)" \
	"\n" \
	"\n  frontend         build frontend for distribution" \
	"\n  frontend.debug   build frontend in debug mode" \
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
	"Common combinations:" \
	"\n" \
	"\n  To run " \
	"\n" \
	"\n  Author: Yuxuan Zhang" \
	"\n"

# Git Related
git.sync:
	@if [ -z "$(git status --porcelain)" ]; then \
		echo "[GIT] Checking updates from remote ..."; \
		git pull > /dev/null; \
		git submodule update --init --recursive > /dev/null; \
	else \
		echo "Git repository is dirty. Skipping git pull"; \
	fi

# Frontend Related
BUILD_FLAGS  ?= 
BUILD_FLAGS  += --emptyOutDir --outDir $(SRV_VAR)/static

frontend.init: git.sync
	@cd frontend && npm install > /dev/null

frontend: frontend.init
	$(info Building frontend distribution...)
	@cd frontend && \
	npx vite build $(BUILD_FLAGS) > /dev/null 

frontend.debug: BUILD_FLAGS += --minify false
frontend.debug: frontend

frontend.dev: frontend.init
	@cd frontend && \
	PROXY="http://localhost:$(SRV_PORT)" \
	npx vite dev

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
	@ PORT=$(SRV_PORT) VAR_PATH=$(SRV_VAR) \
	node backend/index.js

# Optional attiaional make scripts
include scripts/*.mk