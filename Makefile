build:
	./build.sh

builddev:
	./build.sh && docker-compose build

rebuilddev:
	docker-compose down && ./build.sh && docker-compose build --no-cache

cleardev:
	docker-compose down

start:
	docker-compose up

stop:
	docker-compose stop

test-api:
	docker-compose build && \
	docker-compose -f docker-compose.test.yml up --remove-orphans --exit-code-from api-testrunner

# This is... wrong. But it works
# https://stackoverflow.com/a/6273809/836205
# Run any sequelize command in the container via `make sequelize COMMAND`
# or leave COMMAND blank for a list of sequelize commands
sequelize:
	docker container exec danger-api /api/node_modules/.bin/sequelize $(filter-out $@,$(MAKECMDGOALS))

# This is a catchall for sequelize commands to silence Make from complaining
# about "No rule to Make target". See SO link above
%:
	@: