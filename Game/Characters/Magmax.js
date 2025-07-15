/* 
hardmode changes:
    can no longer overheal past 120 hp
    gets the energy feature from evaedes (clutch mode makes you regen energy faster... because of course it does)
    flow gives slightly less invincibility
*/

function Magz(startposx, startposy, size){
this.px = startposx;
this.py = startposy;
this.pz = 0;
this.size = size;

//I swear I'm not referencing evades.io with this character!
this.postColor =  "rgb(71, 0, 0)";
this.color = "rgb(255, 84, 84)";
this.desc = ["The easy mode character! much more DI than normal, and takes less hitstun!", "Second Phase!: This is a passive that permanently grants an omnibuff if you are ever killed! Only works once", "1. Skate beam: Slash in an arc, and create a large shockwave to zone out your foe! Both the melee and ranged attack can hit!", "Successful attacks add extra damage to your next attacks! Zoning lowers this damage boost, so keep your enemies close!", "2. Roundhouse: Dash forwards and go for a quick slash with your skates! gain invincibility, heal, and gain a bonus speed on hit! On miss, you slow down.", "Deal A LOT of extra damage for every roundhouse in your combo! Missing resets the damage.", "3. Flow: Get bonus speed on toggle! Increases the effect of DI as well! Grants immunity for the first few frames", "4. Harden: Just get invincibilty, for as long as you want. Sure, you can't move, but does that really matter???"];
//game stats
this.playershift = [0, 0];//shift the position of the player
this.cooldowns = [0, 0, 0, 0];
this.damagetypemod = [["dark", 0.1], ["black", 0.5], ["light", 0.5], ["seduction", 0]];//the DARK abomination that absorbs traits from all sources. Also, the paragon of friendship and love.
this.hp = 100;
this.damagemod = 1;
this.speed = 10;
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.DI = 2; //It's the easy mode character, lmao.
this.hitstunmod = 0.8; //That one character that everyone can play
this.knockbackmod = 1;
this.facing = [1, 0]
this.height = 8;
this.iframe = false;
//Unique!!!
this.clutch = false;
this.state = "normal";
this.slashbox = new hitbox(this.px, this.py, this.pz, 3, this.size - 10);
this.slashbox.disable();
this.slashbox.immunityframes(2);//really fucking broken, I know.
this.slashtime = 0;
this.dashtime = 0;
this.nohit = false;
this.repetitivebonus = 1;//get a small damage boost for every attack hit
this.projstart = 0;
this.abilitylock = [false, false];
this.secondphase = -1;
this.hitboxsize = 50;//just so you know, this is a LOT bigger than what you think it is
//hard mode exclusive
this.energy = 50;//also straight from evades.io
this.energyregen = 0.13;//straight from evades.io (4 energy a second)
this.energydepleted = 0;//marks when the energy max bar should be red

}
Magz.prototype.listname = function(){
//to help position the characters correctly
return "Magmax";
}
Magz.prototype.greeting = function(){
console.log("Magmax, easy mode character, skates back from the dead!");
}
Magz.prototype.exist = function(){
this.slashbox.updateimmunity();
if(this.repetitivebonus > 1){
this.repetitivebonus-=0.02;
}else{
if(this.clutch){
this.repetitivebonus = 10;//permanent damage AND healing buff
}
this.repetitivebonus = 1;
}



//HP check
if(this.hp > 100){
    //I'm generous enough to give you a BIT of extra power for a set time
    if(!this.clutch){
        //second phase = godhood
        this.hp-=0.15;
    }
    if(this.hp <= 100){
        this.hp = 100;
        //yes, I'm aware this is effectively a free defense
    }

}else if(this.hp <=0 ){

    //clutch up activation
    if(!this.clutch){
    //POV: second phase! (this will actually save you from death)
    this.hp = 50;
    this.nohit = 45;
    this.hitstun = 0;
    this.clutch = true;
    this.secondphase = 0;
    this.hitboxsize = 75;
    }else{
    //play the death anmiation, then call off
    this.death();
    return "dead";
    }
}
//indicator of phase change
if(this.secondphase > -1 && this.secondphase <= 15){
    screen.strokeStyle = "#f00";
    screen.lineWidth = 10*(this.secondphase/2)
    circle(canvhalfx, canvhalfy, this.size * this.secondphase, true, false);
    this.secondphase+=3;
    screen.lineWidth = 1;
}
timeplayed++;
if(this.state == "harden" || this.nohit > 0){
    console.log(true)
    this.iframe = true;
}else{
    this.iframe = false;
}
//speedmod is ALWAYS 1 to begin with
if(this.clutch){
//permanent speed buff
this.speedmod = 1.2;
}else{
this.speedmod = 1;
}
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
            if(this.state == "flow"){
                screen.fillStyle = "#ff7e75"
            }else if(this.state == "harden"){
                screen.fillStyle = "#5e0a04"
            }else{
                screen.fillStyle = this.color;
            }
            circle(canvhalfx, canvhalfy, this.size)
            //hp
            if(this.hp <= 100){
            //under max
            screen.fillStyle = "#F00";
            screen.fillRect(canvhalfx- 25, canvhalfy - this.size - 10, 50, 4);//max hp
            screen.fillStyle = (this.nohit < 0 && this.state != "harden")? "#0F0":"#00f";
            screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
            }else{
            //over max
            screen.fillStyle = (this.nohit < 0 || this.state != "harden")? "#0F0":"#00f";
            screen.fillRect(canvhalfx - 25 - (this.hp - 100) * 0.25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
            screen.fillStyle = "#00F";
            screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
            }
            //if hard mode, energy bar
            if(!charezmode()){
            if(this.energydepleted > 0){
                screen.strokeStyle = "#F00";
                this.energydepleted--;
            }else{
                screen.strokeStyle = "#000";
            }
            screen.fillStyle = "#00F";
            screen.strokeRect(canvhalfx - 25, canvhalfy - this.size - 15, 50, 4);//max energy
            screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 15, this.energy, 4);//current energy

            //energy regen
            if(this.clutch){
            this.energyregen = 0.17//approximately 5 energy regen. +1 bonus
            }
            if(this.energy < 50){
                this.energy+=this.energyregen;
            }else if(this.energy > 50){
                this.energy = 50;
            }

            //energy depletion for states
            if(this.state == "flow"){
                this.energy-=0.07;//2 energy a second
                //cancel flow if out of energy
                if(!this.clutch && !charezmode() && this.energy < 1){
                    //flow cannot be cancelled if clutch up is active
                    this.state = "normal";
                    this.energydepleted = 10;

                }
            }else if (this.state == "harden"){
                this.energy-=0.4;//12 energy a second
                //cancel harden if out of energy
                if(!charezmode() && this.energy < 1){
                this.state = "normal";
                this.energydepleted = 10;

                }
            }
            //energy regen
                        if(this.energy < 50){
                            this.energy+=this.energyregen;
                        }else if(this.energy > 50){
                            this.energy = 50;
                        }

            }
            this.nohit--;//lower i frames
            //hitstun
            if(this.hitstun > 0){
                this.hurt();
                if(this.clutch){
                //hitstun is not as effective against you on second phase!
                this.hitstun--;
                }
                return;
            }
            //movement

            if(this.dashtime < 0){
            if(this.state == "flow"){
                this.DI = 5
                if(inputs.includes("shift")){
                    this.speed = 10;
                }else{
                    this.speed = 20;
                }
            }else if(this.state == "harden"){
                this.speed = 0;
            }else{
                this.DI = 2;
                if(inputs.includes("shift")){
                    this.speed = 5;
                }else{
                    this.speed = 10;
                }
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
}
//lower all cooldowns
for(let i = 0; i < this.cooldowns.length ; i++){
    this.cooldowns[i]--;
}
//attacks
this.dashtime--;
if(this.slashtime > 0){
screen.fillStyle = "#f5b8da"
screen.beginPath();
if(this.dashtime >0){
//SPEED
this.px -= (this.speed * this.speedmod * 2 + 12) * this.facing[0];
this.py -= (this.speed * this.speedmod * 2 + 12) * this.facing[1];
if(arena.pleavedir().includes('l')){
this.facing[0] = 1;
}else if(arena.pleavedir().includes('r')){
this.facing[0] = -1;
}

if(arena.pleavedir().includes('u')){
this.facing[1] = 1;
}else if(arena.pleavedir().includes('d')){
this.facing[1] = -1;
}

}else{

if(this.facing[0] == -1){
//facing left
if(this.facing[1] == -1){
//up left
screen.arc(canvhalfx - 10, canvhalfy - 10, 30, 2.74, 5.23);
this.slashbox.reassign(canvhalfx - 20, canvhalfy - 20, this.pz, 2, this.hitboxsize);
//screen.arc(this.px - 20, this.py - 20, 35, 0, 2 * Math.PI);
}else if(this.facing[1] == 1){
//down left
screen.arc(canvhalfx - 10, canvhalfy + 10, 30, 1, 3.43);
this.slashbox.reassign(canvhalfx - 20, canvhalfy + 20, this.pz, 2, this.hitboxsize);
}else{
//just left
screen.arc(canvhalfx - 10, canvhalfy, 30, 1.8, 4.48);
this.slashbox.reassign(canvhalfx - 20, canvhalfy, this.pz, 2, this.hitboxsize);
}
}else if(this.facing[0] == 1){
if(this.facing[1] == -1){
//up right
screen.arc(canvhalfx + 10, canvhalfy - 10, 30, -2.1, 0.43);
this.slashbox.reassign(canvhalfx + 20, canvhalfy - 20, this.pz, 2, this.hitboxsize);

}else if(this.facing[1] == 1){
//down right
screen.arc(canvhalfx + 10, canvhalfy + 10, 30, -0.39, 1.9);
this.slashbox.reassign(canvhalfx + 20, canvhalfy + 20, this.pz, 2, this.hitboxsize);
}else{
//just right
screen.arc(canvhalfx + 10, canvhalfy, 30, -1.2, 1.23);
this.slashbox.reassign(canvhalfx + 20, canvhalfy, this.pz, 2, this.hitboxsize);
}
}else{
if(this.facing[1] == -1){
//just up
screen.arc(canvhalfx, canvhalfy - 10, 30, -2.74, -0.41);
this.slashbox.reassign(canvhalfx, canvhalfy - 20, this.pz, 2, this.hitboxsize);

}else{
//just down
screen.arc(canvhalfx, canvhalfy + 10, 30, -12.25, -9.76);
this.slashbox.reassign(canvhalfx, canvhalfy + 20, this.pz, 2, this.hitboxsize);
}
}
//this.slashbox.showbox()

for(let i = 0 ; i < enemies.length ; i++){
if(this.slashbox.checkenemy(i)){
if(this.projstart <=0){
enemies[i].hit(8 * (this.repetitivebonus * 1.5), ["physical", "slashing"]);//devestating when in a combo!
if(!charezmode() && this.hp < 101){
//you can overheal with this one!
this.hp+= 2 * (this.repetitivebonus * 1.5)//lifesteal
if(!charezmode() && this.hp >120){
this.hp = 120;
}
}else if (charezmode()){
this.hp+= 2 * (this.repetitivebonus * 1.5)//lifesteal, and overheal cheese!
}
this.repetitivebonus+=3;//MOAR DAMAGE!
this.nohit=17;
this.slashbox.grantimmunity(i);
this.cooldowns[0] = 0;//HIT EM AGAIN AND AGAIN AND AGAIN AND ah man... I missed.
this.speedcause.push(["Frenzy!", 17, 2]);
}else{
enemies[i].hit(8 * this.repetitivebonus, ["physical", "slashing"], [8 * this.facing[0], 8 * this.facing[1]], 20);
this.repetitivebonus+=1;
if(this.hp < 99){
this.hp+= 2 * (this.repetitivebonus / 2)//weak lifesteal
if(this.hp > 100){
this.hp = 100//this move is no longer allowed to overheal... it was too OP
}
}
this.nohit=6;
this.slashbox.grantimmunity(i);
}
}else if(this.projstart<=0){
{
let slow = true;
for(let i = 0 ; i < this.speedcause.length ; i++){
    if(this.speedcause[i][0] == 'Frenzy!'){
        //this.speedcause.splice(i, 1);
        slow = false;
        break;
    }
}
if(slow == true){
if(!this.clutch){
this.speedcause.push(["whiff", 17, 0.5]);
//you are no longer slowed down on whiff with clutch up active
}else{
this.nohit=2;//you are given a small bit of Iframes instead!
}
this.repetitivebonus = 1;//only combos allowed!!!
}
}
}
}
screen.fill();
screen.closePath();

this.slashtime--;
}
}
if(this.projstart > 0 && --this.projstart <= 0){
if(this.clutch){
projectiles.push(new skatebeam(canvhalfx + (20 * this.facing[0]), canvhalfy + (20 * this.facing[1]), 60, this.facing));
projectiles[projectiles.length - 1].lifetime = null;//make the projectiles unparriable
}else{
projectiles.push(new skatebeam(canvhalfx + (20 * this.facing[0]), canvhalfy + (20 * this.facing[1]), 30, this.facing));
}
}

if(this.state != "harden"){
//no moving and no abilities allowed! Only state changing!

if(this.cooldowns[0] <= 0 && inputs.includes(controls[4])){
    this.spec2();//swapped it around
}
if(this.cooldowns[1] <= 0 && inputs.includes(controls[5])){
    this.spec1();
}
}
if(this.cooldowns[2] <= 0 && inputs.includes(controls[6]) && this.abilitylock[0] == false){
    //flow
    this.abilitylock[0] = true;
    this.spec3();
}
if(this.cooldowns[3] <= 0 && inputs.includes(controls[7]) && this.abilitylock[1] == false){
    //harden
    this.abilitylock[1] = true;
    this.spec4();
}
if(!inputs.includes(controls[6])){
this.abilitylock[0] = false;
}
if(!inputs.includes(controls[7])){
//reactivate flow
this.abilitylock[1] = false;
}
}

Magz.prototype.spec1 = function(){
//on hard mode only, this requires energy
if(!charezmode() && this.energy <= 15){
this.energydepleted = 10;
return;
}else if(!charezmode()){
this.energy-=15;
}

this.cooldowns[1] = 18;//this IS the easy mode character
this.dashtime = 6;//6 frames of dashing!
this.cooldowns[3] = this.dashtime;//no hardening mid dash!
this.nohit = this.dashtime + 1;
this.slashtime = 2;
console.log("e");
}
Magz.prototype.spec2 = function(){
//on hard mode only, this requires energy
if(!charezmode() && this.energy <= 5){
this.energydepleted = 10;
return;
}else if(!charezmode()){
 this.energy-=5;
 }
this.cooldowns[0] = 8;
this.cooldowns[3] = 8;
this.projstart = 2;
this.slashtime = 2;
}
Magz.prototype.spec3 = function(){
if(this.state != "flow"){
this.state = "flow";
if(this.nohit < 10){
if(charezmode()){
this.nohit = 12;//some invulnerability on start up!
}else{
this.nohit = 8;//pray that you evade!
}
}

}else{
this.state = "normal"
}
//this.cooldowns[2] = 2;
}
Magz.prototype.spec4 = function(){

if(this.state != "harden"){
this.state = "harden";
}else{
this.state = "normal"
}
//this.cooldowns[3] = 15;
}
Magz.prototype.hurt = function(){
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
Magz.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0, DImod = 1){
        if(this.nohit > 0 || this.state == "harden"){
            return;//so complex!
        }
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
        if(this.clutch){
        //takes 50% of the damage from ALL sources. no matter what
        this.hp-=dmg*0.50;
        }else{
        this.hp-=dmg;
        }
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
Magz.prototype.death = function(){
projectiles = [];
summons = [];
enemies = [];
//game over man! Game over!

//draw the character, stationary
screen.fillStyle = this.color;
circle(canvhalfx, this.size + 40, this.size)
bossbarmode = 0;
//here is some statistics
screen.fillStyle = "#FFF";
screen.textAlign = "center";
screen.font = "25px Times New Roman";
screen.fillText("Magmax", canvhalfx, 20);//char name
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

clearInterval(setup);
setup = setInterval(prep, 1000/fps);
screen.textAlign = "left";
level = 0;
selection = 0;
bossbar = [];
input = '';
player = null;
}

}
Magz.prototype.inst = function(x = this.px, y = this.py, size = this.size){
//adds a player to the game!
player = new Magz(x, y, size);
}
//yep, this is magmax's nickname
chars.push(new Magz(canvhalfx, canvhalfy, 20));

//projectiles
function skatebeam(x, y, size, face){
    this.name = "skatebeam";
    this.x = x;
    this.y = y;
    this.size = size
     this.shift = [player.px, player.py];
    this.facing = [face[0], face[1]];
    this.esist = 15;
    this.hitbox = new hitbox(x, y, player.pz, 2, size);
    this.hitbox.disable();
    this.hitbox.immunityframes(10);
    this.lifetime = 700;
}
skatebeam.prototype.exist = function(){
    if(typeof this.lifetime == "number"){
        //yep... these are unparriable on second phase
        this.lifetime--;
    }
    screen.strokeStyle = "#999"
    this.hitbox.updateimmunity();
    this.hitbox.enable();
    //circle(this.x, this.y, this.size)
    //moving
    screen.beginPath();
    if(this.facing[0] == -1){
    if(this.facing[1] == -1){
    //up left
    screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size, 2.74, 5.23);
    //screen.arc(this.px - 20, this.py - 20, 35, 0, 2 * Math.PI);
    }else if(this.facing[1] == 1){
    //down left
    screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size, 1, 3.43);

    }else{
    //just left
    screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size, 1.8, 4.48);

    }
    }else if(this.facing[0] == 1){
    if(this.facing[1] == -1){
    //up right
    screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size, -2.1, 0.43);

    }else if(this.facing[1] == 1){
    //down right
    screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size, -0.39, 1.9);
    }else{
    //just right
    screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size, -1.2, 1.23);

    }
    }else{
    if(this.facing[1] == -1){
    //just up
    screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size, -2.74, -0.41);

    }else{
    //just down
    screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size, -12.25, -9.76);
    }
    }

    screen.stroke();
    screen.closePath();

    this.x+= 12 * this.facing[0];
    this.y+= 12 * this.facing[1];
    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    if(arena.leave(this.x - this.shift[0], this.y - this.shift[1], this.size) || typeof this.lifetime == "number" && this.lifetime < 1){
        return "delete";
    }
    //hitting the enemy
    let en = this.hitbox.hitenemy();
    //console.log(en);
    for(let i = 0 ; i < enemies.length ; i++){
    if(this.hitbox.checkenemy(i)){
        if(enemies[i].knockback == "legacy"){
                enemies[i].hit(0, [], [], 45);
            }
        enemies[i].hit(5 + this.esist + player.repetitivebonus,  ["magic", "slashing"], [12 * this.facing[0], 12 * this.facing[1]], 5);
        player.repetitivebonus+= 1 * (this.esist/10)
        this.esist+=10;
        this.hitbox.grantimmunity(i);
        
        //return "delete";
    }
}
    if(this.esist > -2){
    this.esist--;
    }
}