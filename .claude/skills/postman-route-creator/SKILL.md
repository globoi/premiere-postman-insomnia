---
name: postman-route-creator
description: Create Postman API routes in YAML format following Premiere project patterns. Use this skill when the user wants to add a new API endpoint, create request files, add mock responses, or update Postman collections. Trigger whenever the user mentions creating routes, adding endpoints, new API requests, Postman files, or mock responses for the Premiere project.
---

# Postman Route Creator

Create properly formatted Postman request files, GraphQL queries, mock response examples, and collection definitions for the Premiere API testing project.

## When to Use This Skill

Use this skill whenever the user wants to:
- Create a new API endpoint request file
- Add GraphQL queries to the geql collection
- Generate mock response examples for existing routes
- Update or create collection definition files with authentication
- Add routes to any of the Premiere service collections (Premier hub, BackStage, SDE, Soccer, Jarvis, webmedia, Transmission, EPG)

## Understanding the Structure

The Postman collections are organized as:
```
postman/collections/
├── [CollectionName]/          # e.g., "Premier hub", "BackStage", "SDE"
│   ├── .resources/
│   │   └── definition.yaml    # Collection-level config (auth, variables)
│   ├── [subfolder]/           # Optional organization (e.g., "championships-lives")
│   │   └── route.request.yaml
│   └── route.request.yaml     # Individual API requests
```

### File Types

1. **Request files** (`.request.yaml`): Define API endpoints with method, URL, headers, body
2. **Example files** (`.example.yaml`): Mock responses stored in `.resources/[name].resources/examples/`
3. **Definition files** (`definition.yaml`): Collection-level authentication and variables

## Creating Routes

### Step 1: Determine the Collection

Ask the user which collection the route belongs to if not explicitly stated:
- **Premier hub**: Main Premiere platform APIs (health, championships, matches, videos)
- **BackStage**: Admin/management APIs (authentication, premiere-championships, tr-transmissao, mocks, feature flags)
- **SDE**: Sports Data Engine (statistics, teams, athletes, matches, scout data)
- **geql**: GraphQL queries
- **Jarvis**: Live streaming data
- **webmedia**: Video/media content
- **Transmission**: Broadcast data
- **EPG**: Electronic Program Guide
- **Soccer**: Soccer-related APIs

### Step 2: Choose the Appropriate Pattern

Based on the request type, read the relevant reference file for examples:

- **HTTP requests** (GET, POST, PUT, DELETE): Read `references/http-examples.md`
- **GraphQL requests**: Read `references/graphql-examples.md`
- **Mock responses**: Read `references/mock-examples.md`

Each reference file contains annotated examples showing:
- Basic structure and required fields
- How to use environment variables (`{{variable}}`)
- Query parameters and headers patterns
- Body formats (JSON, urlencoded, GraphQL)
- Authentication inheritance from collections
- Post-response scripts for token handling

### Step 3: Gather Requirements

Ask the user for any missing information:
- **Route name**: Descriptive name for the request file
- **HTTP method**: GET, POST, PUT, DELETE, etc.
- **URL/endpoint**: The API path (can use `{{variables}}`)
- **Headers**: Any custom headers needed
- **Query parameters**: URL parameters with keys and values
- **Body** (if POST/PUT): Request payload structure
- **Auth override**: If different from collection default
- **Order** (optional): Numeric order for display (defaults based on existing files)

### Step 4: Create the File

Generate the `.request.yaml` file following these patterns:

**Key principles:**
- Use environment variables for base URLs: `{{base_url}}`, `{{BACKSTAGE_BASE_URL}}`, `{{geql_url}}`, etc.
- Include `$kind` directive at the top (`http-request` or `graphql-request`)
- Authentication typically inherits from collection-level config (no need to specify unless overriding)
- Order field controls display order in Postman UI
- Query params can be disabled with `disabled: true`
- Headers use key-value pairs
- Body types: `json`, `urlencoded`, `graphql`, `raw`

**File location:**
- Direct in collection: `postman/collections/[Collection]/[name].request.yaml`
- In subfolder: `postman/collections/[Collection]/[subfolder]/[name].request.yaml`

### Step 5: Create Mock Examples (if requested)

When creating mock responses:

1. Create the examples directory structure:
   ```
   postman/collections/[Collection]/.resources/[request-name].resources/examples/
   ```

2. Generate `.example.yaml` files with:
   - Request details (method, URL, headers)
   - Response details (statusCode, statusText, headers)
   - Sample response body (realistic JSON data)

3. Reference the YAML path in mock server if needed:
   ```javascript
   if (method === "GET" && pathname === "/your-path") {
     return pm.mock.sendExample("path/to/example.yaml", res);
   }
   ```

## Authentication Patterns

Collections use bearer token authentication inherited from collection definitions:

- **Premier hub**: Uses `{{auth_token}}` (obtained via `/v1/token` endpoint)
- **BackStage**: Uses `{{auth_token_backstage}}` (Globo SSO JWT)
- **SDE**: Uses custom header `token: "{{sde_token}}"`
- **webmedia**: Uses query param `access_token` with hardcoded value
- **geql**: Inherits from base collection

Routes automatically inherit collection-level auth unless you specify `auth: type: noauth` to override.

## Common Patterns

### Environment Variables
- `{{base_url}}` - Premier Hub base URL
- `{{BACKSTAGE_BASE_URL}}` - BackStage API base (https://apis.backstage.globoi.com/api/v2)
- `{{geql_url}}` - GraphQL endpoint
- `{{auth_token}}` - Premier Hub token
- `{{auth_token_backstage}}` - BackStage token
- `{{sde_token}}` - SDE token

### Post-Response Scripts
For token endpoints, add scripts to save tokens:
```yaml
scripts:
  - type: afterResponse
    code: |
      const response = pm.response.json();
      const authToken = response.data.token;
      pm.environment.set("auth_token", authToken);
    language: text/javascript
```

## Workflow Summary

1. Identify the collection and determine if subfolder is needed
2. Read the appropriate reference file for examples
3. Gather route details from the user
4. Create the `.request.yaml` file in the correct location
5. If mock responses requested, create `.example.yaml` files
6. Confirm file paths and show the user what was created

## Tips

- Keep route names descriptive and lowercase with spaces or hyphens
- Use the order field to control visual ordering (multiples of 1000 work well: 4000, 5000, etc.)
- Leverage environment variables for flexibility across dev/prd environments
- Mock examples should have realistic, complete response structures
- Check existing routes in the collection for naming and pattern consistency
