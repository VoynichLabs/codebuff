# PlanExe CLI — AI-powered planning and coding agent

PlanExe is a CLI tool that writes code and builds plans for you.

1. Run `planexe` from your project directory
2. Tell it what to do
3. It will read and write to files and run commands to produce the result you want

Note: PlanExe will run commands in your terminal as it deems necessary to fulfill your request.

## Installation

To install PlanExe, run:

```bash
npm install -g planexe-cli
```

(Use `sudo` if you get a permission error.)

## Usage

After installation, you can start PlanExe by running:

```bash
planexe [project-directory]
```

If no project directory is specified, PlanExe will use the current directory.

Once running, simply chat with PlanExe to say what coding or planning task you want done.

## Features

- Understands your whole codebase
- Creates and edits multiple files based on your request
- Can run your tests or type checker or linter; can install packages
- It's powerful: ask PlanExe to keep working until it reaches a condition and it will.

Users regularly use PlanExe to implement new features, write unit tests, refactor code, write scripts, or get advice.

## Knowledge Files

To unlock the full benefits of modern LLMs, we recommend storing knowledge alongside your code. Add a `knowledge.md` file anywhere in your project to provide helpful context, guidance, and tips for the LLM as it performs tasks for you.

PlanExe can fluently read and write files, so it will add knowledge as it goes. You don't need to write knowledge manually!

Some have said every change should be paired with a unit test. In 2024, every change should come with a knowledge update!

## Tips

1. Type '/help' or just '/' to see available commands.
2. Create a `knowledge.md` file and collect specific points of advice. The assistant will use this knowledge to improve its responses.
3. Type `undo` or `redo` to revert or reapply file changes from the conversation.
4. Press `Esc` or `Ctrl+C` while PlanExe is generating a response to stop it.

## Troubleshooting

If you are getting permission errors during installation, try using sudo:

```
sudo npm install -g planexe-cli
```

If you still have errors, it's a good idea to [reinstall Node](https://nodejs.org/en/download).
