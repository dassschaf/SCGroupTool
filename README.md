# SCGroupTool

Before working on anything, install Bun and Docker.

## Development
- Start the database as detailed in `docker-compose.yml`
- Generate the necessary database migration for BetterAuth using `bun x auth@latest generate` and apply it manually to the database.
- (One day, more steps here.)
- Run the tool with `bun run dev -- --open`