# Cloudflare Deployment - API Connection Errors Fix

## 🚨 Root Cause
All API errors (newsletter, career, business, contact forms) are caused by **missing Supabase environment variables** in your Cloudflare Pages deployment.

## ❌ Current Errors
- Newsletter: "Connection error. Please try again later."
- Career: "Error submitting application. Please check the API endpoint or try again later."
- Business: "Connection error: Unexpected end of JSON input"
- Contact: "Failed to send message. Please try again."

---

## ✅ Solution: Configure Environment Variables on Cloudflare Pages

### Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **wiyqajztlthkpbbdmhub**
3. Click **Settings** → **API** (left sidebar)
4. Copy these values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Anon Key** (looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 2: Add Environment Variables to Cloudflare Pages

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Pages** in the left sidebar
3. Select your project (prasunet_website-main or similar)
4. Click **Settings** → **Environment Variables** (or **Deployments** → **Environment** if older UI)
5. Click **Add environment variable**

**Add these two variables:**

| Variable Name | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | From Supabase Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | From Supabase Settings → API → Anon Key (the long string) |

6. Click **Save** and **Deploy**

⚠️ **Important**: The variable names MUST start with `NEXT_PUBLIC_` to be accessible in the browser.

---

## Step 3: Verify Supabase Tables Exist

Ensure all 4 required tables exist in Supabase:

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Run this SQL to check all tables:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('newsletter_subscribers', 'career_applications', 'business_inquiries', 'contacts');
```

**Expected Result**: Should show 4 rows with these table names.

If any table is missing:
- `newsletter_subscribers` → Run `supabase_newsletter.sql`
- `career_applications` → Run `career_table.sql`
- `business_inquiries` → Run `supabase_business_inquiries.sql`
- `contacts` → Run `supabase_contacts.sql`

All SQL files are in the project root directory.

---

## Step 4: Verify RLS Policies (Row Level Security)

Your tables need proper RLS policies. Run this SQL in Supabase:

```sql
-- For newsletter_subscribers table
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON newsletter_subscribers 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated reads" ON newsletter_subscribers 
  FOR SELECT TO authenticated USING (true);

-- For career_applications table
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON career_applications 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated reads" ON career_applications 
  FOR SELECT TO authenticated USING (true);

-- For business_inquiries table
ALTER TABLE business_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON business_inquiries 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated reads" ON business_inquiries 
  FOR SELECT TO authenticated USING (true);

-- For contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON contacts 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated reads" ON contacts 
  FOR SELECT TO authenticated USING (true);
```

---

## Step 5: Redeploy Your Project

After adding environment variables:

1. Go to Cloudflare Pages
2. Click your project
3. Click **Deployments**
4. Click the most recent deployment → **Retry deployment**
   
   OR
   
   Push a new commit to trigger auto-deployment

---

## Step 6: Test Each Form

### Test Newsletter Subscribe
1. Visit your website
2. Scroll to footer
3. Enter a test email
4. Click "Subscribe to Newsletter"
5. ✅ Should see: "✅ Successfully subscribed to our newsletter!"

### Test Career Application
1. Go to `/career` page
2. Click "Apply Now"
3. Fill form and submit
4. ✅ Should see success message

### Test Business Inquiry
1. Go to `/business` page
2. Fill the business inquiry form
3. Submit
4. ✅ Should see success message

### Test Contact Form
1. Go to `/contact` page (or use contact form anywhere)
2. Fill form and submit
3. ✅ Should see: "Message sent successfully"

---

## 🔍 Debugging: How to Check Browser Console for Errors

1. Open your website on Chrome/Firefox
2. Press `F12` (or Right-click → Inspect)
3. Click **Console** tab
4. Try submitting a form again
5. Look for error messages - they'll show what's wrong

### Common Errors & Solutions

| Error | Cause | Solution |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` is undefined | Environment variable not set | Add to Cloudflare Pages Environment Variables |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` is undefined | Environment variable not set | Add to Cloudflare Pages Environment Variables |
| `JSON.parse` error | Response is not valid JSON | Check Supabase table schema |
| `CORS error` | Domain mismatch | Verify Supabase CORS settings (usually not needed) |
| `table "xyz" does not exist` | Database table missing | Run the SQL setup files in Supabase |

---

## 📋 Checklist Before Going Live

- [ ] Supabase credentials copied correctly
- [ ] Environment variables added to Cloudflare Pages
- [ ] All 4 Supabase tables exist
- [ ] RLS policies are enabled on all tables
- [ ] Deployment triggered/redeployed
- [ ] Waited 2-3 minutes for deployment to complete
- [ ] Tested newsletter form - works ✅
- [ ] Tested career form - works ✅
- [ ] Tested business form - works ✅
- [ ] Tested contact form - works ✅
- [ ] Browser console shows no errors

---

## 🚀 If Issue Persists

1. **Clear Cloudflare cache**: 
   - Go to Cloudflare Dashboard → Caching → Purge Everything
   
2. **Hard refresh browser**: 
   - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Check deployment logs**: 
   - Cloudflare Pages → Your project → Deployments → Click recent build → View logs

4. **Test API directly**:
   - Open browser console (F12)
   - Go to **Console** tab
   - Paste and run:
   ```javascript
   const response = await fetch('/api/subscribe', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'test@example.com' })
   });
   const data = await response.json();
   console.log(response.status, data);
   ```
   - Look at the response to see detailed error

---

## 📞 Need Help?

If you see specific error codes:
- **401 Unauthorized**: Anon Key is invalid or wrong
- **404 Not Found**: Table doesn't exist in Supabase
- **500 Internal Server Error**: Check Supabase RLS policies
- **CORS error**: Check that URL doesn't have trailing slash

Check the [Supabase Docs](https://supabase.com/docs) or [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/) for more info.
