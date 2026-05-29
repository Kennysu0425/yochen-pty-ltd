**Created:** 2026-05-29
**Goal:** Migrate yochen.com.au DNS authority from VentraIP to a Yochen-dedicated
Cloudflare account, so we can use Cloudflare Email Routing + Cloudflare front
for Vercel deploys (mirroring Joy Truepath's setup).

This is a runbook, not a handoff. Follow top-to-bottom on the day you do it.
Most steps are reversible — Phase 0 covers the only step that can lock you out.

---

## Phase 0 — Pre-flight (5 min, do this first)

### 0.1 Confirm DNSSEC is OFF at the registrar

If DNSSEC is enabled at VentraIP and you change nameservers to Cloudflare,
`.au` will keep validating against the old DS record and the domain becomes
unreachable until you either revert NS or rotate DS at the registrar. This
is the single most common .au migration footgun.

- Log in: https://vip.ventraip.com.au/
- My Services → yochen.com.au → look for "DNSSEC" tab/option
- Status should be **Disabled** / **Off** / **Not configured**
- If it's **on**, disable it FIRST. Wait at least 24h before changing NS
  (the old DS needs to leave .au's cache). DNSSEC TTL at `.au` is ~24h.

For a domain you just registered on 2026-05-22, DNSSEC is almost certainly
off by default. Confirm anyway.

### 0.2 Make sure Cloudflare side is ready (before touching VentraIP)

You need the two Cloudflare nameservers Cloudflare assigns to yochen.com.au
BEFORE you change anything at VentraIP. So do Cloudflare setup first:

1. Log in to the existing Cloudflare account managed under
   `kennysu.tw@gmail.com` — the same account that already hosts
   `joytruepath.com`. Yochen shares this account by deliberate choice:
   each Cloudflare zone is independent (separate NS, DNS records, Email
   Routing), so co-tenancy does not cause cross-domain leakage. If we
   ever need strict billing/access isolation we can move the zone to a
   dedicated account later (Cloudflare supports zone transfer between
   accounts).
2. After login → Add a Site → enter `yochen.com.au` → choose **Free** plan.
3. Cloudflare scans existing DNS and proposes a record set. It'll be mostly
   empty (yochen.com.au is a fresh registration). Accept the empty/default
   set — we'll add records in Phase 4.
4. Cloudflare shows the screen "Change your nameservers". **Copy both
   nameserver values** — they look like `xxx.ns.cloudflare.com` and
   `yyy.ns.cloudflare.com`. The exact pair is unique per account.
5. Leave the Cloudflare tab open. Do NOT click "Done, check nameservers"
   yet — we click that after VentraIP is updated.

---

## Phase 1 — VentraIP nameserver change (5 min)

This is the destructive-feeling step but it's fully reversible: changing
NS back to VentraIP defaults restores the old setup (with the same TTL
wait).

1. Log in: https://vip.ventraip.com.au/
2. My Services (domains) → click **yochen.com.au**
3. Look in the left-side menu for **Nameservers** (sometimes labelled
   "Manage Nameservers" or under a "Domain" subsection).
4. Current state: usually `ns1.ventraip.com.au`, `ns2.ventraip.com.au`,
   `ns3.ventraip.com.au` (VentraIP defaults).
5. Select **Use custom nameservers** (or equivalent toggle).
6. Replace all rows with the two Cloudflare values from Phase 0.2.
   - Leave row 3 and 4 empty (Cloudflare only needs 2 NS).
7. **Save**.

VentraIP submits the NS change to auDA. auDA's queue is usually fast
(seconds to minutes); resolvers then catch up via TTL (could be 5-60 min).

### What happens to VentraIP's "DNS Management" panel?

It becomes irrelevant. VentraIP keeps the records (A, MX, TXT etc.) in
its own DNS, but no one queries VentraIP DNS anymore — all queries route
to Cloudflare via the new NS pointers. Don't bother cleaning the VentraIP
DNS panel. It's harmless and you don't want to touch it during migration.

---

## Phase 2 — Wait + verify propagation (15-60 min)

Run from local shell:

```bash
# Should return Cloudflare NS values, not VentraIP
dig yochen.com.au NS +short

# Compare against a public resolver to confirm not just local cache
dig @1.1.1.1 yochen.com.au NS +short
dig @8.8.8.8 yochen.com.au NS +short
```

When both return the Cloudflare NS values, propagation is done.

Cloudflare dashboard will also flip the domain status from "Pending
nameserver update" to **Active** — you'll get an email from Cloudflare.
At that point click "Check nameservers" in the Cloudflare tab if you
left it open, otherwise it auto-detects.

If still showing VentraIP NS after 1 hour: re-check the VentraIP save
went through. After 24h with no change: contact VentraIP support.

---

## Phase 3 — Cloudflare Email Routing (3 min, after Phase 2)

Goal: `contact@yochen.com.au` forwards to a working personal/work mailbox.

1. Cloudflare dashboard → yochen.com.au → **Email** (left nav) → Email
   Routing.
2. Click **Get Started** → Cloudflare proposes MX + TXT records → accept.
   (These get added to the new Cloudflare DNS zone automatically.)
3. Under **Routes**, add a custom address:
   - Address: `contact`
   - Destination: your real mailbox (e.g., `kennysu@kdanmobile.com` or
     your personal gmail)
4. Cloudflare emails the destination address a verification link. Click
   it.
5. Test: from any other email, send to `contact@yochen.com.au`. Should
   land in destination mailbox within a minute.

Catch-all (optional): you can also enable `*@yochen.com.au` → same
destination, so any future `support@`, `hello@` etc. also routes. Free.

---

## Phase 4 — Vercel custom domain DNS records (done at the end, after
Vercel project exists)

Vercel will tell you which records to add. For a typical Next.js project:

- `yochen.com.au` (apex) → A record to `76.76.21.21` (Vercel's anycast)
  OR ALIAS/ANAME to `cname.vercel-dns.com` if Cloudflare supports it
- `www.yochen.com.au` → CNAME to `cname.vercel-dns.com`

In Cloudflare DNS panel:

1. yochen.com.au → DNS → Records → Add record
2. **Important: Proxy status**. Cloudflare offers "Proxied" (orange cloud)
   or "DNS only" (grey cloud). For Vercel custom domains, use **DNS only**
   (grey cloud) — proxied breaks Vercel's automatic TLS provisioning.
3. Apply the records Vercel specifies.

Verify:

```bash
dig yochen.com.au +short        # should resolve to Vercel anycast IP
curl -I https://yochen.com.au   # should return 200 from Vercel
```

---

## Rollback (if anything goes wrong before Phase 4)

If at any point you want to revert to VentraIP DNS:

1. VentraIP → yochen.com.au → Nameservers → switch back to **Use VentraIP
   default nameservers** (or manually re-enter `ns1.ventraip.com.au`,
   `ns2.ventraip.com.au`, `ns3.ventraip.com.au`).
2. Wait for propagation (same TTL window).
3. The records VentraIP held should still be in its DNS panel and
   resume serving.

The only irrecoverable state is "DNSSEC was on at VentraIP, you changed
NS without disabling DS first, the domain went dark for 24h". Phase 0.1
exists to prevent this.

---

## Notes

- **Cloudflare Free tier is fine** for everything in this runbook. No
  paid features required.
- **Cloudflare Email Routing is free**, no MX cost.
- **TTL during migration**: NS records at .au have a typical 24h TTL but
  most resolvers refresh much faster. Plan for "up to 1 hour" in normal
  conditions, "up to 24h" worst case.
- **The Joy Truepath setup uses this exact pattern** — see
  `joytruepath.com` for a working precedent (Cloudflare-fronted, Vercel
  backend, Email Routing for `support@`).
- **VentraIP keeps the registrar role** — only the DNS authority moves
  to Cloudflare. You still renew, transfer, and manage WHOIS at VentraIP.
