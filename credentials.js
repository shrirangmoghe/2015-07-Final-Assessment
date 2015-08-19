var credentials = {

    credentials: {
        // Replace placeholder below by the Consumer Key and Consumer Secret you got from
        // http://developer.autodesk.com/ for the production server
        client_id: process.env.CONSUMERKEY || 'gKZpgJFmQXPjyHB0YUc1UQv1P8pkINBx',
        client_secret: process.env.CONSUMERSECRET || 'oXfWMssc5ECGceg8',
        oauth_id: process.env.OAUTHKEY || '558d1ffa-a437-4b62-8729-88f0d943fe9d', 
        oauth_secret: process.env.OAUTHSECRET || '5b0936d6-a7fe-4633-b6bc-0c0621b5f012',
        grant_type: 'client_credentials'
    },
    password : 'n824KN`~p31=?/z;las09',
    pubnub : {
       subscribe_key: 'sub-c-6def75da-404e-11e5-9f25-02ee2ddab7fe', // always required
       publish_key: 'pub-c-7d98d445-8a56-4c0f-b8f8-19bf18192bc1'    // only required if publishing
    },
    // If you wish to use the Autodesk View & Data API on the staging server, change this url
    BaseUrl: 'https://developer-stg.api.autodesk.com',
    Version: 'v1'
};

credentials.Authentication = credentials.BaseUrl + '/authentication/' + credentials.Version + '/authenticate';

module.exports = credentials;