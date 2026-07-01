# HTTP Request Examples

This file contains annotated examples of HTTP request patterns used in the Premiere Postman collections.

## Example 1: Simple GET Request

**Use case**: Basic health check or status endpoint without parameters

**File**: `postman/collections/Premier hub/health.request.yaml`

```yaml
$kind: http-request
url: "{{base_url}}/v1/health"
method: GET
order: 4000
```

**Key points:**
- Minimal structure for simple GET requests
- Uses environment variable `{{base_url}}`
- Authentication inherited from collection definition
- Order field controls display position in Postman

---

## Example 2: GET with Query Parameters

**Use case**: Fetching data with multiple filters and parameters

**File**: `postman/collections/webmedia/get by id.request.yaml`

```yaml
$kind: http-request
name: get by id
url: https://api.video.globoi.com/videos/with_navigation.json?access_token=apisportv1abcd105521a5361b6bab&extended_metadata.genre_ids.all=53346df2dd23814b50000fd4&service_id=151&extended_metadata.season=18&kind=episode
method: GET
queryParams:
  - key: access_token
    value: apisportv1abcd105521a5361b6bab
  - key: id
    value: "14660668"
    disabled: true
  - key: extended_metadata.genre_ids.all
    value: 53346df2dd23814b50000fd4
  - key: service_id
    value: "151"
  - key: extended_metadata.season
    value: "18"
  - key: kind
    value: episode
  - key: sde.nin
    value: "null"
    disabled: true
order: 440185489721936
```

**Key points:**
- Query parameters defined separately in `queryParams` array
- Each param is key-value pair
- Use `disabled: true` to temporarily disable params
- Params in URL should match queryParams definition
- Values are strings, even for numbers

---

## Example 3: GET with Custom Headers

**Use case**: API requiring custom authentication or headers

**File**: `postman/collections/SDE/campeonatos.request.yaml`

```yaml
$kind: http-request
url: https://api.sde.globoi.com/esportes/futebol/modalidades/futebol_de_campo/categorias/profissional/campeonatos
method: GET
headers:
  - key: token
    value: "{{sde_token}}"
order: 13000
```

**Key points:**
- Custom headers use `headers` array
- Header values can use environment variables
- SDE API uses custom `token` header instead of standard Authorization

---

## Example 4: POST with URL-Encoded Body

**Use case**: OAuth token requests, form submissions

**File**: `postman/collections/BackStage/Token.request.yaml`

```yaml
$kind: http-request
url: https://accounts.backstage.globoi.com/token
method: POST
headers:
  - key: Authorization
    value: Basic UUxmdjZEaHE2QnZRZGJxMU1JZHk1QT09OkxUS3U3TUNmNDExZTh1aVFDRHRoQ0E9PQ==
    description: premiere
  - key: Authorization
    value: ""
    disabled: true
body:
  type: urlencoded
  content:
    grant_type: client_credentials
auth:
  type: noauth
scripts:
  - type: afterResponse
    code: |
      const response = pm.response.json();
      const authToken = response.access_token;

      pm.environment.set("auth_token_backstage", authToken);
    language: text/javascript
order: 5000
```

**Key points:**
- POST requests use `body` field with `type` and `content`
- URL-encoded bodies: `type: urlencoded`, content is object with key-value pairs
- `auth: type: noauth` overrides collection-level auth
- Headers can have descriptions for documentation
- Disabled headers remain in file but aren't sent
- Post-response scripts save tokens to environment

---

## Example 5: POST with JSON Body

**Use case**: Creating or updating resources with structured data

```yaml
$kind: http-request
name: create match
url: "{{BACKSTAGE_BASE_URL}}/premiere-championships"
method: POST
headers:
  - key: Content-Type
    value: application/json
body:
  type: json
  content: |
    {
      "championshipId": 26,
      "championshipName": "Campeonato Brasileiro",
      "active": true,
      "phases": [
        {
          "phaseId": 1,
          "rounds": [1, 2, 3]
        }
      ]
    }
order: 6000
```

**Key points:**
- JSON bodies: `type: json`, content is JSON string (use `|` for multiline)
- Content-Type header typically needed for JSON
- Inherits bearer auth from collection (BackStage uses `{{auth_token_backstage}}`)
- Indent JSON properly within the content field

---

## Example 6: PUT Request

**Use case**: Updating existing resources

```yaml
$kind: http-request
name: update championship
url: "{{BACKSTAGE_BASE_URL}}/premiere-championships/26"
method: PUT
body:
  type: json
  content: |
    {
      "active": false,
      "endDate": "2026-12-31"
    }
order: 7000
```

**Key points:**
- PUT follows same pattern as POST
- URL typically includes resource ID
- Only changed fields needed in body (partial update)

---

## Example 7: DELETE Request

**Use case**: Removing resources

```yaml
$kind: http-request
name: delete mock
url: "{{BACKSTAGE_BASE_URL}}/premiere-mocks/mock-123"
method: DELETE
order: 8000
```

**Key points:**
- DELETE requests usually just need URL with resource ID
- No body required
- Returns status code (204 No Content typical for success)

---

## Template: Generic HTTP Request

Use this template as a starting point:

```yaml
$kind: http-request
name: [descriptive name]
url: "{{variable}}/path/to/endpoint"
method: [GET|POST|PUT|DELETE|PATCH]
headers:
  - key: [Header-Name]
    value: [value or {{variable}}]
    description: [optional description]
queryParams:
  - key: [param_name]
    value: [value]
    disabled: [true|false]
body:
  type: [json|urlencoded|raw]
  content: |
    [body content]
auth:
  type: [noauth]  # Only if overriding collection auth
scripts:
  - type: afterResponse
    code: |
      // JavaScript code for post-processing
    language: text/javascript
order: [number]
```

## Common Patterns Summary

### Authentication Inheritance
- Routes automatically use collection-level auth (defined in `.resources/definition.yaml`)
- Only specify `auth: type: noauth` to disable inherited auth
- Bearer tokens: `{{auth_token}}` (Premier hub), `{{auth_token_backstage}}` (BackStage)

### Environment Variables
Always use variables for:
- Base URLs: `{{base_url}}`, `{{BACKSTAGE_BASE_URL}}`, `{{geql_url}}`
- Tokens: `{{auth_token}}`, `{{auth_token_backstage}}`, `{{sde_token}}`
- Dynamic values: `{{mockId}}`, `{{X-Mock-Profile}}`

### Order Values
- Use multiples of 1000 for flexibility: 4000, 5000, 6000
- Lower numbers appear first in Postman UI
- Large numbers (like 440185489721936) are auto-generated

### Headers
- Content-Type usually auto-set by Postman based on body type
- Custom auth headers: use when API doesn't support standard Authorization
- Can disable headers temporarily with `disabled: true`
