# Debug Checklist: DevSessionCreate → "Missing expected key(s)" Preview Failure

**Issue**: Thank-You survey extension failing during preview creation with DevSessionCreate mutation errors.

---

## Quickest Fix Path (Do in Order)

### ✅ 1. Update Shopify CLI + App Packages
**Issue**: Mismatched CLI/@shopify/app versions cause DevSessionCreate errors
- [x] Run: `npm i -g @shopify/cli`
- [x] Run: `npm i -D @shopify/app@latest`
- [x] Clear artifacts: `rm -rf node_modules .cache .turbo`
- [x] Reinstall: `npm i`
- [x] **Status**: [x] Complete / [ ] Failed

### ⚠️ 2. Start Dev Without Auto-Updating URLs
**Issue**: Partner App URLs fighting with CLI-managed URLs
- [x] Run: `shopify app dev --verbose` (--no-update-urls flag doesn't exist in this CLI version)
- [x] Check if preview loads successfully - **DevSessionCreate mutation found but still fails**
- [x] **Status**: [x] Partial Success / [ ] Failed

### ⏳ 3. Manually Set App URL & Redirects (Partner Dashboard)
**For Remix apps**, set these in **Partners → Your App → App setup**:
- [ ] **App URL**: `https://<tunnel>.trycloudflare.com`
- [ ] **Allowed redirection URL(s)**: Include both:
  - [ ] `https://<tunnel>.trycloudflare.com/auth/callback`
  - [ ] `https://<tunnel>.trycloudflare.com/auth*` (splat route fallback)
- [ ] **Status**: [ ] Complete / [ ] Failed

### ⚠️ 4. Pin Extension TOML to Current Schema
**Verify your `extensions/thank-you-survey/shopify.extension.toml`**:
- [x] Contains: `type = "checkout_ui_extension"`
- [x] Contains: `api_version = "2025-07"`
- [x] Contains: `extension_points = ["purchase.thank-you.render"]` (corrected format)
- [x] Contains: `network_access = true`
- [x] **Status**: [x] Schema Fixed / [x] Target Still Invalid - Need Valid Target

### ⏳ 5. Clear CLI Auth (If Needed)
- [ ] Run: `shopify logout`
- [ ] Run: `shopify login --store <your-dev-store.myshopify.com>`
- [ ] Re-run step 2
- [ ] **Status**: [ ] Complete / [ ] Failed

---

## Clean Room Reset (If Quick Path Fails)

### ⏳ 6. Nuke Caches & Reinstall Everything
- [ ] Run: `rm -rf node_modules .cache .turbo ~/.config/shopify ~/.shopify`
- [ ] Run: `npm i -g @shopify/cli`
- [ ] Run: `npm i`
- [ ] **Status**: [ ] Complete / [ ] Failed

### ⏳ 7. Regenerate Extension Draft
- [ ] Run: `shopify app info`
- [ ] Run: `shopify app dev --no-update-urls --verbose`
- [ ] Watch for: `mutation DevSessionCreate($appId: String!, $assetsUrl: String!) { ... }`
- [ ] **Status**: [ ] Complete / [ ] Failed

### ⏳ 8. Try Different Dev Store
**If preview state is corrupted**:
- [ ] Create fresh dev store
- [ ] Link it with `--store` flag or at prompt
- [ ] **Status**: [ ] Complete / [ ] Failed

---

## Current Configuration Check

### App Configuration
- [ ] **shopify.app.toml** - Check for any schema issues
- [ ] **Package versions** - Current versions installed
- [ ] **Extension build** - Build artifacts present and valid

### Extension Configuration
- [ ] **Target**: `purchase.thank-you-page.render` ✓
- [ ] **Capabilities**: `network_access = true` ✓
- [ ] **API Version**: `2025-07` ✓
- [ ] **Type**: `checkout_ui_extension` ✓

---

## Thank-You Survey Specifics

- ✅ **Target**: Using `purchase.thank-you-page.render` (correct for Thank-You page)
- ✅ **Capabilities**: `network_access = true` (required for API calls)
- ✅ **PCD**: Only needed if reading customer data from `buyerIdentity`
- ✅ **Store Plan**: Thank-You targets work on non-Plus stores

---

## Error Logs & Notes

### Step 1 Results:
```
✅ Shopify CLI: Updated to 3.85.5
✅ @shopify/app: Installed (deprecated, now bundled with CLI)
✅ Dependencies: Cleared and reinstalled successfully
⚠️  Note: @shopify/app is deprecated as of CLI 3.59.0, now bundled with @shopify/cli
```

### Step 2 Results:
```
✅ Dev server started successfully
✅ Cloudflare tunnel created: https://strengthen-trained-arm-investors.trycloudflare.com
✅ DevSessionCreate mutation executed successfully
❌ Still getting "Missing expected key(s)" error at the end
⚠️  --no-update-urls flag doesn't exist in CLI 3.85.5
```

### Step 3 Results:
```
[Paste Partner Dashboard settings here]
```

### Step 4 Results:
```
✅ TOML Schema Fixed:
  - Added api_version = "2025-07"
  - Fixed extension_points format (array of strings)
  - Added network_access = true
✅ Extension Building Successfully!
✅ DevSessionCreate mutation executing
✅ CORRECT TARGET FOUND: "purchase.thank-you.block.render"
✅ CORRECT TOML STRUCTURE: Used [[extensions.targeting]] format
✅ DEV SERVER RUNNING SUCCESSFULLY!
✅ Access scopes auto-granted: read_orders, write_orders
✅ URL: https://shopify.dev/apps/default-app-home
```

### Any Error Messages:
```
[Paste error messages here]
```

---

## Final Sanity Checklist

- [ ] `@shopify/cli` **and** `@shopify/app` updated to latest; reinstall deps
- [ ] Run `shopify app dev --no-update-urls --verbose`
- [ ] Partners → App setup: App URL set to tunnel; Redirects include `/auth/callback` and `/auth*`
- [ ] Extension TOML: `type="checkout_ui_extension"`, `api_version` present, target = `purchase.thank-you-page.render`, `network_access=true`
- [ ] If still failing: `shopify logout` → login again; or try **fresh dev store**

---

## Known Issues Context

- **CLI Preview Flakiness**: Recent `DevSessionCreate` mutation issues resolved by CLI updates
- **Schema Drift**: "Unexpected/missing keys" validation errors between CLI versions
- **Validation Wrapper**: "Missing expected key(s)" covers multiple upstream error types, not just TOML

---

**Last Updated**: [Date]
**Current Step**: [Step being worked on]
**Overall Status**: [ ] In Progress / [ ] Complete / [ ] Blocked
