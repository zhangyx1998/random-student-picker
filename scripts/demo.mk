DEMO_CSV := scripts/demo-students.csv
demo.convert:
	@$(MAKE) convert < $(DEMO_CSV)
	@echo "Student list generated using $(DEMO_CSV)"

demo: demo.convert frontend backend
