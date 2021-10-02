
/**
 * import these classes from the ants file
 */
import {Insect, Bee, Ant, GrowerAnt, ThrowerAnt, EaterAnt, ScubaAnt, GuardAnt} from './ants';

/**
 * PLACE CLASS
 * representation of the location of an Insect
 */
class Place {
  protected ant:Ant;
  protected guard:GuardAnt;
  protected bees:Bee[] = [];
/**
 * constructor
 * creates a Place object using name, water, exit, and entrance
 * 
 * @param name string representation of the type of insect
 * @param water boolean value to determine if the tunnel has water
 * @param exit optional parameter of type Place to represent an exit
 * @param entrance optional parameter of type Place to represent an entrance
 */
  constructor(readonly name:string,
              protected readonly water = false,
              private exit?:Place, 
              private entrance?:Place) {}


/**
 * getExit
 * returns the exit Place object associated with this insect
 * @return return insect's exit Place object
 */
  getExit():Place { return this.exit; }

  /**
   * setEntrance
   * sets the insect's entrance to the given place
   * @param place Place object used to assign to insect's entrance
   * @return returns nothing 
   */
  setEntrance(place:Place){ this.entrance = place; }

/**
 * isWater 
 * determines if a location has waters
 * @param no parameters
 * @return return boolean value
 */
  isWater():boolean { return this.water; }

/**
 * getAnt
 * gets an any type Ant object from current Place 
 * @param no parameters
 * @return returns an Ant object
 */
  getAnt():Ant { 
    if(this.guard) 
      return this.guard;
    else 
      return this.ant;
  }

/**
 * getGuardedAnt
 * gets a Guarded Ant at the current Place
 * @param no parameters
 * @return return an Ant object
 */
  getGuardedAnt():Ant {
    return this.ant;
  }

/**
 * getBees
 * gets the array of bees at the current Place
 * @param no parameters
 * @return returns an array of Bee objects
 */
  getBees():Bee[] { return this.bees; }


/**
 * getClosestBee
 * gets the closest bee within the specified distance 
 * 
 * @param maxDistance number representation for maximum bound for distance
 * @param minDistance number representation for minimum bound for distance
 * @return returns a Bee object
 */
  getClosestBee(maxDistance:number, minDistance:number = 0):Bee {
		let p:Place = this;
		for(let dist = 0; p!==undefined && dist <= maxDistance; dist++) {
			if(dist >= minDistance && p.bees.length > 0) {
				return p.bees[0];
      }
			p = p.entrance;
		}
		return undefined;
  }
/**
 * addAnt
 * determines if an Ant object was successfully added to the location(Place)
 * @param ant Ant object
 * @return return boolean value to check if the ant was added
 */
  addAnt(ant:Ant):boolean {
    if(ant instanceof GuardAnt) {
      if(this.guard === undefined){
        this.guard = ant;
        this.guard.setPlace(this);
        return true;
      }
    }
    else 
      if(this.ant === undefined) {
        this.ant = ant;
        this.ant.setPlace(this);
        return true;
      }
    return false;
  }
/**
 * removeAnt
 * removes an Ant object from the location(Place)
 * @param no parameters
 * @return returns an Ant object
 */
  removeAnt():Ant {
    if(this.guard !== undefined){
      let guard = this.guard;
      this.guard = undefined;
      return guard;
    }
    else {
      let ant = this.ant;
      this.ant = undefined;
      return ant;
    }
  }

/**
 * addBee
 * adds a bee to the Bee array
 * @param bee the given Bee object to add to the Bee array
 * @return returns nothing
 */
  addBee(bee:Bee):void {
    this.bees.push(bee);
    bee.setPlace(this);
  }

/**
 * removeBee
 * removes a bee from the Bee array
 * @param bee given Bee object to be removed from the Bee arrat
 * @return returns nothing
 */
  removeBee(bee:Bee):void {
    var index = this.bees.indexOf(bee);
    if(index >= 0){
      this.bees.splice(index,1);
      bee.setPlace(undefined);
    }
  }

/**
 * removeAllBees
 * removes every bee from the Bee array
 * @param no parameters
 * @return returns nothing
 */
  removeAllBees():void {
    this.bees.forEach((bee) => bee.setPlace(undefined) );
    this.bees = [];
  }

/**
 * exitBee
 * makes the bee exit the ant's tunnel
 * @param bee given Bee object to be removed from the ant tunnel
 * @return returns nothing
 */
  exitBee(bee:Bee):void {
    this.removeBee(bee);
    this.exit.addBee(bee);  
  }

/**
 * removeInsect
 * removes any given insect from a location in the tunnel
 * @param insect given Insect object to be removed
 * @return returns nothing
 */
  removeInsect(insect:Insect) {
    if(insect instanceof Ant){
      this.removeAnt();
    }
    else if(insect instanceof Bee){
      this.removeBee(insect);
    }
  }

/**
 * act
 * removes any ant type other than Scuba Ant from the tunnel
 * @param no parameters
 * @return returns nothing 
 */
  act() {
    if(this.water)
    {
      if(this.guard){
        this.removeAnt();
      }
      if(!(this.ant instanceof ScubaAnt)){
        this.removeAnt();
      }
    }
  }
}

