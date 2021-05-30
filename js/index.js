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

  var notes = "Notes";


$("#notes").click(function(){
  if (notes === "Notes") {
    notes = "This is version 0.1 <br>so some things won't work <br>or are improperly balanced!"
    $(this).html(notes)
  } else {
    $(this).fadeOut();
  }
})

  var player = {
    workers: 1,
    available: 1,
    active: 0,
    merchants: 0
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
    shelters: 0,
    shops: 0
  }

  var costs = {
    workbench: 20,
    shelter: 40,
    goldproc: 100
  }

  var shop = {
    merchants: {
      "total":0,
      "available":0,
      "food":0,
      "water":0
    },
    holding: {
      "food":0,
      "water":0
    },
    price: {
      "food":1,
      "water":1
    }

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

  var firstTime = true;

  $("#addWorker").click(function() {
    if (player.available >= 1 && scr.workers < scr.wrkmx) {
      scr.workers += 1;
      player.available -= 1;
      player.active += 1;

      if (firstTime === true) {
        console.log("You've assigned a task. Now you're gathering scrap, but your resources are finite. Might wanna keep an eye on that...")
        firstTime = false;
      }
    }
  })

  $("#subtractWorker").click(function() {
    if (scr.workers >= 1) {
      scr.workers -= 1;
      player.available += 1;
      player.active -= 1;
    }
  })

  var firstTimeAQ = true;

  $("#addAQWorker").click(function() {
    if (player.available >= 1 && aqdc.workers < aqdc.wrkmx) {
      aqdc.workers += 1;
      player.available -= 1;
      player.active += 1;

      if (firstTimeAQ === true) {
        console.log("Now your party is exploring the Aqueduct. You'll find random bits of food or water regularly.")
        firstTimeAQ = false;
      }

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
    if (resources.scrap >= costs.workbench) {
      resources.scrap -= costs.workbench;
      $("#cwkb").fadeOut();
      $("#nav-build-tab").removeAttr("hidden");
      console.log("Workbench crafted! You can now make buildings.")
      update()
    }
  })

  $("#craftGProc").click(function() {
    if (resources.scrap >= 100) {
      resources.scrap -= 100;
      $("#cgpr").fadeOut();
      $("#gprc").removeAttr("hidden");
    }
  })

  $("#buildShelter").click(function() {
    if (resources.scrap >= costs.shelter) {
      resources.scrap -= costs.shelter;
      costs.shelter *= 1.6
      costs.shelter = Math.round(costs.shelter)
      commune.shelters += 1;
      commune.buildings += 1;
      update()
      if (player.workers === 1) {
        player.workers += 1;
        player.available += 1;
        scr.wrkmx = player.workers;
        aqdc.wrkmx = player.workers;
        gprc.wrkmx = player.workers;
        console.log("First worker arrived! Shelters have a random chance of attracting another every so often.")
        update()
      }
    }
    update()
  })

  $("#buildShop").click(function() {
    if (resources.scrap >= 300) {
      resources.scrap -= 300;
      commune.shops += 1;
      player.merchants += 1;
      shop.merchants.total += 1;
      shop.merchants.available += 1;
      commune.buildings += 1;
      //$("#nav-contact-tab").removeAttr("hidden");
      update()
    }
  })

//SHOP SHIT

$("#addFM").click(function(){
  if (shop.merchants.available >= 1) {
    shop.merchants.available -= 1;
    shop.merchants.food += 1;
  }
})

$("#subFM").click(function(){
  if (shop.merchants.food >= 1) {
  shop.merchants.available += 1;
  shop.merchants.food -= 1;
}
})



$("#addWM").click(function(){
  if (shop.merchants.available >= 1) {
    shop.merchants.available -= 1;
    shop.merchants.water += 1;
  }
})

$("#subWM").click(function(){
  if (shop.merchants.water >= 1) {
  shop.merchants.available += 1;
  shop.merchants.water -= 1;
}
})

$("#buyFood").click(function(){
  if (resources.gold >= shop.price.food) {
    resources.gold -= shop.price.food;
    resources.food += shop.holding.food;
    shop.holding.food = 0;
    shop.price.food = 1;
  }
})

$("#buyWater").click(function(){
  if (resources.gold >= shop.price.water) {
    resources.gold -= shop.price.water;
    resources.water += shop.holding.water;
    shop.holding.water = 0;
    shop.price.water = 1;
  }
})


function runShop() {
  if (shop.merchants.food >= 1) {
    shop.holding.food += shop.merchants.food*5;
    shop.price.food += Math.ceil(shop.merchants.food*1.2);
  }

  if (shop.merchants.water >= 1) {
    shop.holding.water += shop.merchants.water*3;
    shop.price.water += Math.ceil(shop.merchants.water*1.4);
  }
}

setInterval(function(){
  runShop()
},2000)

function shopDate() {
  $("#foodMrch").text(shop.merchants.food)
  $("#waterMrch").text(shop.merchants.water)

  $("#shopFood").text(shop.holding.food)
  $("#shopWater").text(shop.holding.water)

  $("#foodPrice").text(shop.price.food)
  $("#waterPrice").text(shop.price.water)

}

setInterval(function(){
  shopDate()
},50)





$("#art1").click(function(){
  if (resources.gold >= artifacts.one.cost) {
    resources.gold -= artifacts.one.cost;
    artifacts.one.owned += 1;
    artifacts.one.cost *= 1.5;
    artifacts.one.cost = Math.round(artifacts.one.cost);
    $("#a1owned").text(artifacts.one.owned);
    $("#a1name").text(artifacts.one.name);
    $("#a1cost").text(numberformat.format(artifacts.one.cost));
  }
})

$("#art5").click(function(){
  if (resources.gold >= artifacts.five.cost) {
    resources.gold -= artifacts.five.cost;
    artifacts.five.owned += 1;
    artifacts.five.cost *= 1.5;
    artifacts.five.cost = Math.round(artifacts.five.cost);
    $("#a5owned").text(artifacts.five.owned);
    $("#a5name").text(artifacts.five.name);
    $("#a5cost").text(numberformat.format(artifacts.five.cost));
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
      resources.water -= player.active+1;
      if (resources.water <= 0) {
        die()
      }
      update()
    }
  }


  function gatherScrap() {
    if (scr.workers >= 1) {
      resources.scrap += scr.workers*(artifacts.mult+artifacts.one.owned);
    //  console.log("Scrap gathered")
      update()
    }
  }

  function mine() {
    if (gprc.workers >= 1) {

      var findGold = Math.floor(Math.random() * 2) + 1;

      switch (findGold) {
        case 1:
          resources.gold += gprc.workers*(artifacts.mult+artifacts.five.owned);
          console.log("Gold found!")
          break;
        case 2:
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
          //console.log(foodgain + " Food gathered");
          break;
        case 2:
          var watergain = Math.floor(Math.random() * 4) + 1;
          resources.water += watergain * aqdc.workers;
          //console.log(watergain + " Water gathered");
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

          //console.log("Worker added! Total: " + player.workers)

          break;
        case 2:

          //console.log("No workers added")

          break;
        case 3:

          //console.log("No workers added")

          break;
        case 4:

          //console.log("No workers added")

          break;
        default:

      }

      update()
    }
  }



  function update() {
    let g = 1;

    $("#scrap-count").text(numberformat.format(resources.scrap));
    $("#food-count").text(numberformat.format(resources.food));
    $("#water-count").text(numberformat.format(resources.water));
    $("#gold-count").text(numberformat.format(resources.gold));

    $("#scrpWrk").text(scr.workers)
    $("#scrapWrkers").text(scr.workers)
    $("#scrpWrkMx").text(scr.wrkmx)
    $("#gprcWrk").text(gprc.workers)
    $("#gprcWrkers").text(gprc.workers)
    $("#gprcWrkMx").text(gprc.wrkmx)
    $("#aqdcWrk").text(aqdc.workers)
    $("#aqdcWrkers").text(aqdc.workers)
    $("#aqdcWrkMx").text(aqdc.wrkmx)
    $("#aqdcWrk").text(aqdc.workers)
    $("#aqdcWrkers").text(aqdc.workers)
    $("#aqdcWrkMx").text(aqdc.wrkmx)

    $("#shopWrk").text(shop.merchants.total)

    $("#shelterCost").text(numberformat.format(costs.shelter))

    $("#shelter-count").text(commune.shelters)
    $("#shop-count").text(commune.shops)
    $("#popDisplay").text(player.workers)
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

    if (resources.scrap >= 40) {
      $("#cgpr").removeAttr("hidden");
    }

    if (resources.gold >= 10) {
      $("#artifactsButton").removeAttr("hidden");
    }

    if (resources.scrap >= 300) {
      $("#buildShop").removeAttr("disabled");
    }

    if (resources.scrap >= 5) {
      $("#nav-craft-tab").removeAttr("hidden");
    }

    if (commune.buildings >= 1) {
      $("#nav-population-tab").removeAttr("hidden");
    }

    if (gprc.workers >= 1) {
      $("#exploring-mines").removeAttr("hidden");
    }

    if (player.merchants >= 1) {
      $("#shopRow").removeAttr("hidden");
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
  }, 900)




})
