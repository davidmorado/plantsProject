// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        2 Set 2016
// * Description: Config Factory file
//

'use strict';

bioPredictorApp.factory('configFactory', function() {

    var currentEnvironment = 'develop';

    var configuration =
    {
        develop:
        {
            serverURL:'http://localhost:8080',
            appURL:'http://localhost:3000/#/'
        },
        demo:
        {
            serverURL:'https://biopredictor-demo.herokuapp.com',
            appURL:'http://localhost:3000/#/'
        },
        production: {
            serverURL:'http://localhost:8080',
            appURL:'http://localhost:3000/#/'
        }
    };

    /**
     * All system return messages
     * @type {Object}
     */
    var returnMessages = {

        //Error
        requestError : 'No se puede connectar con el serivor, intente más tarde',
        emailOrPassIncorrect : 'Correo o contraseña incorrectos',
        companyNameRequired : 'Por favor ingrese un nombre para la compañía',
        loadCompaniesError : 'Ha ocurrido un error cargando las compañías',
        removeCompanyError : 'Ha ocurrido un error removiendo la compañía',
        removeCompanyInvalid : 'La compañía no puede ser removida',
        removeRoleError: 'Ha ocurrido un error removiendo el rol',
        removeRoleInvalid : 'El rol no puede ser removido',
        loadRolesError : 'Ha ocurrido un error cargando los roles',
        loadBioProcessesError : 'Ha ocurrido un error cargando los Bio Procesos',
        loadActionsError: 'Ha ocurrido un error cargando las acciones',
        roleNameRequired: 'Por favor ingrese un nombre para el rol',
        factorNameRequired : 'Por favor ingrese un nombre para el factor',
        loadFactorsError : 'Ha ocurrido un error cargando los factores',
        removeFactorInvalid : 'El factor no puede ser removido',
        removeFactorError : 'Ha ocurrido un error removiendo el factor',
        loadUsersError : 'Ha ocurrido un error cargando los usuarios',
        loadDataError : 'Ha ocurrido un error cargando los datos',
        loadCalculationsError: 'Ha ocurrido un error cargando los calculos',
        userNameRequired : 'El nombre del usuario es requerido.',
        userLastNameRequired : 'El apellido del usuario es requerido.',
        userEmailRequired : 'El email del usuario es requerido.',
        userPasswordRequired : 'La contraseña de usuario es requerida.',
        userCompanyRequired : 'La compañia del usuario es requerida.',
        userInfoRequired : 'Por favor ingrese la información del usuario.',
        emailAlreadyTaken : 'El email ingresado ya se encuentra en uso',
        removeUserError: 'El usuario no puede ser removido',
        addDataError : 'Ha ocurrido un error guardando los datos',
        removeDataInvalid : 'Los datos no pueden ser removidos',
        removeDataError : 'Ha ocurrido un error removiendo los datos',
        removeBioProcessError : 'Ha ocurrido un error removiendo el BioProceso',
        removeBioProcessInvalid : 'El BioProceso no puede ser removido',
        invalidRangeOfDates : 'El Rango de fechas es invalido',
        invalidBioProcess : 'El Bio Proceso seleccionado es invalido',
        bioProcessAddSuccess : 'El BioProceso ha sido agregado exitosamente',
        calculationAddSuccess : 'El Calculo ha sido registrado exitosamente',
        loadProcessRegistersError : 'Ha ocurrido un Error cargando los registros del Bio Proceso',

        //Success
        companyAddSuccess : 'La compañía ha sido agregada exitosamente',
        companyRemoveSucess : 'La compañía ha sido removida exitosamente',
        roleRemoveSuccess : 'El rol ha sido removido exitosamente',
        roleAddSuccess : 'El rol ha sido agregado exitosamente',
        factorAddSuccess : 'El factor ha sido agregado exitosamente',
        factorRemoveSuccess : 'El factor ha sido removido exitosamente',
        userAddSuccess : 'El usuario ha sido modificado exitosamente',
        removeUserSuccess : 'El usuario ha sido removido exitosamente',
        addDataSuccess : 'Los datos han sido agregados exitosamente',
        dataRemoveSucess : 'Los datos han sido removidos exitosamente',
        bioProcessRemoveSuccess : 'El BioProceso ha sido removido exitosamente',
        bioProcessNameRequired : 'El nombre del BioProceso es requerido'
    };

    /**
     * All system permited actions
     * @type {Object}
     */
    var actions = {
        // Users
        addUser :'addUser',
        editUser : 'editUser',
        viewListUser : 'viewListUser',
        removeUser: 'removeUser',
        //Companies
        addCompany : 'addCompany',
        viewListCompany : 'viewListCompany',
        removeCompany : 'removeCompany',
        // Roles
        addRole : 'addRole',
        viewListRole : 'viewListRole',
        removeRole : 'removeRole',
        // Factors
        addFactor : 'addFactor',
        viewListFactor : 'viewListFactor',
        removeFactor : 'removeFactor',
        //Bio Process
        addBioProcess : 'addBioProcess',
        viewBioProcess : 'viewBioProcess',
        removeBioProcess : 'removeBioProcess',
        // Data
        addDataCSV : 'addDataCSV',
        addDataManual : 'addDataManual',
        viewListData : 'viewListData',
        removeData : 'removeData',
        // Calculation
        generateCalculation : 'generateCalculation',
        viewListCalculation : 'viewListCalculation',
        removeCalculation : 'removeCalculation',
        // Reports
        reportCompanies : 'reportCompanies',
        reportFactors : 'reportFactors',
        reportBioProcesses : 'reportBioProcesses',
        reportData : 'reportData',
        reportCalculations : 'reportCalculations'
    };

    // Navigation control variable for menu
    var navBarItems = [
        {
            text : 'Equipos',
            class : 'bp-bio-process',
            state : 'bp-list',
            icon : './images/icons/bio_procesos_icon.png'
        },
        {
            text : 'Tipos de Equipos',
            class : 'bp-factor',
            state : 'factors-list',
            icon : './images/icons/tiposEquipos.png'
        },
        {
            text : 'Mantenimientos',
            class : 'bp-role',
            state : 'roles-list',
            icon : './images/icons/mantenimiento.png'
        },
        {
            text : 'Usuarios',
            class : 'bp-user',
            state : 'users-list',
            icon : './images/icons/user_icon.png'
        },

        // {
        //     text : 'Compañias',
        //     class : 'bp-company',
        //     state : 'companies-list',
        //     icon : './images/icons/companies_icon.png'
        // },
        // {
        //     text : 'Datos',
        //     class : 'bp-data',
        //     state : 'data-list',
        //     icon : './images/icons/data_icon.png'
        // },
        // {
        //     text : 'Reportes',
        //     class : 'bp-report',
        //     state : 'reports',
        //     icon : './images/icons/reportes_icon.png'
        // },
        // {
        //     text : 'Cálculos',
        //     class : 'bp-calculation',
        //     state : 'calculations-list',
        //     icon : './images/icons/calculos_icon.png'
        // }
    ];

    return {
        /**
         * Gets the configuration from file
         * @return {Objcet} [The configuration file to be used]
         */
        getConfiguration : function() {
            return configuration[currentEnvironment];
        },

        /**
         * Gets the page return messages
         * @return {[type]} [description]
         */
        getReturnMessages : function () {
            return returnMessages;
        },

        /**
         * Gets the system permited actions
         * @return {[type]} [description]
         */
        getSystemActions : function() {
            return actions;
        },

        /**
         * Gets the system navbar items
         * @return {[type]} [description]
         */
        getNavBarItems : function() {
            return navBarItems;
        }
    };
});

