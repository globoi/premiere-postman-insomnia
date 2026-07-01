# GraphQL Request Examples

This file contains annotated examples of GraphQL request patterns used in the Premiere geql collection.

## Example 1: GraphQL Query with Variables

**Use case**: Fetching team statistics for a specific championship

**File**: `postman/collections/geql/premiereTeamChampionshipStats.request.yaml`

```yaml
$kind: graphql-request
url: "{{geql_url}}/graphql"
query: >-
  query premiereTeamChampionshipStats($teamId: Int!, $championshipEditionId:
  Int!, $format: String!="60x60"){
    premiereTeamChampionshipStats(
      filter: {teamId: $teamId, championshipEditionId: $championshipEditionId}
    ) {
      team {
        name
        popularName
        badge(format: $format)
        colors {
          primary
          secondary
          tertiary
        }
        organization {
          kind
          foundedAt
          age
        }
      }
      championshipEdition {
        name
        currentPhase {
          dateStart
        }
        championship {
          id
          name
        }
      }
      segmentedStats {
        sectionName
        stats {
          name
          key
          value
        }
      }
      summary(limit: 2) {
        name
        key
        value
      }
    }
  }
variables: |-
  {
    "teamId": 2192,
    "championshipEditionId": 7002
  }
order: 4000
```

**Key points:**
- `$kind: graphql-request` identifies this as a GraphQL request
- URL typically points to `/graphql` endpoint
- `query: >-` uses YAML multiline folded scalar for long queries
- Query variables defined with type annotations (`$teamId: Int!`)
- Default values supported (`$format: String!="60x60"`)
- `variables: |-` uses YAML literal scalar for JSON variables
- Variables are JSON object with key-value pairs

---

## Example 2: GraphQL Query for Athlete Stats

**Use case**: Fetching player statistics for a specific match

**File**: `postman/collections/geql/query premiereAthleteMatchStats.request.yaml`

```yaml
$kind: graphql-request
name: query premiereAthleteMatchStats
url: "{{geql_url}}/graphql"
query: >-
  query premiereAthleteMatchStats(
    $athleteId: Int!
    $matchId: Int!
  ) {
    premiereAthleteMatchStats(
      filter: {
        athleteId: $athleteId
        matchId: $matchId
      }
    ) {
      athlete {
        id
        name
        position
        photo(format: "220x220")
      }
      match {
        id
        startDate
        homeTeam {
          id
          name
          popularName
        }
        awayTeam {
          id
          name
          popularName
        }
      }
      stats {
        category
        items {
          key
          label
          value
          highlight
        }
      }
      rating {
        value
        scale
      }
    }
  }
variables: |-
  {
    "athleteId": 12345,
    "matchId": 334109
  }
order: 5000
```

**Key points:**
- Multiple variables with type definitions
- Nested query structure for related data
- Photo format can be parameterized
- Clean indentation for readability
- Variables match query parameter names exactly

---

## Example 3: GraphQL Query with Complex Filters

**Use case**: Fetching championship standings

**File**: `postman/collections/geql/query championshipStandingsByMatchIdGetter.request.yaml`

```yaml
$kind: graphql-request
name: query championshipStandingsByMatchIdGetter
url: "{{geql_url}}/graphql"
query: >-
  query championshipStandingsByMatchIdGetter(
    $matchId: Int!
    $highlightTeamIds: [Int!]
  ) {
    championshipStandingsByMatchIdGetter(matchId: $matchId) {
      phase {
        id
        name
        type
      }
      standings(highlightTeamIds: $highlightTeamIds) {
        position
        team {
          id
          name
          popularName
          badge(format: "45x45")
          colors {
            primary
            secondary
            tertiary
          }
        }
        stats {
          points
          played
          won
          drawn
          lost
          goalsFor
          goalsAgainst
          goalDifference
        }
        highlighted
      }
    }
  }
variables: |-
  {
    "matchId": 346416,
    "highlightTeamIds": [282, 283]
  }
order: 6000
```

**Key points:**
- Array type variables (`[Int!]`) for lists
- Optional parameters (no `!` after type)
- Nested object returns with multiple levels
- Array parameters in variables (JSON arrays)

---

## Example 4: GraphQL Query for Match Schedule

**Use case**: Fetching past and future matches for a team

**File**: `postman/collections/geql/query pastAndFutureMatches.request.yaml`

