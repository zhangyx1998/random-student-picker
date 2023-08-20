DEMO_CSV := scripts/demo-students.csv
demo.convert:
	@$(MAKE) --no-print-directory \
	convert < $(DEMO_CSV)
	@echo "Student list generated using $(DEMO_CSV)"

demo.password:
	@mkdir -p $(SRV_VAR)
	@LC_ALL=C tr -dc A-Za-z0-9 < /dev/urandom \
		| head -c 8 \
		> $(SRV_VAR)/password
	@echo "Your randomly generated password is:" $$(cat $(SRV_VAR)/password)

demo: demo.password demo.convert frontend backend
