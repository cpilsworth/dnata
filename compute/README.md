# aem-edge-compute-boilerplate

## Introduction

This boilerplate serves as an example of what is possible to achieve with AEM Edge Compute. The repository contains a simple server that expose multiple endpoints and makes usage of:

- Edge Compute service provisioning
- Configurations usage (ConfigStore)
- Secrets usage (SecretStore)
- Logging
- Log Tailing

Server source code can be found under `./src`, tests can be found under `./test` and are executable through `mocha`.
The service configuration is defined in `config/compute.yaml` and CDN routing in `config/cdn.yaml`.

## Setup

The following command will help you install the necessary dependencies to run your compute code locally and package it for deployment.

```
make setup
```

You would also need to export the following environment variable to be able to deploy your package or tail your logs.

```
export AEM_COMPUTE_TOKEN=<CUSTOM_TOKEN>
```

**Notes:** You can add those exports directly in your `~/.bashrc` or `~/.zshrc` to persist them.

## Create your compute

The first step to create your compute is to ensure that you have setup a configuration pipeline for your environment in Cloud Manager. If it is not the case, please follow this documentation to create your configuration pipeline.

In case you are using a RDE, you can deploy your configuration using the command make deploy-config instead.

Compute services creation is done via configuration file, you will need to create a YAML file (eg. compute.yaml) with the following configuration:

```
kind: "Compute"
version: "1"
metadata:
  envTypes: ["rde", "dev", "stage", "prod"]
data:
  services:
    - name: first-compute
    - name: second-compute
  # Uncomment to enable configs and secrets
  # configs:
  #   - key: LOG_LEVEL
  #     value: DEBUG
  # secrets:
  #   - key: API_TOKEN
  #     value: ${{ API_TOKEN_SECRET }}
```

The configuration is composed of:

- services: contains a list of compute services, where a compute service is composed of a name and a set of origins. The number of services is limited to 3.
- configs: contains a key/value configs arrays that will be exposed to all your compute services
- secrets: contains a key/value secrets arrays that will be exposed to all your compute services

Once you have created your configuration, you will need to commit your changes to your CM Git Repo and trigger the configuration pipeline. Once the configuration pipeline succeed, you should be able to access both your compute services:

- compute-backend-pXXXXX-eYYYYY-first-compute.adobeaemcloud.com
- compute-backend-pXXXXX-eYYYYY-second-compute.adobeaemcloud.com

Your compute service will be accessible through the domain compute-backend-<pXXXXX-eYYYYYY>-<compute-name>.adobeaemcloud.com, where pXXXXX-eYYYYY is your environment coordinates and compute-name is the name you gave your compute in the compute configuration file.

## Build

The following command will package your compute code for deployment to your compute service.

```
make build
```

## Deploy

The following command will deploy your package to your compute service. You will have to set the argument computeService to your own compute service <pXXXXX-eYYYYYY>-<compute-name>, where pXXXXX-eYYYYY is your environment coordinates and compute-name is the name you gave your compute in the compute configuration file.

```
make deploy AEM_COMPUTE_SERVICE=pXXXXX-eYYYYY-first-compute
```

## Local run

The following command will run your compute code locally and exposed a server at `http://127.0.0.1:7676`

```
make serve
```

You can learn more about what is supported by Local runtime on [Fastly documentation](https://www.fastly.com/documentation/reference/cli/compute/serve/).

## Test

The following command will execute tests using `mocha`.

```
make test
```

## Remote debugging

Fastly offers remote logging as a way to debug your program. The following command will tail your compute service logs. You will be able to get runtime `console.log` from your compute service directly in your terminal.

```
make tail-logs AEM_COMPUTE_SERVICE=pXXXXX-eYYYYY-first-compute
```

## Configuration

### Origins

Adobe Managed CDN allows compute to access any origins by default. In case you want to restrict access to only defined origins (see [Fastly Documentation](https://js-compute-reference-docs.edgecompute.app/docs/fastly:backend/enforceExplicitBackends)), you will need to define your origins in your compute service definition (in the compute configuration file) as an array of origins similar to the [CDN Origin Selectors feature](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/content-delivery/cdn-configuring-traffic#origin-selectors).

Given the following configuration

```
origins:
  - name: my-origin-name
    domain: example.com
```

you will be able to select the origin to use for your request as follow

```
const request = new Request("https://example.com/test");
const response = await fetch(request, { backend: "my-origin-name" });
```

### Service Secrets

Fastly allows you to use secrets in your code through secret store. Those secrets can be defined in the compute service configuration file under secrets as an array of objects containing a key and a value fields. Note that the value field does not contain the secret, but a reference to the secret (${{SECRET_REFERENCE}}). The secret needs to be defined in Cloud Manager as described in this documentation.

Given the following configuration

```
secrets:
  - key: API_TOKEN
    value: ${{ API_TOKEN_SECRET }}
```

you will be able to get your secret using the secret manager class available in the boilerplate. Secrets get be retrieved as follow

```
import { SecretStoreManager } from "./lib/config";
...
const apiToken = await SecretStoreManager.getSecret('API_TOKEN');
```

**Notes:**
- The secret store will always be named secret_default
- key name are case-sensitive
- **Secrets are immutable**

### Logging

AEM Edge Compute is compatible with the [log forwarding feature](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/log-forwarding).

You can define your logging configuration as follow (create a logForwarding.yaml file next to the compute.yaml)

```
kind: "LogForwarding"
version: "1"
metadata:
  envTypes: ["rde", "dev", "stage", "prod"]
data:
  splunk:
    default:
      enabled: true
      host: "splunk-host.example.com"
      token: "${{SPLUNK_TOKEN}}"
      index: "AEMaaCS"
```

and use the logger in your code as follow:

```
import { Logger } from "fastly:logger";
...
const logger = new Logger("customerSplunk");
logger.log(JSON.stringify({
  method: event.request.method,
  url: event.request.url
}));
```

## Routing

You can access your compute service directly at compute-backend-<pXXXXX-eYYYYYY>-<compute-name>.adobeaemcloud.com, where pXXXXX-eYYYYY is your environment coordinates and compute-name is the name you gave your compute in the compute configuration file.

But you can also leverage the originSelector feature from the Adobe Managed CDN to route route parts of your traffic to your compute. For that you will need to apply the following CDN configuration (cdn.yaml) via the Configuration Pipeline.

```
kind: 'CDN'
version: '1'
metadata:
  envTypes: ["rde", "dev", "stage", "prod"]
data:
  originSelectors:
    rules:
      - name: route-to-compute
        when: { reqProperty: path, equals: "/weather" }
        action:
          type: selectAemOrigin
          originName: compute-<compute-name>
```

Where compute-name is the name you gave your compute in the compute configuration file.

With that configuration, the weather endpoint of the compute boilerplate that you have deployed on your compute will now be accessible on your publish-pXXXXX-eYYYYY.adobeaemcloud.com or custom domains.

See [official documentation](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/content-delivery/cdn-configuring-traffic#origin-selectors) to learn more about Origin Selector.

## References

https://www.fastly.com/documentation/guides/compute/
