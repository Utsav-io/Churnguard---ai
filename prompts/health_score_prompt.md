# Gemini health-scoring prompt

Used in the n8n **Google Gemini > Message a model** node. The `{{ ... }}` parts are n8n expressions that insert each account's values.

```
You are a SaaS Customer Success analyst. Score this account's health from 0 to 100.

Scoring guide:
- Below 50 = churn risk (falling logins, low feature use, no teammate invites, many support tickets, low CSAT)
- 50 to 85 = healthy and stable
- Above 85 = expansion ready (seats nearly full, high and rising logins, broad feature use)

Account data:
Company: {{ $json.company }}
Plan: {{ $json.plan }}
Seats used: {{ $json.seats_used }} of {{ $json.seat_limit }}
Logins last 7 days: {{ $json.logins_last_7d }} (previous 7 days: {{ $json.logins_prev_7d }})
Features used in last 30 days: {{ $json.features_used_30d }}
Days since last teammate invite: {{ $json.days_since_teammate_invite }}
Support tickets in last 30 days: {{ $json.support_tickets_30d }}
Last CSAT (1-5): {{ $json.csat_last_ticket }}

Respond ONLY with valid JSON, no extra text, in exactly this format:
{"score": 0, "risk_summary": "2 sentences", "retention_playbook": "3 short bullet actions for the CS team", "upsell_angle": "1 sentence pitch angle, or empty string if not expansion ready"}
```

## Design notes

- The scoring bands match the Switch node thresholds (below 50, above 85).
- A fixed JSON format lets the Parse AI node read the reply reliably.
- `upsell_angle` is empty for accounts that are not expansion-ready.
