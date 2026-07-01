# Mock Response Examples

This file contains annotated examples of mock response patterns used in the Premiere Postman collections.

## What Are Mock Examples?

Mock examples are sample responses stored alongside request definitions. They serve two purposes:
1. **Documentation**: Show what a successful response looks like
2. **Mock Server**: Can be served by the local mock server for testing

Mock examples are stored in:
```
postman/collections/[Collection]/.resources/[request-name].resources/examples/[name].example.yaml
```

---

## Example 1: Complete Mock Response with Rich Data

**Use case**: Live championship matches with full team and broadcast details

**File**: `postman/collections/Premier hub/championships-lives/.resources/-.resources/examples/-.example.yaml`

```yaml
$kind: http-example
name: /
request:
  url: "{{base_url}}/v1/championships/lives/"
  method: GET
  headers:
    Client-ID: PREMIERE
response:
  statusCode: 200
  statusText: OK
  headers:
    content-type: application/json; charset=utf-8
    date: Sun, 03 May 2026 00:15:09 GMT
    transfer-encoding: chunked
  body:
    type: json
    content: |-
      {
        "status": "success",
        "data": [
          {
            "championship_id": 26,
            "championship_name": "Campeonato Brasileiro",
            "championship_nickname": "",
            "matches": [
              {
                "match_id": 346416,
                "home_score": 0,
                "away_score": 1,
                "home_team": {
                  "team_id": 283,
                  "name": "Cruzeiro Esporte Clube",
                  "popular_name": "Cruzeiro",
                  "nickname": "Raposa",
                  "slug": "cruzeiro",
                  "sigla": "CRU",
                  "shield": {
                    "small": "https://s.sde.globo.com/media/organizations/2021/02/13/30_cruzeiro-2021.png",
                    "medium": "https://s.sde.globo.com/media/organizations/2021/02/13/45_cruzeiro-2021.png",
                    "large": "https://s.sde.globo.com/media/organizations/2021/02/13/65_cruzeiro-2021.png",
                    "svg": "https://s.sde.globo.com/media/organizations/2021/02/13/cruzeiro_2021.svg"
                  },
                  "colors": {
                    "primary": "#005cb0",
                    "secondary": "#ffffff",
                    "tertiary": "#000000"
                  }
                },
                "away_team": {
                  "team_id": 282,
                  "name": "Clube Atlético Mineiro",
                  "popular_name": "Atlético-MG",
                  "nickname": "Galo",
                  "slug": "atletico-mg",
                  "sigla": "CAM",
                  "shield": {
                    "small": "https://s.sde.globo.com/media/organizations/2017/11/23/Atletico-Mineiro-escudo30px.png",
                    "medium": "https://s.sde.globo.com/media/organizations/2017/11/23/Atletico-Mineiro-escudo45px.png",
                    "large": "https://s.sde.globo.com/media/organizations/2017/11/23/Atletico-Mineiro-escudo65px.png",
                    "svg": "https://s.sde.globo.com/media/organizations/2018/03/10/atletico-mg.svg"
                  },
                  "colors": {
                    "primary": "#000000",
                    "secondary": "#ffffff",
                    "tertiary": "#000000"
                  }
                },
                "start_date": "2026-05-02",
                "start_hour": "21:00:00",
                "status": "Não disponivel",
                "timer_status": "INICIADO",
                "transmission_status": "EM_ANDAMENTO",
                "transmission_time": "01'1T",
                "period": "PRIMEIRO_TEMPO",
                "current_time": "01:10",
                "wo": false,
                "canceled": false,
                "suspended": false,
                "decisive": false,
                "revenue": 0,
                "broadcasts": [
                  {
                    "transmissionId": 1516,
                    "mediaId": "6942216",
                    "urlSnapshot": "https://live-thumbs.video.globo.com/pfc3/snapshot",
                    "name": "Premiere 3",
                    "channelId": "936",
                    "slug": "premiere-3",
                    "partner": {
                      "name": "Premiere",
                      "slug": "premiere",
                      "logo": {
                        "png": "https://s3.glbimg.com/v1/AUTH_36abb2af534644878388f516c38b89ac/prod/partner_logo/Premiere.png",
                        "svg": "https://s3.glbimg.com/v1/AUTH_36abb2af534644878388f516c38b89ac/prod/partner_logo/Premiere.svg"
                      },
                      "colors": {
                        "primary": "#2E903C",
                        "secondary": "#FFFFFF",
                        "tertiary": "#FFFFFF"
                      }
                    },
                    "authorizationExternalIds": [
                      {
                        "id": "",
                        "aeid": "premiere-fc",
                        "type": "media-rights"
                      }
                    ]
                  }
                ]
              }
            ],
            "especial_transmissions": []
          }
        ]
      }
order: 1777767319304
```

