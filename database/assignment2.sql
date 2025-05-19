-- 1. Insert new record in account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Update account type to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- 3. Delete account from account table
DELETE FROM account
WHERE account_id = 1;

-- 4. Replace description for 'GM Hummer' in inventory table
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_id = 10;

-- 5. Inner join to get inventory with 'Sport' classification
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
    INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Update invetory table with '/vehicles/ for inv_image and inv_thumbnail file path
-- Example: /images/vehicles/carname.jpg
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');