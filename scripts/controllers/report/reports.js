// *
// * Author:      Fabian Arce Molina - sarcem1111@gmail.com
// * Date:        10 Oct 2016
// * Description: The reports controller
//

'use strict';

// Handles the report controller logic
bioPredictorApp.controller('reportsController', ['$scope', '$rootScope', 'rolesService', 'companiesService', 'factorsService', 'usersService','bioProcessesService',
function($scope, $rootScope, rolesService, companiesService, factorsService, usersService, bioProcessesService)
{

  $rootScope.isLogin = false;
  $rootScope.isMenu = false;

  $scope.reports = [];
  $scope.companies = [];
  $scope.bioProcesses = [];
  $scope.showCompanyFilter = false;
  $scope.showBioProcessFilter = false;

  $scope.companiesList = {company:{companyId:-1, name: "No Filter"}};
  $scope.bioProcessesList = {bioProcess:{processId:-1, name: "No Filter"}};
  var downloadButton = document.getElementById("downloadButton");

  $rootScope.displayLoading();

  companiesService.getCompanies()
  .then(function(pCompanies)
  {
    $scope.companies = [];
    $scope.companies.push({companyId:-1, name: "Sin filtro"});
    $scope.companies = $scope.companies.concat(pCompanies);
  })
  .catch(function(pError)
  {
    displayError($rootScope.returnMessages.loadRolesError);
  });
/*
  bioProcessesService.getBioProcesses()
  .then(function(pBioProcesses)
  {
    $scope.bioProcesses.push({processId:-1, name: "Sin filtro"});
    $scope.bioProcesses = pBioProcesses;
  })
  .catch(function(pError)
  {
    displayError($rootScope.returnMessages.loadRolesError);
  });
*/
  $rootScope.hideLoading();

  $scope.getBioProcessesReport = function(pCompany)
  {
    $scope.showCompanyFilter = true;
    $scope.showBioProcessFilter = false;
    $scope.downloadName = "Descargar reporte de BioProcesos";
    $scope.showDownload = true;

    $rootScope.displayLoading();
    bioProcessesService.getBioProcessesReport(pCompany)
    .then(function(pBioProcesses)
    {
      loadCSVFromJSON(pBioProcesses, "Reporte de bioProcesos - BioPredictor");
      createReport(pBioProcesses);
    })
    .catch(function(pError)
    {
      displayError($rootScope.returnMessages.loadRolesError);
      $rootScope.hideLoading();
    });
  };

  $scope.getCompaniesReport = function(pCompany)
  {
    $scope.showCompanyFilter = true;
    $scope.showBioProcessFilter = false;
    $scope.downloadName = "Descargar reporte de compañias";
    $scope.showDownload = true;

    $rootScope.displayLoading();
    companiesService.getCompaniesReport(pCompany)
    .then(function(pCompanies)
    {
      loadCSVFromJSON(pCompanies, "Reporte de compañias - BioPredictor");
      createReport(pCompanies);
    })
    .catch(function(pError)
    {
      displayError($rootScope.returnMessages.loadRolesError);
      $rootScope.hideLoading();
    });
  };

  $scope.getFactorsReport = function(pCompany)
  {
    $scope.showCompanyFilter = true;
    $scope.showBioProcessFilter = false;
    $scope.downloadName = "Descargar reporte de factores";
    $scope.showDownload = true;

    $rootScope.displayLoading();
    factorsService.getFactorsReport(pCompany)
    .then(function(pFactors)
    {
      loadCSVFromJSON(pFactors, "Reporte de factores - BioPredictor");
      createReport(pFactors);
    })
    .catch(function(pError)
    {
      displayError($rootScope.returnMessages.loadRolesError);
      $rootScope.hideLoading();
    });
  };

  function createReport(pData)
  {
      $scope.reports = [];

      var elements =
      {
        element:[]
      };

      for (var i = 0; i < pData.length; i++)
      {
        Object.keys(pData[i]).forEach(function(key)
        {
          elements.element.push
          (
            {title: key,content: pData[i][key]}
          );
        });

        $scope.reports.push(elements);

        elements =
        {
          element:[]
        };
      };
      //alert(JSON.stringify($scope.reports)); For debug
      $rootScope.hideLoading();
  };

  function loadCSVFromJSON(pJSONArray, pCSVName)
  {
    if(pJSONArray != "")
    {
      var array = typeof pJSONArray != 'object' ? JSON.parse(pJSONArray) : pJSONArray;
      var csvContent = "data:text/csv;charset=utf-8,";

      Object.keys(pJSONArray[0]).forEach(function(key)
      {
        csvContent += key +',';
      });

      csvContent += '\r\n';

      for (var i = 0; i < array.length; i++)
      {
          var line = '';
          for (var index in array[i])
          {
              if (line != '')
                line += ','
              line += array[i][index];
          }
          csvContent += line + '\r\n';
      };

      downloadButton.setAttribute("href", encodeURI(csvContent));
      downloadButton.setAttribute("download", pCSVName + ".csv");

    }
  };
}]);
