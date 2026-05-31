USE borderwatch;
-- Demo passwords: admin=Admin@2024, director=Director@2024, officer1/officer2=Officer@2024, ops/auditor=Ops@2024
INSERT IGNORE INTO users (id,username,email,password_hash,full_name,role) VALUES
('u-admin-0001','admin',   'admin@borderwatch.cm',  '$2b$12$5qvPM6Lihjiygwsikf1aAuV26Ewmj235AXqRNFYyPEpUiKCozt4q2','System Administrator',          'ROLE_ADMIN'),
('u-dir-0001',  'director','director@customs.cm',   '$2b$12$9yAyHj6vFDlVSWbWGN0ag.KqVn7WbazDAQLZJVQmyPOiHzHChm9Tq', 'Directeur Général des Douanes', 'ROLE_DIRECTOR'),
('u-off-0001',  'officer1','officer1@customs.cm',   '$2b$12$uUGfvrfwhyEww/zK3/sdzO2Jb6qW03LcmRsofxYDFn3/ZfXLloJLq', 'Inspecteur Tambi',              'ROLE_OFFICER'),
('u-off-0002',  'officer2','officer2@customs.cm',   '$2b$12$FaSqWVy7.1RbDpJb5s6UdeA3bBMkRjxZUFkDE8wy51ZlhJqsbpVQm', 'Inspecteur Arthur',             'ROLE_OFFICER'),
('u-ops-0001',  'ops',     'ops@borderwatch.cm',    '$2b$12$Tv73oRF5Fs7jmG13Dhssh.ggkQzzhNqQZTASHfIPOHmV1WXY9S4XO', 'DevOps Engineer',               'ROLE_OPS'),
('u-aud-0001',  'auditor', 'auditor@justice.gov.cm','$2b$12$dGH1hIG8yikV7c7NM19wj.m8xgRLVLmoq43HvAc9/lRt4EU2CukMC', 'Court Auditor',                 'ROLE_AUDITOR');

INSERT IGNORE INTO corridors (id,name,waypoints_json,tolerance_km) VALUES
('CORRIDOR_DOUALA_NDJAMENA','Douala–N''Djamena','[{"lat":4.0511,"lon":9.7679,"name":"Douala Port"},{"lat":4.9601,"lon":11.8616,"name":"Yaoundé"},{"lat":5.9667,"lon":14.3167,"name":"Ngaoundéré"},{"lat":7.3667,"lon":15.4833,"name":"Garoua"},{"lat":10.3833,"lon":15.3667,"name":"Maroua"},{"lat":12.1048,"lon":15.0445,"name":"N''Djamena"}]',25.0),
('CORRIDOR_DOUALA_BANGUI','Douala–Bangui','[{"lat":4.0511,"lon":9.7679,"name":"Douala Port"},{"lat":4.3612,"lon":18.5583,"name":"Bangui"}]',30.0);

INSERT IGNORE INTO trucks (truck_id,plate_number,operator_name,operator_email,cargo_type) VALUES
('CE-2024-ALPHA','LT-4521-A','Total Cameroun SA',        'logistics@total.cm',   'PETROLEUM'),
('CE-2024-BETA', 'LT-8832-B','Alucam Transport',          'transport@alucam.cm',  'ELECTRONICS'),
('CE-2024-GAMMA','LT-1104-C','Pharmivoire SARL',           'ops@pharmivoire.cm',   'PHARMACEUTICALS'),
('CE-SIM-0021',  'DLA-2021-D','Cameroun Express Freight', 'cef@logistics.cm',     'GENERAL_GOODS'),
('CE-SIM-0087',  'DLA-8710-E','SCDP Logistics',            'scdp@transport.cm',    'PETROLEUM'),
('CM-2024-001',  'YDE-0011-F','MTN Cameroon Supply',       'supply@mtn.cm',        'ELECTRONICS');
SELECT 'Seed data loaded' AS status;
