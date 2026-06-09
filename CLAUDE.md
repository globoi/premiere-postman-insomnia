# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Postman collection repository for testing Premiere-related APIs. Premiere is a sports streaming platform (focused on soccer/football) operated by Globo. The repository contains API collections, mock servers, and environment configurations for development and testing.

## Repository Structure

```
postman/
├── collections/          # API collections organized by service
│   ├── Premier hub/     # Main Premiere hub API
│   ├── BackStage/       # Backstage admin/management APIs
│   ├── SDE/             # Sports Data Engine (statistics, matches, teams)
│   ├── Soccer/          # Soccer-related APIs
│   ├── geql/            # GraphQL queries
│   ├── Jarvis/          # Live streaming data
│   ├── webmedia/        # Video/media content APIs
│   ├── Transmission/    # Transmission/broadcast APIs
│   └── EPG/             # Electronic Program Guide
├── environments/        # Environment configurations
│   ├── dev.environment.yaml
│   ├── local.environment.yaml
│   └── prd.environment.yaml
├── globals/             # Global workspace variables
└── mocks/               # Mock server implementations
```

## Working with Collections

### API Collections Structure

Each collection is organized as YAML files:
- `.resources/definition.yaml` - Collection metadata (auth, variables)
- `*.request.yaml` - Individual API request definitions
- `.resources/*.resources/examples/*.example.yaml` - Mock response examples

### Authentication

Collections use bearer token authentication with two main token types:

1. **Premier Hub Token** - Stored in `{{auth_token}}`
   - Obtain via POST to `{{base_url}}/v1/token`
   - Credential: `client_id: "PREMIERE"` with secret

2. **Backstage Token** - Stored in `{{auth_token_backstage}}`
   - Used for Backstage/admin APIs
   - JWT-based authentication via Globo SSO

### Environment Variables

Key variables across environments:
- `base_url` - Main API base URL
- `auth_token` - Premier Hub authentication token
- `BACKSTAGE_BASE_URL` - Backstage API base URL (https://apis.backstage.globoi.com/api/v2)
- `auth_token_backstage` - Backstage authentication token
- `base_url_geql_proxy` - GraphQL proxy endpoint
- `X-Mock-Profile` / `mockId` - Mock server configuration

## Mock Server

### Running the Mock Server

The local mock server is implemented in Node.js and serves mock responses for API testing.

```bash
# Run mock server (from postman/mocks/ directory)
node mock-1.js

# Server runs on port 4500 by default (configurable via PORT env var)
PORT=4500 node mock-1.js
```

### Mock Server Configuration

- Configuration: `postman/mocks/mock-1.json`
- Implementation: `postman/mocks/mock-1.js`
- Auto-restart on changes: enabled
- Logging: verbose mode with body inspection

### Adding Mock Endpoints

To add new mock endpoints, edit `postman/mocks/mock-1.js`:

```javascript
// Example pattern
if (method === "GET" && pathname === "/your-endpoint") {
  return pm.mock.sendExample("path/to/example.yaml", res);
}
```

Mock responses reference example YAML files stored in `.resources/*.resources/examples/` directories within collections.

## Key API Services

### Premier Hub
Main service for Premiere platform functionality:
- Health checks (`/v1/health`, `/v1/health-cached`)
- Token generation (`/v1/token`)
- Championship data and live matches
- Match videos and highlights
- Team statistics
- GraphQL proxy (geql)

### SDE (Sports Data Engine)
Comprehensive sports statistics and match data:
- Championships, teams, and athletes (`/campeonatos`, `/equipes`, `/atleta`)
- Match details and scout data (`/jogo`, `/scout jogo`)
- Player and team statistics (`/estatisticas_atletas`, `/estatisticas_equipe`)
- Tournament phases and rounds (`/fases`, `/rodadas`)

### BackStage
Admin and content management:
- Championship configuration (`premiere-championships`)
- Transmission management (`tr-transmissao`)
- Feature flags
- Mock management
- TV clubs configuration

### GraphQL (geql)
GraphQL queries for structured data access:
- `premiereTeamChampionshipStats` - Team statistics
- `premiereAthleteMatchStats` - Player statistics
- `championshipStandingsByMatchIdGetter` - Standings
- `pastAndFutureMatches` - Match schedules

## Development Workflow

### Testing API Requests

1. Select appropriate environment (dev/local/prd)
2. Obtain authentication token if needed (run Token request)
3. Use collection-level auth (bearer tokens set automatically)
4. Requests use `{{variable}}` syntax for environment values

### Working with Mock Data

1. Create example YAML files in `.resources/` directories
2. Reference examples in mock server (`mock-1.js`)
3. Restart mock server to apply changes (auto-restart enabled)
4. Test against `localhost:4500`

### Common API Patterns

**Health Check:**
```yaml
url: "{{base_url}}/v1/health"
method: GET
```

**Authenticated Request:**
```yaml
url: "{{base_url}}/v1/championships-lives"
method: GET
# Auth token automatically applied from collection-level config
```

**GraphQL Query:**
```yaml
url: "{{base_url_geql_proxy}}/graphql"
method: POST
body:
  type: graphql
  content: |
    query { ... }
```

## API Response Processing

Some requests include post-response scripts (JavaScript) to:
- Extract and store tokens in environment variables
- Process response data
- Set up variables for subsequent requests

Example (from token request):
```javascript
const response = pm.response.json();
const authToken = response.data.token;
pm.environment.set("auth_token", authToken);
```

## Version Control

The repository uses Postman's Git integration:
- `.postman/resources.yaml` maps local collections to Postman Cloud
- Workspace ID: `f05936be-4417-4cb1-8dc3-ed4adf05f0b0`
- Collections sync bidirectionally with Postman Cloud

## Important Notes

- Token expiration: Auth tokens have expiration times - regenerate when needed
- Environment selection: Always verify correct environment is active before testing
- Mock vs Live: Mock server is for local development; switch to dev/prd for integration testing
- Credentials: Authentication secrets are included in environment files - do not commit sensitive changes
