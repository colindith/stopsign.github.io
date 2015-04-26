
setInterval(function() {
	tick();
},50);
globalId = 0;
zIndex = 10000000000;
unitsThroughOnRight = 0;
unitsThroughOnLeft = 0;
exitLineRightTimer = 0;
exitLineLeftTimer = 0;

units = [[],[],[],[],[],[]];
linesEnabled = 6;
for(j = 0; j < linesEnabled; j++) {
	addUnit("soldier", j, "left", 3);
}
//addUnit("soldier", 0, "right", 2);
//addUnit("spear", 0, "right", 1);
//addUnit("soldier", 0, "right");
//addUnit("soldier", 0, "right");
//addUnit("soldier", 0, "right");

soldierSpawnRate = 2;
spearSpawnRate = .5;
enemySpawnRate = 15;
curBattles = [];
timer = 0;
stop = 0;
totalTicks = 0
function tick() {
	totalTicks++;
	if(stop)
		return
	moveUnits()
	checkForUnitAtEnds()
	handleLineTimer()
	checkForUnitCollisions()
	handleEngaged()
	if(timer % 2 == 0) {
		handleSpawnRates()
		handleBattles()
	}
	
	timer++;
	if(timer === 10) {
		halfSecond()
	}
	if(timer >= 20) {
		halfSecond()
		timer = 0;
	}
}

function halfSecond() {
}

function handleEngaged() {
}

function handleSpawnRates() {
	soldierSpawnRate -= .09999;
	if(soldierSpawnRate <= 0) {
		j = Math.floor(Math.random() * linesEnabled)
		addUnit("soldier", j, "right", 1);
		soldierSpawnRate = 1;
	}
	spearSpawnRate -= .09999;
	if(spearSpawnRate <= 0) {
		j = Math.floor(Math.random() * linesEnabled)
		addUnit("spear", j, "right", 1);
		spearSpawnRate = 4;
	}
	enemySpawnRate -= .09999;
	if(enemySpawnRate <= 0) {
		for(j = 0; j < linesEnabled; j++) {
			addUnit("soldier", j, "left", 1);
		}
		enemySpawnRate = 15;
	}
	updateSpawnTimers()
}

function moveUnits() {
	for(y = 0; y < units.length; y++) {
		for(x = 0; x < units[y].length; x++) {
			if(units[y][x].engaged.length === 0) {
				if(units[y][x].direction == "right") {
					units[y][x].pos += units[y][x].speed;
				}
				else {
					units[y][x].pos -= units[y][x].speed;
				}
			}
			updateUnitPos(y, x)
		}
	}
}

function checkForUnitAtEnds() {
	triggerForDelete=[];
	for(y = 0; y < units.length; y++) {
		for(x = 0; x < units[y].length ; x++) {
			if(units[y][x].direction === "right" && units[y][x].pos > 93) { //unit made it to the right
				unitsThroughOnRight+=units[y][x].unitCount;
				document.getElementById("unitsThroughOnRight").innerHTML = unitsThroughOnRight
				exitLineRightTimer = 8
				triggerForDelete.push(units[y][x])
			}
			else if(units[y][x].direction != "right" && units[y][x].pos < 5) { //enemy got through
				unitsThroughOnLeft++;
				document.getElementById("unitsThroughOnLeft").innerHTML = unitsThroughOnLeft
				exitLineLeftTimer = 8
				triggerForDelete.push(units[y][x])
			}
		}
	}
	deleteUnitsInList(triggerForDelete)
}

function checkForUnitCollisions() {
triggerForDelete=[];
	for(y = 0; y < units.length; y++) {
		for(x = 0; x < units[y].length ; x++) {
			
			for(z = 0; z < units.length; z++) {
				for(w = 0; w < units[z].length; w++) {
					if(y == z && w == x)
						continue
					test = 0
					for(i = 0; i < triggerForDelete.length; i++) {
						if(triggerForDelete[i].equals(units[y][x])) {
							test = 1
							break
						}
					}
					if(test) {
						continue;
					}
					for(i = 0; i < units[y][x].engaged.length; i++) {
						if(units[y][x].engaged[i].equals(units[z][w])) {
							test = 1
							break
						}
					}
					if(test) {
						continue;
					}
					//Ranged:
					if(units[y][x].type=="spear") {
						if((Math.abs(y-z)<=1)&&units[z][w].direction != units[y][x].direction) {
							if(Math.abs(units[y][x].pos - units[z][w].pos) <= 15) {
								//console.log("pushing " + units[z][w].id + ", "+'variables1: '+y+", "+x+", "+z+", "+w+", id:"+units[y][x].id+", "+units[y][x].unitCount)
								units[y][x].engaged.push(units[z][w])
							}
						}
					}
					//Melee:
					if(z != y)
						continue
					if(units[z][w].direction == units[y][x].direction) {
						if(Math.abs(units[y][x].pos - units[z][w].pos) <= 2 && units[z][w].type===units[y][x].type) {
							units[y][x].unitCount+=units[z][w].unitCount;
							//console.log('variables1: '+y+", "+x+", "+z+", "+w+", id:"+units[y][x].id+", "+units[y][x].unitCount)
							document.getElementById("count"+units[y][x].id).innerHTML = units[y][x].unitCount
							document.getElementById("healthBar"+units[y][x].id).style.width = (units[y][x].curHealth / units[y][x].health * 100) + "%";
							triggerForDelete.push(units[z][w])
							//combine units into one
						}
					}
					else if(Math.abs(units[y][x].pos - units[z][w].pos) <= 4.5) { //soldier
						if(units[y][x].direction === "right") {
							units[y][x].pos = units[z][w].pos - 4.5;
						}
						else {
							units[z][w].pos = units[y][x].pos - 4.5;
						}
						//console.log('variables: '+y+", "+x+", "+z+", "+w)
						units[z][w].engaged.push(units[y][x]);
						units[y][x].engaged.push(units[z][w]);
						//console.log('new battle: '+units[y][x].id + " vs " + units[z][w].id + " at " + Math.abs(pos - units[z][w].pos));
					}
					else {
					}
				}
			}
		}
	}
	deleteUnitsInList(triggerForDelete)
}

