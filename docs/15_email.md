# Email (Transactional)

## Required emails
1) Customer confirmation
- Includes reference number and next steps
2) Business notification
- Includes full enquiry details (PII is ok for internal email)

## Implementation
- Provider-agnostic interface
- In local dev: allow mail sink (console log) with explicit warnings
- In production: must send real emails based on env vars
