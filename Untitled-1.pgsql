SELECT * FROM users;
SELECT * FROM cal_period;

DELETE FROM cal_period where id >0;

ALTER SEQUENCE cal_period_id_seq RESTART WITH 4;

INSERT INTO users (username,email,password,is_admin,created_at) VALUES ('Admin','test@test.com','admin',true,'2024-02-16 11:06:00');

UPDATE users SET email = 'test@test.com',is_admin = true,created_at = '2024-02-16 11:06:00';