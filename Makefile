build:
	./build.sh

builddev:
	./build.sh && docker-compose build

rebuilddev:
	./build.sh docker-compose build --no-cache

start:
	docker-compose up

stop:
	docker-compose stop

test-api:
	docker-compose build && \
	docker-compose -f docker-compose.test.yml up --remove-orphans --exit-code-from api-testrunner
