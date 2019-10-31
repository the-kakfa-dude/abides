#!/usr/bin/env bash
#
# Takes a copy of this repo, and let's you pick a new name for it.
#
# Changes all the files in place.
#
# If it screws up, or you don't like the name, start over from a fresh copy,
#

CURRENT_PROJECT="ts_sonar"

MY_PROJECT="$1"
if [[ "x" == "x${MY_PROJECT}" ]]
 then
  echo "Pass me the new project name."
  exit 1
fi

for file in $(grep -R "$CURRENT_PROJECT" . | sort | awk -F':' '{print $1}' | egrep -v '/build/|/node_modules/|/coverage/' | uniq);
 do
  echo $file
  cat $file | sed "s|${CURRENT_PROJECT}|${MY_PROJECT}|g" > ${file}.fixed
done

for file in $(find . -type f | grep fixed$)
 do
  NEW_NAME=${file}
  OLD_NAME=$(echo $file | sed 's/.fixed$//g')
  rm -f $OLD_NAME
  mv $NEW_NAME $OLD_NAME
done

# find all the scripts that lost their executable bit, and set it again.
find . -type f | grep sh$ | xargs chmod +x