/**
 * HIVE CLASS
 * child class of the Place class that represents the hive
 */
class Hive extends Place {
  private waves:{[index:number]:Bee[]} = {}

  /**
   * constructor 
   * creates a Hive object using beeArmor and beeDamage
   * @param beeArmor number representation for the bee's armor amount 
   * @param beeDamage number representation for the bee's damage amount
   *  */  
  constructor(private beeArmor:number, private beeDamage:number){
    super('Hive');
  }

/**
 * addWave
 * adds a wave of bees to be released on its appropriate attack turn
 * @param attackTurn
 * @param numBees
 * @return returns Hive object
 * 
 */
  addWave(attackTurn:number, numBees:number):Hive {
    let wave:Bee[] = [];
    for(let i=0; i<numBees; i++) {
      let bee = new Bee(this.beeArmor, this.beeDamage, this);
      this.addBee(bee);
      wave.push(bee);
    }
    this.waves[attackTurn] = wave;
    return this;
  }

  /**
   * invade
   * makes the bees invade the AntColony
   * 
   * @param colony AntColony object that will be invaded
   * @param currentTurn number representation of the current turn of the game
   * @return returns an array of Bees
   */
  invade(colony:AntColony, currentTurn:number): Bee[]{
    if(this.waves[currentTurn] !== undefined) {
      this.waves[currentTurn].forEach((bee) => {
        this.removeBee(bee);
        let entrances:Place[] = colony.getEntrances();
        let randEntrance:number = Math.floor(Math.random()*entrances.length);
        entrances[randEntrance].addBee(bee);
      });
      return this.waves[currentTurn];
    }
    else{
      return [];
    }    
  }
}

/**
 * ANT_COLONY CLASS
 * represents an AntColony
 */
class AntColony {
  private food:number;
  private places:Place[][] = [];
  private beeEntrances:Place[] = [];
  private queenPlace:Place = new Place('Ant Queen');
  private boosts:{[index:string]:number} = {'FlyingLeaf':1,'StickyLeaf':1,'IcyLeaf':1,'BugSpray':0}

/**
 * constructor
 * creates an AntColony object using startingFood, numTunnels, tunnelLength, and moatFrequency
 * @param startingFood number representation of the AntColony's initial amount of food
 * @param numTunnels number representation of the amount of tunnels in the AntColony
 * @param tunnelLength number representation of the tunnel's length
 * @param moatFrequency 
 */
  constructor(startingFood:number, numTunnels:number, tunnelLength:number, moatFrequency=0){
    this.food = startingFood;

/**
 * holds previous Place
 */
    let prev:Place;
    /**
     * for loop
     * assigns the location of the tunnels, the queen's location, 
     * and determines the type of tunnel in withing the 'places' class field
     */
		for(let tunnel=0; tunnel < numTunnels; tunnel++)
		{
			let curr:Place = this.queenPlace;
      this.places[tunnel] = [];
			for(let step=0; step < tunnelLength; step++)
			{
        let typeName = 'tunnel';
        if(moatFrequency !== 0 && (step+1)%moatFrequency === 0){
          typeName = 'water';
				}
				
				prev = curr;
        let locationId:string = tunnel+','+step;
        curr = new Place(typeName+'['+locationId+']', typeName=='water', prev);
        prev.setEntrance(curr);
				this.places[tunnel][step] = curr;
			}
			this.beeEntrances.push(curr);
		}
  }
/**
 * getFood
 * @return returns a number that represents the available food amount in the AntColony
 */
  getFood():number { return this.food; }

