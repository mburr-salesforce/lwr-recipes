# Introduction to Lightning Web Runtime (LWR)

Lightning Web Runtime (LWR) is a flexible platform that supports a wide range of different web applications. Its features are composable and pluggable. LWR at its simplest is a non-opinionated way to configure and load the modules, services, and dependency providers to meet your use case.

LWR describes any configurable aspects of the application in a well-defined, portable format. Because of this flexible deployment model, you can deploy on a variety of runtime environments, depending on your use case. For example, LWR works in a local NodeJS runtime, as a stand-alone instance in Heroku, or as a Java runtime deployed and configured for an opinionated platform.

## Server Runtime

The LWR server runtime provides a framework of APIs and services which serve all the modules needed by your app definition. The server also contains view providers for compiling and serving your static templates.

The LWR server is configured in `lwr.config.json`, at the root of your project.

## Client Runtime

The client runtime provides all the resources you need to host a compiled app in the execution environment, typically a browser. The client runtime includes routing APIs for managing navigation and loader APIs for managing any special code that runs as modules are loaded into your app.
