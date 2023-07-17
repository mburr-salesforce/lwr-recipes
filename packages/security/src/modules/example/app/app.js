import { LightningElement } from 'lwc';

export default class SecurityApp extends LightningElement {
    data;

    connectedCallback() {
        var req = new XMLHttpRequest();
        req.open('HEAD', document.location, false);
        req.send(null);
        const headers = this.parseHttpHeaders(req.getAllResponseHeaders());
        this.data = headers;
    }

    parseHttpHeaders(httpHeaders) {
        return httpHeaders
            .split('\n')
            .map((x) => x.split(/: (.*)/s))
            .map((x) => ({ name: x[0], value: x[1] }));
    }
}
