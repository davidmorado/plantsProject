---------------------------------------- USERS  ----------------------------
DROP PROCEDURE IF EXISTS loginUser;
DELIMITER //
CREATE PROCEDURE loginUser(IN pEmail VARCHAR(80),
IN pPassword VARCHAR(500))
BEGIN
    SELECT u.userId, u.email, u.registrationDate, u.isActive, u.isRemoved,
    CAST(u.password AS CHAR(10000) CHARACTER SET utf8) password,
    u.name, u.lastName, c.companyId companyId, c.name companyName, c.description companyDescription
    FROM BP_Users u
    INNER JOIN BP_Companies c
    WHERE u.companyId = c.companyId
    AND email = pEmail AND pPassword = CAST(u.password AS CHAR(10000) CHARACTER SET utf8)
    AND u.isActive = true AND u.isRemoved = false;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS getActionsByUserId;
DELIMITER //
CREATE PROCEDURE getActionsByUserId(IN pUserId INT)
BEGIN
    SELECT a.actionId, a.name , a.description
    FROM BP_Actions a
    INNER JOIN BP_ActionsXRole axr ON axr.actionId = a.actionId
    INNER JOIN BP_Roles r ON r.roleId = axr.roleId
    INNER JOIN BP_RolesxUsers rxu ON rxu.roleId = r.roleId
    WHERE rxu.userId = pUserId AND rxu.isActive = TRUE;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS getUsersByCompanyId;
DELIMITER //
CREATE PROCEDURE getUsersByCompanyId(IN pCompanyId INT)
BEGIN

    SELECT u.userId, u.email, u.registrationDate, u.isActive, u.isRemoved,
        CAST(u.password AS CHAR(10000) CHARACTER SET utf8) password,
        u.name, u.lastName, c.companyId companyId, c.name companyName
    FROM BP_Users u
    INNER JOIN BP_Companies c ON c.companyId = u.companyId
    WHERE u.companyId = pCompanyId AND u.isRemoved = false;

END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getAllUsers;
DELIMITER //
CREATE PROCEDURE getAllUsers()
BEGIN

    SELECT u.userId, u.email, u.registrationDate, u.isActive, u.isRemoved,
        CAST(u.password AS CHAR(10000) CHARACTER SET utf8) password,
        u.name, u.lastName, c.companyId companyId, c.name companyName
    FROM BP_Users u
    INNER JOIN BP_Companies c ON c.companyId = u.companyId
    WHERE u.isRemoved = false;

END //
DELIMITER ;

DROP PROCEDURE IF EXISTS modifyUser;
DELIMITER //
CREATE PROCEDURE modifyUser(
    IN pEmail VARCHAR(80),
    IN pPassword VARBINARY(500),
    IN pName VARCHAR(80),
    IN pLastName VARCHAR(80),
    IN pCompanyId INT,
    IN pRolesIds TEXT,
    IN pIsNew BIT,
    IN pUserId INT
)
BEGIN

    DECLARE userId INT;
    DECLARE userCount INT;
    DECLARE returnMessage VARCHAR(100);

    SET @userId = -1;
    SET @userCount = 0;
    SET @returnMessage = 'Success';


    IF(pIsNew = TRUE) THEN

        SELECT COUNT(*)
        FROM BP_Users
        WHERE email = pEmail AND isRemoved = false
        INTO @userCount;

        /* Email Validation*/
        IF(@userCount = 0) THEN


            INSERT INTO BP_Users
                (email, registrationDate, password, isActive, isRemoved, name, lastName,companyId)
            VALUES (pEmail, NOW(), pPassword, true, false, pName, pLastName, pCompanyId);

            SET @userId = LAST_INSERT_ID();

        ELSE
            SET @userId = -1;
            SET @returnMessage = 'El email ingresado ya se encuentra en uso';
        END IF;


    ELSE

        SELECT COUNT(*)
        FROM BP_Users u
        WHERE u.email = pEmail AND u.isRemoved = false AND u.userId != pUserId
        INTO @userCount;

        /* Email Validation*/
        IF(@userCount = 0) THEN

            UPDATE BP_Users u SET
                u.email = pEmail,
                u.password = pPassword,
                u.name = pName,
                u.lastName = pLastName,
                u.companyId = pCompanyId
            WHERE u.userId = pUserId;

            SET @userId = pUserId;

        ELSE
            SET @userId = -1;
            SET @returnMessage = 'El email ingresado ya se encuentra en uso';
        END IF;

    END IF;


    /*Update Roles Table */
    IF(@userId != -1) THEN

        UPDATE BP_RolesXUsers rxu SET rxu.isActive = FALSE
        WHERE rxu.userId = @userId;

        INSERT INTO BP_RolesXUsers (userId, roleId, registerDate, isActive)
        SELECT @userId, r.roleId, NOW(), true
        FROM BP_Roles r
        WHERE FIND_IN_SET(r.roleId, pRolesIds);

    END IF;


    SELECT @userId userId, @returnMessage message;


