-- The role column is introduced by 0007_uploaded_images_reports_admin.sql.
-- This migration normalizes existing role/status data and pins the known owner account.

UPDATE users
SET role = 'user'
WHERE role IS NULL OR role NOT IN ('user', 'admin', 'owner');

UPDATE users
SET role = 'owner'
WHERE login_id = 'wlgur2101'
   OR (
     lower(email) = 'wlgur2101@gmail.com'
     AND (email_verified_at IS NOT NULL OR auth_provider IN ('google', 'password_google'))
   );

UPDATE users
SET role = 'user'
WHERE role = 'owner'
  AND login_id != 'wlgur2101'
  AND (
    email IS NULL
    OR lower(email) != 'wlgur2101@gmail.com'
    OR (email_verified_at IS NULL AND auth_provider NOT IN ('google', 'password_google'))
  );

UPDATE uploaded_images
SET status = CASE status
  WHEN 'hidden' THEN 'rejected'
  WHEN 'removed' THEN 'deleted'
  WHEN 'pending' THEN 'pending'
  WHEN 'approved' THEN 'approved'
  WHEN 'rejected' THEN 'rejected'
  WHEN 'deleted' THEN 'deleted'
  ELSE 'pending'
END;

UPDATE reports
SET status = CASE status
  WHEN 'pending' THEN 'new'
  WHEN 'dismissed' THEN 'rejected'
  WHEN 'new' THEN 'new'
  WHEN 'reviewing' THEN 'reviewing'
  WHEN 'resolved' THEN 'resolved'
  WHEN 'rejected' THEN 'rejected'
  ELSE 'new'
END;

UPDATE contact_inquiries
SET status = CASE status
  WHEN 'new' THEN 'new'
  WHEN 'reviewing' THEN 'reviewing'
  WHEN 'resolved' THEN 'resolved'
  WHEN 'ignored' THEN 'ignored'
  ELSE 'new'
END;
