Database lab_system;
CREATE TABLE useful_link (
  id SERIAL primary key,
  title TEXT,
  used_for TEXT,
  link TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
CREATE TABLE users (
  id SERIAL primary key,
  username TEXT,
  email TEXT,
  password TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
CREATE TABLE suppliers (
  id SERIAL primary key,
  company_name TEXT,
  type_of_service TEXT,
  contact_person TEXT,
  contact_email TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
CREATE TABLE orders (
  id SERIAL primary key,
  supplier_id INT,
  FOREIGN KEY (supplier_id) REFERENCES supplier(id),
  order_no INT,
  product TEXT,
  price INT,
  confirm_date DATE,
  order_by TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
CREATE TABLE testing_item (
  id SERIAL primary key,
  name TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
CREATE TABLE sample_info (
  id SERIAL primary key,
  sample_receive_date TIMESTAMP,
  analysis_date TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
CREATE TABLE testing_info (
  id SERIAL primary key,
  sample_info_id INT,
  FOREIGN KEY (sample_info_id) REFERENCES sample_info(id),
  testing_item_id INT,
  FOREIGN KEY (testing_item_id) REFERENCES testing_item(id),
  batch_id INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
CREATE TABLE calibration_period (
  id SERIAL primary key,
  parameter TEXT,
  calibration_period INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
CREATE TABLE equipment (
  id SERIAL primary key,
  name TEXT,
  brand TEXT,
  model TEXT,
  calibration_period_id INT,
  calibration_date TIMESTAMP,
  expiry_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (calibration_period_id) REFERENCES calibration_period(id)
);
CREATE TABLE reference_materials(
  id SERIAL primary key,
  chemical_name TEXT,
  is_certified BOOLEAN,
  expiry_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
CREATE TABLE reagent(
  id SERIAL primary key,
  name TEXT,
  testing_item_id INT,
  FOREIGN KEY (testing_item_id) REFERENCES testing_item(id),
  reference_materials_id INT,
  FOREIGN KEY (reference_materials_id) REFERENCES reference_materials(id),
  prepare_date TIMESTAMP,
  expiry_date DATE,
  prepared_by TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
CREATE TABLE reagent_sample_info (
  id SERIAL primary key,
  testing_info_id INT,
  FOREIGN KEY (testing_info_id) REFERENCES testing_info(batch_id),
  reagent_id INT,
  FOREIGN KEY (reagent_id) REFERENCES reagent(id)
);
CREATE TABLE notices (
  id SERIAL primary key,
  topic TEXT,
  content TEXT,
  equipment_id INT,
  reference_materials_id INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  FOREIGN KEY (reference_materials_id) REFERENCES reference_materials(id)
);