**Key points:**
- `$kind: http-example` identifies this as a mock example
- `name` field gives the example a label
- `request` section mirrors the actual request (method, URL, headers)
- `response` section contains the mock data
- `statusCode` and `statusText` define HTTP response
- Response headers should include `content-type`
- `body.type: json` with `content: |-` for JSON responses
- Response data should be realistic and complete
- Include realistic dates, IDs, and nested structures
- Arrays should have at least one complete example item

---

## Example 2: Simple Success Response

**Use case**: Basic API success response

```yaml
$kind: http-example
name: success
request:
  url: "{{base_url}}/v1/health"
  method: GET
response:
  statusCode: 200
  statusText: OK
  headers:
    content-type: application/json; charset=utf-8
  body:
    type: json
    content: |-
      {
        "status": "ok",
        "timestamp": "2026-05-03T12:34:56Z",
        "version": "1.0.0"
      }
order: 1000
```

**Key points:**
- Minimal structure for simple responses
- Include timestamps in ISO 8601 format
- Status field common pattern

---

## Example 3: Error Response (4xx)

**Use case**: Client error responses

```yaml
$kind: http-example
name: not found
request:
  url: "{{base_url}}/v1/matches/999999"
  method: GET
response:
  statusCode: 404
  statusText: Not Found
  headers:
    content-type: application/json; charset=utf-8
  body:
    type: json
    content: |-
      {
        "status": "error",
        "error": {
          "code": "MATCH_NOT_FOUND",
          "message": "Match with ID 999999 not found",
          "details": {
            "matchId": 999999
          }
        }
      }
order: 2000
```

**Key points:**
- Use appropriate 4xx status codes
- Error responses should have clear structure
- Include error codes and messages
- Provide helpful details for debugging

---

## Example 4: Authentication Token Response

**Use case**: OAuth or token generation endpoints

```yaml
$kind: http-example
name: token success
request:
  url: "{{base_url}}/v1/token"
  method: POST
  body:
    client_id: PREMIERE
    client_secret: secret123
response:
  statusCode: 200
  statusText: OK
  headers:
    content-type: application/json; charset=utf-8
  body:
    type: json
    content: |-
      {
        "status": "success",
        "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQUkVNSUVSRSIsImlhdCI6MTY4MzA3MjAwMCwiZXhwIjoxNjgzMDc1NjAwfQ.dGVzdF90b2tlbl9zaWduYXR1cmU",
          "expires_in": 3600,
          "token_type": "Bearer"
        }
      }
order: 3000
```

**Key points:**
- Include realistic JWT tokens (even if fake)
- Provide expiration time
- Token type field useful for clients

---

## Example 5: Array Response (List Endpoint)

**Use case**: Endpoints returning lists of items

```yaml
$kind: http-example
name: championships list
request:
  url: "{{base_url}}/v1/championships"
  method: GET
response:
  statusCode: 200
  statusText: OK
  headers:
    content-type: application/json; charset=utf-8
  body:
    type: json
    content: |-
      {
        "status": "success",
        "data": [
          {
            "id": 26,
            "name": "Campeonato Brasileiro",
            "nickname": "Brasileirão",
            "active": true,
            "year": 2026,
            "current_round": 15
          },
          {
            "id": 27,
            "name": "Copa do Brasil",
            "nickname": "Copa do Brasil",
            "active": true,
            "year": 2026,
            "current_round": 8
          },
          {
            "id": 28,
            "name": "Campeonato Paulista",
            "nickname": "Paulistão",
            "active": false,
            "year": 2026,
            "current_round": 12
          }
        ],
        "meta": {
          "total": 3,
          "page": 1,
          "per_page": 10
        }
      }
order: 4000
```

