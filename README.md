# Developer documentation for the Security CLI
Reading this first will help a lot: https://github.com/akamai/cli

# Setup
To get started you need {OPEN} credentials. Please get one from by following the instructions here: https://developer.akamai.com/introduction/Luna_Setup.html and place them in a file names `.edgerc` in your home directory. This file may contain many {OPEN} credentials for different apps like property manager, media delivery etc. Each of these credentials in the file should have a section id of the for `[<section>]`. The section name for this app is `appsec`. For example, credential file should look like:
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
