function Shojo(startposx, startposy, size){
//startup
this.px = startposx;
this.py = startposy;
this.pz = 0;
this.size = size;

//character poster/character color
this.postColor = "#333333";
this.color = "#99CC99";
this.desc = ["Honestly, fuck being a player in a boss rush game, why not BE the boss instead!",
    "Armor Clad: Can only take up to 20 damage over a short period. Excess damage is ignored!",
     "1. Pierce: Hold to charge, swinging a lance overhead and doing AoE damage! Release to stab ahead, dealing great damage!",
     "  after 2 seconds of charging, instead throw the lance! Lighter enemies are forcefully dragged back towards you!",
      "2. Bash: Charge a short distance and bash enemies with your shield! Has great knockback, and grants immunity on hit!",
       "3. Run Through: Shojo gains really good armor frames, and runs through everything, dealing damage!", 
       "    This is a stance move, and can be ended by using pierce, bash or the ability again.",
        "4. Shield: Raise your shield, defending against virtually all damage! Really slows you down though. deflects certain projectiles."];
//game stats
this.playershift = [0, 0];//shift the position of the player

this.cooldowns = [0, 0, 0, 0]
this.damagetypemod = [["pain", 0], ["slashing", 0.2], ["physical", 0.8]];//I dare you, hurt the guy in full steel and tungstun, come on.
this.hp = 100; //EVEN THE FUCKING TANK GETS 100! FUCK YOUR OPINION!!!
this.damagemod = 0.6; //40% tungsten
this.maxspeed = 8;
this.speed = 8; //tungsten is very heavy
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];//causes of speed buffs/nerfs [reason, duration, effect]

this.DI = 0.9; //Bro's looking more and more like robot from YOMI hustle
this.hitstunmod = 0.2; //Hitstun, what's that?
this.knockbackmod = 0.2; //You know, Barons are bosses in Fire Emblem Thracia 776... (sued)
this.height = 10; //Big boi
this.facing = [0, 0]; //what direction the player is facing
this.iframe = false;//completely ignore hits
this.won = false;

