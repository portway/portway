install:
	docker-compose -f docker-compose.builder.yml run --rm install_api
	docker-compose -f docker-compose.builder.yml run --rm install_web

dev:
	docker-compose up
