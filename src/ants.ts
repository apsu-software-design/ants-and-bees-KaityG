//Import AntColony class and Place class from ./game file
import {AntColony, Place} from './game';

/**
 * INSECT CLASS
 * abstract class that represents an insect
 * 
 */
export abstract class Insect {
     /**
     * represents the insect's name
     */
  readonly name:string;


  /**
   * Constructor
   * creates an insect object with the specified armor and place
   * @param armor the insect's armor level represented by a number
   * @param place the insect's placement represent by a Place object
   */
  constructor(protected armor:number, protected place:Place){}
/**
 * getName
 * @return the insect's name
 */
  getName():string { return this.name; }
  
  /**
   * getArmor
   * @return the insect's armor number
   */
  getArmor():number { return this.armor; }
  
  /**
   * getPlace
   * @return the insect's place object
   */
  getPlace() { return this.place; }

  /**
   * setPlace
   * set's the insect's place object to the given place object
   * @param place the location of the Insect
   */
  setPlace(place:Place){ this.place = place; }

  /**
   * reduceArmor
   * reduces the armor level for an insect
   * if the armor is less than zero, it outputs the armor is gone to the user
   * @param amount number that represent the amount to decrement from the insect's armor level.
   * @return boolean value to determine if the armor level has depleted to zero.
   */
  reduceArmor(amount:number):boolean {
    this.armor -= amount;
    if(this.armor <= 0){
      console.log(this.toString()+' ran out of armor and expired');
      this.place.removeInsect(this);
      return true;
    }
    return false;
  }

/**
 * act
 * abstract method 
 * @param colony an optional AntColony object passed to act for implementation
 * @return void- returns nothing
 */
  abstract act(colony?:AntColony):void;

/**
 * toString
 * @param no parameters
 * @return returns a string in the specified format
 */
  toString():string {
    return this.name + '('+(this.place ? this.place.name : '')+')';
  }
}

/**
 * BEE CLASS
 * child class of Insect that represents a bee
 */
export class Bee extends Insect {
  /**
   *represents the insect's name: Bee  
   */  
  readonly name:string = 'Bee';
  private status:string;

/**
 * Constructor
 * creates Bee object using armor, damage, and place
 * @param armor armor level of the Bee object
 * @param damage amount of damage the bee can inflict on an ant
 * @param place the location of the Bee object
 */
  constructor(armor:number, private damage:number, place?:Place){
    super(armor, place);
  }

/**
 * sting
 * inflicts damage to the ant from the bee by calling reduceArmor on given Ant object
 * @param ant An Ant object that receive sting from the bee
 * @return boolean value to determine if the ant's armor was reduced
 */
  sting(ant:Ant):boolean{
    console.log(this+ ' stings '+ant+'!');
    return ant.reduceArmor(this.damage);
  }
/**
 * isBlocked
 * checks if an ant is located 
 */
  isBlocked():boolean {
    return this.place.getAnt() !== undefined;
  }

/**
 * setStatus
 * sets the status using the given parameter
 * @param status string representation of given status
 * @return returns nothing
 */
  setStatus(status:string) { this.status = status; }

/**
 * act
 * implementation of the abstract act function from the Insect class
 * determines if a bee should sting an ant or exit and undefines its status
 * @param no parameters
 * @return returns nothing
 */
  act() {
    if(this.isBlocked()){
      if(this.status !== 'cold') {
        this.sting(this.place.getAnt());
      }
    }
    else if(this.armor > 0) {
      if(this.status !== 'stuck'){
        this.place.exitBee(this);
      }
    }    
    this.status = undefined;
  }
}

/**
 * ANT CLASS
 * an abstract child class of the Insect class that represents an ant
 * 
 */
export abstract class Ant extends Insect {
  protected boost:string;

  /**
   * Constructor
   * creates an ant object using armor, foodCost, and place
   * @param armor armor level of the ant
   * @param foodCost the amount in food it costs to create the ant
   * @param place the location of the ant
   */
  constructor(armor:number, private foodCost:number = 0, place?:Place) {
    super(armor, place);
  }
/**
 * getFoodCost
 * @return returns the ant's foodCost
 */
  getFoodCost():number { return this.foodCost; }
  /**
   * setBoost
   * assigns the given boost to the Ant object's boost
   * @param boost string representation of boost
   */
  setBoost(boost:string) { 
    this.boost = boost; 
      console.log(this.toString()+' is given a '+boost);
  }
}

/**
 * GROWER_ANT CLASS
 * child class of Ant that represents a GrowerAnt
 */
export class GrowerAnt extends Ant {
  readonly name:string = "Grower";
  /**
   * creates GrowerAnt object
   * @param takes no parameters
   */
  constructor() {
    super(1,1)
  }
/**
 * act
 * implementation of the abstract act function from the Insect class
 * determines whether the GrowerAnt will increase the food in the ant colony or it will add a particular Boost 
 * @param colony an object of the AntColony class
 * @return returns nothing
 * 
 */
  act(colony:AntColony) {
    let roll = Math.random();
    if(roll < 0.6){
      colony.increaseFood(1);
    } else if(roll < 0.7) {
      colony.addBoost('FlyingLeaf');
    } else if(roll < 0.8) {
      colony.addBoost('StickyLeaf');
    } else if(roll < 0.9) {
      colony.addBoost('IcyLeaf');
    } else if(roll < 0.95) {
      colony.addBoost('BugSpray');
    }
  }  
}

/**
 * THROWER_ANT CLASS
 * child class of Ant that represents a ThrowerAnt
 */

