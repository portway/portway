install:
	docker-compose -f docker-compose.builder.yml run --rm install_api
	docker-compose -f docker-compose.builder.yml run --rm install_web

build-api:
	docker-compose -f docker-compose.builder.yml run --rm build_api

build-web:
	docker-compose -f docker-compose.builder.yml run --rm build_web

start:
	docker-compose up

kill:
	docker-compose stop
