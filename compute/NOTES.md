
# boilerplate function
https://git.corp.adobe.com/fccs-content-delivery/aem-edge-compute-boilerplate

# aio plugin
https://github.com/OneAdobe/aio-cli-plugin-aem-edge-compute

# wiki page
https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=WEM&title=AEM+Edge+Compute+Documentation 

---

aio plugins:install @adobe/aio-cli-plugin-cloudmanager
aio plugins:install @adobe/aio-cli-plugin-aem-rde
aio plugins:update
aio login

---
# on context error issue:
aio config set --json -l "ims.contexts.mycontext" "{ cli.bare-output: false }"
aio auth ctx -s mycontext
aio login --no-open
---

 aio config:set cloudmanager_orgid <org-id>
 aio config:set cloudmanager_programid <program-id>
 aio config:set cloudmanager_environmentid <env-id>


aio aem:rde:setup

