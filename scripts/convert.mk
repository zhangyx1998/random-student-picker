# Convenient commands for development and deployment
NAME_ENT=Student
convert:
	@cd scripts && npm install
	@node scripts/convert.js \
		--primary-name $(NAME_ENT) \
		--out-dir var/students

