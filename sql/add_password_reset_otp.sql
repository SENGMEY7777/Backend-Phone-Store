ALTER TABLE users
ADD COLUMN password_reset_otp VARCHAR(6) NULL,
ADD COLUMN password_reset_expires DATETIME NULL;
