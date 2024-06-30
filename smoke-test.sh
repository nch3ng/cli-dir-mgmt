#! /bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
# Running the program
cat commands.input | npm run start | tail -n +5 > actual.output

DIFF=$(diff --strip-trailing-cr expect.output actual.output)

if [ "$DIFF" != "" ] 
then
    echo "${RED}Failed${NC}"
    echo $DIFF
    exit 1
else
    echo "${GREEN}Passed${NC}"
    exit 0
fi