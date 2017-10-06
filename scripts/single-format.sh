#!/usr/bin/env bash

set -e

# IMPORTANT: If you change the script, please check it with ShellCheck: http://www.shellcheck.net/

FILE=$1

echo "# format '${FILE}' ###########################################"

function ts {
"$(npm bin)/prettier" \
  --single-quote \
  --no-bracket-spacing \
  --parser typescript \
  --write \
  "$FILE"
}

function js {
"$(npm bin)/prettier" \
  --single-quote \
  --no-bracket-spacing \
  --write \
  "$FILE"
}

if [[ "$1" == *ts ]]
then
  ts
fi

if [[ "$1" == *tsx ]]
then
  ts
fi

if [[ "$1" == *js ]]
then
  js
fi

if [[ "$1" == *json ]]
then
  js
fi