```yaml
$kind: graphql-request
name: query pastAndFutureMatches
url: "{{geql_url}}/graphql"
query: >-
  query pastAndFutureMatches(
    $teamId: Int!
    $championshipEditionId: Int!
    $pastMatchesLimit: Int = 3
    $futureMatchesLimit: Int = 3
  ) {
    pastMatches: teamMatches(
      filter: {
        teamId: $teamId
        championshipEditionId: $championshipEditionId
        status: FINISHED
      }
      sort: {field: START_DATE, direction: DESC}
      limit: $pastMatchesLimit
    ) {
      id
      startDate
      homeTeam {
        id
        name
        popularName
        badge(format: "45x45")
      }
      awayTeam {
        id
        name
        popularName
        badge(format: "45x45")
      }
      homeScore
      awayScore
      status
    }
    futureMatches: teamMatches(
      filter: {
        teamId: $teamId
        championshipEditionId: $championshipEditionId
        status: SCHEDULED
      }
      sort: {field: START_DATE, direction: ASC}
      limit: $futureMatchesLimit
    ) {
      id
      startDate
      homeTeam {
        id
        name
        popularName
        badge(format: "45x45")
      }
      awayTeam {
        id
        name
        popularName
        badge(format: "45x45")
      }
      status
    }
  }
variables: |-
  {
    "teamId": 2192,
    "championshipEditionId": 7002,
    "pastMatchesLimit": 5,
    "futureMatchesLimit": 5
  }
order: 7000
```

**Key points:**
- Query aliases (`pastMatches:`, `futureMatches:`)
- Default values in query definition (`Int = 3`)
- Enum values in filters (`status: FINISHED`, `status: SCHEDULED`)
- Sorting with field and direction
- Limit parameters for pagination
- Variables can override defaults

---

## Example 5: Simple GraphQL Query (No Variables)

**Use case**: Listing available queries or fetching static data

**File**: `postman/collections/Premier hub/geql/ListQueries.request.yaml`

```yaml
$kind: graphql-request
name: ListQueries
url: "{{geql_url}}/graphql"
query: >-
  {
    __schema {
      queryType {
        fields {
          name
          description
          args {
            name
            type {
              name
              kind
            }
          }
        }
      }
    }
  }
order: 1000
```

**Key points:**
- No `query` keyword needed for simple queries
- No variables section needed when query has no parameters
- Introspection queries use `__schema` and `__type`
- Useful for exploring API schema

---

## Template: GraphQL Request

Use this template as a starting point:

```yaml
$kind: graphql-request
name: [descriptive query name]
url: "{{geql_url}}/graphql"
query: >-
  query [QueryName](
    $[variableName]: [Type]!
    $[anotherVariable]: [Type] = [defaultValue]
  ) {
    [queryName](
      filter: {
        [field]: $[variableName]
      }
      limit: $[limitVariable]
      sort: {field: [FIELD_NAME], direction: [ASC|DESC]}
    ) {
      [field1]
      [field2]
      [nestedObject] {
        [nestedField1]
        [nestedField2]
      }
    }
  }
variables: |-
  {
    "[variableName]": [value],
    "[anotherVariable]": [value]
  }
order: [number]
```

## Common Patterns Summary

### Variable Types
- Scalar types: `Int`, `String`, `Float`, `Boolean`, `ID`
- Non-null: Add `!` after type (`Int!`)
- Arrays: Use brackets (`[Int!]`)
- Optional: Omit `!` (`String` instead of `String!`)
- Defaults: Use `=` (`Int = 10`)

### Query Structure
1. Define query with name and variables
2. Use variables in filter/arguments (prefix with `$`)
3. Select fields to return
4. Nest objects for related data
5. Use fragments for reusable field sets (if needed)

### URL Patterns
- Standard: `{{geql_url}}/graphql`
- Proxied: `{{base_url_geql_proxy}}/graphql`
- Always use environment variables for base URLs

### Authentication
- GraphQL requests inherit collection-level bearer auth
- Token automatically included in Authorization header
- No need to specify auth unless overriding

### Best Practices
- Name queries descriptively matching the operation
- Use proper indentation for readability
- Define variables with appropriate types
- Include only needed fields in response
- Use aliases when making multiple similar queries
- Add default values for optional pagination parameters

### Variables JSON
- Must be valid JSON
- Keys match query variable names (without `$`)
- Values match expected types
- Arrays for list types: `"highlightTeamIds": [1, 2, 3]`
- Null values allowed for optional parameters: `"filter": null`
