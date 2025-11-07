FASTLY_API_ENDPOINT=https://api-fastly.adobeaemcloud.com/
AEM_COMPUTE_TOKEN ?= ''
AEM_COMPUTE_SERVICE ?= ''
FASTLY_API_TOKEN=$(AEM_COMPUTE_TOKEN)

export FASTLY_API_ENDPOINT
export FASTLY_API_TOKEN

.PHONY: test

setup:
	npm install -g @fastly/cli@latest
	npm install

check-env:
ifndef FASTLY_API_ENDPOINT
	$(error FASTLY_API_ENDPOINT is not set)
endif
ifndef AEM_COMPUTE_TOKEN
	$(error AEM_COMPUTE_TOKEN is not set)
endif
ifndef AEM_COMPUTE_SERVICE
	$(error AEM_COMPUTE_SERVICE is not set)
endif
	@echo "AEM_COMPUTE_SERVICE: $(AEM_COMPUTE_SERVICE)"

build:
	@fastly compute build --include-source

test:
	npm run test

serve:
	@fastly compute serve

deploy-config:
	aio aem:rde:install -t env-config ./config --force

deploy: check-env build
	@fastly compute deploy --service-id $(AEM_COMPUTE_SERVICE)

tail-logs: check-env
	@fastly log-tail --service-id $(AEM_COMPUTE_SERVICE)
