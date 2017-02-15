use BioPredictorDB;

-- Actions static filling
INSERT INTO BP_Actions (name,description)
VALUES
    -- Users
    ('addUser', 'Agregar nuevo usuario '),
    ('editUser', 'Editar usuarios'),
    ('viewListUser', 'Ver lista de usuarios'),
    ('removeUser', 'Remover usuarios'),
    -- ('disableUser', 'Inhabilitar usuarios'),
    -- Companies
    ('addCompany', 'Agregar nueva compañia'),
    -- ('editCompany', 'Editar compañias '),
    ('viewListCompany', 'Ver lista de compañias'),
    ('removeCompany', 'Remover compañias'),
    -- Roles
    ('addRole', 'Agregar nuevo rol'),
    -- ('editRole', 'Editar roles'),
    ('viewListRole', 'Ver lista de roles'),
    ('removeRole', 'Remover rol'),
    -- Factors
    ('addFactor', 'Agregar nuevo factor'),
    -- ('editFactor', 'Editar factor'),
    ('viewListFactor', 'Ver lista de factores'),
    ('removeFactor', 'Remover factores'),
    -- Bio Process
    ('addBioProcess', 'Agregar nuevo bio proceso'),
    -- ('editBioProcess', 'Editar pio procesos'),
    ('viewBioProcess', 'Ver lista de bio procesos'),
    ('removeBioProcess', 'Remover bio procesos'),
    -- Data
    ('addDataCSV', 'Agregar nuevos datos CSV'),
    ('addDataManual' ,'Agregar nuevos datos manual'),
    -- ('editData', 'Editar datos'),
    ('viewListData', 'Ver lista de datos'),
    ('removeData', 'Remover datos'),
    -- Calculation
    ('generateCalculation', 'Generar predicción'),
    ('viewListCalculation', 'Ver lista de predicciones'),
    ('removeCalculation', 'Remover predicciones'),

    -- Reports
    ('reportCompanies', 'Generar reporte compañias'),
    ('reportFactors', 'Generar reporte factores'),
    ('reportBioProcesses', 'Generar reporte bio procesos'),
    ('reportData', 'Generar reporte datos'),
    ('reportCalculations', 'Generar reporte predicciones');

-- INSERT ADMIN COMPANY
INSERT INTO BP_Companies (name, description, registerDate, isActive)
VALUES ('Bio Predictor', 'Main system company', NOW(), true);

-- INSERT ADMIN USER
INSERT INTO BP_Users (email,registrationDate,password,isActive,isRemoved,name,lastName,companyId)
VALUES ('bpAdmin@gmail.com', NOW(),'admin', true, false,'BP_User', 'BP_LastName', 1);

SET @userID = (SELECT userId FROM BP_Users ORDER BY RAND() LIMIT 1);
SET @companyID = (SELECT companyId FROM BP_Companies ORDER BY RAND() LIMIT 1);

call addFactor("Temperatura_C","Temperatura en grados celsius", @userID, @companyID);
call addFactor("Humedad","Humedad relativa", @userID, @companyID);
call addFactor("Velocidad del viento","Velocidad del viento medida en metros por segundo", @userID, @companyID);
call addFactor("Precipitacion","Cantidad de lluvia mefida en centimetros cubicos", @userID, @companyID);
call addFactor("Incidencia_Roya","Roya", @userID, @companyID);
call addFactor("Estado de evolucion_Sigatoka negra","Sigatoka negra", @userID, @companyID);
call addFactor("Radiacion solar","W / m2", @userID, @companyID);
call addFactor("Ph del suelo","Ph", @userID, @companyID);

call addBioProcess("BioProceso 1", "Este es el bio proceso 1", @userID, @companyID, "42,52,62,72");
call addBioProcess("BioProceso 2", "Este es el bio proceso 2", @userID, @companyID, "82,92,102,112");
call addBioProcess("BioProceso 3", "Este es el bio proceso 3", @userID, @companyID, "42,72,102,82");

