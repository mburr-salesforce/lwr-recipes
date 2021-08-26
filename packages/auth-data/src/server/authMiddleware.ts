import https from 'https';
import fetch from 'node-fetch';
import type express from 'express';
const agent = new https.Agent({ rejectUnauthorized: false });

/**
 * Web Server OAuth middleware: https://help.salesforce.com/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm&type=5
 */

// Info needed from a Connected App for Web Server OAuth
interface WebServerInfo {
    myDomain: string; // base URL to the Connected App
    consumerKey: string; // 'Consumer Key' from the Connected App
    consumerSecret: string; // 'Consumer Secret' from the Connected App
    redirectURI: string; // the URL to the app, to use as the OAuth callback
}

const LOGIN_ENDPOINT = '/login';
const OAUTH_ENDPOINT = '/oauth';

export function setupAuthMiddleware(server: express.Application, orgInfo: WebServerInfo): void {
    const { myDomain, consumerKey, consumerSecret, redirectURI } = orgInfo;
    const redirect_uri = encodeURIComponent(redirectURI);

    // First, request an authorization code by redirecting to Salesforce login
    // There is an anchor to this route in the "example/dataChart" component
    server.get(LOGIN_ENDPOINT, (req, res) => {
        const loginUri = `${myDomain}/services/oauth2/authorize?response_type=code`;
        res.redirect(`${loginUri}&client_id=${consumerKey}&redirect_uri=${redirect_uri}`);
    });

    // Second, use the authorization code from the redirect URI to retrieve the token
    // This route is the "Callback URL" in the Connected App OAuth settings
    server.get(OAUTH_ENDPOINT, async (req, res) => {
        const { code } = req.query;
        const response = await fetch(`${myDomain}/services/oauth2/token`, {
            agent, // handle "self signed certificates"
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=authorization_code&code=${code}&client_id=${consumerKey}&client_secret=${consumerSecret}&redirect_uri=${redirect_uri}`,
        });

        // Response handling
        const data = await response.json();
        if (response.ok) {
            // Store the OAuth info in a cookie and redirect to the app
            const { access_token, instance_url } = data;
            res.cookie('lwr_recipe', JSON.stringify({ access_token, instance_url }));
            res.redirect('/');
        } else {
            // Forward the error JSON to the client
            res.status(response.status).send(data);
        }
    });
}
