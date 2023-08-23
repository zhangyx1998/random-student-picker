# Function to generate random password
define RandomPassword
$(shell LC_ALL=C tr -dc A-Za-z0-9 < /dev/urandom | head -c 8)
endef

# Interactive prompt to generate new password
$(SRV_VAR)/password:
	@mkdir -p $(SRV_VAR)
	@echo -n 'New Password [leave blank for random]: '
	@read PASSWORD; if [ -z "$$PASSWORD" ]; then \
		printf '%s' $(call RandomPassword) > $(SRV_VAR)/password; \
		echo \
			"Your randomly generated password is" \
			$$(cat $(SRV_VAR)/password); \
	else \
		printf '%s' $$PASSWORD > $(SRV_VAR)/password; \
	fi
	@echo "New password written to" $(SRV_VAR)/password

new-password: $(SRV_VAR)/password

# Ensure password file exists and valid
password:
	@if [ ! -f $@ ]; then \
		$(MAKE) new-password; \
	fi

.PHONY: new-password password