END//
DELIMITER ;

DROP PROCEDURE IF EXISTS removeUser;
DELIMITER //
CREATE PROCEDURE removeUser(IN pUserId INT)
BEGIN

    DECLARE processesCount INT;
    DECLARE calculationsCount INT;

    SET @processesCount = 0;
    SET @calculationsCount = 0;

    SELECT COUNT(*)
    FROM BP_Processes
    WHERE registerUser = pUserId
    INTO @processesCount;


    SELECT COUNT(*)
    FROM BP_Calculations
    WHERE userId = pUserId
    INTO @calculationsCount;


    IF(@processesCount = 0 AND @calculationsCount = 0) THEN

        UPDATE BP_Users u SET u.isRemoved = true, u.isActive = false
        WHERE u.userId = pUserId;

        SELECT TRUE removed;
    ELSE

        SELECT FALSE removed;
    END IF;

END//
DELIMITER ;
-- ----------------------------------- ROLES  ----------------------------

DROP PROCEDURE IF EXISTS getRoles;
DELIMITER //
CREATE PROCEDURE getRoles()
BEGIN
    SELECT roleId, name, description, isActive
    FROM BP_Roles
    WHERE isActive = true;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS removeRole;
DELIMITER //
CREATE PROCEDURE removeRole(IN pRoleId INT)
BEGIN

    DECLARE userCount INT;

    SET @userCount = 0;

    SELECT COUNT(*)
    FROM BP_RolesXUsers
    WHERE roleId = pRoleId
    INTO @userCount;

    IF(@userCount = 0) THEN

        UPDATE BP_Roles SET isActive = false
        WHERE roleId = pRoleId;

        SELECT TRUE removed;
    ELSE

        SELECT FALSE removed;
    END IF;

END//
DELIMITER ;

DROP PROCEDURE IF EXISTS getActionsXRoleId;
DELIMITER //
CREATE PROCEDURE getActionsXRoleId(IN pRoleId INT)
BEGIN

    SELECT a.actionId, a.name, a.description
    FROM BP_Actions a
    INNER JOIN BP_ActionsXRole axp ON axp.actionId = a.actionId
    WHERE axp.roleId = pRoleId AND axp.isActive = true;

END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getActions;
DELIMITER //
CREATE PROCEDURE getActions()
BEGIN

    SELECT a.actionId, a.name, a.description
    FROM BP_Actions a;

END //
DELIMITER ;

DROP PROCEDURE IF EXISTS addRole;
DELIMITER //
CREATE PROCEDURE addRole(IN pName VARCHAR(80), IN pDescription VARCHAR(200), IN pActionIds TEXT)
BEGIN

    DECLARE roleId INT;

    INSERT INTO BP_Roles (name, description, isActive)
    VALUES (pName, pDescription, true);

    SET @roleId = LAST_INSERT_ID();

    INSERT INTO BP_ActionsXRole (roleId,actionId, registerDate, isActive)
    SELECT @roleId, a.actionId, NOW(), true
    FROM BP_Actions a
    WHERE FIND_IN_SET(a.actionId, pActionIds);


    SELECT @roleId roleId;

END//
DELIMITER ;

DROP PROCEDURE IF EXISTS getRolesByUserId;
DELIMITER //
CREATE PROCEDURE getRolesByUserId(IN pUserId INT)
BEGIN

    SELECT r.roleId, r.name, r.description, r.isActive
    FROM BP_Roles r
    INNER JOIN BP_RolesXUsers rxu ON rxu.roleId = r.roleId
    WHERE rxu.userId = pUserId AND r.isActive = true AND rxu.isActive;


END //
DELIMITER ;

-- ----------------------------------- FACTORS  ----------------------------

DROP PROCEDURE IF EXISTS addFactor;
DELIMITER //
CREATE PROCEDURE addFactor(pName VARCHAR(80), pDescription VARCHAR(200), pRegisterUserId INT, pCompanyId INT)
BEGIN
    INSERT INTO BP_Processes(name, description, registrationDate, isActive, registerUser, companyId, isProcess)
    VALUES(pName, pDescription, NOW(), true, pRegisterUserId, pCompanyId, FALSE);
    SELECT LAST_INSERT_ID() factorId;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS removeFactor;
DELIMITER //
CREATE PROCEDURE removeFactor(IN pFactorId INT)
BEGIN

    DECLARE bpCount INT;

    SET @bpCount = 0;

    SELECT COUNT(*)
    FROM BP_ProcessFactors
    WHERE factorId = pFactorId AND isActive = TRUE
    INTO @bpCount;

    IF(@bpCount = 0) THEN

        UPDATE BP_Processes SET isActive = false
        WHERE processId = pFactorId
        AND isProcess = FALSE;

        SELECT TRUE removed;
    ELSE

        SELECT FALSE removed;
    END IF;

END//
DELIMITER ;

DROP PROCEDURE IF EXISTS getFactors;
DELIMITER //
CREATE PROCEDURE getFactors()
BEGIN
    SELECT processId factorId, name, description, registrationDate, isActive
    FROM bp_processes
    WHERE isActive = true AND isProcess = FALSE;
END //
DELIMITER ;

-- ----------------------------------- COMPANY  ----------------------------

DROP PROCEDURE IF EXISTS addCompany;
DELIMITER //
CREATE PROCEDURE addCompany(IN pName VARCHAR(80), IN pDescription VARCHAR(200))
BEGIN

    INSERT INTO BP_Companies (name, description, registerDate, isActive)
    VALUES (pName, pDescription, NOW(), true);

    SELECT LAST_INSERT_ID() companyId;

END//
DELIMITER ;

DROP PROCEDURE IF EXISTS getCompanies;
DELIMITER //
CREATE PROCEDURE getCompanies()
BEGIN

    SELECT companyId, name, description, registerdate, isActive
    FROM BP_Companies
    WHERE isActive = TRUE;

END//
DELIMITER ;

DROP PROCEDURE IF EXISTS removeCompany;
DELIMITER //
CREATE PROCEDURE removeCompany(IN pCompanyId INT)
BEGIN

    DECLARE userCount INT;
    DECLARE bpCount INT;

    SET @userCount = 0;
    SET @bpCount = 0;

    SELECT COUNT(*)
    FROM BP_Users
    WHERE companyId = pCompanyId
    INTO @userCount;

    SELECT COUNT(*)
    FROM BP_Processes
    WHERE companyId = pCompanyId
    INTO @bpCount;

    IF(@userCount = 0 AND @bpCount = 0) THEN

        UPDATE BP_Companies SET isActive = false
        WHERE companyId = pCompanyId;

        SELECT TRUE removed;
    ELSE

        SELECT FALSE removed;
    END IF;

END//
DELIMITER ;


-- ----------------------------------- BIO PROCESS  ----------------------------

DROP PROCEDURE IF EXISTS addBioProcess;
DELIMITER //
CREATE PROCEDURE `addBioProcess`(pName VARCHAR(80), pDescription VARCHAR(200), pRegisterUserId INT, pCompanyId INT, IN pFactorIds TEXT)
BEGIN

    DECLARE bioProcessId INT;

    INSERT INTO BP_Processes
    (name, description, registrationDate, isActive,
    registerUser, isProcess, companyId)
    VALUES (pName, pDescription, now(), true, pRegisterUserId, true, pCompanyId);

    SET @bioProcessId = LAST_INSERT_ID();

    INSERT INTO BP_Processfactors (processId, factorId, registerDate, isActive)
    SELECT @bioProcessId, p.processId, NOW(), true
    FROM BP_Processes p
    WHERE FIND_IN_SET(p.processId, pFactorIds) AND p.isProcess = false;


    SELECT @bioProcessId bioProcessId;

END//
DELIMITER ;

DROP PROCEDURE IF EXISTS removeBioProcess;
DELIMITER //
CREATE PROCEDURE `removeBioProcess`(IN pBioProcessId INT)
BEGIN

    DECLARE registerCount INT;

    SELECT COUNT(*)
    FROM BP_ProcessRegisters
    WHERE processId = pBioProcessId
    INTO @registerCount;

    /* Email Validation*/
    IF(@registerCount = 0) THEN

        UPDATE BP_Processes SET isActive = false
        WHERE processId = pBioProcessId
        AND isProcess = TRUE;

        SELECT TRUE removed;

    ELSE
        SELECT FALSE removed;
    END IF;

END//
DELIMITER ;

DROP PROCEDURE IF EXISTS getBioProcesses;
DELIMITER //
CREATE PROCEDURE `getBioProcesses`(IN pCompanyId INT)
BEGIN
    SELECT processId , name, description, registrationDate, isActive
    FROM bp_processes
    WHERE isActive = true AND isProcess = TRUE
    AND companyId = pCompanyId;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS getAllBioProcesses;
DELIMITER //
CREATE PROCEDURE `getAllBioProcesses`()
BEGIN
    SELECT processId , name, description, registrationDate, isActive
    FROM bp_processes
    WHERE isActive = true AND isProcess = TRUE;

END//
DELIMITER ;

DROP PROCEDURE IF EXISTS getFactorsXBioProcess;
DELIMITER //
CREATE PROCEDURE `getFactorsXBioProcess`(IN pBioProcessId INT)
BEGIN

    SELECT p.processId factorId, p.name, p.description, p.registrationDate, 0 value
    FROM BP_Processes p
    INNER JOIN BP_ProcessFactors pf ON pf.factorId = p.processId
    WHERE pf.processId = pBioProcessId AND pf.isActive = TRUE AND p.isActive = TRUE;
END//
DELIMITER ;

-- ----------------------------------- REPORTS  ----------------------------

DROP PROCEDURE IF EXISTS getBioProcessesReport;
DELIMITER //
CREATE PROCEDURE getBioProcessesReport(pCompanyId int)
BEGIN
    SELECT
        process.name 'Nombre del BioProceso',
        process.description 'Descripcion',
        company.name 'Compañia',
        COALESCE(GROUP_CONCAT(DISTINCT processFactor.name SEPARATOR '; '), 'No tiene factores asociados') 'Factores'
    FROM BP_Processes process
    LEFT JOIN BP_Companies company ON process.companyId = company.companyId
    LEFT JOIN BP_ProcessFactors factors ON process.processId = factors.processId
    LEFT JOIN BP_Processes processFactor ON factors.factorId = processFactor.processId
    WHERE
        process.isActive = true
    AND
        (company.companyId = pCompanyId OR pCompanyId = -1)
    AND
        process.isProcess = true
    GROUP BY process.processId;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getFactorsReport;
DELIMITER //
CREATE PROCEDURE getFactorsReport(pCompanyId int)
BEGIN
    SELECT
        factor.name 'Nombre del factor',
        factor.description 'Descripcion',
        company.name 'Compañia'
    FROM BP_Processes factor
    INNER JOIN BP_Companies company ON factor.companyId = company.companyId
    WHERE
        factor.isActive
    AND
        factor.isProcess = FALSE
    AND
        (company.companyId = pCompanyId OR pCompanyId = -1);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getCompaniesReport;
DELIMITER //
CREATE PROCEDURE getCompaniesReport(pCompanyId int)
BEGIN
    SELECT
        company.name 'Nombre de la compañia',
        COALESCE(company.description, 'Sin descripción') 'Descripción',
        COALESCE(GROUP_CONCAT(DISTINCT CONCAT(user.name, " ", user.lastName) SEPARATOR '; '), 'No contiene usuarios') 'Usuarios'
    FROM BP_Companies company
    LEFT JOIN BP_Users user ON company.companyId = user.companyId
    WHERE
        company.isActive
    AND
        (company.companyId = pCompanyId OR pCompanyId = -1)
    GROUP BY company.companyId;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getDataReport;
DELIMITER //
CREATE PROCEDURE getDataReport(pBioProcessId int)
BEGIN
    SELECT
        calc.result 'Resultado',
        bioProcess.name 'Bio Proceso',
        CONCAT(user.name, ' ', user.lastName)'Nombre de usuario',
        calc.generationDate 'Dia de creacion',
        actity.description 'Actividad recomendada'
    FROM bp_calculations calc
    INNER JOIN BP_Processes bioProcess ON calc.bioProcessId = bioProcess.processId
    INNER JOIN BP_Users user ON calc.userId = user.userId
    INNER JOIN bp_recomendedactivities actity ON calc.recomendedActivityId = actity.recomendedActivityId
    WHERE bioProcess.processId = pBioProcessId OR pBioProcessId = -1;
END //
DELIMITER ;

-- ----------------------------------- DATA  ----------------------------

DROP PROCEDURE IF EXISTS saveCSVDatas;
DELIMITER //
CREATE PROCEDURE `saveCSVDatas`(pDatas VARCHAR(2500))
BEGIN
    DECLARE cont int;
    DECLARE dataLenght int;

    set cont = 1;
    set dataLenght = stringLen(pDatas,'\n');

    WHILE (cont <= dataLenght) DO
        call saveCSVData(split(pDatas,'\n',cont));
        set cont = cont + 1; 
    END WHILE;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS saveCSVData;
DELIMITER //
CREATE PROCEDURE `saveCSVData`(pData VARCHAR(255))
BEGIN
    DECLARE _UserId INT;
    DECLARE _ProcessId INT;
    DECLARE _FactorId INT;
    DECLARE _ProcessRegisterId INT;
    
    select userId from bp_users 
    where email = split(pData,",",1)
    AND isActive = TRUE
    into _UserId;
    
    select processId 
    from bp_processes 
    where name = split(pData,",",3) AND isProcess = TRUE 
    AND isActive = TRUE
    into _ProcessId;
    
    select processId from bp_processes 
    where name = split(pData,",",4) AND isProcess = FALSE
    AND isActive = TRUE
    into _FactorId;
    
    INSERT INTO bp_processregisters(registerUser, registerDate, processId)
    values(_UserId, split(pData,",",2), _ProcessId);
    
    set _ProcessRegisterId = LAST_INSERT_ID();
    
    INSERT INTO bp_registervalues(processRegisterId,factorId,value)
    values(_ProcessRegisterId,_FactorId,CAST(split(pData,",",5) AS DECIMAL));
    
    INSERT INTO bp_processfactors(processId, factorId, registerDate)
    values(_ProcessId,_FactorId,split(pData,",",2));

    select _ProcessRegisterId as 'Process Register Id';
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS addProcessRegister;
DELIMITER //
CREATE PROCEDURE `addProcessRegister`(
    pRegisterUser INT,
    pRegisterDate VARCHAR(100),
    pProcessId INT,
    pRegisterValues TEXT
)
BEGIN

    DECLARE processRegisterId INT;
    DECLARE registersInsert TEXT;
    DECLARE replaceRegisters TEXT;

    INSERT INTO BP_ProcessRegisters
    (registerUser, registerDate, processId, isRemoved)
    VALUES (
        pRegisterUser,
        STR_TO_DATE(pRegisterDate, '%d/%m/%Y %H:%i'),
        pProcessId,
        FALSE
    );

    SET @processRegisterId = LAST_INSERT_ID();
    SET @replaceRegisters = REPLACE (pRegisterValues, '{id}', @processRegisterId);

    SET @registersInsert = CONCAT(
        'INSERT INTO BP_RegisterValues (processRegisterId,factorId,value) ',
        'VALUES ',
        @replaceRegisters
    );

    PREPARE stmt FROM @registersInsert;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    SELECT @processRegisterId processRegisterId;

END//
DELIMITER ;

DROP PROCEDURE IF EXISTS getData;
DELIMITER //
CREATE PROCEDURE getData(IN pCompanyId INT)
BEGIN

    SELECT pr.processRegisterId, pr.registerUser, pr.registerDate, pr.processId, pr.isRemoved,
        p.name
    FROM BP_ProcessRegisters pr
    INNER JOIN BP_Processes p ON p.processId = pr.processId
    INNER JOIN BP_Users u ON u.userId = pr.registerUser
    WHERE pr.isRemoved = FALSE AND u.companyId = pCompanyId;

