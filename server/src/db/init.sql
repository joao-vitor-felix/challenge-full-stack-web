DROP DATABASE IF EXISTS college_app;

CREATE DATABASE college_app;

\c college_app

CREATE TYPE staff_role AS ENUM ('REGISTRAR', 'PROFESSOR');

CREATE TABLE
  students (
    ra VARCHAR(11) PRIMARY KEY,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
  );

CREATE TABLE
  staff (
    id VARCHAR(50) PRIMARY KEY NOT NULL DEFAULT gen_random_uuid (),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(100) NOT NULL,
    role staff_role NOT NULL
  );

INSERT INTO
  students (ra, cpf, name, email)
VALUES
  (
    '74200711460',
    '84835216016',
    'Lucas Pereira',
    'lucaspereira@gmail.com'
  );

INSERT INTO
  students (ra, cpf, name, email)
VALUES
  (
    '29326890503',
    '65665154024',
    'João Silva',
    'joaosilva@gmail.com'
  );

INSERT INTO
  students (ra, cpf, name, email)
VALUES
  (
    '39501621353',
    '83409065008',
    'Carlos Rocha',
    'carlosrocha@gmail.com'
  );

INSERT INTO
  students (ra, cpf, name, email)
VALUES
  (
    '59284644488',
    '87704921070',
    'John Doe',
    'johndoe@gmail.com'
  );