  /**
   * increaseFood
   * increases the amount of food in the AntColony
   * @param amount number representation of the amount to increment the AntColony food amount
   * @return returns nothing
   */
  increaseFood(amount:number):void { this.food += amount; }

/**
 * getPlaces
 * @return returns a Place array of the placements of the AntColony's components
 */
  getPlaces():Place[][] { return this.places; }

/**
 * getEntrances
 * @return returns a Place array of the bee's entrance location
 */
  getEntrances():Place[] { return this.beeEntrances; }

/**
 * getQueenPlace
 * @return returns Place object that represents the queen ant's location 
 */
  getQueenPlace():Place { return this.queenPlace; }

/**
 * queenHasBees
 * determines if any bees are located in the queen's place
 * @return returns boolean value 
 */
  queenHasBees():boolean { return this.queenPlace.getBees().length > 0; }

/**
 * getBoosts
 * gets available boosts in the AntColony
 * @return array of strings
 */
  getBoosts():{[index:string]:number} { return this.boosts; }

  addBoost(boost:string){
    if(this.boosts[boost] === undefined){
      this.boosts[boost] = 0;
    }
    this.boosts[boost] = this.boosts[boost]+1;
    console.log('Found a '+boost+'!');
  }
/**
 * deployAnt
 * deploys the given Ant object to the given location
 * @param ant Ant object that will be deployed
 * @param place Place object that represents the location of the ant object 
 * @return returns string to output to user if the ant cannot be deployed
 */
  deployAnt(ant:Ant, place:Place):string {
    if(this.food >= ant.getFoodCost()){
      let success = place.addAnt(ant);
      if(success){
        this.food -= ant.getFoodCost();
        return undefined;
      }
      return 'tunnel already occupied';
    }
    return 'not enough food';
  }

/**
 * removeAnt
 * removes an the specified place in the tunnel
 * 
 * @param place Place object to represent the location where to remove the ant
 * @return returns nothing
 */
  removeAnt(place:Place){
    place.removeAnt();
  }

/**
 * applyBoost
 * applies the boost at the specified location
 * 
 * @param boost string representation of the boost's type
 * @param place Place object to represent the location to deploy the boost
 * @return return string if the boost cannot be applied
 */
  applyBoost(boost:string, place:Place):string {
    if(this.boosts[boost] === undefined || this.boosts[boost] < 1) {
      return 'no such boost';
    }
    let ant:Ant = place.getAnt();
    if(!ant) {
      return 'no Ant at location' 
    }
    ant.setBoost(boost);
    return undefined;
  }
/**
 * antsAnt
 * makes all the ants in the colony perform an act
 * 
 * @param no parameters
 * @return returns nothing
 */
  antsAct() {
    this.getAllAnts().forEach((ant) => {
      if(ant instanceof GuardAnt) {
        let guarded = ant.getGuarded();
        if(guarded)
          guarded.act(this);
      }
      ant.act(this);
    });    
  }

/**
 * beesAnt
 * makes all the bees in the hive perform an act in the AntColony
 * 
 * @param no parameters
 * @return returns nothing
 */
  beesAct() {
    this.getAllBees().forEach((bee) => {
      bee.act();
    });
  }
/**
 * placesAnt
 * make all the places in the AntColony perform its specific act
 * 
 * @param no parameters
 * @return returns nothing
 */
  placesAct() {
    for(let i=0; i<this.places.length; i++) {
      for(let j=0; j<this.places[i].length; j++) {
        this.places[i][j].act();
      }
    }    
  }

/**
 * getAllAnts
 * gets all the available ants from the AntColony
 * 
 * @param no parameters
 * @return returns an Ant array
 */
  getAllAnts():Ant[] {
    let ants = [];
    for(let i=0; i<this.places.length; i++) {
      for(let j=0; j<this.places[i].length; j++) {
        if(this.places[i][j].getAnt() !== undefined) {
          ants.push(this.places[i][j].getAnt());
        }
      }
    }
    return ants;
  }

/**
 * getAllBees
 * gets all the available bees from the AntColony
 * 
 * @param no parameters
 * @return returns an Bee array
 */
  getAllBees():Bee[] {
    var bees = [];
    for(var i=0; i<this.places.length; i++){
      for(var j=0; j<this.places[i].length; j++){
        bees = bees.concat(this.places[i][j].getBees());
      }
    }
    return bees;
  }
}

