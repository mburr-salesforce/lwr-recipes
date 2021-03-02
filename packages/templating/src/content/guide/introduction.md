# Introduction

![Salesforce](./rel-salesforce-icon.svg)

## This is a subtitle

Embed a Lightning Web Component:

<example-echo message="intro"></example-echo>

## Another important thing

Look at this code:

```js
function xyz() {
    return 'yay';
}
```

```json
{
    "root": true,
    "selector": {
        "css": "body"
    },
    "elements": [
        {
            "name": "hello-world",
            "selector": {
                "css": "body example-hello-world"
            },
            "public": true,
            "type": "tutorial/helloWorld"
        }
    ]
}
```
