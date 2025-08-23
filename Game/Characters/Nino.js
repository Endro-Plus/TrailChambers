/*
all hardmode changes:
    crits only do half 30 damage instead of 60 (+ the standard)
    defense reduction is half effective
    miasma aura no longer lowers defense
    less cutting gales
    miasma storm grows more slowly, and doesn't shoot as often.

*/
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
this.damagetypemod = [["seduction", 0.6], ["light", 2], ["radiant", 2], ["magic", 0.5], ["dark", 0.5], ["headpat", 999], ["aura", 0.5]];//Bro does NOT like his hat being removed. Also, he's a renowned dark wizard, that light weakness caught up to him.
this.hp = 100;
this.damagemod = 1;
this.speed = 10;
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.DI = 0.7;//definitely the worse DI in the game
this.facing = [0, 0]
this.hitstunmod = 1;
this.knockbackmod = 1;
this.height = 6; //POV: canonically short
this.iframe = false;
this.won = false;

//extras
this.defenemies = [];
this.miasma_aura = new hitbox(0, 0, 0, 9, 45);
this.miasmatime = 0;
this.defdiv = null;
}


Nino.prototype.listname = function(){
//to help position the characters correctly
return "Nino";
}
Nino.prototype.greeting = function(){
//The formal greeting for the console log! Useless? Sure, but still!
console.log("Shadow Wizard Money Gang enthusiast Nino is ready to cast spells!")
}
Nino.prototype.exist = function(){
if(this.defdiv == null){
    if(charezmode()){
        this.defdiv = 24;
    }else{
        this.defdiv = 48;//defense reduction is only half as effective on hard mode
    }
}
//HP check
if(this.hp <= 100 && this.hp>0 && this.won == false){
//under max
screen.fillStyle = "#F00";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
screen.fillStyle = "#0F0";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp

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
screen.fillStyle = "#00F";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
}


timeplayed++;

//growing darkness passive
for(let i = 0 ; i < this.defenemies.length ; i++){
    if(this.defenemies[i].hp >= 0 && "GDdetonationtime" in this.defenemies[i]){
        screen.strokeStyle = "rgb(111, 0, 255)"
        screen.lineWidth = 3;
        screen.beginPath();
        screen.arc(this.defenemies[i].x + this.px - this.defenemies[i].shift[0], this.defenemies[i].y + this.py - this.defenemies[i].shift[1], this.defenemies[i].size + 2, ((100-this.defenemies[i].GDdetonationtime)/100) * (2 * Math.PI), 2 * Math.PI);
        screen.stroke();
        screen.closePath();
        this.defenemies[i].GDdetonationtime-=1.25;
        if(this.defenemies[i].GDdetonationtime <= 0){
            delete this.defenemies[i].GDdetonationtime;
            projectiles.push(new Darkblast(this.defenemies[i].x + this.px - this.defenemies[i].shift[0], this.defenemies[i].y + this.py - this.defenemies[i].shift[1], this.defenemies[i].growingdarknessdebuff/2))
            delete this.defenemies[i].growingdarknessdebuff;
        }
    }else{
        //this no longer applies to this enemy
        this.defenemies.splice(i--, 1);
    }
}

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

            //attacks (basically just miasma storm)

if(this.miasmatime > 0){
    this.miasmatime--;
    this.miasma_aura.enable();
    this.miasma_aura.move(canvhalfx, canvhalfy);
    this.miasma_aura.resize(((charezmode())? 150:100) + (40 - this.miasmatime/((charezmode())? 2:5)))
    this.miasma_aura.showbox("rgba(108, 0, 158, 0.5)");
    for(let i = 0 ; i < enemies.length ; i++){
        if(this.miasma_aura.checkenemy(i)){
            enemies[i].hit(1.2, ["aura", "magic", "dark"]);
        }
    }
    if(this.miasmatime % ((charezmode())? 10:15) == 0){
        for(let i = 1 ; i <= 3 ; i++){
        let speed = 20;
        let velx = random(0, speed) * (random(0, 1, false)? -1:1)
        speed -= Math.abs(velx)
        let vely = speed * (random(0, 1, false)? -1:1)
        
        projectiles.push(new Miasma(canvhalfx, canvhalfy, 15, velx, vely));
        }
    }
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
    if(this.miasmatime <= 0 && this.cooldowns[3] < 0){
        screen.fillStyle = "rgba(255, 0, 212, 0.02)";
        circle(canvhalfx, canvhalfy, this.size + 10)
    }
}


if(this.cooldowns[0] <= 0 && inputs.includes(controls[4])){
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



Nino.prototype.hurt = function(){
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
Nino.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0, DImod = 1){
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
Nino.prototype.death = function(){
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
screen.fillText("Nino", canvhalfx, 20);//char name
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
Nino.prototype.win = function(){
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
screen.fillText("Nino", canvhalfx, 40);//char name
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
Nino.prototype.spec1 = function(){
    let bolt = false
//this is buffed if already electrofied
for(let i = 0 ; i < projectiles.length ; i++){
    if(projectiles[i].name == "chain lightning" && projectiles[i].hitbox.scanplayer()){
        projectiles.push(new chain_lightning(canvhalfx, canvhalfy, 24, [this.facing[0], this.facing[1]]));
        bolt = true;
        break;
    }
}
if(!bolt){
projectiles.push(new chain_lightning(canvhalfx, canvhalfy, 12, this.facing));
}
this.cooldowns[0] = 45;
if(this.cooldowns[1] < 15){
    //casting spells takes full focus
this.cooldowns[1] = 15;
}
if(this.cooldowns[2] < 15){
    
this.cooldowns[2] = 15;
}
}
Nino.prototype.spec2 = function(){
projectiles.push(new Pyromine(canvhalfx, canvhalfy, 100, 24 * this.facing[0], 24 * this.facing[1]));
this.cooldowns[1] = 30;
if(this.cooldowns[0] < 15){
    //casting spells takes full focus
this.cooldowns[0] = 15;
}
if(this.cooldowns[2] < 15){
    
this.cooldowns[2] = 15;
}
}
Nino.prototype.spec3 = function(){
for(let i = -1 ; i <= 1 ; i+=(charezmode())? 0.5:1){
    for(let x = -1 ; x <= 1 ; x+=(charezmode())? 0.5:1){
        if(i == x && i == 0){
            //overcomplicated way if saying if I and X are 0
            continue;
        }
        projectiles.push(new Cutting_Gale(canvhalfx, canvhalfy, random(11, 13), random(11,13), [i/2, x/2]));
    
    }
    

}
this.cooldowns[2] = 120;
if(this.cooldowns[0] < 15){
    //casting spells takes full focus
this.cooldowns[0] = 15;
}
if(this.cooldowns[1] < 15){
    
this.cooldowns[1] = 15;
}

}
Nino.prototype.spec4 = function(){
this.miasmatime = 210;
this.cooldowns[3] = 510;


if(this.cooldowns[0] < 7){
    //casting this spell takes partial focus!
this.cooldowns[0] = 7;
}
if(this.cooldowns[1] < 7){
    
this.cooldowns[1] = 7;
}
if(this.cooldowns[2] < 7){
    
this.cooldowns[2] = 7;
}
}


Nino.prototype.inst = function(x = this.px, y = this.py, size = this.size){
player = new Nino(x, y, size);
}
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Nino(canvhalfx, canvhalfy, 20));


//projectiles
function chain_lightning(x, y, size, facing){
    this.name = "chain lightning";
    this.phase = 1;//just shoot, then target enemies
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.origin = [x, y]
    this.size = size
    this.facing = [facing[0], facing[1]]
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.lifetime = null;
    this.visibility = 100;
    this.dist = 20
    this.target;
}
chain_lightning.prototype.exist = function(){
    this.hitbox.enable();

    
    if(this.phase == 1){
    this.x = this.origin[0];
    this.y = this.origin[1];
    for(let move = 0 ; move < 25 ; move++){
    
    
    this.x += this.size * 3 * this.facing[0]
    this.y += this.size * 3 * this.facing[1]
    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    if(this.visibility > 97){
    //enemies first
    for(let i = 0 ; i < enemies.length ; i++){
        if(this.hitbox.checkenemy(i)){
            playerattack = this.name;
            if(player.defenemies.includes(enemies[i])){
            enemies[i].hit(this.size + enemies[i].growingdarknessdebuff/player.defdiv, ["electric", "magic", "hitscan", "proj"]);
            enemies[i].growingdarknessdebuff += this.size + enemies[i].growingdarknessdebuff/player.defdiv
             enemies[i].GDdetonationtime = 100;
        }else{
            enemies[i].hit(this.size,  ["electric", "magic", "hitscan", "proj"]);
            enemies[i].growingdarknessdebuff = this.size
            enemies[i].GDdetonationtime = 100;
            player.defenemies.push(enemies[i]);
        }
            this.target = enemies[i];
            move = 102;
            this.phase = 2;
            
        }
    }
    //now projectiles
    for(let i = 0 ; i < projectiles.length ; i++){
        if(this.hitbox.scanproj(i) && projectiles[i].name != "chain lightning"){
            
            this.target = projectiles[i];
            move = 102;
            this.phase = 2;
            
        }
    }
}


    }
    screen.beginPath();
    screen.lineWidth = this.size;
    screen.strokeStyle = `rgba(100, 100, 200,${this.visibility--/100})`
    
    screen.moveTo(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    screen.lineTo(this.origin[0] + player.px - this.shift[0], this.origin[1] + player.py - this.shift[1]);
  
    screen.stroke();
    screen.closePath();
    //this.visibility-=10;
    
    }else{
        try{
        if(this.target == player){
            this.x = canvhalfx - player.playershift[0];
            this.y = canvhalfy - player.playershift[1];
            //player.speedcause.push(["Electro boost!", 15, 1.2])
        }else{
        this.x = this.target.x + player.px - this.target.shift[0];
        this.y = this.target.y + player.py - this.target.shift[1];
        }
        screen.strokeStyle = `rgba(100, 100, 200,${this.visibility/100})`;
        this.visibility-=0.5;
        screen.lineWidth = 3;
        circle(this.x, this.y, this.target.size+this.dist, true, false);

        //debuff enemies
        if("speedcause" in this.target && this.target != player){
            //this is an enemy then!
            this.target.speedcause.push(["electrified", 45, 0.8]);
            this.target.hit(0.25, ["electric"])
        }
        

        if(this.target.name != "pyro mine" || this.target.name=="pyro mine" && this.visibility % 20 == 0){
            //attempt to jump
            if(this.target.name == "pyro mine"){
                this.dist += 100;
            }
            this.dist+=10;
            this.hitbox.resize(this.target.size+this.dist);
            this.hitbox.move(this.x, this.y)
            //prioritize enemies
            if(charezmode() || this.visibility % 5 == 0){
                //only jump every 5 frames on hard mode

           
            for(let i = 0 ; i < enemies.length ; i++){
        if(this.hitbox.checkenemy(i) && enemies[i] != this.target){
            playerattack = this.name;
            this.dist = 20;
            screen.beginPath();
            screen.lineWidth = 10;
        screen.strokeStyle = `rgba(100, 100, 200,${this.visibility--/100})`
    
        screen.moveTo(this.x, this.y);
        if(player.defenemies.includes(enemies[i])){
            enemies[i].hit(8 + enemies[i].growingdarknessdebuff/24,  ["electric", "magic", "hitscan", "proj"]);
            enemies[i].growingdarknessdebuff += 8 + enemies[i].growingdarknessdebuff/player.defdiv
             enemies[i].GDdetonationtime = 100;
        }else{
            enemies[i].hit(8,  ["electric", "magic", "hitscan", "proj"]);
            enemies[i].growingdarknessdebuff = 8
             enemies[i].GDdetonationtime = 100;
            player.defenemies.push(enemies[i]);
        }
        
        this.target = enemies[i];
        this.x = this.target.x + player.px - this.target.shift[0];
        this.y = this.target.y + player.py - this.target.shift[1];
        screen.lineTo(this.x, this.y);
  
        screen.stroke();
        screen.closePath();
        return
            
            
            
        }
    }
    
        //now projectiles
        for(let i = 0 ; i < projectiles.length ; i++){
        if(this.hitbox.scanproj(i) && projectiles[i].name != "chain lightning" && projectiles[i].name != "passive dark blast" && projectiles[i] != this.target){
            
            this.dist = 20;
            screen.beginPath();
            screen.lineWidth = 10;
        screen.strokeStyle = `rgba(100, 100, 200,${this.visibility--/100})`
    
        screen.moveTo(this.x, this.y);
        
        this.target = projectiles[i];
        this.x = this.target.x + player.px - this.target.shift[0];
        this.y = this.target.y + player.py - this.target.shift[1];
        screen.lineTo(this.x, this.y);
  
        screen.stroke();
        screen.closePath();
            return
        }
        }
        //finally, the player
        if(this.target != player && this.hitbox.scanplayer()){
            this.dist = 20;
            screen.beginPath();
            screen.lineWidth = 10;
        screen.strokeStyle = `rgba(100, 100, 200,${this.visibility--/100})`
    
        screen.moveTo(this.x, this.y);
        
        this.target = player;
        this.x = canvhalfx - player.playershift[0];
        this.y = canvhalfy - player.playershift[1];
        screen.lineTo(this.x, this.y);
  
        screen.stroke();
        screen.closePath();
        }
    }
     }
        }catch(e){
            
            return "delete"
        }
    }

    //console.log((this.x - (canvhalfx + player.playershift[0])) + " " + (this.y - (canvhalfx + player.playershift[1])));
    //console.log(arena.leavedir(this.x, this.y, this.size))
    if(this.visibility < 0){
        return "delete";
    }
    //hitting the enemy
    //console.log(en);
    }

    function Darkblast(x, y, dmg){
    this.name = "passive dark blast";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = 50
    this.color = "rgba(50, 0, 50, 0.5)";
    this.hitbox = new hitbox(x, y, 2, 0, 10);
    this.hitbox.disable();
    this.hitbox.immunityframes(999);//one massive hit!
    this.lifetime = null;
    this.dmg = dmg;
}
Darkblast.prototype.exist = function(){
    if(this.size > 400){
    //no subtracting null!
    return "delete";
    }
    this.hitbox.enable();
    //no need to update immunity, since it's just one hit
    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    this.hitbox.resize(this.size);
    this.hitbox.showbox(this.color);
    for(let i = 0 ; i < enemies.length ; i++){
        if(this.hitbox.checkenemy(i)){
            playerattack = this.name;
            enemies[i].hit(this.dmg, ["dark", "magic", "bludgeoning", "proj"]);
            this.hitbox.grantimmunity(i);
        }
    }
    this.size+=50;
    //console.log((this.x - (canvhalfx + player.playershift[0])) + " " + (this.y - (canvhalfx + player.playershift[1])));
    //console.log(arena.leavedir(this.x, this.y, this.size))
    }

    function Pyromine(x, y, size, mx, my){
    this.name = "pyro mine"
    this.x = x;
    this.y = y;
    this.shift = [player.px , player.py];
    this.size = 8
    this.radius = size
    this.mx = mx;
    this.my = my;
    this.last = 600;//20 second duration!
    this.hitbox = new hitbox(this.x, this.y, 8, 0, 9);
    this.hitbox.disable();
    this.hitbox.immunityframes(999);
    this.lifetime = 30;//1 second to arm, one second of it being parriable
    this.blast = -1;

}
Pyromine.prototype.exist = function(){
    this.hitbox.enable();
    //this.hitbox.updateimmunity();
    screen.fillStyle = "#F00";
    
    if(this.lifetime >= 0){
        this.x+=this.mx;
        this.y+=this.my;
        this.mx*= 0.7;
        this.my*= 0.7;
        this.lifetime--;
        
    }
    if(this.blast < 0){
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
    }
    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    if(this.last <=0 || this.blast >4){
        return "delete";
    }
    //hitting the enemy
    if(this.lifetime < 0 || this.lifetime == null){
        console.log(true)
        this.lifetime = null;
        this.hitbox.resize(this.radius);
        screen.strokeStyle = "#F00";
        screen.lineWidth = 2;
        if(this.blast >= 0){
            this.hitbox.showbox("rgba(255, 0, 0, 0.5)");
        }
        circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.radius, true, false);
        for(let i = 0 ; i < enemies.length ; i++){
            if(this.hitbox.checkenemy(i)){
                playerattack = this.name;
                if(player.defenemies.includes(enemies[i])){
                enemies[i].hit(30 + enemies[i].growingdarknessdebuff/player.defdiv, ["fire", "bludgeoning", "magic"], [(this.x < enemies[i].x)? 12:-12, (this.y < enemies[i].y)? 12:-12], 45);
                for(let x = 0 ; x < projectiles.length ; x++){
                    //if electrified, do bonus damage!
                    if(projectiles[x].name == "chain lightning" && this.hitbox.scanproj(x)){
                        enemies[i].hit(((charezmode())? 60:30) + enemies[i].growingdarknessdebuff/player.defdiv, ["CRITICAL", "electric", "magic"], [(this.x < enemies[i].x)? 36:-36, (this.y < enemies[i].y)? 36:-36], 30);//CRITICAL HIT

                        //electrify the enemy
                        projectiles.push(new chain_lightning(0, 0, 0, [0, 0]));
                        projectiles[projectiles.length-1].phase = 2;
                        projectiles[projectiles.length-1].target = enemies[i];
                        enemies[i].growingdarknessdebuff += ((charezmode())? 60:30) + enemies[i].growingdarknessdebuff/player.defdiv;
                        break;
                    }
                }
                enemies[i].growingdarknessdebuff += 30 + enemies[i].growingdarknessdebuff/player.defdiv
                enemies[i].GDdetonationtime = 100;
                }else{
                enemies[i].hit(30, ["fire", "bludgeoning", "magic"], [(this.x < enemies[i].x)? 12:-12, (this.y < enemies[i].y)? 12:-12], 45);
                for(let x = 0 ; x < projectiles.length ; x++){
                    //if electrified, do bonus damage!
                    if(projectiles[x].name == "chain lightning" && this.hitbox.scanproj(x)){
                        enemies[i].hit(((charezmode())? 60:30), ["CRITICAL", "electric", "magic"], [(this.x < enemies[i].x)? 36:-36, (this.y < enemies[i].y)? 36:-36], 30);//CRITICAL HIT
                        crit++;
                        //electrify the enemy
                        projectiles.push(new chain_lightning(0, 0, 0, [0, 0]));
                        projectiles[projectiles.length-1].phase = 2;
                        projectiles[projectiles.length-1].target = enemies[i];
                        enemies[i].growingdarknessdebuff = ((charezmode())? 60:30)
                        break;
                    }
                }
                enemies[i].growingdarknessdebuff = 30
                enemies[i].GDdetonationtime = 100;
                player.defenemies.push(enemies[i]);
                }
                
                
                this.hitbox.grantimmunity(i);
                if(this.blast < 0){
                this.blast = 0;
                return;
                }
            }


        }
        if(this.blast >=0){
            this.blast++;
            this.radius+=50;
        }

            
    }
}

function Cutting_Gale(x, y, size, speed, facing){
    this.name = "Cutting Gale";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.speed = speed
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.lifetime = 210;
    this.facing = [facing[0], facing[1]];
    this.turning = [0, 0, 10]//force, rate, time
    this.hitbox.immunityframes(10);
}
Cutting_Gale.prototype.exist = function(){
    if(typeof this.lifetime == "number"){
    //no subtracting null!
    this.lifetime--;
    }
    this.hitbox.enable();
    this.hitbox.updateimmunity();

    //turning
    this.facing[0]+=this.turning[0];
    this.facing[1]+=this.turning[1];

    if(this.facing[0] > 1){
        this.facing[0] = 1
    }else if(this.facing[0] < -1){
        this.facing[0] = -1
    }

    if(this.facing[1] > 1){
        this.facing[1] = 1
    }else if(this.facing[1] < -1){
        this.facing[1] = -1
    }
    //turn a new direction
    if(this.turning[2]-- <= 0){
        this.turning = [random(-3, 2, true)/50, random(-3, 2, true)/50, random(1, 10, false)];
    }

    //SHOWING
    screen.fillStyle = "rgb(29, 255, 97)";
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
    this.x+=this.speed * this.facing[0];
    this.y+=this.speed * this.facing[1];

    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    if(this.lifetime < 0){
        return "delete";
    }
    //hitting the enemy
    for(let i = 0 ; i < enemies.length ; i++){
    if(this.hitbox.checkenemy(i)){
            if(player.defenemies.includes(enemies[i])){
                
            enemies[i].hit(24 + enemies[i].growingdarknessdebuff/player.defdiv, ["wind", "magic", "slashing", "proj"]);
            enemies[i].growingdarknessdebuff += 24 + enemies[i].growingdarknessdebuff/player.defdiv
             enemies[i].GDdetonationtime = 100;
        }else{
           enemies[i].hit(24, ["wind", "magic", "slashing", "proj"]);
            enemies[i].growingdarknessdebuff = 24
            enemies[i].GDdetonationtime = 100;
            player.defenemies.push(enemies[i]);
        }
        this.hitbox.grantimmunity(i);
        this.lifetime-=random(10, 30, false)
        }
        }
}

function Miasma(x, y, size, mx, my){
    this.name = "Miasma";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.color = "rgb(80, 0, 80)";
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.lifetime = 200;
    this.phase = 0;
    this.follow = "not null";
}
Miasma.prototype.exist = function(){
    if(typeof this.lifetime == "number"){
    //no subtracting null!
    this.lifetime--;
    }
    

    screen.fillStyle = this.color;
    
    if(this.phase == 0){
        this.hitbox.enable();
        circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
         this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    this.x+=this.mx;
    this.y+=this.my;
    }else{
        this.x = this.follow.x + player.px - this.follow.shift[0];
        this.y = this.follow.y + player.py - this.follow.shift[1];
        this.hitbox.move(this.x, this.y)
        this.hitbox.disable();
        this.hitbox.resize(this.size)
        this.size-=1;
        circle(this.x, this.y, this.size)
    }
   
    //console.log((this.x - (canvhalfx + player.playershift[0])) + " " + (this.y - (canvhalfx + player.playershift[1])));
    //console.log(arena.leavedir(this.x, this.y, this.size))
    if(this.lifetime < 0 || this.follow.hp < 0){
        return "delete";
    }
    //hitting the enemy
    //console.log(en);
    for(let i = 0 ; i < enemies.length ; i++){
    if(this.hitbox.checkenemy(i)){
        if(this.phase == 0){
        playerattack = this.name;
            
             if(player.defenemies.includes(enemies[i])){
            enemies[i].hit(30 + enemies[i].growingdarknessdebuff/24, ["magic", "dark", "proj"]);
            enemies[i].growingdarknessdebuff += 30 + enemies[i].growingdarknessdebuff/24
             enemies[i].GDdetonationtime = 100;
        }else{
           enemies[i].hit(30, ["magic", "dark", "proj"]);
            enemies[i].growingdarknessdebuff = 30
            enemies[i].GDdetonationtime = 100;
            player.defenemies.push(enemies[i]);
        }
            this.size = enemies[i].size * 2 + 100;
            this.lifetime = null;//unparriable now!
            this.follow = enemies[i]
            this.phase = 1
            this.color = "rgba(60, 0, 60, 0.7)"
        }else{
            enemies[i].hit(0.8, ["magic", "dark", "aura"]);
            if(player.defenemies.includes(enemies[i])){
                enemies[i].growingdarknessdebuff += (charezmode())? 4: 0;
            }
            //this.size+=0.5
        }
        }
        }
    
        if(this.size < this.follow.size){
            return "delete";
        }
    }