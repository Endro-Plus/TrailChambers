/*
Hardmode changes:
    the hp costs are actually accurate to the description (on easy mode, slime requires 5 hp, but will only take 2. Supreme Slime requires 50 hp, but will only take 35)

*/

function Dorn(startposx, startposy, size){
//startup
this.px = startposx;
this.py = startposy;
this.pz = 0;
this.size = size;

//character poster/character color
this.postColor = "#003300";
this.color = "#009900";
this.desc = ["Who would've thought a slime would become the hero? Certainly not me!",
     "Regeneration: Slowly regenerates hp when below than 3/4 hp",
      "1. Slime: Throw slime at the opponent! The slime lingers for a bit on miss, and clings to an enemy on hit!",
    "   Walking on slime heals you, enemies touching slime damages the slime thanks to your acidic base!",
    "This move costs 5% hp",
    "2. Supreme Slime: Sacrifice 50% of your hp to roll a large ball of slime! This slime sticks to the ground and acts like regular slime",
    "   While this is rolling, 1 light enemy can be caught in the center! Other enemies simply suffer a severe speed penalty.",
    "   Throwing regular slime at the supreme slime increases it's \"hp\" stat. Standing in sacrifices it's hp to heal you faster!",
    "   Use the ability again while a supreme slime is out to swap places with it! You inherit it's hp stat, and it will inherit yours",
    "   You autoswap instead of dying if a supreme slime is active and you take fatal damage! Swapping can be done in hitstun!",
    "3. Splatter: Upon taking damage, some of the damage is done over time rather than instantly.",
    "   During this point, use this ability to negate the damage and splatter! This negates knockback and hitstun too!",
    "   You are invulnerable and faster while in the splattered state, use this to get away before you reform!",
    "4. Deform/Reform: Become a puddle! You automatically absorb slime on the ground and heal instantly while in this state!",
    "   Enemies take damage if they step in you, but you also take minor damage for this. Use again to reform!",
    "   While in this state, you are practically immune to damage! This can be done in hitstun."

]

//game stats
this.playershift = [0, 0];//shift the position of the player
this.cooldowns = [0, 0, 0, 0];
this.damagetypemod = [["fire", 1.5], ["poison", 0], ["slashing", 0.3], ["piercing", 0.3], ["bludgeoning", 1.3], ["magic", 1.2], ["physical", 0.8]];//guys, the slime is immune to poison, and cannot be hurt by slashing or stabbing!!! Who would've thought!!!!!!
this.hp = 100;
this.damagemod = 0.8; //It's hard to hurt a slime..
this.maxspeed = 9;
this.speed = 9; //Kinda hard to move as a slime, just sliding around

this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];//causes of speed buffs/nerfs [reason, duration, effect]
this.DI = 1; //I SURE HOPE YOU'RE USING DI, DORN MAIN!!!
this.hitstunmod = 0.8 //When getting hurt is hard, recoiling in pain is unlikely!
this.knockbackmod = 0.6; //Knock away a slime by punching it, I dare you.
this.facing = [1, 0];
this.height = 8;
this.iframe = false;//completely ignore hits
this.won = false;
this.hitstun = 0;
this.knockback = [0, 0]

