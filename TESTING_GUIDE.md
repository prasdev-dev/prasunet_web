# Quick Test Guide - Cloudflare Deployment

## Before Testing
1. ✅ Add environment variables to Cloudflare Pages (see CLOUDFLARE_DEPLOYMENT_FIX.md)
2. ✅ Redeploy your project
3. ✅ Wait 2-3 minutes for deployment to complete

## Testing Steps

### Test 1: Newsletter Subscribe
1. Open your website (e.g., www.yoursite.com)
2. Scroll to footer
3. Enter test email: `test@example.com`
4. Click "Subscribe to Newsletter"
5. **Expected**: Green success message "✅ Successfully subscribed to our newsletter!"
6. **If error**: Check browser console (F12) for error details

### Test 2: Career Application
1. Go to `/career` page
2. Click "Apply Now" button
3. Fill form with test data:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: +1 (555) 123-4567
   - Job Title: Software Engineer
   - Experience: 3
   - Resume URL: https://example.com/resume.pdf
   - Other fields optional
4. Click Submit
5. **Expected**: Success modal appears
6. **If error**: Check browser console for details

### Test 3: Business Inquiry
1. Go to `/business` page
2. Fill the business inquiry form:
   - First Name: Jane
   - Last Name: Smith
   - Email: jane@company.com
   - Company: Tech Corp
   - Phone: +1 (555) 987-6543
   - Project Type: Web Development
   - Message: I need a custom solution
3. Click Submit
4. **Expected**: Success message appears
5. **If error**: Check browser console

### Test 4: Contact Form
1. Go to `/contact` page (or use contact form if embedded)
2. Fill form:
   - Name: Test User
   - Email: test.user@example.com
   - Phone: +1 (555) 111-2222
   - Message: Test message
3. Click Send
4. **Expected**: "Message sent successfully! We will contact you soon."
5. **If error**: Check browser console

## Debugging if Tests Fail

### Step 1: Open Browser Console
- Press `F12` on Windows/Linux or `Cmd+Option+I` on Mac
- Click **Console** tab
- Look for error messages

### Step 2: Check Error Messages
- **"Supabase credentials not found"**: Environment variables not set in Cloudflare
- **"Table not found"**: SQL setup files not run in Supabase
- **"JSON.parse error"**: Invalid request format (shouldn't happen)
- **"Connection error"**: Supabase connection issue

### Step 3: Verify Each Component
1. **Cloudflare Pages Environment Variables** (should see both):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Supabase Tables** (run in Supabase SQL Editor):
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('newsletter_subscribers', 'career_applications', 'business_inquiries', 'contacts');
   ```
   Should return 4 tables.

3. **Supabase RLS Policies** (should allow public inserts):
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

### Step 4: Test API Directly
In browser console, test the newsletter API:
```javascript
const response = await fetch('/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com' })
});
const data = await response.json();
console.log('Status:', response.status);
console.log('Response:', data);
```

Expected response if successful:
- Status: 201
- Has `message` and `data` fields

## Verification Checklist

After successful tests:
- [ ] Newsletter form works - emails appear in Supabase `newsletter_subscribers` table
- [ ] Career form works - applications appear in Supabase `career_applications` table
- [ ] Business form works - inquiries appear in Supabase `business_inquiries` table
- [ ] Contact form works - messages appear in Supabase `contacts` table
- [ ] No errors in browser console
- [ ] No errors in Cloudflare Pages build logs

## Success Indicators
✅ Forms submit without errors
✅ Data appears in Supabase tables within seconds
✅ Browser console shows no errors
✅ Cloudflare Pages deployment status is "Success"

If all tests pass, your deployment is configured correctly!
