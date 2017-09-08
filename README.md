This app displays list of shelters for Hurricane Harvey evacuees from: https://docs.google.com/spreadsheets/d/14GHRHQ_7cqVrj0B7HCTVE5EbfpNFMbSI9Gi8azQyn-k

Created using React and Leaflet map

Thanks to everyone working to keep this sheet constantly updated


## How to run development

* Clone this repository
* Make sure your node environment is 8.2+ and NPM is 5.3.0
* Navigate to root folder and run ```npm install```
* Choose to copy either `.env.harvey` or `.env.irma` to `.env.local`
* Then run ```npm run start``` or ```yarn start```


## For deploying to heroku

* For each different event you want you configure for, you will need to make a file named `.env.${event-name}`.
* For what environment variables need to be defined, see existing `.env` files and [`./src/config.js`](./src/config.js).
* For your heroku app, you will need to set an `EVENT_NAME` config variable like so:

  ```
  heroku --app ${app-name} config:set EVENT_NAME=${event-name}
  ```

  For example:

  ```
  heroku --app irma-staging config:set EVENT_NAME=irma
  heroku --app irma-shelters config:set EVENT_NAME=irma
  heroku --app harvey-shelters-staging config:set EVENT_NAME=harvey
  ```
* Now, you can deploy by pushing to the heroku remotes as usual.

  For example:

  ```
  git push irma-staging master
  ```

* Once heroku receives your push, it will do the following for you:

  1. Run `npm run heroku-prebuild` and set up your environment variables
  1. Run `npm install`
  1. Run `npm run heroku-postbuild` building the static files for your app
  1. Run `npm run start-static` as referenced in the [`Procfile`](./Procfile) to serve up your built app statically on the `PORT` as defined by the heroku environment.


Learn more about customizing the Heroku deploy process [here](https://devcenter.heroku.com/articles/nodejs-support#heroku-specific-build-steps) and [here](https://devcenter.heroku.com/articles/procfile).