//UNIQUE
this.dmgcap = 20;//max is 20!
this.lancespin = new hitbox(0, 0, this.pz+4, this.height + 4, 60);
this.lancespin.disable();
this.lancespin.immunityframes(5);
this.stab = new hitbox(0, 0, this.pz+2, this.height-2, 10);
this.stab.disable();
this.stab.immunityframes(6);
this.spinspeed = 0.2;
this.chargetime = 0
this.lockfacing = [];
}
Shojo.prototype.listname = function(){
return "Shojo";
}
Shojo.prototype.greeting = function(){
//Needs more bulk tbh...
console.log("Shojo, Baron of a distant land, is ready to defend a universe!")
}
Shojo.prototype.exist = function(){
//HP check
if(this.hp <= 100 && this.hp > 0){
//under max
screen.fillStyle = "#F00";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
screen.fillStyle = "#0F0";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
if(this.hp - this.dmgcap > 0){
screen.fillStyle = "#00F";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, ((this.hp - this.dmgcap) / 2), 4);//damage able to be taken
}
}else if(this.hp <=0 || this.won == true){
    //play the death anmiation, then call off
    if(this.won == false){
        this.death();
    }else{
        this.win()
    }
    return;
}else{
//over max

screen.fillStyle = "#0F0";
screen.fillRect(canvhalfx - 25 - (this.hp - 100) * 0.25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
if(this.hp - this.dmgcap>100){
screen.fillStyle = "#00F";
screen.fillRect(canvhalfx - 25 - (this.hp - 100 - this.dmgcap) * 0.25, canvhalfy - this.size - 10, (this.hp - this.dmgcap) / 2, 4);//max damage capable of taking
}else{
screen.fillStyle = "#00F";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp


}
//I'm generous enough to give you a BIT of extra power for a set time
    this.hp-=0.15;
    if(this.hp <= 100){
        this.hp = 100;
        //yes, I'm aware this is effectively a free defense
    }
}

//update damage cap
if(this.dmgcap < 20){
    this.dmgcap+=0.2
}
//update immunity frames
this.lancespin.updateimmunity()
this.stab.updateimmunity();
timeplayed++;

//speedmod is ALWAYS 1 to begin with
this.speedmod = 1;
this.speedcause.sort();//sorting it makes it easier to check for duplicated
for(let i = 0 ; i < this.speedcause.length ; i++){
    //for every non-stacking buff, delete any duplicates
    try{
        //delete all duplicated that aren't stackable
        while(this.speedcause[i][0] != "stack" && this.speedcause[i][0] == this.speedcause[i+1][0]){
            //console.log("dfafds")
            try{
            if(this.speedcause[i][1] < this.speedcause[i+1][1]){
                this.speedcause.splice(i, 1);
            }else{
                this.speedcause.splice(i+1, 1);
            }
            }catch(e){
            break;
            }


        }
        }catch(e){

        }

    //console.log(this.speedcause[i])
    if(this.speedcause[i][1]-- < 0){
        //delete all effects that ran out
        this.speedcause.splice(i--, 1);
    }else{
        //cause every lasting effect to effect speed
        this.speedmod*=this.speedcause[i][2];
    }
}
//The character exists in my plane of existance!
            screen.fillStyle = this.color;
            circle(canvhalfx, canvhalfy, this.size)
            //hp
            
            //hitstun
            
            if(this.hitstun > 0){
                //account for super armor
                if(this.chargetime > 15){
                    this.hitstun = 0;
                }else{
                this.hurt();
                return;
                }
            }
            //movement
            if(inputs.includes("shift")){
                this.speed = this.maxspeed/2;
            }else{
                this.speed = this.maxspeed;
            }
            if(inputs.includes(controls[0]) && !arena.pleavedir().includes('l')){
            this.px+=this.speed * this.speedmod;
            this.facing[0] = -1;
            if(!inputs.includes(controls[2]) && !inputs.includes(controls[3])){
                this.facing[1] = 0;
            }
            }
            if(inputs.includes(controls[1]) && !arena.pleavedir().includes('r')){
            this.px-=this.speed * this.speedmod;
            this.facing[0] = 1;
            if(!inputs.includes(controls[2]) && !inputs.includes(controls[3])){
                this.facing[1] = 0;
            }
            }
            if(inputs.includes(controls[2]) && !arena.pleavedir().includes('u')){
            this.py+=this.speed * this.speedmod;
            this.facing[1] = -1;
            if(!inputs.includes(controls[0]) && !inputs.includes(controls[1])){
                this.facing[0] = 0;
            }
            }
            if(inputs.includes(controls[3]) && !arena.pleavedir().includes('d')){
            this.py-=this.speed * this.speedmod;
            this.facing[1] = 1;
            if(!inputs.includes(controls[0]) && !inputs.includes(controls[1])){
                this.facing[0] = 0;
            }
            }
//lower all cooldowns
for(let i = 0; i < this.cooldowns.length ; i++){
    this.cooldowns[i]--;
}
//attacks

if(this.cooldowns[0] <= 0 && inputs.includes(controls[4])){
    this.spec1();
}
if(this.spinspeed > 0.2 && !inputs.includes(controls[4])){
    //use the skill!
    this.spinspeed = 0.2
    this.lockfacing = [...this.facing];
    if(this.chargetime < 6990){
    //melee!
    
    this.cooldowns[0] = 7;
    
    }else{
    }

    this.chargetime = 0;
}
//melee hitbox
if(this.cooldowns[0] > 3){
    this.stab.move(canvhalfx, canvhalfy)
for(let i = 0 ; i < 10 ; i++){
    //deal damage
    this.stab.move(this.stab.x + (this.stab.size*2 * this.lockfacing[0]), this.stab.y + (this.stab.size*2 * this.lockfacing[1]))
    //this.stab.showbox();
    for(let d = 0 ; d < enemies.length ; d++){
        if(this.stab.checkenemy(d)){
            
            enemies[d].hit(30, ["piercing", "physical"], [this.lockfacing[0] * 6, this.lockfacing[1] * 6], 30);
            this.stab.grantimmunity(d)
        }
    }
    
}
screen.beginPath();
        screen.lineWidth = 15;
        screen.strokeStyle = "#444"
    
    screen.moveTo(canvhalfx, canvhalfy);
    screen.lineCap = "round"
    screen.lineTo(this.stab.x, this.stab.y);
  
    screen.stroke();
    screen.lineCap = "butt"
    screen.closePath();
    screen.lineWidth = 1;
}
if(this.cooldowns[1] <= 0 && inputs.includes(controls[5])){
    this.spec2();
}
if(this.cooldowns[2] <= 0 && inputs.includes(controls[6])){
    this.spec3();
}
if(this.cooldowns[3] <= 0 && inputs.includes(controls[7])){
    this.spec4();
}

}



