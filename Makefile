build:
	./build.sh

builddev:
	./build.sh && docker-compose build

start:
	docker-compose up

kill:
	docker-compose stop
