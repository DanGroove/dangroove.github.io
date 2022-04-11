include .makefile.inc

APP_URL = "http://localhost:3000/dan"

## Starts app in development mode
start:
	npm start

## Launches test runner in the interactive watch mode
test:
	npm test

## Builds the app for production in the `build` folder
build:
	npm run build

## Deploys the app to GitHub Pages
deploy:
	npm run deploy

## Broswer commands

## Opens the local project in Safari
safari:
	open -a safari ${APP_URL}

## Opens the local project in Chrome
chrome:
	open -a Google\ Chrome ${APP_URL}

## Opens the project on GitHub Pages
online:
	open -a Google\ Chrome https://rendelacruz.github.io/dan/

## Other commands

## Removes the single build dependency of the app. Warning: One-way operation
eject:
	npm run eject
