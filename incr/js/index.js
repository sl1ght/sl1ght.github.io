(function () {
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML = (JSON && JSON.stringify ? JSON.stringify(message) : message);
        } else {
            logger.innerHTML = message;
        }
    }
})();

$(function() {

  var player = {
    workers: 1,
    available: 1,
    active: 0
  }

  var resources = {
    scrap: 0,
    food: 50,
    water: 30,
    gold: 0
  }

  var scr = {
    time: 5,
    prog: 0,
    use: true,
    workers: 0,
    wrkmx: 1
  }

  var aqdc = {
    time: 5,
    prog: 0,
    use: true,
    workers: 0,
    wrkmx: 1
  }

  var gprc = {
    time: 5,
    prog: 0,
    use: true,
    workers: 0,
    wrkmx: 1
  }

  var commune = {
    popAdd: 1,
    buildings: 0,
    shelters: 0
  }

  var costs = {
    workbench: 25,
    shelter: 50,
    goldproc: 200
  }

  var artifacts = {
    one: {
      "owned": 0,
      "name":"Endurance",
      "cost": 10
    },
    five: {
      "owned": 0,
      "name":"Abundance",
      "cost": 25
    },
    mult: 1
  }

  $("#reset").click(function() {
    location.reload();
  })

  $("#scrap-gather").click(function() {
    if (scrap.use === true) {
      gatherScrap()
    }
  })

  $("#addWorker").click(function() {
    if (player.available >= 1 && scr.workers < scr.wrkmx) {
      scr.workers += 1;
      player.available -= 1;
      player.active += 1;
    }
  })

  $("#subtractWorker").click(function() {
    if (scr.workers >= 1) {
      scr.workers -= 1;
      player.available += 1;
      player.active -= 1;
    }
  })

  $("#addAQWorker").click(function() {
    if (player.available >= 1 && aqdc.workers < aqdc.wrkmx) {
      aqdc.workers += 1;
      player.available -= 1;
      player.active += 1;
    }
  })

  $("#subtractAQWorker").click(function() {
    if (aqdc.workers >= 1) {
      aqdc.workers -= 1;
      player.available += 1;
      player.active -= 1;
    }
  })

  $("#addGPWorker").click(function() {
    if (player.available >= 1 && gprc.workers < gprc.wrkmx) {
      gprc.workers += 1;
      player.available -= 1;
      player.active += 1;
    }
  })

  $("#subtractGPWorker").click(function() {
    if (gprc.workers >= 1) {
      gprc.workers -= 1;
      player.available += 1;
      player.active -= 1;
    }
  })


  $("#craftWorkbench").click(function() {
    if (resources.scrap >= 25) {
      resources.scrap -= 25;
      $("#cwkb").fadeOut();
      $("#nav-build-tab").removeAttr("hidden");
      update()
    }
  })

  $("#craftGProc").click(function() {
    if (resources.scrap >= 200) {
      resources.scrap -= 200;
      $("#cgpr").fadeOut();
      $("#gprc").removeAttr("hidden");
    }
  })

  $("#buildShelter").click(function() {
    if (resources.scrap >= 50) {
      resources.scrap -= 50;
      commune.shelters += 1;
      commune.buildings += 1;
      update()
    }
  })

$("#art1").click(function(){
  if (resources.gold >= artifacts.one.cost) {
    resources.gold -= artifacts.one.cost;
    artifacts.one.owned += 1;
    artifacts.one.cost *= 1.5;
    artifacts.one.cost == Math.ceil(artifacts.one.cost);
    $("#a1owned").html(artifacts.one.owned);
    $("#a1name").html(artifacts.one.name);
    $("#a1cost").html(artifacts.one.cost);
  }
})

$("#art5").click(function(){
  if (resources.gold >= artifacts.five.cost) {
    resources.gold -= artifacts.five.cost;
    artifacts.five.owned += 1;
    artifacts.five.cost *= 1.5;
    artifacts.five.cost == Math.ceil(artifacts.five.cost);
    $("#a5owned").html(artifacts.five.owned);
    $("#a5name").html(artifacts.five.name);
    $("#a5cost").html(artifacts.five.cost);
  }
})


  function food() {
    if (player.active > 0) {
      resources.food -= player.active;
      if (resources.food <= 0) {
        die()
      }
      update()
    }
  }

  function water() {
    if (player.active > 0) {
      resources.water -= player.active;
      if (resources.water === 0) {
        die()
      }
      update()
    }
  }


  function gatherScrap() {
    if (scr.workers >= 1) {
      resources.scrap += scr.workers*(artifacts.mult+artifacts.one.owned);
      console.log("Scrap gathered")
      update()
    }
  }

  function mine() {
    if (gprc.workers >= 1) {

      var findGold = Math.floor(Math.random() * 3) + 1;

      switch (findGold) {
        case 1:
          resources.gold += gprc.workers*(artifacts.mult+artifacts.five.owned);
          console.log("Gold found!")
          break;
        case 2:
          console.log("No gold here...")
          break;
        case 3:
          console.log("No gold here...")
          break;
        default:

      }

      update()
    }
  }

  function aqueduct() {
    if (aqdc.workers >= 1) {
      var aqgain = Math.floor(Math.random() * 2) + 1;

      switch (aqgain) {
        case 1:
          var foodgain = Math.floor(Math.random() * 6) + 1;
          resources.food += foodgain * aqdc.workers;
          console.log(foodgain + " Food gathered");
          break;
        case 2:
          var watergain = Math.floor(Math.random() * 4) + 1;
          resources.water += watergain * aqdc.workers;
          console.log(watergain + " Water gathered");
          break;
      }

      update()
    }
  }

  var minekey = false;

  function unlockMine() {
    if (resources.scrap >= 100 && minekey === false) {
      minekey = true;

    }
  }

  function attractPop() {
    if (commune.buildings >= 1) {

      var attrChance = Math.floor(Math.random() * 4) + 1;

      switch (attrChance) {
        case 1:

          player.workers += commune.buildings;
          player.available += commune.buildings;
          scr.wrkmx = player.workers;
          aqdc.wrkmx = player.workers;
          gprc.wrkmx = player.workers;
          console.log("Worker added! Total: " + player.workers)

          break;
        case 2:

          console.log("No workers added")

          break;
        case 3:

          console.log("No workers added")

          break;
        case 4:

          console.log("No workers added")

          break;
        default:

      }

      update()
    }
  }



  function update() {
    let g = 1;

    $("#scrap-count").html(resources.scrap);
    $("#food-count").html(resources.food);
    $("#water-count").html(resources.water);
    $("#gold-count").html(resources.gold);

    $("#scrpWrk").html(scr.workers)
    $("#scrapWrkers").html(scr.workers)
    $("#scrpWrkMx").html(scr.wrkmx)
    $("#gprcWrk").html(gprc.workers)
    $("#gprcWrkers").html(gprc.workers)
    $("#gprcWrkMx").html(gprc.wrkmx)
    $("#aqdcWrk").html(aqdc.workers)
    $("#aqdcWrkers").html(aqdc.workers)
    $("#aqdcWrkMx").html(aqdc.wrkmx)
    $("#aqdcWrk").html(aqdc.workers)
    $("#aqdcWrkers").html(aqdc.workers)
    $("#aqdcWrkMx").html(aqdc.wrkmx)

    $("#shelter-count").html(commune.shelters)
    $("#popDisplay").html(player.workers)
  }

  function buttonUpdate() {
    if (resources.scrap >= costs.workbench) {
      $("#craftWorkbench").removeAttr("disabled");
    }

    if (resources.scrap >= costs.shelter) {
      $("#buildShelter").removeAttr("disabled");
    }

    if (resources.scrap >= costs.goldproc) {
      $("#craftGProc").removeAttr("disabled");
    }

    if (resources.scrap >= 50) {
      $("#cgpr").removeAttr("hidden");
    }

    if (resources.gold >= 10) {
      $("#artifactsButton").removeAttr("hidden");
    }

  }


  function die() {
    setTimeout(function() {
      console.log("Ded")
      $("#staticBackdrop").modal('show');
    }, 1000);
  }

  function showEndGameModal() {
    var modal = document.getElementById('endGameModal');
    modal.style.display = "block";
  }

  function artifactsMult() {
    if (artifacts.one.owned >= 1) {

    }
  }

  setInterval(function() {
    update()
    buttonUpdate()
  }, 50)

  setInterval(function() {
    food()
  }, 5000)

  setInterval(function() {
    water()
  }, 9000)

  setInterval(function() {
    aqueduct()
  }, 3000)

  setInterval(function() {
    mine()
  }, 7500)

  setInterval(function() {
    attractPop()
  }, 7000)

  setInterval(function() {
    gatherScrap()
  }, 800)




})
