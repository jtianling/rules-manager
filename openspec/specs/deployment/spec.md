## Requirements

### Requirement: Single-file deployment conflict handling

When deploying rules to a single-file target (e.g., AGENTS.md, GEMINI.md, goosehints), the deployer SHALL check if the target file already exists. If it does, the deployer MUST NOT overwrite the file and SHALL print a warning message telling the user to handle the conflict manually.

#### Scenario: Target file already exists
- **WHEN** deploying rules to a single-file tool target and the target file already exists in the project directory
- **THEN** the deployer skips the file, prints a warning indicating the file already exists and the user should handle it manually, and does not modify the existing file

#### Scenario: Target file does not exist
- **WHEN** deploying rules to a single-file tool target and the target file does not exist
- **THEN** the deployer creates the file with merged rules content as before