export class ThrowerAnt extends Ant {
/**
 * name string representation of ant type: Thrower
 */
  readonly name:string = "Thrower";
  private damage:number = 1;
/**
 * constructor
 * creates ThrowerAnt object
 * @param no parameter
 */
  constructor() {
    super(1,4);
  }
/**
 * act
 * implementation of the abstract act function from the Insect class
 * determines the type of boost the ThrowerAnt will use and uses the boost on the nearest bee
 * @param no parameters
 * @return returns nothing
 */
  act() {
    if(this.boost !== 'BugSpray'){
      let target;
      if(this.boost === 'FlyingLeaf')
        target = this.place.getClosestBee(5);
      else
        target = this.place.getClosestBee(3);

      if(target){
        console.log(this + ' throws a leaf at '+target);
        target.reduceArmor(this.damage);
    
        if(this.boost === 'StickyLeaf'){
          target.setStatus('stuck');
          console.log(target + ' is stuck!');
        }
        if(this.boost === 'IcyLeaf') {
          target.setStatus('cold');
          console.log(target + ' is cold!');
        }
        this.boost = undefined;
      }
    }
    else {
      console.log(this + ' sprays bug repellant everywhere!');
      let target = this.place.getClosestBee(0);
      while(target){
        target.reduceArmor(10);
        target = this.place.getClosestBee(0);
      }
      this.reduceArmor(10);
    }
  }
}

/**
 * EATER_ANT CLASS
 * child class of Ant that represents an EaterAnt
 */
export class EaterAnt extends Ant {
/**
 * name represents the type of ant 
 */
  readonly name:string = "Eater";
  private turnsEating:number = 0;
  private stomach:Place = new Place('stomach');
  /**
   * constructor
   * creates an EaterAnt object
   * @param no parameters
   */
  constructor() {
    super(2,4)
  }

    /**
     * isFull
     * determines if the EaterAnt is full from eating an ant
     * @param no parameters
     * @return boolean
     */
  isFull():boolean {
    return this.stomach.getBees().length > 0;
  }
/**
 * act
 * implementation of the abstract act function from the Insect class
 * determines if the EaterAnt will eat the targeted bee
 * @param no parameters
 * @return returns nothing
 */
  act() {
    console.log("eating: "+this.turnsEating);
    if(this.turnsEating == 0){
      console.log("try to eat");
      let target = this.place.getClosestBee(0);
      if(target) {
        console.log(this + ' eats '+target+'!');
        this.place.removeBee(target);
        this.stomach.addBee(target);
        this.turnsEating = 1;
      }
    } else {
      if(this.turnsEating > 3){
        this.stomach.removeBee(this.stomach.getBees()[0]);
        this.turnsEating = 0;
      } 
      else 
        this.turnsEating++;
    }
  }  
/**
 * reduceArmor
 * EaterAnt reduces the armor of the given bee(s)
 * @param amount number representation of the amount to decrement from an insect's armor
 * @return returns boolean value
 */
  reduceArmor(amount:number):boolean {
    this.armor -= amount;
    console.log('armor reduced to: '+this.armor);
    if(this.armor > 0){
      if(this.turnsEating == 1){
        let eaten = this.stomach.getBees()[0];
        this.stomach.removeBee(eaten);
        this.place.addBee(eaten);
        console.log(this + ' coughs up '+eaten+'!');
        this.turnsEating = 3;
      }
    }
    else if(this.armor <= 0){
      if(this.turnsEating > 0 && this.turnsEating <= 2){
        let eaten = this.stomach.getBees()[0];
        this.stomach.removeBee(eaten);
        this.place.addBee(eaten);
        console.log(this + ' coughs up '+eaten+'!');
      }
      return super.reduceArmor(amount);
    }
    return false;
  }
}

/**
 * SCUBA_ANT CLASS
 * child class of the Ant class that represents a Scuba Ant
 */
export class ScubaAnt extends Ant {
/**
 * name string representation of the ant's type
 */
  readonly name:string = "Scuba";
  private damage:number = 1;

/**
 * constructor
 * creates a Scuba Ant object
 * @param no parameters
 * 
 */
  constructor() {
    super(1,5)
  }
/**
 * act
 * implementation of the abstract act function from the Insect class
 * determines the type of boost the ScubaAnt will use and uses the boost on the nearest bee
 * @param no parameters
 * @return returns nothing
 */
  act() {
    if(this.boost !== 'BugSpray'){
      let target;
      if(this.boost === 'FlyingLeaf')
        target = this.place.getClosestBee(5);
      else
        target = this.place.getClosestBee(3);

      if(target){
        console.log(this + ' throws a leaf at '+target);
        target.reduceArmor(this.damage);
    
        if(this.boost === 'StickyLeaf'){
          target.setStatus('stuck');
          console.log(target + ' is stuck!');
        }
        if(this.boost === 'IcyLeaf') {
          target.setStatus('cold');
          console.log(target + ' is cold!');
        }
        this.boost = undefined;
      }
    }
    else {
      console.log(this + ' sprays bug repellant everywhere!');
      let target = this.place.getClosestBee(0);
      while(target){
        target.reduceArmor(10);
        target = this.place.getClosestBee(0);
      }
      this.reduceArmor(10);
    }
  }
}

/**
 * GUARD_ANT CLASS
 * child class of the Ant class that represents a Guard Ant
 */
export class GuardAnt extends Ant {
    /**
     * name string representation of the ant's type
     */
  readonly name:string = "Guard";
/**
 * constructor
 * creates a Guard Ant object
 * @param no parameters
 */
  constructor() {
    super(2,4)
  }
  /**
   * getGuarded
   * @param no parameters
   * @return return an a Guarded Ant object from a specificed location 
   */

  getGuarded():Ant {
    return this.place.getGuardedAnt();
  }
/**
 * act
 * defined function with no code for implementation
 */
  act() {}
}
