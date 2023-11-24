install:
	pip install -r requirements.txt

docker-build:
	docker build -t sucicada/japanese-service:latest .



freeze-extensions:
	code --list-extensions > extensions.txt

install-extensions:
	cat extensions.txt | xargs -L 1 code --install-extension

