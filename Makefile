ifneq ("$(wildcard .env)","")
	include .env
	export
endif

install:
	pip install -r requirements.txt
run:
	#python main.py
	node src/server.js

remote_docker := unset DOCKER_HOST; docker
ifeq ($(REMOTE),true)
	remote_docker := DOCKER_HOST=$(REMOTE_DOCKER_HOST) docker
endif

docker-build:
	$(remote_docker) build -t sucicada/japanese-firigana-service:latest .

service_name = japanese-firigana-service
_docker-run: docker-build
	@echo $(remote)
	@echo $(DOCKER_HOST)
	@echo $(remote_docker)
	$(remote_docker) stop $(service_name) || true
	$(remote_docker) rm $(service_name) || true
	$(remote_docker) run -d -p 41401:41401 --name $(service_name) \
		--env-file .env \
		sucicada/$(service_name):latest

docker-run-remote:
	REMOTE=true make _docker-run

docker-run-local:
	make _docker-run

docker-push:
	docker push sucicada/$(service_name):latest


#freeze-extensions:
#	code --list-extensions > extensions.txt
#
#install-extensions:
#	cat extensions.txt | xargs -L 1 code --install-extension
#
test:
	/opt/homebrew/bin/docker build -t sucicada/japanese-firigana-service:latest .