Shojo.prototype.hurt = function(){
this.hitstun--;
console.log(this.hitstun);
this.px += this.knockback[0];
this.py += this.knockback[1];
this.knockback[0]*=0.9;
this.knockback[1]*=0.9;
if(arena.pleavedir().includes("l") || arena.pleavedir().includes('r')){
this.hitstun += 3;

this.knockback[0]*=-0.5;
if(arena.pleavedir().includes("l")){
    this.px = arena.w - this.size - 3;
}else{
    this.px = -arena.w + this.size + 3;
}
}
if(arena.pleavedir().includes("u") || arena.pleavedir().includes('d')){
this.hitstun += 3;
this.knockback[1]*=-0.5;
if(arena.pleavedir().includes("u")){
    this.py = arena.h - this.size - 3;
}else{
    this.py = -arena.h + this.size + 3;
}
}

}
Shojo.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0, DImod = 1){
        //handle damage dealth
        var dmg = damage * this.damagemod;
        
        for(let i = 0 ; i < this.damagetypemod.length ; i++){
            if(damagetype.includes(this.damagetypemod[i][0])){
                dmg *= this.damagetypemod[i][1];
            }
        }

        //ensure protection
        if(dmg >= this.dmgcap){
            dmg = this.dmgcap
            this.dmgcap = 0;
        }else{
            this.dmgcap-=dmg
        }
        if(this.hp > 100 && this.hp - dmg < 100){
        this.hp = 100;
        }else{
        this.hp-=dmg;
        }

        //handle knockback and DI.
        knockback[0] *= this.knockbackmod;
        knockback[1] *= this.knockbackmod;
        if(inputs.includes(controls[0])){
            knockback[0] += this.DI * DImod;
        }
        if(inputs.includes(controls[1])){
            knockback[0] -= this.DI * DImod;
        }
        if(inputs.includes(controls[2])){
            knockback[1] += this.DI * DImod;
        }
        if(inputs.includes(controls[3])){
            knockback[1] -= this.DI * DImod;
        }
        if(this.hp < 100){
        if(this.hitstun > 0){
            knockback[0] += this.knockback[0];
            knockback[1] += this.knockback[1];
            //hitstun+=this.hitstun;
            this.knockback = knockback;
            this.hitstun += hitstun * this.hitstunmod;
            }else{
            this.knockback = knockback;
            this.hitstun = hitstun * this.hitstunmod;
            }
        }
        //console.log(this.hp);
    }
