# Testimonials System Setup Guide

To ensure the new Testimonials management system works perfectly without errors, you must set up the `testimonials` table in your Supabase database. 

During the development request, the required setup script was automatically generated as `supabase-testimonials.sql` in your `frontend` directory.

### Step 1: Execute Database Migration (Supabase)

You need to run the newly created SQL script in your Supabase SQL Editor to set up the necessary table and security policies.

1. Open your **Supabase Dashboard** and enter your project.
2. Navigate to the **SQL Editor** on the left menu.
3. Click on **New Query**.
4. Open the `frontend/supabase-testimonials.sql` file in your code editor and copy its entire contents.
5. Paste the contents into the Supabase SQL Editor.
6. Click **Run**.
*(This will create the `testimonials` table, enable Row Level Security, allow public read access, and seed the initial 3 testimonials).*

### Step 2: Verify the Admin Panel

1. Go to your local or deployed application at `/admin`.
2. Login with your Admin Password.
3. You will now see a **Testimonials** section in the navigation menu (indicated by ❞).
4. Go to this section to test adding, editing (hiding/showing), and deleting testimonials.

### Step 3: Verify the Home Page

1. Navigate to the main home page (`/`).
2. Scroll to the "What They Say" section.
3. If testimonials are actively stored in Supabase and marked as `Visible` (which `is_active: true`), they will automatically populate in that section without requiring code updates.

#### Troubleshooting:
- **No Testimonials Showing on Home Page:** This typically means the `testimonials` table is empty or all testimonials are hidden, OR the SQL script wasn't fully run. Ensure Step 1 is properly executed.
- **Unauthorized / "Failed to load testimonials" in Admin:** Check the network tab, this indicates your local `.env.local` might be missing `ADMIN_PASSWORD` or the Supabase connection keys (`NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`) are malfunctioning. Ensure they exist.
