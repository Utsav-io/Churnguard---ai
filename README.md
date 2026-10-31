# ChurnGuard AI

**Automated SaaS retention and expansion engine built with n8n and Google Gemini.**

ChurnGuard AI reads product usage data for each customer account, asks an LLM to score the account's health from 0 to 100, and routes each account to the right team with a ready-made action.

- Score **below 50**: churn risk, sent to Customer Success with a risk summary and a retention playbook.
- Score **50 to 85**: healthy, no action.
- Score **above 85**: expansion-ready, sent to Sales with a suggested pitch angle.

> **Note:** This project runs on a **simulated dataset** of 9 accounts. It demonstrates the pipeline end to end. It does not measure how well the AI score predicts real churn.

## The problem

In SaaS, churn is usually silent. Users stop logging in or skip core features weeks before they cancel. Meanwhile, power users who fill their seat limit are ideal upsell targets, but that signal stays trapped in product analytics tools and never reaches the CRM or chat channels in time.

## How it works

```
Schedule Trigger (9 AM IST) / Manual Trigger
        |
        v
   Mock Data (Code node, 9 simulated accounts)
        |
        v
   Gemini scoring (Message a model)
        |
        v
   Parse AI (Code node: text to fields)
        |
        v
   Switch router
     |-- score < 50  --> Churn Alert  (risk summary + retention playbook)
     |-- score > 85  --> Upsell Alert (seat usage + pitch angle)
     '-- 50 to 85    --> no action
```

## Test result

| Stage | Items |
| --- | --- |
| Accounts loaded | 9 |
| Accounts scored | 9 |
| Churn Risk path | 3 |
| Expansion path | 3 |
| Healthy, no action | 3 |

## Tech stack

- [n8n](https://n8n.io) (self-hosted in Docker)
- Google Gemini API
- JavaScript (n8n Code nodes)
- Docker Desktop

## Repository structure

```
churnguard-ai/
├── README.md
├── LICENSE
├── .gitignore
├── data/
│   └── mock_accounts.json        # the 9 simulated accounts
├── prompts/
│   └── health_score_prompt.md    # the Gemini scoring prompt
├── src/
│   ├── mock_data.js              # code for the Mock Data node
│   └── parse_ai.js               # code for the Parse AI node
├── workflows/
│   └── churnguard-ai.json        # exported n8n workflow
└── docs/
    └── screenshots/              # workflow canvas and output screenshots
```

## Run it yourself

### 1. Start n8n with Docker

```bash
docker run -d --name n8n --restart unless-stopped -p 5678:5678 \
  -e GENERIC_TIMEZONE="Asia/Kolkata" -e TZ="Asia/Kolkata" \
  -v n8n_data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

Open http://localhost:5678 and create the owner account. The `n8n_data` volume keeps your workflows when the container restarts.

### 2. Get a Gemini API key

Create a free key at https://aistudio.google.com/apikey. Keep it private and never commit it.

### 3. Import the workflow

1. In n8n, create a new workflow.
2. Open the menu (three dots), choose **Import from file**, and select `workflows/churnguard-ai.json`.
3. Open the Gemini node, create a new credential and paste your API key.
4. In the **Mock Data** node, replace `YOUR_EMAIL@gmail.com` with your own address.

### 4. Run

Click **Execute workflow**. You should see 9 items scored, 3 on Churn Risk and 3 on Expansion.

**Free-tier tip:** the Gemini free tier allows only a few requests per minute. If you see a rate-limit error, wait a minute and run again, or add retry and batching settings to the Gemini node. Model names also change over time; if a model is reported as retired, pick the one the error message recommends.

## Scoring data fields

| Field | Meaning |
| --- | --- |
| company, contact_name, contact_email | Account identity |
| plan | Starter, Pro or Business |
| seat_limit, seats_used | Licensed seats against seats in use |
| logins_last_7d, logins_prev_7d | Login trend across two weeks |
| features_used_30d | Product adoption breadth |
| days_since_teammate_invite | Days since the last teammate invite |
| support_tickets_30d, csat_last_ticket | Support load and satisfaction (1 to 5) |

## Limitations

- Data is simulated, so scores are not validated against real cancellations.
- Alerts are message fields, not yet delivered to Slack, email or a CRM.
- The schedule runs only while the host machine and Docker are running.
- An LLM score is a judgement based on the numbers it receives, so alerts should be reviewed by a person before acting.

## Roadmap

- [ ] Slack alerts for Customer Success and Sales
- [ ] Check-in email to at-risk contacts (Gmail)
- [ ] HubSpot deal creation for expansion-ready accounts
- [ ] Live usage data from PostHog or Mixpanel
- [ ] Run logging and accuracy tracking against real churn
- [ ] Always-on hosting

## License

MIT. See [LICENSE](LICENSE).

## Author

Utsav Pathak, MBA Marketing student. Built as a portfolio project on SaaS growth and revenue operations automation.
