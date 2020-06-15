
# Advent of Code 2016 - Exercises 1, 4 and 10

The solution of each exercise is contained in a single file `index.js` inside corresponding folders. Each file also has the boilerplate code to run and display the formatted output on the terminal.

The third-parties which I've used are below:
   - Mocha - The test framework for javascript
   - Chai - BDD / TDD assertion library for javascript
   - Testcheck - generative property testing library
   - Nyc/Istanbul - test coverage reporting library
   - ESlint - static code analysis and linting tool


## How to install
To get started, we need to first install the node dependencies

```sh
npm install
```
---
## How to run tests
Execute the below commonds to run the test cases
```sh
npm run test
```

Below is the test coverage report for the assignment

File       | % Stmts | % Branch | % Funcs | % Lines |
-----------|---------|----------|---------|---------|
All files  |   86.62 |    84.62 |   94.34 |   86.52 |
 **day1**/index.js      |   88.24 |    86.67 |   94.44 |      88 |
 **day4**/index.js      |   85.37 |    83.33 |      95 |   85.37 |
 **day10**/index.js     |      86 |       84 |   93.33 |      86 |


---

## How to run ESlint
Execute the below command to run the lint using ESlint.

**Output**
```
No issues found!
```

## How to run the code

Navigate to the corresponding directory for each day and run execute `index.js` using Node CLI.

**Day 1:**
```sh
cd ./day1
node index.js
```
**Output:**
```
Part 1: 161 
Part 2: 110
```
**Day 4:**
```sh
cd ./day4
node index.js
```
**Output:**
```
Part 1: 185371 
Part 2: 984
```
**Day 10:**
```sh
cd ./day10
node index.js
```
**Output:**
```
Part 1: 141 
Part 2: 1209 
```
<br/>

**Thank you** :slightly_smiling_face:

---
