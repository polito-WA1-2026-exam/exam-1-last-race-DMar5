# Exam #1: "Last Race"
## Student: s362842 LISI DIANA 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server
- POST `/api/sessions`
- GET `/api/sessions/current`
- DELETE `/api/sessions/current`

- GET `/api/network`
  - No request parameters and no request body content
  - Response body content: list of lines

- GET `/api/stations`
- GET `/api/segments`
- GET `/api/events`
- POST `/api/score/me`
- GET `/api/scores/me`


## Database Tables

- Table `Users` - contains 3 registered users:
  1) Vittoria Corbello, age 34, vittoriacorbello@example.com
  2) Francesco Massini, age 23, francescomassini@example.com
  3) Giuseppe Passiflora, age 54, giuseppepassiflora@example.com
- Table `Scores` - contains a list of scores of previews matches for the 3 registered users
- Table `Lines` - contains 5 underground lines:
  - Linea Rubino
  - Linea Zaffiro
  - Linea Smeraldo
  - Linea Eliodoro
  - Linea Ametista
- Table `Stations` - contains 21 stations
- Table `Segments` - contains 22 segments, with its endpoint stations and the line they belong to
- Table `Events` - contains 9 different events, with gains going from -4 to +4, their titles and descriptions

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

1) Victo10, Vittoria123!
2) Franci11, Francesco123!
3) Beppe12, Giuseppe123!

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
