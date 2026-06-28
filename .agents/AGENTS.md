# Project Rules

- Always review the complete conversation history, Git status logs, and IDE state before prompting the user with terminal or git commands. Ensure that instructions do not contradict the current known local/remote repository state (such as suggesting commits when the branch is already clean, or suggesting rebases when a rebase was already aborted).