/**
 * ANT_GAME CLASS
 * representation of the AntGame
 */
class AntGame {
  private turn:number = 0;
  /**
   * constructor
   * creates an AntGame using colony and hive
   */
  constructor(private colony:AntColony, private hive:Hive){}

/**
 * takeTurn
 * makes all the ants, bees, and places act each turn of the game
 * 
 * @param no parameters
 * @return returns nothing
 */
  takeTurn() {
    console.log('');
    this.colony.antsAct();
    this.colony.beesAct();
    this.colony.placesAct();
    this.hive.invade(this.colony, this.turn);
    this.turn++;
    console.log('');
  }
/**
 * getTurn
 * @return returns the current turn of the AntGame
 */
  getTurn() { return this.turn; }

/**
 * gameIsWon
 * determines if the AntGame has been won
 * 
 * @param no parameters
 * @return returns boolean or undefined value
 */
  gameIsWon():boolean|undefined {
    if(this.colony.queenHasBees()){
      return false;
    }
    else if(this.colony.getAllBees().length + this.hive.getBees().length === 0) {
      return true;
    }   
    return undefined;
  }

/**
 * deployAnt
 * deploy the specific type of ant at the given coordinates in the AntColony
 * 
 * @param antType string representation of the ant's type
 * @param placeCoordinates string representation of the ant's coordinates in the AntColony
 * @return returns string
 */
  deployAnt(antType:string, placeCoordinates:string):string {
    let ant;
    switch(antType.toLowerCase()) {
      case "grower":
        ant = new GrowerAnt(); break;
      case "thrower":
        ant = new ThrowerAnt(); break;
      case "eater":
        ant = new EaterAnt(); break;
      case "scuba":
        ant = new ScubaAnt(); break;
      case "guard":
        ant = new GuardAnt(); break;
      default:
        return 'unknown ant type';
    }

    try {
      let coords = placeCoordinates.split(',');
      let place:Place = this.colony.getPlaces()[coords[0]][coords[1]];
      return this.colony.deployAnt(ant, place);
    } catch(e) {
      return 'illegal location';
    }
  }
/**
 * removeAnt
 * removes ant from the specificed location
 * 
 * @param placeCoordinates string representation of the ant's coordinates 
 * @return returns string if the ant cannot be removed at the location
 */
  removeAnt(placeCoordinates:string):string {
    try {
      let coords = placeCoordinates.split(',');
      let place:Place = this.colony.getPlaces()[coords[0]][coords[1]];
      place.removeAnt();
      return undefined;
    }catch(e){
      return 'illegal location';
    }    
  }

/**
 * boostAnt
 * gives an ant the specified boost
 * 
 * @param boostType string representation of the boost type
 * @param placeCoordinates string representation of the coordinates to place the boost
 * @return returns string if the boost cannot be applied at the location 
 */
  boostAnt(boostType:string, placeCoordinates:string):string {
    try {
      let coords = placeCoordinates.split(',');
      let place:Place = this.colony.getPlaces()[coords[0]][coords[1]];
      return this.colony.applyBoost(boostType,place);
    }catch(e){
      return 'illegal location';
    }    
  }

/**
 * getPlaces
 * @return returns a Place array of the places in the AntColony
 */
  getPlaces():Place[][] { return this.colony.getPlaces(); }

  /**
   * getFood
   * @return returns a number that represents the amount of food in the AntColony
   */
  getFood():number { return this.colony.getFood(); }

  /**
   * getHiveBeesCount
   * @return returns a number that represents the amount of bees in the hive
   */
  getHiveBeesCount():number { return this.hive.getBees().length; }

  /**
   * getBoostNames
   * @return returns string that represents the boosts available 
   */
  getBoostNames():string[] { 
    let boosts = this.colony.getBoosts();
    return Object.keys(boosts).filter((boost:string) => {
      return boosts[boost] > 0;
    }); 
  }
}

export { AntGame, Place, Hive, AntColony }