#!/usr/bin/env bash
#
# rerun-func-tests.sh
#
#  If this fails run it again.
#


# revert all the migrations, assuming you want the old code
#
while [[ $(./node_modules/.bin/typeorm migration:show | grep '[X]') ]]
 do
  npm run migration:revert
  sleep 1s
done

# drop the build and recompile the code,
# assuming you want to put up the new code.
#
gts clean
npm run compile
sleep 1s

# run all the database migrations, using the new code
#
npm run migration:run

# run run the tests
#
npm run functest

