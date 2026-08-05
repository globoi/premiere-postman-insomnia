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

Example filename convention: `YYYY-MM-DD <description>.example.yaml`

---

## Format Selection by Collection

There are two distinct YAML formats. Choose based on the collection:

| Collection | URL style | Body scalar | Extra fields |
|------------|-----------|-------------|--------------|
| **BackStage** | `{{BACKSTAGE_BASE_URL}}/path` | `content: >-` followed by **single-line** JSON | none |
| **Jarvis** | real `https://` URL | `content: '...'` **single-quoted** JSON | `name:` and `order:` at root |
| **Premier hub** | `{{base_url}}/path` | `content: \|-` multiline JSON | optional `order:` |

**All formats use list-style for both `queryParams` and `headers`:**
```yaml
queryParams:
  - key: param_name
    value: "value"
headers:
  - key: content-type
    value: application/json
```

---

## Example 1: BackStage Format (tr-transmissao match by matchId)

**Use case**: BackStage API response filtered by match ID

**File**: `postman/collections/BackStage/tr-transmissao/.resources/match by matchId.resources/examples/2026-07-30 tr-transmissao ge filter by id_jogo_sde 346289 Vitoria vs Palmeiras.example.yaml`

```yaml
$kind: http-example
request:
  url: "{{BACKSTAGE_BASE_URL}}/tr-transmissao/ge?filter[where][id_jogo_sde]=346289"
  method: GET
  queryParams:
    - key: filter[where][id_jogo_sde]
      value: "346289"
      description: Match ID
response:
  statusCode: 200
  statusText: OK
  headers:
    - key: date
      value: Thu, 30 Jul 2026 01:09:11 GMT
    - key: content-type
      value: application/json; profile="https://apis.backstage.globoi.com/api/v2/item-schemas/tr-transmissao"
    - key: x-served-from
      value: Backstage APIaaS
  body:
    type: json
    content: >-
      {"itemCount": 1, "items": [{"id": "faad6e72-754e-4fd4-b802-679a8cd87995", "id_jogo_sde": "346289", "nome_mandante": "Vitória", "nome_visitante": "Palmeiras", "status_transmissao": "EM_ANDAMENTO"}]}
```

**Key points:**
- URL uses `{{BACKSTAGE_BASE_URL}}` — never put the real `https://apis.backstage.globoi.com/api/v2` directly
- `content: >-` with the JSON **on the same line** — no newlines inside the JSON value (YAML folded block)
- List-style `queryParams` and `headers`
- No `name:` or `order:` fields at root level

---

## Example 2: Jarvis Format (GraphQL)

**Use case**: Jarvis GraphQL broadcasts query

**File**: `postman/collections/Jarvis/.resources/get_lives.resources/examples/2026-07-30 Broadcasts affiliateCode RJ.example.yaml`

```yaml
$kind: http-example
request:
  url: http://jarvis-rpaas-be-gcp-prod.rpaasv2-be.tsuru.gcp.i.globo/graphql?query=query+Broadcasts(...)&variables={"filtersInput":{"affiliateCode":"RJ"}}
  method: GET
  headers:
    - key: x-platform-id
      value: back-end
    - key: x-tenant-id
      value: premiere
  queryParams:
    - key: query
      value: "query+Broadcasts(%24filtersInput...)"
    - key: variables
      value: '{"filtersInput":{"affiliateCode":"RJ"}}'
response:
  statusCode: 200
  statusText: OK
  headers:
    - key: date
      value: Thu, 30 Jul 2026 01:09:10 GMT
    - key: content-type
      value: application/json; charset=utf-8
  body:
    type: json
    content: '{"data":{"broadcasts":[{"mediaId":"6942237","name":"Premiere 8","channelId":"936"}]}}'
name: 2026-07-30 Broadcasts affiliateCode RJ
order: 3724223550256525
```

**Key points:**
- Real `https://` (or `http://`) URL — no env var substitution
- `content: '...'` — **single-quoted** YAML string containing compact (single-line) JSON
- List-style `queryParams` and `headers`
- `name:` and `order:` fields appear at **root level** (after `response:`)
- Large random `order:` value (auto-generated)

