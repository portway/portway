build:
	./build.sh

builddev:
	./build.sh && docker-compose build

cleardev:
	# Erases the volumes, including node_modules. Run this if node_modules changes
	docker-compose down

start:
	docker-compose up

stop:
	docker-compose stop