function deleteUnitsInList(triggerForDelete) {
	for(i = 0; i < triggerForDelete.length; i++) {
		for(y = 0; y < units.length; y++) {
			for(x = units[y].length - 1; x >= 0 ; x--) {
				if(units[y][x].equals(triggerForDelete[i])) {
					disengageAll(units[y][x])
					removeUnit(units[y][x], units[y][x].direction!="right")
				}
			}
		}
	}
}

function handleBattles() {
	//for each unit
	for(y = 0; y < units.length; y++) {
		for(x = units[y].length - 1; x >= 0; x--) {
			if(units[y][x].curHealth > 0 && units[y][x].engaged.length > 0) {
				pos = 0;
				for(i = 1; i < units[y][x].engaged.length; i++) {
					if(units[y][x].engaged[i].line == y || Math.abs(units[y][x].engaged[i].pos - units[y][x].pos) < Math.abs(units[y][x].engaged[pos].pos - units[y][x].pos)) {
						pos = i
					}
				}
				//disengage if the unit is too far away.
				engageTarget = units[y][x].engaged[pos];
				if(units[y][x].type ==="spear") {
					if((units[y][x].direction ==="right" && units[y][x].pos - engageTarget.pos > 0) || (units[y][x].direction !="right" && units[y][x].pos - engageTarget.pos < 0)) {
						//console.log(units[y][x].pos - engageTarget.pos)
						units[y][x].engaged.splice(0, 1);
						continue;
					}
				}
				//get the first target & dmg
				engageTarget.takeDamage(units[y][x].getDamageRoll())
				//console.log(engageTarget.id)
				document.getElementById("count"+engageTarget.id).innerHTML = engageTarget.unitCount
				//console.log(units[y][x].id + " attacking "+engageTarget.id + " on " + totalTicks)
				//if it died
				if(engageTarget.curHealth <= 0) {
					//console.log("removing: " + engageTarget.id + " on " + totalTicks + ", "+x)
					//console.log(units[y][x].engaged)
					disengageAll(engageTarget)
					removeUnit(engageTarget, engageTarget.direction!="right")
				}
				else {
					document.getElementById("healthBar"+engageTarget.id).style.width = (engageTarget.curHealth / engageTarget.health * 100) + "%";
				}
				//console.log("x:"+x)
			}
		}
	}
}

function disengageAll(unit) {
	for(f = 0; f < units.length; f++) {
		for(e = 0; e < units[f].length ; e++) {
			for(i = units[f][e].engaged.length-1; i >= 0; i--) {
				if(units[f][e].engaged[i].equals(unit)) {
					//console.log("disengaging "+unit.id +" from "+unit.engaged[i].id);
					units[f][e].engaged.splice(i, 1)
				}
			}
		}
	}
}

function removeUnit(unit, shouldAdd) {
	var elem = document.getElementById("unit"+unit.id);
	elem.parentNode.removeChild(elem);
	
	for(g = 0; g < units.length; g++) {
		for(h = units[g].length - 1; h >= 0; h--) {
			if(unit.equals(units[g][h])) {
				//console.log('removing2: ' + units[g][h].id + " on " + totalTicks)
				units[g].splice(h, 1)
			}
		}
	}
	/*for(g = 0; g < units.length; g++) {
		for(h = units[g].length - 1; h >= 0; h--) {
			if(units[g][h].curHealth <= 0) {
				console.log('removing2: ' + units[g][h].id + " on " + totalTicks)
				units[g].splice(h, 1)
			}
		}
	}*/
}

function addUnit(type, line, direction, unitCount) {
	if(direction == "right") {
		pos = 0
		if(type == "soldier") {
			health = 60
			damage = 1
			damageRange = 0
			attackCooldown = 1
		}
		if(type == "spear") {
			health = 20
			damage = 5
			damageRange = 0
			attackCooldown = 4
		}
	}
	else {
		pos = 100
		if(type == "soldier") {
			health = 200
			damage = 2
			damageRange = 0
			attackCooldown = 3
		}
		if(type == "spear") {
			health = 20
			damage = 50
			damageRange = 0
			attackCooldown = 4
		}
	}
	theNewUnit = new Unit(line, pos, type, direction, health, 0, damage, damageRange, unitCount, attackCooldown, line, units.length);
	units[line].push(theNewUnit);
	//console.log("just added"+(globalId - 1))
	newUnitDiv(theNewUnit)
	updateUnitPos(line, (units[line].length-1));
}

function removeDuplicates(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}
function initiate() {
}

function round2(num) {
    return (Math.floor(num * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function round(num) {
    return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}