**Key points:**
- Include multiple items in arrays (2-3 examples)
- Add pagination metadata when relevant
- Each item should be complete

---

## Example 6: POST/PUT Success Response

**Use case**: Resource creation or update

```yaml
$kind: http-example
name: create championship
request:
  url: "{{BACKSTAGE_BASE_URL}}/premiere-championships"
  method: POST
  body:
    type: json
    content: |
      {
        "championshipId": 29,
        "championshipName": "Copa Libertadores",
        "active": true
      }
response:
  statusCode: 201
  statusText: Created
  headers:
    content-type: application/json; charset=utf-8
    location: /premiere-championships/29
  body:
    type: json
    content: |-
      {
        "status": "success",
        "data": {
          "id": 29,
          "championshipId": 29,
          "championshipName": "Copa Libertadores",
          "active": true,
          "createdAt": "2026-05-03T12:34:56Z",
          "updatedAt": "2026-05-03T12:34:56Z"
        }
      }
order: 5000
```

**Key points:**
- Use 201 Created for successful POST
- Include Location header for created resources
- Return the created resource with server-generated fields
- Include timestamps

---

## Example 7: Empty/No Content Response

**Use case**: DELETE or operations with no response body

```yaml
$kind: http-example
name: delete success
request:
  url: "{{BACKSTAGE_BASE_URL}}/premiere-mocks/mock-123"
  method: DELETE
response:
  statusCode: 204
  statusText: No Content
  headers: {}
order: 6000
```

**Key points:**
- 204 No Content for successful DELETE
- No body needed
- Empty headers object

---

## Template: Mock Example

Use this template as a starting point:

```yaml
$kind: http-example
name: [descriptive name]
request:
  url: [full URL with variables]
  method: [GET|POST|PUT|DELETE]
  headers:
    [Header-Name]: [value]
  body:
    type: [json|urlencoded]
    content: |
      [request body if POST/PUT]
response:
  statusCode: [200|201|204|400|404|500]
  statusText: [OK|Created|No Content|Bad Request|Not Found|Internal Server Error]
  headers:
    content-type: [application/json; charset=utf-8]
    [additional-headers]: [values]
  body:
    type: [json|text]
    content: |-
      [response body as JSON or text]
order: [number]
```

## Creating Directory Structure

Mock examples must be in specific directories:

```bash
# For request file: postman/collections/Premier hub/health.request.yaml
# Mock goes in:
postman/collections/Premier hub/.resources/health.resources/examples/

# Directory structure:
mkdir -p "postman/collections/[Collection]/.resources/[request-name].resources/examples/"

# Then create: [example-name].example.yaml
```

## Using Mocks in Mock Server

Reference mock examples in `postman/mocks/mock-1.js`:

```javascript
// In the request handler
if (method === "GET" && pathname === "/v1/health") {
  return pm.mock.sendExample(
    "Premier hub/.resources/health.resources/examples/success.example.yaml",
    res
  );
}
```

## Best Practices

### Response Data
- Use realistic, complete data structures
- Include all required fields
- Use proper data types (numbers as numbers, not strings)
- Dates in ISO 8601 format: `"2026-05-03T12:34:56Z"`
- Arrays should have 2-3 example items

### Status Codes
- 200 OK: Successful GET, PUT, PATCH
- 201 Created: Successful POST creating resource
- 204 No Content: Successful DELETE
- 400 Bad Request: Validation error
- 401 Unauthorized: Auth required
- 403 Forbidden: Auth insufficient
- 404 Not Found: Resource doesn't exist
- 500 Internal Server Error: Server error

### Headers
Always include:
- `content-type: application/json; charset=utf-8` for JSON
- `date` header with realistic date
- `location` header for 201 Created responses

### Naming
- Use descriptive names: `success`, `not found`, `validation error`
- Multiple examples per request: `match-live.example.yaml`, `match-finished.example.yaml`
- Keep names lowercase with hyphens

### Response Structure
Common pattern for Premiere APIs:
```json
{
  "status": "success" | "error",
  "data": { ... },
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```
