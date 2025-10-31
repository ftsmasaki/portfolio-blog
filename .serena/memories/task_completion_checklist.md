When finishing a task/phase:
1) Run type-check: `cd app && yarn type-check`
2) Run tests: `cd app && yarn test:run`
3) Lint & fix: `cd app && yarn lint` and `cd app && yarn format`
4) Create change-log in `/change-log/<YYYY-MM-DD>/<HH-MM>_<change>-phaseX.md` (follow workspace rules)
5) Ask user for verification before proceeding to next sub-phase
6) Commit with conventional message (Japanese, per rules) and push