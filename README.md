---
## -- HELLO AND THANKS FOR TAKING THE TIME TO REVIEW MY PROJECT! Dan Munro --
---

## -- Objective --

The purpose of this project is to store and index Bitcoin OP_RETURN data for all transactions after a certain block. This data will then be served on an HTTP endpoint as a JSON payload.

- The app should have one endpoint: /opreturn/${opReturnData}

- It should then return the associated transaction hashes and block hashes for all matching transactions​. You can use https://mempool.space/ to check your work.

- Implement in Javascript using Node.js
- You can use ANY 3rd-party npm library
- You must use Postgres as the database
- You can use the Bitcoin mainnet or testnet
- You must use bitcoind
- Your code syncs and indexes new blocks as they get mined

It has a OP_RETURN with hex 636861726c6579206c6f766573206865696469 that decoded leads to this plain text "charley loves heidi".

## NOTE: Changes to rules found on 9/29:

- You must use the Bitcoin signet
- You must use Bitcoin Core

You can take as example this bitcoin signet tx:
https://mempool.space/signet/tx/ffddb3c33035bba09a62813526a8ccef027bdb21ebb8f333cef4e54ce3e88de5

The second output is an OP_RETURN with hex 65786f647573 that decodes to the plain text "exodus".

---

## -- Assumptions --

- The OP_MONITOR job defaults to OFF when starting. This is a configurable value.
- The monitor will check every 60 seconds after caught up indexing. This is a configurable value.
- Admin page - Very Basic with start/pause monitor buttons.
  - This was mainly built for my dev and testing. This would most likely be excluded from release builds but I decided to include it here.
- User must have a Postgres Server available.
- Must have "opreturns" database created. - TODO - script this if I have more time
- I chose to structure my project based on the following link. I am completely open to improving on this though!
  https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md

---

## -- How to Run --

1. git clone https://github.com/ExodusMovementInterviews/Daniel-Munro
2. cd exodus-coding-challenge
3. npm install
4. npm run dbInit
5. Point config file at chosen env:
   port: 38332, // -signet - DEFAULT
   port: 8332, // bitcoind
6. npm node app.js
7. Start Indexer: http://localhost:3000/admin/
8. Admin page has a op_return search input or the direct api is available.

---

## -- How to Test --

- Note: This assumes bitcoind/signet and the db is running. Future improvement would be to mock these up to remove dependency.

1. npm run test
2. Code Coverage:
3. jest --collect-coverage

---

## -- Future Improvements/TODO --

- Improve Code Coverage and quality of tests. Ran out of time to build test suite correctly.
  - I would like to refactor a bit to allow for dependency injection. This would make the api and database testing easier.
- Usually, I would deploy this to a testing environment which often exposes bugs. Hopefully there are none :)
- Testing assumes bitcoind or signet is up and running. Could be mocked.
- There is currently no logging framework.
  - Add a logging framework
  - Configurable Debug level
  - Add debug statements as needed
  - Log Rotation/Retention
  - Log monitoring
- The import of OP_RETURN data is not as fault tolerant as I would like. Currently failed OP_RECORDS are only logged.
- Add a library to sanitize and validate any user input
- The Admin page could be improved in many ways
- Follow Exodus coding standards!

## -- Resources --

- https://github.com/ExodusMovementInterviews/Daniel-Munro
- https://www.npmjs.com/package/pg
- https://www.npmjs.com/package/jest
- https://www.npmjs.com/package/node-json-rpc2
- https://www.npmjs.com/package/lodash-fp
- https://www.npmjs.com/package/json-rpc-2.0
- https://www.npmjs.com/package/bitcoinjs-lib
- https://github.com/goga-m/btc-opreturn
- https://mempool.space/signet
- https://docs.google.com/document/d/1-ATcKf1gTaCKGisl-DsYmmfo9GIWjmrzqCGCgtGrBP0/edit
