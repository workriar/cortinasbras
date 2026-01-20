---
description: Trigger deployment via curl
---

## Workflow: Trigger Deployment

This workflow automates the deployment trigger by sending an HTTP request to the configured deployment endpoint.

### Steps

1. **Set the deployment URL**
   - Replace `<URL>` with your actual deployment endpoint, or set an environment variable `DEPLOY_URL` with the URL.

2. **Execute the curl command**
   ```bash
   curl -X POST "http://31.97.247.205:3000/api/deploy/e92f59e147a5ea18038547a3e9499c8c8d3bc6f0b2879b9a"
   ```
   - The command triggers the deployment immediately.

3. **Verify the response**
   - Ensure the response status is `200` or the expected success code.

---

*Add this file to `.agent/workflows/` and run the workflow using your automation system.*
