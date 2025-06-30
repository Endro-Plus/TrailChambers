function Nino(startposx, startposy, size){
//startup
this.px = startposx;
this.py = startposy;
this.pz = 0;
this.size = size;

//character poster/character color
this.postColor = "#000088";
this.color = "#7700CC";
this.desc = ["The wizard! Many strong projectiles that are hard to miss, but not many mobility options. Also, don't tell him this, but he's kinda short", "Growing Darkness: Every successful hit on an enemy lowers their defense. After a damage drought, the enemy detonates, leaving miasma on the ground", "  the explosion does 50% of the damage you dealt before the detonation, so keep that combo high!", "1. Chain Lightning: Fire a bolt of lightning that constantly bounces off enemies, projectiles, and even you! The closer targets are, the more bounces!", "Electrified enemies are slower, and take passive damage.", "2. Pyro mine: A stationary projectile that detonates into a large inferno when near an enemy!", "Electrified mines deal critical damage AND electrifies enemies in the radius! Pyro mines hold charges for longer times.", "3. Cutting Barrage: conjure several cutting gales at once that move irratically!", "4. Miasma Storm: An install that creates a dark aura around you, damaging nearby enemies and spewing random balls of miasma!", "enemies are slowed down by the aura, and enemies hit by miasma balls emit a similar damaging aura, causing more overtime damage!"]
//game stats
this.playershift = [0, 0]
this.cooldowns = [0, 0, 0, 0];
this.damagetypemod = [["seduction", 0.6], ["light", 2], ["radiant", 2], ["magic", 0.5], ["dark", 0.1], ["headpat", 999]];//Bro does NOT like his hat being removed. Also, he's a renowned dark wizard, that light weakness caught up to him.
this.hp = 100;
this.damagemod = 1;
this.speed = 10;
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.DI = 1;
this.facing = [0, 0]
this.hitstunmod = 1;
this.knockbackmod = 1;
this.height = 6; //POV: canonically short
this.iframe = false;
}
Nino.prototype.listname = function(){
//to help position the characters correctly
return "Nino";
}
Nino.prototype.greeting = function(){
//The formal greeting for the console log! Useless? Sure, but still!
console.log("Shadow Wizard Money Gang enthusiast Nino is ready to cast spells!")
}
Test.prototype.exist = function(){
//HP check
if(this.hp <= 100){
//under max
screen.fillStyle = "#F00";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
screen.fillStyle = "#0F0";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp

}else if(this.hp <=0 ){
    //play the death anmiation, then call off
    this.death();
    return;
}else{
//over max

screen.fillStyle = "#0F0";
screen.fillRect(canvhalfx - 25 - (this.hp - 100) * 0.25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
screen.fillStyle = "#00F";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
}


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
            if(this.hp <= 100){
            //under max
            screen.fillStyle = "#F00";
            screen.fillRect(this.px - 25, this.py - this.size - 10, 50, 4);//max hp
            screen.fillStyle = "#0F0";
            screen.fillRect(this.px - 25, this.py - this.size - 10, this.hp / 2, 4);//current hp
            }else{
            //over max
            screen.fillStyle = "#0F0";
            screen.fillRect(this.px - 25 - (this.hp - 100) * 0.25, this.py - this.size - 10, this.hp / 2, 4);//current hp
            screen.fillStyle = "#00F";
            screen.fillRect(this.px - 25, this.py - this.size - 10, 50, 4);//max hp
            }
            //hitstun
            if(this.hitstun > 0){
                this.hurt();
                return;
            }
            //movement
            if(inputs.includes("shift")){
                this.speed = 5;
            }else{
                this.speed = 10;
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
    this.cooldowns[0] = fps;//keep in mind the user can change the FPS freely.
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

}

Test.prototype.hurt = function(){
this.hitstun--;
console.log(this.hitstun);
this.px += this.knockback[0];
this.py += this.knockback[1];
this.knockback[0]*=0.9;
this.knockback[1]*=0.9;
if(arena.pleavedir().includes("l") || arena.pleavedir().includes('r')){
this.hitstun += 3;
if(!charezmode()){
this.hit(3, ["physical"]);//slamming into walls hurt!
}
this.knockback[0]*=-0.5;
if(arena.pleavedir().includes("l")){
    this.px = arena.w - this.size - 3;
}else{
    this.px = -arena.w + this.size + 3;
}
}
if(arena.pleavedir().includes("u") || arena.pleavedir().includes('d')){
this.hitstun += 3;
if(!charezmode()){
this.hit(3, ["physical"]);//slamming into walls hurt!
}
this.knockback[1]*=-0.5;
if(arena.pleavedir().includes("u")){
    this.py = arena.h - this.size - 3;
}else{
    this.py = -arena.h + this.size + 3;
}
}

}
Test.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
        //handle damage dealth
        var dmg = damage * this.damagemod;
        for(let i = 0 ; i < this.damagetypemod.length ; i++){
            if(damagetype.includes(this.damagetypemod[i][0])){
                dmg *= this.damagetypemod[i][1];
            }
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
            knockback[0] += this.DI;
        }
        if(inputs.includes(controls[1])){
            knockback[0] -= this.DI;
        }
        if(inputs.includes(controls[2])){
            knockback[1] += this.DI;
        }
        if(inputs.includes(controls[3])){
            knockback[1] -= this.DI;
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
Test.prototype.death = function(){
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
screen.fillText("Test Character!!!1 NOOOOOOOO", canvhalfx, 20);//char name
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
Test.prototype.spec1 = function(){
//abilities
console.log("working!");
}
Test.prototype.spec2 = function(){

}
Test.prototype.spec3 = function(){

}
Test.prototype.spec4 = function(){

}

Test.prototype.inst = function(x = this.px, y = this.py, size = this.size){
player = new Test(x, y, size);
}
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Nino(canvhalfx, canvhalfy, 20));