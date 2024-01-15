// @OnlyCurrentDoc

function sheetName() {
    return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
  }
  
  function setupChartDuel() {
    // Function to adjust the range on ELO (Y-)axis.
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    let pseudo = sheet.getRange(4, 2).getValue();
    let nb_value = sheet.getRange('Data_Duel!D1').getValue();
  
    let rangeYAxis = 'Data_Duel!C2:C'+nb_value.toString();
    const newtitle = "ELO evolution " + pseudo;
  
    let charts = sheet.getCharts();
    for (var i in charts) {
      var chart = charts[i];
      if (chart.getOptions().get('title') != null){
        if (chart.getOptions().get('title').startsWith("ELO")) {
          var myChart = chart;
        }
      }
    }
  
    let yAxis = sheet.getRange(rangeYAxis);
    let yAxisValues = yAxis.getValues().flat();
  
    // set lower and higher bound to be 100 away from max and min values (e.g. 100)
    const offset = 50;
    const minVal = Math.min.apply(Math, yAxisValues) - offset;
    const maxVal = Math.max.apply(Math, yAxisValues) + offset;
   
    var finalChart = myChart.modify()
      .setOption('title', newtitle)
      .setOption('vAxes.0.viewWindow.max', maxVal)
      .setOption('vAxes.0.viewWindow.min', minVal)
      .build();
    sheet.updateChart(finalChart);  
  }
  
  function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Graph Duel')
        .addItem('Run setup chart duel', 'setupChartDuel')
    .addToUi();
    ui.createMenu('Force refresh')
        .addItem('Force refresh countries/rounds', 'forceRefreshCountries')
        .addItem('Force refresh Opponents_ELO', 'forceRefreshOpponentsELO')
    .addToUi();
  }
  
  function myFunction() {
    SpreadsheetApp.getUi()
       .alert('Running Chart Duel Setup');
  }
  
  function computeDiffCols(array=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    const result = [];
    let idx = 1;
    let val1 = 0;
    let val2 = 0;
    array.flat().forEach(value => {
      if (idx == 2) {
        val1 = value;
        idx += 1;
      } else if (idx == 3) {
        val2 = value;
        idx += 1;
      } else if (idx == 4){
        if (val1 != "No Guess" && val2 != "No Guess") {
          result.push(val1-val2);
        }
        val1 = 0;
        val2 = 0;
        idx = 1;
      } else {
        idx += 1;
      }
    });
    return result;
  }
  
  function removeDuplicates(arr) {
      return [...new Set(arr)];
  }
  
  function resize(array, i, j) {
      var gen = array.reduce((a, b) => a.concat(b))[Symbol.iterator]();
      
      return Array.from({ length: i }, _ => Array.from({ length: j }, _ => gen.next().value));
  }
  
  function computeDataCountryDuel(rounds, dummy) {
    // Code to compute data per country on each round
  
    let result = [];
  
    rounds = resize(rounds, rounds.length * rounds[0].length/4, 4);
    var filteredRounds = {};
  
    // Output : Nb rounds | Winrate | Mean dist | Δmean | Mean time
    // Input : R1 country |	R1 dist. Opp |	R1 dist. me |	R1 guess time
    rounds.forEach(round => {
      let country = round[0];
      let hasWin = (round[2] > round[1]) === true ? 0 : 1;
      if (country != ''){
        if (!round.includes("No Guess")) {
          if (country in filteredRounds) {
            let newVals = [
              filteredRounds[country][0] + 1, 
              filteredRounds[country][1] + hasWin, 
              filteredRounds[country][2] + round[2], 
              filteredRounds[country][3] + round[1]-round[2], 
              filteredRounds[country][4] + round[3],
              filteredRounds[country][5],
              filteredRounds[country][6]
              ];
            filteredRounds[country] = newVals;
          }
          else{
            filteredRounds[country] = [1, hasWin, round[2], round[1]-round[2], round[3], 0, 0];
          }
        }
        else{
          let hasWin = 0;
          let myDist = 0;
          let time = 0;
          if (round[1] == "No Guess"){
            hasWin = 1;
            myDist = round[2];
            time = round[3];
          }
          if (country in filteredRounds) {
            filteredRounds[country][0] = filteredRounds[country][0] + 1;
            filteredRounds[country][1] = filteredRounds[country][1] + hasWin;
            filteredRounds[country][5] = filteredRounds[country][5] + 1 - hasWin;
            filteredRounds[country][6] = filteredRounds[country][6] + hasWin;
          }
          else{
            filteredRounds[country] = [1, hasWin, myDist, 0, time, 1 - hasWin, hasWin];
          }
        }
      }
    });
    for (const [key, value] of Object.entries(filteredRounds)){
      nbGame = value[0];
      nbGameMinOppNG = nbGame - value[6];
      nbGameMinNG = nbGameMinOppNG - value[5];
      if (nbGame > value[5] + value[6]){
        let newVals = [key, nbGame, value[1]/nbGame, value[2]/nbGameMinOppNG, value[3]/nbGameMinNG, value[4]/nbGameMinOppNG];
        result.push(newVals);
      }
    }
    return result
  }
  
  function forceRefreshCountries(){
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data_duel');
    sheet.getRange('AI1').setValue(new Date().toTimeString());
    return
  }
  
  function forceRefreshOpponentsELO(){
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Opponents_ELO');
    const cell = sheet.getRange('A3')
    const content = cell.getFormula()
    cell.clearContent();
    SpreadsheetApp.flush();
    cell.setValue(content);
    return
  } 