//UNIQUE
this.friction = 0.33;//sliding around at the speed of sound!
this.movement = [0, 0];//weeeeeee
this.nohp = 0;
this.superslime = null;
this.sizeto = size;
}
Dorn.prototype.listname = function(){
//to help position the characters correctly
return "Dorn";
}
Dorn.prototype.greeting = function(){
//The formal greeting for the console log! Useless? Sure, but still!
console.log("Dorn, a slime, is ready to slide his way to victory!")
}
Dorn.prototype.exist = function(){
//HP check
if(this.hp <= 100 && this.hp > 0){
//under max
screen.fillStyle = "#F00";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
screen.fillStyle = (this.nohp-- > 0)? "rgba(255, 145, 0, 1)":"#0F0";//if you don't have the hp to use super slime, it flashes orange for you
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp

}else if (this.hp > 0){
//over max

screen.fillStyle = "#0F0";
screen.fillRect(canvhalfx - 25 - (this.hp - 100) * 0.25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
screen.fillStyle = "#00F";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
    //I'm generous enough to give you a BIT of extra power for a set time
    this.hp-=0.15;
    if(this.hp <= 100){
        this.hp = 100;
        //yes, I'm aware this is effectively a free defense
    }



}
if(this.hp <=0 || this.won == true){
    //play the death anmiation, then call off
    if(this.won == false){
        this.death();
    }else{
        this.win()
    }
    return "dead";
}
if(this.hp < 75){
    this.hp+=0.1;//hit that passive regen! Free of charge!
}
//super slime
if(this.superslime != null && this.superslime.lifetime == 0){
    this.superslime = null;
}
timeplayed++;
//resizing
 if(this.size != this.sizeto){
    this.speedmod = 0.5;
    this.iframe = true;
    this.cooldowns[1] = 30;
            if(this.size > this.sizeto - 2){
                this.size-=2;
            }else if(this.size < this.sizeto + 2){
                this.size+=2;
            }else{
                this.size = this.sizeto;
                this.iframe = false;
            }
        }else{
            this.speedmod = 1;

        }


//speedmod is ALWAYS 1 to begin with

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
                this.hurt();
                
            }else{
            //movement
            if(inputs.includes("shift")){
                this.speed = this.maxspeed/5;//super slow!
            }else{
                this.speed = this.maxspeed;
            }
            if(inputs.includes(controls[0]) && !arena.pleavedir().includes('l')){
            this.movement[0] =this.speed * this.speedmod;
            this.facing[0] = -1;
            if(!inputs.includes(controls[2]) && !inputs.includes(controls[3])){
                this.facing[1] = 0;
            }
            }
            if(inputs.includes(controls[1]) && !arena.pleavedir().includes('r')){
            this.movement[0] = this.speed * this.speedmod;
            this.facing[0] = 1;
            if(!inputs.includes(controls[2]) && !inputs.includes(controls[3])){
                this.facing[1] = 0;
            }
            }
            if(inputs.includes(controls[2]) && !arena.pleavedir().includes('u')){
            this.movement[1] = this.speed * this.speedmod;
            this.facing[1] = -1;
            if(!inputs.includes(controls[0]) && !inputs.includes(controls[1])){
                this.facing[0] = 0;
            }
            }
            if(inputs.includes(controls[3]) && !arena.pleavedir().includes('d')){
            this.movement[1] = this.speed * this.speedmod;
            this.facing[1] = 1;
            if(!inputs.includes(controls[0]) && !inputs.includes(controls[1])){
                this.facing[0] = 0;
            }
            }
        }

            //slippery-ness (yep, the ability to slide is being accounted for even in hitstun)
        
            this.px += this.movement[0] * -this.facing[0];
            this.py += this.movement[1] * -this.facing[1];
            this.movement[0] = this.movement[0] * (1 - this.friction)
            this.movement[1] = this.movement[1] * (1 - this.friction)
            if(Math.abs(this.movement[0]) < 0.5){
                this.movement[0] = 0;
            }
            if(Math.abs(this.movement[1]) < 0.5){
                this.movement[1] = 0;
            }

//lower all cooldowns
for(let i = 0; i < this.cooldowns.length ; i++){
    this.cooldowns[i]--;
}
//attacks

if(this.cooldowns[0] <= 0 && inputs.includes(controls[4]) && this.hitstun < 1){
    this.spec1();
   
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



Dorn.prototype.hurt = function(){
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
Dorn.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0, DImod = 1){
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
Dorn.prototype.death = function(){
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
screen.fillText("Dorn", canvhalfx, 20);//char name
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
Dorn.prototype.win = function(){
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
screen.fillText("Dorn", canvhalfx, 40);//char name
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
Dorn.prototype.spec1 = function(){
//abilities
//console.log("working!");
if(this.hp > 5){
projectiles.push(new Slime(canvhalfx, canvhalfy, 7, 30 * this.facing[0], 30 * this.facing[1]));
 this.cooldowns[0] = 12;//keep in mind the user can change the FPS freely.
 if(charezmode()){
 this.hp-=2;//a bit of mercy
 }else{
    this.hp-=5;//You will PAY!
 }
}else{
    //PANICCC!!!!!
    this.nohp = 10;
}
}
Dorn.prototype.spec2 = function(){
    if(this.superslime == null && this.hp > 50){
        //can't be done in hitstun
        if(this.hitstun < 1){
        projectiles.push(new Super_Slime(canvhalfx, canvhalfy, this.size * 2, 25 * this.facing[0], 25 * this.facing[1]));
        this.superslime = projectiles[projectiles.length-1]
    this.cooldowns[1] = 30;
     if(charezmode()){
     this.hp-=35;//a bit of mercy
     }else{
    this.hp-=50;//You WILL pay the cost of greatness
 }
}

    }else if (this.superslime != null){
        //can be done in hitstun
        if(typeof this.superslime.lifetime == "string"){
        let tp = [canvhalfx - findposition(this.superslime)[0] + this.px, canvhalfy - findposition(this.superslime)[1] + this.py, this.hp];
        this.superslime.x = canvhalfx - this.px + this.superslime.shift[0]
        this.superslime.y = canvhalfy - this.py + this.superslime.shift[1];
        this.hp = this.superslime.hp;
        this.superslime.hp = tp[2];
        this.px = tp[0];
        this.py = tp[1];

        this.size = this.superslime.sizeto;
        this.superslime.size = this.sizeto;
        
        }
    }else{
        //no hp???
        this.nohp = 10;
    }
}
Dorn.prototype.spec3 = function(){

}
Dorn.prototype.spec4 = function(){

}

Dorn.prototype.inst = function(x = this.px, y = this.py, size = this.size){
player = new Dorn(x, y, size);
}
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Dorn(canvhalfx, canvhalfy, 20));

//projectiles

function Slime(x, y, size, mx, my){
    this.name = "Slime";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.color = "rgba(51, 204, 51";
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.lifetime = 1;//can be parried now... but not when on the ground
    this.visibility = 80;//reduces slowly, then fades out of existance.
    
}
Slime.prototype.exist = function(){
    this.hitbox.enable();
    this.visibility-=0.1
    screen.fillStyle = this.color + `,${this.visibility/100})`;
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
    if(typeof this.lifetime == "object"){
        //just follow the boss around
        this.x = findposition(this.lifetime)[0] - player.px + this.shift[0]
        this.y = findposition(this.lifetime)[1] - player.py + this.shift[1]
    }else if (typeof this.lifetime != "string"){
        //slow down overtime and grow
    this.x+=this.mx;
    this.y+=this.my;
    this.mx*=.80;
    this.my*=0.80
    this.size+=random(1, 2);
    if(Math.abs(this.mx) + Math.abs(this.my) < 5){
        //if it stops, stick to the ground!
        this.size+=random(1, 9);
        this.lifetime = "cling!"
        this.hitbox.movez(-1, 2);//extremely close to the ground!
    }
    }   
    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    this.hitbox.resize(this.size)
    //console.log((this.x - (canvhalfx + player.playershift[0])) + " " + (this.y - (canvhalfx + player.playershift[1])));
    //console.log(arena.leavedir(this.x, this.y, this.size))
    
    if(this.lifetime <= 0 || this.visibility < 1){
         this.lifetime.HelpIamslimed = undefined;//make sure other enemies can still be slimed!
        return "delete";
    }
    //hitting the enemy
    //console.log(en);
    if(typeof this.lifetime=="object"){
        if(typeof this.lifetime.HelpIamslimed == "undefined" || this.lifetime.HelpIamslimed==this && this.lifetime.hp > 0){
        this.lifetime.HelpIamslimed = this;//funny debuff name I know!
        this.size = this.lifetime.size * 2;
        this.lifetime.hit(0.2, ["acid"]);
        this.lifetime.speedcause.push(["Slimed", 30, 0.5])
        }else{
            //no stacking allowed!
            if(this.lifetime.hp > 0){
            this.lifetime.HelpIamslimed.visibility  = 90;//a little boost
            return "delete"
            }else{
                //just linger instead
                this.lifetime = "stick";
                this.size +=10;
                this.lifetime.HelpIamslimed = undefined;//make sure other enemies can still be slimed!
                //console.log("hi")
            }
        }

    }else{
    for(let i = 0 ; i < enemies.length ; i++){

    if(this.hitbox.checkenemy(i) && this.lifetime == 1){
        playerattack = this.name;
        enemies[i].hit(12, ["acid"]);
       this.lifetime = enemies[i];//cling
        }else if (this.hitbox.checkenemy(i) && typeof this.lifetime == "string"){
            //bro stepped in some sticky acid! Ewwww!!!
            enemies[i].hit(0.4, ["acid"]);
            enemies[i].speedcause.push(["stack", 10, 0.95])//first stacking debuff!!!
            this.visibility-=0.1;
        }
        

        }
        if(this.hitbox.hitplayer() && typeof this.lifetime == "string" && player.hp < 100){
            player.hp+=0.2;
            this.visibility-=0.4;
            //Heal up mate, you'll need it!
        }
    }
}

function Super_Slime(x, y, size, mx, my){
    this.name = "Supreme Slime";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.color = "rgba(51, 204, 51";
    this.hitbox = new hitbox(x, y, 0, this.size, size);//This is rolled
    this.hitbox.disable();
    this.lifetime = 1;//can be parried now... but not when on the ground
    this.hp = 50;//reduces slowly, then fades out of existance. basically just visibility but I renamed it
    this.sizeto = size;
    
}
Super_Slime.prototype.exist = function(){
    this.hitbox.enable();
    this.hp-=0.01;//a slower death for it
    screen.fillStyle = this.color + `,${this.hp/100})`;
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
    if (typeof this.lifetime != "string"){
        //slow down overtime and grow
    this.x+=this.mx;
    this.y+=this.my;
    this.mx*=0.95;
    this.my*=0.95
    this.size+=2
    if(Math.abs(this.mx) + Math.abs(this.my) < 1){
        //if it stops, stick to the ground!
        this.size+=12
        this.lifetime = "cling!"
        this.hitbox.movez(-1, 1);//extremely close to the ground!
        this.hitbox.refreshimmune();
        this.sizeto = this.size
    }

    //out of bounds
        if(this.x - this.shift[0] - this.size < canvhalfx - arena.w){
            //bounce right

            this.mx = Math.abs(this.mx)

        }else if(this.x - this.shift[0] + this.size > canvhalfx - arena.w + arena.w*2){
        //bounce left

        this.mx = Math.abs(this.mx) * -1

        }
        if(this.y - this.shift[1]  - this.size< canvhalfy - arena.h){
        //bounce down

        this.my = Math.abs(this.my)

        }else if(this.y - this.shift[1]  + this.size> canvhalfy - arena.h + arena.h*2){
        //bounce up

        this.my = Math.abs(this.my) * -1

        }
    }   
    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    this.hitbox.resize(this.size)
    //console.log((this.x - (canvhalfx + player.playershift[0])) + " " + (this.y - (canvhalfx + player.playershift[1])));
    //console.log(arena.leavedir(this.x, this.y, this.size))
    
    if(this.lifetime <= 0 || this.hp < 1){
         this.lifetime = 0;//make sure other enemies can still be slimed!
        return "delete";
    }
    //hitting the enemy
    //console.log(en);
    
    for(let i = 0 ; i < enemies.length ; i++){

    if(this.hitbox.checkenemy(i) && typeof this.lifetime != "string"){
        playerattack = this.name;
        enemies[i].hit(16, ["acid"]);
        if(this.lifetime == 1 && checkweight(enemies[i], 0.4)){
             this.lifetime = enemies[i];//drag them along!
            
        }else{
            //do a bit extra
            enemies[i].hit(4, ["acid"], [this.mx * 10, this.my * 10], 45);
            enemies[i].speedcause.push(["stack", 60, 0.50])
        }

        this.hitbox.grantimmunity(i);
         
      
        }else if (this.hitbox.checkenemy(i) && typeof this.lifetime == "string"){
            //bro stepped in some sticky acid! Ewwww!!!
            enemies[i].hit(0.7, ["acid"]);
            enemies[i].speedcause.push(["stack", 10, 0.85])
            this.hp-=0.05;
        }
        
        

        }
        if(this.hitbox.hitplayer() && typeof this.lifetime == "string" && player.hp < 100){
            player.hp+=0.4;
            this.hp-=0.2;
            //Heal up mate, you'll need it!
        }
        if(typeof this.lifetime == "object"){
            //They see me rollin' they hatin'!
            this.lifetime.hitstun = 10;
            this.lifetime.x = this.x - this.shift[0];
            this.lifetime.y = this.y - this.shift[1];
            this.lifetime.hit(1, ["acid"]);
            this.lifetime.speedcause.push(["Super Slimed", 90, 0.10])//movement? not for you!
        }

    if(typeof this.lifetime == "string"){
        //for healing the supreme slime or resizing
        
        //healing
        for(let i = 0 ; i < projectiles.length ; i++){
            if(this.hp < 100 && projectiles[i].name == "Slime" && typeof projectiles[i].lifetime == "string" && this.hitbox.scanproj(i)){
                this.hp+=5;
                if(this.hp > 100){
                    this.hp = 100;
                }
                projectiles[i].visibility = 0;
                
            }
        }

        //warping/resizing

        if(this.size != this.sizeto){
            if(this.size > this.sizeto + 2){
                this.size-=2;
            }else if(this.size < this.sizeto - 2){
                this.size+=2
            }else{
                this.size = this.sizeto;
            }
        }
    }
    
}