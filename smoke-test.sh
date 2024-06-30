#! /usr/bin/env bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color
# Running the program

TEST_CASES=("main" "case1" "case2")

FAIL=0
for testcase in "${TEST_CASES[@]}"; do
    echo "Processing test case: $testcase"
    cat ./test-cases/inputs/${testcase}.input | npm run start -- --no-prompt | tail -n +5 > ./test-cases/outputs/${testcase}.actual.output

    DIFF=$(diff --strip-trailing-cr test-cases/outputs/${testcase}.expect.output test-cases/outputs/${testcase}.actual.output)

    if [ "$DIFF" != "" ] 
    then
        echo -e "${RED}Failed${NC}"
        echo -e $DIFF
        FAIL=1
    else
        echo -e "${GREEN}Passed${NC}"
    fi
done

if [ $FAIL -eq 1 ]
then
    exit 1
fi
exit 0