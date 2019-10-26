#!/usr/bin/env bash
#
# Takes a copy of this repo, and let's you pick a new name for it.
#
# Changes all the files and directories in place.
#i
# If it screws up, or you don't like the name, start over from a fresh copy,
#

# these will get rewritten by this script,
# so if running this script crashes,
# you will want to checkout a fresh copy.
#
CURRENT_PROJECT="java_sonar"
CURRENT_PACKAGE="com.kakfa"

# parse command line args
#
NEW_PROJECT="$1"
if [[ "x" == "x${NEW_PROJECT}" ]]
 then
  echo "Pass me the new project name. The current project is: ${CURRENT_PROJECT}"
  exit 1
fi
#
NEW_PACKAGE="$2"
if [[ "x" == "x${NEW_PACKAGE}" ]]
 then
  echo "Pass me the new package name. The current package is: ${CURRENT_PACKAGE}"
  exit 1
fi


# Takes a term that has dots in it (like a java package),
# and escapes those dots, so as to make sed and egrep happy.
#
function to_package_regex() {

  local term="$1"
  echo "$term" | sed 's|\.|\\.|g'
}


# Takes a term that has dots in it (like a java package),
# and turns the dots into forward slashes, for manipulating
# the directory paths associated with those dotted tokens.
#
function to_directory_regex() {

  local term="$1"
  echo "$term" | sed 's|\.|/|g'
}


# Finds the files that contain the token you want to replace,
# (like the current project name, or a java package name),
# assumes you're on a mac where you can't "sed -i", and so
# for each of those matching files, cat's it into a temp file
# that replacing each occurence of the first presented name
# with the second presented name.
#
# NOTE: You must escape the tokens on your own (to make sed and
#       and egrep happy) before you pass them to this function.
#
# NOTE: Executable files will lose their executable bit,
#       so you'll have to chmod the new files accordingly.
#
function change_names() {

  local replace_me="$1"
  local replace_with="$2"

  for file in $(egrep -R "${replace_me}" . | sort | awk -F':' '{print $1}' | egrep -v 'Binary|\.gradle/|/build/|/bin/' | uniq)
   do 
    echo $file
    cat $file | sed "s|${replace_me}|${replace_with}|g" > ${file}.fixed
  done

  for file in $(find . -type f | grep fixed$)
   do
    NEW_NAME=${file}
    OLD_NAME=$(echo $file | sed 's/.fixed$//g')
    rm -f $OLD_NAME
    mv $NEW_NAME $OLD_NAME
  done
}


if [[ "$CURRENT_PROJECT" != "$NEW_PROJECT" ]]
 then

  # replace the project name
  #
  change_names "$CURRENT_PROJECT" "$NEW_PROJECT"
fi

if [[ "$CURRENT_PACKAGE" != "$NEW_PACKAGE" ]]
 then
  # changing the package names requires escaping the dot characters.
  #
  CP_REGEX=$(to_package_regex "$CURRENT_PACKAGE")
  NP_REGEX=$(to_package_regex "$NEW_PACKAGE")
  change_names "$CP_REGEX" "$NP_REGEX"

  # move the code fromm the old package to the new one.
  #
  # the easiest way to do this is to just create the two
  # new directories (one in main, one in test) and rsync
  # the code from the old location to the new location.
  #
  CURRENT_DIR=$(to_directory_regex "$CURRENT_PACKAGE")
  NEW_DIR=$(to_directory_regex "$NEW_PACKAGE")

  mkdir -p ./src/main/java/${NEW_DIR}
  mkdir -p ./src/test/java/${NEW_DIR}

  # be naive and assume all we need to move is the contents
  # of the final package.
  rsync -avPr ./src/main/java/${CURRENT_DIR}/* ./src/main/java/${NEW_DIR}/
  rsync -avPr ./src/test/java/${CURRENT_DIR}/* ./src/test/java/${NEW_DIR}/

  # if the target dir is different than the source dir,
  # and not a sub-dir, then we should remove the source dir.
  #
  # if it is a sub-dir, we need to remove the files from the parent,
  # but leave the directories alone, since one of those directories
  # contains the newly packaged code.
  #
  if [[ $NEW_DIR != $CURRENT_DIR ]]
   then
    if [[ $NEW_DIR == $CURRENT_DIR* ]]
     then
      # it's a subdir. remove the files from the parent, but not the directories
      #
      rm -f ./src/main/java/${CURRENT_DIR}/* ./src/test/java/${CURRENT_DIR}/*
     else
      # it's just a regular old dir. remove it.
      #
      rm -rf ./src/main/java/${CURRENT_DIR} ./src/test/java/${CURRENT_DIR}
     fi
   fi
fi

# find all the scripts that lost their executable bit,
# and set it again.
#
find . -type f | grep sh$ | xargs chmod +x

# the local .gradle folder will contain aritfacts with the old name.
# clean house.
#
rm -rf .gradle ./build ./bin

cd ..
mv $CURRENT_PROJECT $NEW_PROJECT

echo
echo
echo "Your current directory was renamed."
echo
echo "Run this:"
echo
echo "  cd ../${NEW_PROJECT}"
echo
echo
