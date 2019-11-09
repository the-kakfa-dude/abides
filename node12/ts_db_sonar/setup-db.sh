#!/usr/bin/env bash

# ensure the database, database user, and user password are set
#
./psql-sudo.sh -f init.sql

# compile the code so that we can run the database migration
#
npm run compile

# run the database migration
npm run migration:run

