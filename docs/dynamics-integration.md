# integrating with dataverse, dynamics and entra (for demo while running locally)

This is a spike set up to show we can integrate from a locally running microservice.  I believe we'll take a similar approach when running in (e.g.) CDP.

## 1. create an .envrc file + install direnv

```
export ENTRA_CLIENT_ID="xxx"      # id to authenticate our app to the api & for SSO
export ENTRA_CLIENT_SECRET="xxx"  # secret to authenticate our app to the api & for SSO
export ENTRA_OAUTH_URL="xxx"      # endpoint to make oauth requests to
export DATAVERSE_API_DOMAIN="xxx" # endpoint to make api requests to dataverse - dynamics' backing database
export DYNAMICS_APP_ID="xxx"      # the application id for dynamics, allowing us to deep-link into dynamics app
export DYNAMICS_DOMAIN="xxx"      # the domain dynamics is running on, allowing us to deep-link into dynamics app
```

running `direnv allow .` in the directory once we've populated these values will give you the variables necessary to run.

## Create a Power Platform environment with Dynamics Customer Service apps

If you don't have one already..

1. create a Microsoft Entra account in the tenant you'll be creating your environment in
  - format will be {username}@{tentantName}.onmicrosoft.com
2. make sure the account has the Dynamics Customer Service Enterprise license
3. sign in to [power platform admin environments page](https://admin.powerplatform.microsoft.com/environments)^gG
4. create an environment (either trial or sandbox) with dataverse enabled
![](images/Pasted%20image%2020240229132134.png)
  - use settings as below, and automatically deploy `Customer Service`
![](images/Pasted%20image%2020240229132232.png)
5. once the environment is ready, there should be an environment URL - this is the domain specific to your env
	- set DYNAMICS_DOMAIN in your .envrc to the environment URL.
	- set DATAVERSE_API_DOMAIN to the same url, but with `.api` after the environment name - e.g. `org01a454c7.api.crm11.dynamics.com`
![](images/Pasted%20image%2020240229132353.png)
6. visit the environment URL, click on the app name at the top & you'll see the list of apps relevant to you.
7. on launch your Customer Service Hub & note the appid in the URL:
	* set DYNAMICS_APP_ID in your .envrc to the appid
![](images/Pasted%20image%2020240229132448.png)


## Registering the application

Before we can make API requests *or* use SSO

1. go to [entra](https://entra.microsoft.com/#home) -> Applications -> App Registrations
2. Create a '+ new registration', setting:
	- Name: marine-licensing-frontend-demo
	- Supported Account types: "Accounts in this organisational directory only"
3. navigate to that new application
	* set ENTRA_CLIENT_ID in your .envrc the Application (client) ID
![](images/Pasted%20image%2020240229143343.png)

### Registering client secret

1. from [entra](https://entra.microsoft.com/#home) , navigate to Applications -> App Registrations -> marine-licensing-frontend-demo -> Certificates & Secrets
![[Pasted image 20240229143412.png]]
2. create a new client secret (NB - this will expire + need recreating)
	- set ENTRA_CLIENT_SECRET in your .envrc the client secret
3. go to "endpoints"
	- set ENTRA_OAUTH_URL to the OAuth 2.0 token endpoint **minus** oauth2/v2.0/token as ENTRA_OAUTH_URL (so https://login.microsoftonline.com/c081730e-7a1f-4fee-843e-0601d3dca70f/ in this case)

### Allow application to access dataverse tables

First, we create a security role that has the right permissions:

1. go to the [power platform admin centre](https://admin.powerplatform.microsoft.com/home) -> Environments -> your new environment
2. Settings -> Security roles
	![](Pasted%20image%2020240229145013.png)
3. edit roles
4. add ''Create, Read, Append, Append to" permissions on the Case and Contact tables 
5. save

Then, we give our app that role:
1.  Settings -> Application users
2. new app user ->  add an app & choose the app you defined above in EntraId
3. edit security roles for new user, adding the security group created in the previous step

## Enable SSO with OpenId Connect

1. from [entra](https://entra.microsoft.com/#home) , navigate to Applications -> App Registrations -> marine-licensing-frontend-demo -> Authentication
![](images/Pasted%20image%2020240229165401.png)
- add platform (Web)
- specify http://localhost:3000/marine-licensing-frontend-demo/auth/callback as the redirect uri
- save