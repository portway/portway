build:
	./build.sh

builddev:
	docker-compose build

rebuilddev:
	docker-compose down && docker volume rm portway_postgres-data && docker-compose build --no-cache

installweb:
	docker-compose exec web npm install

installapi:
	docker-compose exec api npm install

installsync:
	docker-compose exec sync npm install

cleardev:
	docker-compose down && docker volume rm portway_postgres-data

start:
	docker-compose up

stop:
	docker-compose stop

test-api:
	docker-compose -f docker-compose.test.yml up --build --exit-code-from api-testrunner

rebuildtest:
	docker-compose -f docker-compose.test.yml down && docker-compose -f docker-compose.test.yml build --no-cache

# This is... wrong. But it works
# https://stackoverflow.com/a/6273809/836205
# Run any sequelize command in the container via `make sequelize COMMAND`
# or leave COMMAND blank for a list of sequelize commands
sequelize:
	docker container exec portway-api /api/node_modules/.bin/sequelize $(filter-out $@,$(MAKECMDGOALS))

# This is a catchall for sequelize commands to silence Make from complaining
# about "No rule to Make target". See SO link above
%:
	@:
