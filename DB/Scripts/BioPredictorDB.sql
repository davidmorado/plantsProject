-- Create the default db user
CREATE USER 'bpUser'@'localhost' IDENTIFIED BY 'bpPass';
GRANT ALL PRIVILEGES ON * . * TO 'bpUser'@'localhost';


-- MySQL Script generated by MySQL Workbench
-- Mon Aug 29 23:13:19 2016
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema BioPredictorDB
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema BioPredictorDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `BioPredictorDB` DEFAULT CHARACTER SET utf8 ;
USE `BioPredictorDB` ;

-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_Companies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_Companies` (
  `companyId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `description` VARCHAR(200) NULL,
  `registerDate` DATETIME NOT NULL,
  `isActive` TINYINT(1) NOT NULL,
  PRIMARY KEY (`companyId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_Users` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(80) NOT NULL,
  `registrationDate` DATETIME NOT NULL,
  `password` VARBINARY(500) NOT NULL,
  `isActive` TINYINT(1) NOT NULL,
  `isRemoved` TINYINT(1) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `lastName` VARCHAR(150) NOT NULL,
  `companyId` INT NOT NULL,
  PRIMARY KEY (`userId`),
  INDEX `fk_BP_Users_BP_Companies1_idx` (`companyId` ASC),
  CONSTRAINT `fk_BP_Users_BP_Companies1`
    FOREIGN KEY (`companyId`)
    REFERENCES `BioPredictorDB`.`BP_Companies` (`companyId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_Processes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_Processes` (
  `processId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `description` VARCHAR(200) NULL,
  `registrationDate` VARCHAR(45) NOT NULL,
  `isActive` TINYINT(1) NOT NULL,
  `registerUser` INT NOT NULL,
  `isProcess` TINYINT(1) NOT NULL,
  `companyId` INT NOT NULL,
  PRIMARY KEY (`processId`),
  INDEX `fk_BP_Processes_BP_Users1_idx` (`registerUser` ASC),
  INDEX `fk_BP_Processes_BP_Companies1_idx` (`companyId` ASC),
  CONSTRAINT `fk_BP_Processes_BP_Users1`
    FOREIGN KEY (`registerUser`)
    REFERENCES `BioPredictorDB`.`BP_Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_BP_Processes_BP_Companies1`
    FOREIGN KEY (`companyId`)
    REFERENCES `BioPredictorDB`.`BP_Companies` (`companyId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_Roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_Roles` (
  `roleId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `description` VARCHAR(200) NULL,
  `isActive` TINYINT(1) NOT NULL,
  PRIMARY KEY (`roleId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_RolesXUsers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_RolesXUsers` (
  `userId` INT NOT NULL,
  `roleId` INT NOT NULL,
  `registerDate` DATETIME NOT NULL,
  `isActive` TINYINT(1) NOT NULL,
  INDEX `fk_BP_RolesXUsers_BP_Users1_idx` (`userId` ASC),
  INDEX `fk_BP_RolesXUsers_BP_Roles1_idx` (`roleId` ASC),
  CONSTRAINT `fk_BP_RolesXUsers_BP_Users1`
    FOREIGN KEY (`userId`)
    REFERENCES `BioPredictorDB`.`BP_Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_BP_RolesXUsers_BP_Roles1`
    FOREIGN KEY (`roleId`)
    REFERENCES `BioPredictorDB`.`BP_Roles` (`roleId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_Actions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_Actions` (
  `actionId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `description` VARCHAR(200) NULL,
  PRIMARY KEY (`actionId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_ActionsXRole`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_ActionsXRole` (
  `roleId` INT NOT NULL,
  `actionId` INT NOT NULL,
  `registerDate` DATETIME NOT NULL,
  `isActive` TINYINT(1) NOT NULL,
  INDEX `fk_BP_ActionsXRole_BP_Roles1_idx` (`roleId` ASC),
  INDEX `fk_BP_ActionsXRole_BP_Actions1_idx` (`actionId` ASC),
  CONSTRAINT `fk_BP_ActionsXRole_BP_Roles1`
    FOREIGN KEY (`roleId`)
    REFERENCES `BioPredictorDB`.`BP_Roles` (`roleId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_BP_ActionsXRole_BP_Actions1`
    FOREIGN KEY (`actionId`)
    REFERENCES `BioPredictorDB`.`BP_Actions` (`actionId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_ProcessFactors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_ProcessFactors` (
  `processId` INT NOT NULL,
  `factorId` INT NOT NULL,
  `registerDate` DATETIME NOT NULL,
  `isActive` TINYINT(1) NOT NULL,
  INDEX `fk_BP_ProcessFactors_BP_Processes1_idx` (`processId` ASC),
  INDEX `fk_BP_ProcessFactors_BP_Processes2_idx` (`factorId` ASC),
  CONSTRAINT `fk_BP_ProcessFactors_BP_Processes1`
    FOREIGN KEY (`processId`)
    REFERENCES `BioPredictorDB`.`BP_Processes` (`processId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_BP_ProcessFactors_BP_Processes2`
    FOREIGN KEY (`factorId`)
    REFERENCES `BioPredictorDB`.`BP_Processes` (`processId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_Severities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_Severities` (
  `severityId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  PRIMARY KEY (`severityId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_EventTypes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_EventTypes` (
  `eventTypeId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `severityId` INT NOT NULL,
  PRIMARY KEY (`eventTypeId`),
  INDEX `fk_BP_EventTypes_BP_Severities1_idx` (`severityId` ASC),
  CONSTRAINT `fk_BP_EventTypes_BP_Severities1`
    FOREIGN KEY (`severityId`)
    REFERENCES `BioPredictorDB`.`BP_Severities` (`severityId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_EventsLog`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_EventsLog` (
  `eventId` INT NOT NULL AUTO_INCREMENT,
  `eventTypeId` INT NOT NULL,
  `description` VARCHAR(200) NULL,
  `reference1` VARCHAR(100) NULL,
  `reference2` VARCHAR(100) NULL,
  `referenceUser` VARCHAR(100) NULL,
  PRIMARY KEY (`eventId`),
  INDEX `fk_BP_EventsLog_BP_EventTypes1_idx` (`eventTypeId` ASC),
  CONSTRAINT `fk_BP_EventsLog_BP_EventTypes1`
    FOREIGN KEY (`eventTypeId`)
    REFERENCES `BioPredictorDB`.`BP_EventTypes` (`eventTypeId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_ProcessCalculation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_ProcessCalculation` (
  `processCalculationId` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `processId` INT NOT NULL,
  `value` FLOAT NOT NULL,
  `registerDate` DATETIME NULL,
  PRIMARY KEY (`processCalculationId`),
  INDEX `fk_BP_ProcessCalculation_BP_Users1_idx` (`userId` ASC),
  INDEX `fk_BP_ProcessCalculation_BP_Processes1_idx` (`processId` ASC),
  CONSTRAINT `fk_BP_ProcessCalculation_BP_Users1`
    FOREIGN KEY (`userId`)
    REFERENCES `BioPredictorDB`.`BP_Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_BP_ProcessCalculation_BP_Processes1`
    FOREIGN KEY (`processId`)
    REFERENCES `BioPredictorDB`.`BP_Processes` (`processId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_RecomendedActivities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_RecomendedActivities` (
  `recomendedActivityId` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(200) NOT NULL,
  `startValue` FLOAT NOT NULL,
  `endValue` FLOAT NOT NULL,
  PRIMARY KEY (`recomendedActivityId`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_Calculations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_Calculations` (
  `calculationId` INT NOT NULL AUTO_INCREMENT,
  `result` FLOAT NOT NULL,
  `bioProcessId` INT NOT NULL,
  `userId` INT NOT NULL,
  `generationDate` DATETIME NOT NULL,
  `dateRange` VARCHAR(100) NOT NULL,
  `recomendedActionId` INT NOT NULL,
  PRIMARY KEY (`calculationId`),
  INDEX `fk_BP_Calculations_BP_Processes1_idx` (`bioProcessId` ASC),
  INDEX `fk_BP_Calculations_BP_Users1_idx` (`userId` ASC),
  INDEX `fk_BP_Calculations_BP_RecomendedActivities1_idx` (`recomendedActionId` ASC),
  CONSTRAINT `fk_BP_Calculations_BP_Processes1`
    FOREIGN KEY (`bioProcessId`)
    REFERENCES `BioPredictorDB`.`BP_Processes` (`processId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_BP_Calculations_BP_Users1`
    FOREIGN KEY (`userId`)
    REFERENCES `BioPredictorDB`.`BP_Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_BP_Calculations_BP_RecomendedActivities1`
    FOREIGN KEY (`recomendedActionId`)
    REFERENCES `BioPredictorDB`.`BP_RecomendedActivities` (`recomendedActivityId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_ProcessRegisters`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_ProcessRegisters` (
  `registerUser` INT NOT NULL,
  `registerDate` DATETIME NOT NULL,
  `processId` INT NOT NULL,
  `isRemoved` TINYINT(1) NOT NULL,
  `processRegisterId` INT NOT NULL AUTO_INCREMENT,
  INDEX `fk_BP_ProcessRegisters_BP_Users1_idx` (`registerUser` ASC),
  INDEX `fk_BP_ProcessRegisters_BP_Processes2_idx` (`processId` ASC),
  PRIMARY KEY (`processRegisterId`),
  CONSTRAINT `fk_BP_ProcessRegisters_BP_Users1`
    FOREIGN KEY (`registerUser`)
    REFERENCES `BioPredictorDB`.`BP_Users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_BP_ProcessRegisters_BP_Processes2`
    FOREIGN KEY (`processId`)
    REFERENCES `BioPredictorDB`.`BP_Processes` (`processId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `BioPredictorDB`.`BP_RegisterValues`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `BioPredictorDB`.`BP_RegisterValues` (
  `registerValueId` INT NOT NULL AUTO_INCREMENT,
  `processRegisterId` INT NOT NULL,
  `factorId` INT NOT NULL,
  `value` FLOAT NOT NULL,
  PRIMARY KEY (`registerValueId`),
  INDEX `fk_BP_RegisterValues_BP_ProcessRegisters1_idx` (`processRegisterId` ASC),
  INDEX `fk_BP_RegisterValues_BP_Processes1_idx` (`factorId` ASC),
  CONSTRAINT `fk_BP_RegisterValues_BP_ProcessRegisters1`
    FOREIGN KEY (`processRegisterId`)
    REFERENCES `BioPredictorDB`.`BP_ProcessRegisters` (`processRegisterId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_BP_RegisterValues_BP_Processes1`
    FOREIGN KEY (`factorId`)
    REFERENCES `BioPredictorDB`.`BP_Processes` (`processId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