END //
DELIMITER ;

DROP PROCEDURE IF EXISTS removeData;
DELIMITER //
CREATE PROCEDURE removeData(IN pProcessRegisterId INT)
BEGIN

    UPDATE BP_ProcessRegisters SET isRemoved = TRUE
    WHERE processRegisterId = pProcessRegisterId;

    SELECT TRUE 'removed';

END //
DELIMITER ;

DROP PROCEDURE IF EXISTS getDataRegisters;
DELIMITER //
CREATE PROCEDURE getDataRegisters(IN pProcessRegisterId INT)
BEGIN

    SELECT rv.registerValueId, rv.processRegisterId, rv.factorId, rv.value,
        f.name, f.description
    FROM BP_RegisterValues rv
    INNER JOIN BP_Processes f ON f.processId = rv.factorId
    WHERE rv.processRegisterId = pProcessRegisterId;

END //
DELIMITER ;
<<<<<<< HEAD

-- ----------------------------------- CALCULATIONS  ----------------------------

DROP PROCEDURE IF EXISTS getCalculations;
DELIMITER //
CREATE PROCEDURE `getCalculations`(IN pCompanyId INT)
BEGIN
SELECT c.calculationId, c.bioProcessId, c.result, b.name, c.generationDate, c.dateRange, 
a.description 
FROM bp_calculations c INNER JOIN 
bp_processes b ON c.bioProcessId = b.processId
INNER JOIN bp_recomendedactivities a 
ON c.recomendedActionId = a.recomendedActivityId
WHERE b.companyId = pCompanyId;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS generateCalculation;
DELIMITER //
CREATE PROCEDURE `generateCalculation`(IN pResult float,
IN pProcessId int, IN pUserId int, IN pDateRange varchar(100), IN pRecomendedActionId int)
BEGIN

INSERT INTO bp_calculations(result, bioProcessId, userId, generationDate, dateRange, recomendedActionId)
VALUES(pResult, pProcessId, pUserId, now(), pDateRange, pRecomendedActionId);
SET @calculationId = LAST_INSERT_ID();
SELECT @calculationId calculationId;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS getRecomendedActivities;
DELIMITER //
CREATE PROCEDURE `getRecomendedActivities`()
BEGIN
SELECT * FROM bp_recomendedactivities;

END //
DELIMITER ;



DROP PROCEDURE IF EXISTS getRangeCalculations;
DELIMITER //
CREATE PROCEDURE `getRangeCalculations`(pBioProcessId INT, pStartDate date, pEndDate date)
BEGIN
SELECT * FROM bp_calculations 
WHERE bioProcessId = pBioProcessId AND generationDate >= pStartDate AND generationDate <= pEndDate;

END //
DELIMITER ;


DROP PROCEDURE IF EXISTS getProcessRegisters;
DELIMITER //
CREATE PROCEDURE `getProcessRegisters`(IN pProcessId INT, IN pStartDate date, IN pEndDate date)
BEGIN
SELECT registerUser, registerDate, factorId, value, processId
FROM bp_processregisters
WHERE processId = pProcessId AND
registerDate >= pStartDate AND registerDate <= pEndDate AND
isRemoved = FALSE;
END //
DELIMITER ;
=======
-------------------------------------Functions-------------------------------------------------------
DROP FUNCTION IF EXISTS split;
DELIMITER //
CREATE FUNCTION split(x VARCHAR(255),delim VARCHAR(12),pos INT)
RETURNS VARCHAR(255)
BEGIN
RETURN REPLACE(SUBSTRING(SUBSTRING_INDEX(x, delim, pos),
       LENGTH(SUBSTRING_INDEX(x, delim, pos -1)) + 1),
       delim, '');
END //
DELIMITER ;

DROP FUNCTION IF EXISTS stringLen;
DELIMITER //
CREATE FUNCTION stringLen(string varchar(5000), delim varchar(10))
RETURNS INT
BEGIN
    RETURN (length(string) - length(replace(string, delim, ""))) DIV LENGTH(delim);
END //
DELIMITER ;
>>>>>>> 32857e20b1a27518654e01c6e73b01c5d978caae
