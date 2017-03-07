// *
// * Author:      Luis Carlos Cruz - kalo070995@gmail.com
// * Date:        06 Set 2016
// * Description: Modify role controller file
//

bioPredictorApp.controller('modifyRoleController2',['$rootScope','$scope','$uibModalInstance', 'rolesService', 'factorsService',
function ($rootScope, $scope, $uibModalInstance, rolesService, factorsService) {


    var init = function () {

     $rootScope.displayLoading();

      factorsService.getEquipments()
      .then(function(pEquipments) {
        $scope.equipments = pEquipments;
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadEquipmentsError);
        $rootScope.hideLoading();
      });


    };

    /**
     * Sets current role actions as marked on UI
     * @return {[type]} [description]
     */
    var mergeActions = function () {

        $scope.displayActions = [];

        for(var actionIndex = 0; actionIndex < $scope.systemActions.length; actionIndex++) {
            var action = $scope.systemActions[actionIndex];

            if(isInArray(action)) {
                action.class = 'bp-calculation';
            } else {
                action.class = null;
            }

            $scope.displayActions.push(action);
        }
    };

    var isInArray = function(pElement) {

        var result = false;
        var roleActions = $scope.roleActions;

        for(var actionIndex = 0; actionIndex < roleActions.length; actionIndex++) {
            var action = roleActions[actionIndex];

            if(action.actionId === pElement.actionId) {

                result = true;
                break;
            }
        }

        return result;
    };

    /**
     * Displays error massage on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displayError = function(pMessage){
        $scope.errorMessage = pMessage;
        $scope.error = true;
    };

    /**
     * Displays the success message on UI
     * @param  {string} pMessage [The message to be displayed]
     * @return {[type]}          [description]
     */
    var displaySuccess = function(pMessage) {
        $scope.successMessage = pMessage;
        $scope.success = true;
    };

    /**
     * Creates the role object to be sent to service
     * @param {Object} pRole [The role object to be save]
     */
    var addRole = function(pRole) {

        $rootScope.displayLoading();
        pRole.actionIds = getSelectedActions();

        rolesService.addRole(pRole)
        .then(function(pRoleId) {
            $scope.role = null;
            displaySuccess($rootScope.returnMessages.roleAddSuccess);
            init();
            $scope.loadRoles();
        })
        .catch(function(pError) {
            console.log(pError);
            displayError($rootScope.returnMessages.requestError);
        })
        .finally(function(){
            $rootScope.hideLoading();
        });
    };

    /**
     * Gets the current selected actions on UI
     * @return {List[Object]} [The list of actions selected for the specified role]
     */
    var getSelectedActions = function () {

        var selectedActions = [];
        var displayActions = $scope.displayActions;

        for(var actionIndex = 0; actionIndex < displayActions.length; actionIndex++) {

            var action = displayActions[actionIndex];

            // Enter the selected action on new array
            if(action.class) {
                selectedActions.push(action.actionId);
            }
        }

        return selectedActions;
    };


    $scope.modifyAction = function (pAction) {
        pAction.class = (pAction.class) ? null : 'bp-calculation';
    };


    /**
     * Hanldes the button save action
     * @return {[type]} [description]
     */
    $scope.save = function () {


            if($scope.selectedEquipment && $scope.startDate && $scope.endDate) {
                $scope.getUpkeepsXDate();
                
                
            } else {
                displayError($rootScope.returnMessages.fieldsRequired);
            }

 
    };

    /**
     * Hides the modal
     * @return {[type]} [description]
     */
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * Clears the alerts handler
     * @return {void} []
     */
    $scope.clearAlert = function (pIsError) {

        if(pIsError) {
            $scope.error = false;
            $scope.errorMessage = '';
        } else {
            $scope.success = false;
            $scope.successMessage = '';
        }
    };

    var genPDF = function(pSelectedUpkeeps){
        var doc=new jsPDF();
        console.log(pSelectedUpkeeps);
        var canvas = document.getElementById('myCanvas');
        var dataURL = canvas.toDataURL();
        doc.addImage(dataURL,'JPEG',10,1,180,100);
        doc.setFontSize(20);
        doc.setFont("cambria");
        doc.text(40,60,'Informe de Mantenimiento Preventivo');
        doc.setFontSize(11);
        doc.text(15,75,'Unidad de Tratamiento:');
        doc.text(55,75,$scope.selectedEquipment.treatmentUnit);
        doc.text(15,80,'Tipo de Equipo:');
        doc.text(45,80,$scope.selectedEquipment.name);
        doc.text(15,85,'Modelo:');
        doc.text(35,85,$scope.selectedEquipment.model);
        doc.text(15,90,'Marca:');
        doc.text(35,90,$scope.selectedEquipment.brand);
        doc.text(15,95,'Voltaje Nominal:');
        doc.text(45,95,$scope.selectedEquipment.voltage.toString());
        doc.text(80,90,'Amperios Nominal:');
        doc.text(113,90,$scope.selectedEquipment.ampers.toString());
        doc.text(80,95,'Potencia Nominal:');
        doc.text(110,95,$scope.selectedEquipment.name.toString());
        doc.text(130,75,'Código:');
        doc.text(150,75,$scope.selectedEquipment.code);
        var y = 65
        var max = 1;
        for(var i = 0; i<$scope.selectedUpkeeps.length; i++){
          if(max == 4){
            doc.addImage(dataURL,'JPEG',10,240,180,100);
            doc.addPage();
            y  = 0;
            max = 0;
          }
          y+=45;
          doc.setFontSize(12);
          doc.setFont("cambria","bold");
          doc.text(15,y,$scope.selectedUpkeeps[i].NAME);
          doc.setFont("cambria","regular");
          y+=5;
          doc.text(15,y,"Descripción: "+$scope.selectedUpkeeps[i].DESCRIPTION);
          max+=1;
          doc.text(15,y+5,"Detalle: ");

        }
        doc.addImage(dataURL,'JPEG',10,240,180,100);
        doc.addPage();
        doc.setFont("cambria","bold");
        doc.text(15,45,"Otras revisiones o reparaciones:");
        doc.text(15,120,"Observaciones o recomendaciones:");
        doc.text(15,200,"Fotos durante el mantenimiento");
        doc.addImage(dataURL,'JPEG',10,240,180,100);



        doc.save('Reporte Aminsa.pdf');

    };

    $scope.getUpkeepsXDate = function () {
      $rootScope.displayLoading();
      $scope.factor = {};
      console.log();
      $scope.factor.startDate = document.getElementById("startD").value;
      $scope.factor.endDate = document.getElementById("endD").value;
      $scope.factor.equipmentId = $scope.selectedEquipment.equipmentId;
      rolesService.getUpkeepsXDate($scope.factor)
      .then(function(pUpkeeps) {
        $scope.selectedUpkeeps = pUpkeeps;
        genPDF($scope.selectedUpkeeps);
        $rootScope.hideLoading();
      })
      .catch(function(pError) {
        displayError($rootScope.returnMessages.loadUpkeepsError);
        $rootScope.hideLoading();
      });
    };



    init();

}]);
