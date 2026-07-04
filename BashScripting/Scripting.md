# Bash Scripting — Complete Notes (Interview + Learning + Projects)

> Everything from your original notes is kept, expanded with deeper explanations, missing-but-commonly-asked topics, interview Q&A, and how this connects to real backend/DevOps work (deployment scripts, Docker, CI/CD — the same stuff you're already doing for CodeArena/PayFlow on your DigitalOcean VPS).

---

## 1. What is Bash?

**Bash = Bourne Again SHell.**

It's a command interpreter — it takes what you type and turns it into instructions the OS can run.

When you type:

```bash
node app.js
```

Here's what actually happens:

```
You
 ↓
Bash        → parses the command ("node" is the program, "app.js" is an argument)
 ↓
Bash        → creates a new process (fork)
 ↓
Bash        → replaces that process with the program (exec) → Linux Kernel schedules it
 ↓
Program     → runs, produces output
 ↓
Bash        → captures exit code, returns control to you
```

So more precisely:
1. **Parse** the command and arguments
2. **fork()** — create a child process
3. **exec()** — load and run the program inside that child process
4. **wait()** — parent (bash) waits, gets the **exit code**, prints output back to your terminal

**Bash vs Shell vs Terminal (common interview confusion):**

| Term | What it actually is |
|---|---|
| Terminal | The window/app you type into (just an I/O interface) |
| Shell | The program that interprets your commands (bash, zsh, sh, fish...) |
| Bash | One specific, very common shell implementation |

**The Shebang line (`#!/bin/bash`)**

Every script should start with this:

```bash
#!/bin/bash
echo "Hello"
```

This tells the OS *which interpreter* to use to run the file, so you can do `./script.sh` directly instead of `bash script.sh`. Without it, the OS doesn't know if this file is a bash script, python script, etc.

---

## 2. Variables

```bash
name="Tridibesh"
echo $name
```

Output:
```
Tridibesh
```

**Rules & gotchas (interview favorites):**
- No spaces around `=` → `name = "x"` is a **syntax error** in bash (spaces make it look like a command with arguments).
- Use `"$name"` (quoted) when the value might contain spaces — prevents word-splitting bugs.
- `${name}` is the same as `$name`, but required when concatenating: `echo "${name}_backup"`.
- Variables are **global by default** inside a script, even inside functions (unless you use `local`).

---

## 3. Command-Line Arguments (very commonly asked, wasn't in your original notes)

When you run `./deploy.sh prod v2`:

| Variable | Meaning |
|---|---|
| `$0` | Script name (`./deploy.sh`) |
| `$1`, `$2`, ... | Positional arguments (`prod`, `v2`) |
| `$#` | Number of arguments passed (`2`) |
| `$@` | All arguments as **separate** words |
| `$*` | All arguments as **one single string** |
| `$$` | PID of the current script |
| `$?` | Exit code of the last command |
| `$!` | PID of the last background process |

Example:
```bash
#!/bin/bash
echo "Script: $0"
echo "Env: $1"
echo "Total args: $#"
```

---

## 4. Taking Input in Bash

```bash
read name
echo $name
```

Output:
```
Enter:
Tridibesh
Tridibesh
```

Useful variations:
```bash
read -p "Enter env: " env      # prompt on same line
read -s -p "Password: " pass   # silent input (for secrets)
```

Very useful for **automation scripts** where a script asks the operator something before proceeding (e.g. "Deploy to production? (y/n)").

---

## 5. Conditional Statements

### `if`

```bash
age=20

if [ $age -gt 18 ]
then
   echo "Adult"
fi
```

**Numeric operators:**

| Operator | Meaning |
|---|---|
| `-eq` | equal |
| `-ne` | not equal |
| `-gt` | greater than |
| `-lt` | less than |
| `-ge` | greater or equal |
| `-le` | less or equal |

**String operators (missing from original notes — comes up a lot in interviews):**

| Operator | Meaning |
|---|---|
| `==` / `=` | strings equal |
| `!=` | strings not equal |
| `-z` | string is empty |
| `-n` | string is NOT empty |

**File test operators:**

```bash
if [ -f app.js ]     # true if file exists
if [ -d node_modules ] # true if directory exists
if [ -x deploy.sh ]  # true if file is executable
```

**If / elif / else:**
```bash
if [ $age -ge 18 ]
then
   echo "Adult"
elif [ $age -ge 13 ]
then
   echo "Teen"
else
   echo "Child"
fi
```

### `case` statement (missing from original — cleaner than long if/elif chains, common in deploy scripts)

```bash
#!/bin/bash
echo "Enter environment: "
read env

case $env in
  dev)
    echo "Starting dev server"
    ;;
  prod)
    echo "Deploying to production"
    ;;
  *)
    echo "Unknown environment"
    ;;
esac
```

### Real DevOps Example (from your notes)

```bash
if [ ! -d node_modules ]
then
   npm install
fi
```
Meaning: **if `node_modules` doesn't exist → install dependencies.** This is exactly the kind of check you'd add at the top of a deploy script so it doesn't waste time reinstalling on every run.

---

## 6. Loops

### For loop

```bash
for i in 1 2 3 4 5
do
   echo $i
done
```
Output: `1 2 3 4 5`

**Real use — restart multiple services:**
```bash
for service in auth payment user
do
   systemctl restart $service
done
```

**C-style for loop (missing — useful for numeric ranges):**
```bash
for (( i=0; i<5; i++ ))
do
   echo $i
done
```

**Looping over files (common in real scripts):**
```bash
for file in *.log
do
   echo "Processing $file"
done
```

### While loop

```bash
count=1
while [ $count -le 5 ]
do
   echo $count
   count=$((count+1))
done
```
Used in **polling systems** — e.g. wait until a database is ready.

### Until loop (missing — the inverse of while, common for "wait until ready" scripts)

```bash
until nc -z localhost 5432
do
  echo "Waiting for Postgres..."
  sleep 2
done
echo "Postgres is up!"
```
This pattern is genuinely used in Docker entrypoint scripts to wait for a DB container before starting the app.

### `break` and `continue` (missing)

```bash
for i in 1 2 3 4 5
do
   if [ $i -eq 3 ]; then continue; fi   # skip 3
   if [ $i -eq 5 ]; then break; fi      # stop at 5
   echo $i
done
```

---

## 7. Arrays (missing from original — asked often in interviews)

```bash
services=("auth" "payment" "user")

echo ${services[0]}       # auth
echo ${services[@]}       # all elements
echo ${#services[@]}      # length = 3

for s in "${services[@]}"
do
   echo "Restarting $s"
done
```

---

## 8. Functions

```bash
deploy() {
   echo "Building..."
   npm run build

   echo "Starting..."
   pm2 restart app
}

deploy
```
Output:
```
Building...
Starting...
```

**Arguments and return values (missing — important nuance):**

Functions take arguments the same way scripts do — via `$1`, `$2`, not by declaring parameters:

```bash
deploy() {
   local env=$1          # 'local' keeps it scoped to the function only
   echo "Deploying to $env"
}

deploy "production"
```

Bash functions can't `return` arbitrary data — `return` only sets an **exit code (0–255)**. To return actual data, `echo` it and capture with `$(...)`:

```bash
get_status() {
   echo "healthy"
}

status=$(get_status)
echo "Status is: $status"
```

---

## 9. Exit Codes (`$?`)

Every command returns an exit code:
- `0` = success
- non-zero = failure (the specific number often tells you *why*)

```bash
npm install
echo $?
```
Output: `0` → success.

Usage:
```bash
if [ $? -eq 0 ]
then
   echo "Success"
else
   echo "Failed"
fi
```

DevOps engineers use this **constantly** to decide whether a pipeline should continue or abort.

**`set -e`, `set -u`, `set -x` (missing — this is what separates a hobby script from a production-grade one)**

```bash
#!/bin/bash
set -e   # exit immediately if any command fails
set -u   # error if an undefined variable is used
set -x   # print every command before running it (debugging)
```
Almost every real deployment/CI script starts with `set -euo pipefail` at the top — this is a strong interview signal that you know production bash, not just tutorial bash.

**`trap` — cleanup on exit (missing, but very real-world)**

```bash
cleanup() {
  echo "Cleaning up temp files..."
  rm -rf /tmp/build_*
}
trap cleanup EXIT
```
This runs `cleanup` no matter *how* the script ends (success, failure, or Ctrl+C). Used for graceful shutdown of workers (relevant to your BullMQ workers running as host processes).

---

## 10. Pipes — MOST IMPORTANT TOPIC

Pipe (`|`) sends the **output of one command as input to the next**.

```bash
cat logs.txt | grep ERROR
```
Meaning: read logs → send output → filter for ERROR.

Output:
```
ERROR Database connection failed
```

**Real production example:**
```bash
pm2 logs | grep ERROR
```
Find errors quickly across running processes — exactly what you'd do while debugging CodeArena's BullMQ worker or LogVerse's API.

**Chaining multiple pipes (common in real usage):**
```bash
cat access.log | grep "500" | awk '{print $1}' | sort | uniq -c | sort -rn
```
Reads as: find all 500 errors → extract IP → sort → count unique IPs → sort by frequency. This kind of one-liner is a classic interview "explain what this does" question.

---

## 11. Redirection

```bash
echo "Hello" > file.txt     # overwrite
echo "World" >> file.txt    # append
```

```bash
npm run build > build.log   # store logs
```

**Missing but important — stderr vs stdout:**

| Symbol | Meaning |
|---|---|
| `1>` or `>` | redirect stdout |
| `2>` | redirect stderr |
| `&>` | redirect both stdout and stderr |
| `2>&1` | send stderr to wherever stdout is going |
| `/dev/null` | the "black hole" — discard output |

```bash
npm run build > build.log 2> error.log     # separate logs
npm run build > build.log 2>&1             # combined into one file
command > /dev/null 2>&1                   # silence everything
```

**Here documents (missing — useful for multi-line input into a command):**
```bash
cat << EOF > config.txt
env=production
port=3000
EOF
```

---

## 12. `grep` — Search Text

```bash
grep ERROR app.log
```
Output: `ERROR DB connection failed`

```bash
grep -i error app.log      # case insensitive
grep -v error app.log      # inverse: lines WITHOUT "error"
grep -r "TODO" .           # recursive search through all files in a folder
grep -n "ERROR" app.log    # show line numbers
grep -c "ERROR" app.log    # count matching lines
grep -E "ERROR|WARN" app.log  # extended regex, multiple patterns
```

Backend engineers use `grep` **daily** — for scanning logs, finding a function definition across a repo, checking if a package is installed, etc.

---

## 13. `find` — Find Files

```bash
find . -name "*.js"
```
Output:
```
./src/app.js
./src/routes/user.js
```

```bash
find . -name "*.log"
find . -type d -name "node_modules"          # find directories
find /logs -name "*.log" -mtime +7 -delete    # delete logs older than 7 days
find . -type f -size +100M                    # find files bigger than 100MB
find . -name "*.js" -exec grep -l "TODO" {} \;  # run a command on each result
```

---

## 14. `awk` — Extract Columns

Log:
```
John 25
Mike 30
```

```bash
awk '{print $1}'
```
Output: `John` / `Mike`

Real:
```bash
docker ps | awk '{print $1}'    # get container IDs
```

**Deeper awk concepts (missing, interview-relevant):**

| Symbol | Meaning |
|---|---|
| `$0` | entire line |
| `$1`, `$2`... | column 1, 2, ... |
| `NR` | current line/row number |
| `NF` | number of fields (columns) in the current line |
| `-F ","` | set the field separator (e.g. for CSV) |

```bash
awk -F "," '{print $2}' data.csv        # print 2nd column of a CSV
awk '{print NR, $0}' app.log            # print line number + full line
awk 'NF > 3 {print $0}' app.log         # print lines with more than 3 fields
```

---

## 15. `sed` — Replace Text

```bash
sed 's/dev/prod/g' config.txt
```
Output: `prod` (replaces all occurrences of "dev" with "prod")

Useful in **CI/CD** to swap environment values in config files before deployment.

**Missing but common:**
```bash
sed -i 's/dev/prod/g' config.txt     # -i edits the file IN PLACE (no output shown)
sed '3d' file.txt                    # delete line 3
sed -n '5,10p' file.txt              # print only lines 5-10
```

---

## 16. Extra text utilities (missing — small but frequently combined with pipes above)

```bash
cut -d ',' -f 2 data.csv     # extract column 2, using ',' as delimiter
sort file.txt                # sort lines alphabetically
sort -n file.txt              # sort numerically
uniq file.txt                 # remove adjacent duplicate lines
sort file.txt | uniq -c       # count occurrences of each unique line
wc -l file.txt                # count lines
wc -l < file.txt               # same, without printing filename
```

---

## 17. Process Management

```bash
ps aux                  # see all running processes
ps aux | grep node       # search for node processes
kill PID                 # terminate a process gracefully (SIGTERM)
kill -9 PID              # force kill (SIGKILL)
```

**Missing but frequently used:**
```bash
top             # live view of CPU/memory usage per process
command &        # run in background
jobs              # list background jobs of current shell
fg %1              # bring job 1 to foreground
nohup node app.js &   # keep process running even after terminal closes
```

Backend debugging starts here — this is exactly how you'd track down a runaway BullMQ worker or a zombie Docker sandbox process.

---

## 18. Permissions

```bash
chmod +x deploy.sh    # make script executable
./deploy.sh
```

**Numeric notation (missing — commonly asked in interviews):**

```bash
chmod 755 deploy.sh
```
Breakdown: `7` = owner (rwx), `5` = group (r-x), `5` = others (r-x)

| Number | Permission |
|---|---|
| 4 | read (r) |
| 2 | write (w) |
| 1 | execute (x) |
| 7 = 4+2+1 | read+write+execute |

```bash
chown user:group file.txt   # change file owner/group
```

---

## 19. Cron Jobs

```bash
crontab -e
```

Run every day at 2 AM:
```bash
0 2 * * * /path/to/backup.sh
```

**Breaking down the 5 fields (missing — always asked):**

```
* * * * *
│ │ │ │ │
│ │ │ │ └── day of week (0-6, Sun=0)
│ │ │ └──── month (1-12)
│ │ └────── day of month (1-31)
│ └──────── hour (0-23)
└────────── minute (0-59)
```

Used for: DB backups, log cleanup, scheduled reports, email jobs.

⚠️ Common pitfall: cron runs with a **minimal environment** (no `PATH` from your `.bashrc`), so scripts that work fine manually can silently fail under cron. Always use full paths (`/usr/bin/node`, not `node`) inside cron scripts.

---

## 20. Real Backend Project Scripts

**Deployment script:**
```bash
#!/bin/bash
set -e

git pull
npm install
npm run build
pm2 restart app
```
Run: `./deploy.sh`

**Database backup:**
```bash
#!/bin/bash
pg_dump mydb > backup_$(date +%F).sql
```
Schedule with cron.

**Log cleanup:**
```bash
find /logs -name "*.log" -mtime +7 -delete
```
Deletes logs older than 7 days.

---

## 21. Bash + Docker

```bash
docker stop $(docker ps -q)      # stop all containers
docker rm $(docker ps -aq)       # remove all containers
docker logs -f container_name | grep ERROR   # tail + filter logs
```

Relevant to what you're already doing with CodeArena's Docker-based sandbox execution — a lot of "clean up all stopped sandbox containers" or "check which sandbox containers are still running" tasks are exactly this kind of one-liner.

---

## 22. Bash + CI/CD

GitHub Actions:
```yaml
- run: npm install
- run: npm test
- run: npm run build
```

Under the hood, this is just:
```bash
npm install
npm test
npm run build
```

**Every CI/CD pipeline is basically executing Bash commands** — this is the single most important mental model to walk into an interview with. GitHub Actions, GitLab CI, Jenkins — they're all just orchestrating shell commands on a machine, with YAML as the scheduling/config layer on top.

---

## 23. Common Interview Questions & Answers

**Q: What's the difference between `sh` and `bash`?**
A: `sh` is the POSIX standard shell spec; `bash` is a specific, feature-rich implementation of a shell (superset of `sh`), adding arrays, `[[ ]]`, string manipulation, etc.

**Q: Difference between `$@` and `$*`?**
A: Both expand to all arguments, but `"$@"` preserves each argument as a separate word (important when arguments have spaces), while `"$*"` merges everything into a single string.

**Q: What does `2>&1` mean?**
A: Redirect file descriptor 2 (stderr) to wherever file descriptor 1 (stdout) currently points. Order matters — `command > log 2>&1` works, `command 2>&1 > log` does not merge them correctly.

**Q: What's the difference between `[ ]` and `[[ ]]`?**
A: `[ ]` is the POSIX test command (works in `sh`); `[[ ]]` is a bash-specific keyword that supports `&&`, `||`, regex matching (`=~`), and doesn't word-split unquoted variables — generally safer and preferred in pure bash scripts.

**Q: How do you debug a bash script?**
A: `bash -x script.sh` or add `set -x` inside the script to print every command as it executes; `set -e` to fail fast; `set -u` to catch undefined variables.

**Q: What happens if you don't quote a variable, e.g. `rm $file`?**
A: If `$file` contains spaces or is empty, this can break in dangerous ways (e.g. `rm` on unexpected paths, or `rm` with no path deleting the wrong thing). Always quote: `rm "$file"`.

**Q: How do you make a script run on every server reboot?**
A: Add it to `crontab -e` with `@reboot /path/script.sh`, or create a systemd service.

**Q: How would you check if the previous command succeeded?**
A: Check `$?` immediately after, or better, use `if command; then ... fi` directly (avoids the extra `$?` step).

**Q: Difference between `kill` and `kill -9`?**
A: `kill` sends `SIGTERM` (15) — a graceful "please shut down" signal a program can catch and clean up after. `kill -9` sends `SIGKILL` — the OS terminates it immediately, no cleanup possible. Always try plain `kill` first.

---

## 24. Best Practices (production-grade bash checklist)

- Start every script with `#!/bin/bash` and `set -euo pipefail`
- Quote your variables: `"$var"` not `$var`
- Use `local` inside functions to avoid polluting global scope
- Prefer `[[ ]]` over `[ ]` in bash-only scripts
- Always check exit codes for critical commands (deploys, migrations)
- Use `trap ... EXIT` for cleanup instead of relying on the happy path
- Log to a file with timestamps for anything running on a schedule (cron jobs run silently — you won't see failures unless you log them)
- Avoid parsing `ls` output — use `find` or globbing instead (classic bash anti-pattern)

---

## 25. Where This Connects to Your Own Projects

- **CodeArena deploy (DigitalOcean + PM2 + Nginx):** your `deploy.sh` is exactly the pattern in section 20 — `git pull && npm install && npm run build && pm2 restart`.
- **BullMQ worker as a host process:** `nohup`, `pm2`, and `trap` (graceful shutdown on SIGTERM) are directly relevant here.
- **Docker sandbox execution:** the `docker stop $(docker ps -q)` / `docker rm $(docker ps -aq)` cleanup patterns are what you'd use to reset sandbox containers between runs.
- **PayFlow/CodeArena log debugging:** `pm2 logs | grep ERROR`, `awk`, and `grep -r` are your day-to-day debugging toolkit on the VPS.

This is a strong area to mention in interviews — you're not just describing bash syntax, you can talk about *why* you used `set -e` in a real deploy script or *how* you clean up Docker containers between sandboxed code runs.