Shojo.prototype.death = function(){
projectiles = [];
summons = [];
enemies = [];
bossbarmode = 0;
//game over man! Game over!

//draw the character, stationary
screen.fillStyle = this.color;
circle(canvhalfx, this.size + 40, this.size)

//here is some statistics
screen.fillStyle = "#FFF";
screen.textAlign = "center";
screen.font = "25px Times New Roman";
screen.fillText("Shojo", canvhalfx, 20);//char name
screen.fillText("Made it to lvl: " + Math.floor(level), canvhalfx, canvhalfy - 60);//made it to what level
screen.fillText("Was playing on " + difficulty + " mode", canvhalfx, canvhalfy - 20);//On what difficulty

//get the time
estimatedtime = Math.ceil(timeplayed/fps);//30 frames in a 30 fps game = 1 second. But it's not 100% accurate.
//console.log(estimatedtime)
estimatedmin = Math.floor(estimatedtime / 60); //60 seconds = 1 minute
estimatedtime-=(estimatedmin * 60);
if(estimatedtime < 10){
estimatedtime = "0"+estimatedtime;
}
if(estimatedmin < 10){
estimatedmin = "0"+estimatedmin;
}
screen.fillText("Time lived: " + estimatedmin + ":" + estimatedtime, canvhalfx, canvhalfy + 20);//time lived

screen.fillText("Press the space bar to go back", canvhalfx, canvas.height - 30);//tell them how to go back

if(input == " "){
//ggwp
player = null;
clearInterval(setup);
setup = setInterval(prep, 1000/fps);
screen.textAlign = "left";
level = 0;
input = '';
bossbar = [];
}

}
Shojo.prototype.win = function(){
//NICE!
this.won = true;
//draw the character, stationary
screen.fillStyle = this.color;
circle(canvhalfx, this.size + 40, this.size)

//here is some statistics
screen.fillStyle = "#99ff00ff";
screen.textAlign = "center";
screen.font = "25px Times New Roman";

screen.fillText("VICTORY", canvhalfx, 20);//PROCLAIM IT!!!
screen.fillText("Shojo!", canvhalfx, 40);//char name
screen.fillText("Won on lvl: " + Math.floor(level), canvhalfx, canvhalfy - 60);//made it to what level
screen.fillText("Was playing on " + difficulty + " mode", canvhalfx, canvhalfy - 20);//On what difficulty

//get the time
estimatedtime = Math.ceil(timeplayed/fps);//30 frames in a 30 fps game = 1 second. But it's not 100% accurate.
//console.log(estimatedtime)
estimatedmin = Math.floor(estimatedtime / 60); //60 seconds = 1 minute
estimatedtime-=(estimatedmin * 60);
if(estimatedtime < 10){
estimatedtime = "0"+estimatedtime;
}
if(estimatedmin < 10){
estimatedmin = "0"+estimatedmin;
}
screen.fillText("Time lived: " + estimatedmin + ":" + estimatedtime, canvhalfx, canvhalfy + 20);//time lived

screen.fillText("Press the space bar to go back", canvhalfx, canvas.height - 30);//tell them how to go back

if(input == " "){
//there's a chance.
player = null;
clearInterval(setup);
setup = setInterval(prep, 1000/fps);
screen.textAlign = "left";
level = 0;
input = '';
bossbar = [];
}

}
Shojo.prototype.spec1 = function(){
//abilities
    this.lancespin.move(canvhalfx + 20 * this.facing[0], canvhalfy + 20 * this.facing[1])
    this.lancespin.showbox("#559")
    var x = (canvhalfx + 20 * this.facing[0]) + (this.size + 40) * Math.cos(this.spinspeed);
    var y =(canvhalfy + 20 * this.facing[1]) + (this.size + 40) * Math.sin(this.spinspeed);
    this.spinspeed  += 0.2 + (this.spinspeed/50)
    this.chargetime++;
    screen.beginPath();
        screen.lineWidth = 10;
        screen.strokeStyle = "#4485"
    
    screen.moveTo(canvhalfx + 20 * this.facing[0], canvhalfy + 20 * this.facing[1]);
    screen.lineCap = "round"
    screen.lineTo(x, y);
  
    screen.stroke();
    screen.lineCap = "butt"
    screen.closePath();
    screen.lineWidth = 1;
    for(let i = 0 ; i < enemies.length ; i++){
        if(this.lancespin.checkenemy(i)){
            enemies[i].hit((this.spinspeed < 200)? this.spinspeed/10:20, ["bludgeoning", "physical"])
            this.lancespin.grantimmunity(i)

            //unique interaction with evades enemies
            if(enemies[i].knockback == "legacy" && enemies[i].hitstun == 0){
                console.log("hi")
                if(this.spinspeed > 20){
                    this.spinspeed-= 20;
                    enemies[i].hitstun = 60;
                }
                if(this.spinspeed > 60){
                    this.spinspeed = 59;
                }
            }
        }
    }
}
Shojo.prototype.spec2 = function(){
this.hp = 200;
}
Shojo.prototype.spec3 = function(){

}
Shojo.prototype.spec4 = function(){

}

Shojo.prototype.inst = function(x = this.px, y = this.py, size = this.size){
player = new Shojo(x, y, size);
}
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Shojo(canvhalfx, canvhalfy, 24));//Armor makes him a tad bigger.