---

## Example 3: Premier Hub Format (classic multiline)

**Use case**: Live championship matches with full team and broadcast details

```yaml
$kind: http-example
name: /
request:
  url: "{{base_url}}/v1/championships/lives/"
  method: GET
  headers:
    - key: Client-ID
      value: PREMIERE
response:
  statusCode: 200
  statusText: OK
  headers:
    - key: content-type
      value: application/json; charset=utf-8
    - key: date
      value: Sun, 03 May 2026 00:15:09 GMT
  body:
    type: json
    content: |-
      {
        "status": "success",
        "data": [
          {
            "championship_id": 26,
            "championship_name": "Campeonato Brasileiro",
            "matches": []
          }
        ]
      }
order: 1777767319304
```

**Key points:**
- URL uses `{{base_url}}`
- `content: |-` with **multiline** JSON (proper indentation)
- List-style headers
- `name:` and `order:` at root level

---

## Example 4: BackStage premiere-championships

**Use case**: List of active premiere championships

```yaml
$kind: http-example
request:
  url: "{{BACKSTAGE_BASE_URL}}/premiere-championships/premiere?filter[order]=position&filter[page]=1&filter[perPage]=1000"
  method: GET
  queryParams:
    - key: filter[order]
      value: position
    - key: filter[page]
      value: "1"
    - key: filter[perPage]
      value: "1000"
response:
  statusCode: 200
  statusText: OK
  headers:
    - key: date
      value: Thu, 30 Jul 2026 01:09:12 GMT
    - key: content-type
      value: application/json; charset=utf-8
  body:
    type: json
    content: >-
      {"count": 2, "rows": [{"id": "abc-123", "championshipId": 26, "championshipName": "Campeonato Brasileiro", "position": 1, "isActivated": true}, {"id": "def-456", "championshipId": 27, "championshipName": "Copa do Brasil", "position": 2, "isActivated": true}]}
```

---

## `examples:` Field in Request Files

Before writing an example, check if the `.request.yaml` has an `examples:` field:

```yaml
# If present — examples dir is already declared:
examples: .resources/match by matchId.resources/examples

# If absent — add this line at the end of the request file:
examples: .resources/<request-name>.resources/examples
```

where `<request-name>` = request filename without `.request.yaml`.

---

## Body Format Quick Reference

| Format | YAML syntax | When to use |
|--------|-------------|-------------|
| `>-` folded | `content: >-\n  {...single line...}` | BackStage APIs |
| `'...'` quoted | `content: '{"key":"value"}'` | Jarvis/GraphQL APIs |
| `\|-` literal | `content: \|-\n  {\n    "key": "value"\n  }` | Premier hub |

**Rule**: JSON in `>-` and `'-'` blocks must be a **single line** — no literal newlines in the JSON string.

---

## Creating Directory Structure

Mock examples must be in specific directories:

```bash
# Formula:
# <request_file_dir>/.resources/<request-name>.resources/examples/

# For: BackStage/tr-transmissao/match by matchId.request.yaml
# Examples dir: BackStage/tr-transmissao/.resources/match by matchId.resources/examples/

# For: Jarvis/get_lives.request.yaml
# Examples dir: Jarvis/.resources/get_lives.resources/examples/
```

## Using Mocks in Mock Server

Reference mock examples in `postman/mocks/mock-1.js`:

```javascript
if (method === "GET" && pathname === "/v1/health") {
  return pm.mock.sendExample(
    "Premier hub/.resources/health.resources/examples/success.example.yaml",
    res
  );
}
```

## Best Practices

### Response Data
- Use realistic, complete data structures from actual API responses when available
- Include all required fields
- Dates in ISO 8601 format: `"2026-07-29T21:30:00.000Z"`
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

### Naming
- Filename: `YYYY-MM-DD <short description>.example.yaml`
- Examples: `2026-07-30 tr-transmissao ge filter by id_jogo_sde 346289 Vitoria vs Palmeiras.example.yaml`
- Multiple examples per request are fine for different scenarios

### Common Response Structure for Premiere APIs
```json
{
  "status": "success",
  "data": { "..." : "..." }
}
```
