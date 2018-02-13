# Developer documentation for the Security CLI
Reading this first will help a lot: https://github.com/akamai/cli

# Setup
To get started you need {OPEN} credentials. Please get one from by following the instructions here: https://developer.akamai.com/introduction/Luna_Setup.html and place them in a file named `.edgerc` in your home directory. This file may contain many {OPEN} credentials for different apps like property manager, media delivery etc. Each of these credentials in the file should have a section id of the form `[<section>]`. The section name for this app is `appsec`. For example, the credential file should look like:
```
[papi]
client_secret = ......
host = akaa-........luna-dev.akamaiapis.net
access_token = akaa-......
client_token = akaa-.......

[appsec]
client_secret = ......
host = akaa-........luna-dev.akamaiapis.net
access_token = akaa-......
client_token = akaa-.......
```

Then install nodejs and download all dependencies for this project by issuing the command below:
`npm update`

# Developer Test
`npm test`

# Logging
`export LOG_LEVEL=debug`

# Running
`./bin/akamai-appsec`

# Mocking the server
If for some reason the {OPEN} APIs are not accessible/available, there is a way to easily switch to mocks. Set the environment variable `MOCK_AKA_SEC_API` to `true` and place the mock jsons in the 'mock' directory. For example, if you need to mock the API `/appsec-configuration/v1/configs/1234/versions`, create the directory `mock/configs/1234` and place a file named `versions.json` in it. The json has the following format:
`
{
    "responseToChoose": 0,
    "responses":[{
        "httpStatus":200,
        "response": [
            {
                "configId": 1234
            }
        ]
    }, {
        "httpStatus":403,
        "response": {
            "status": 403,
            "title":"Unauthorized",
            "detail":"You are not authorized to do this!"
        }
    }]
}
`

Now the API will return the contents of that json based on the attribute `responseToChoose`. This variable determines which response is chosen from the array `responses`. Any `httpStatus` other than 2xx and 3xx will be considered an error from the server.
