#!/usr/bin/env bash

# make sure we're using the current virtual environment
#
2>&1 deactivate | grep -v 'deactivate: command not found'
. ./venv/bin/activate

# drop the tables generated by the functional tests
#
# add new tables here:
#
FUNKY_TABLES="cars bikes"
for table in $(echo "$FUNKY_TABLES"); do echo "dropping table $table"; ./psql-user.sh -c "drop table $table"; echo; done

# run the func tests
#
pytest functional_tests
