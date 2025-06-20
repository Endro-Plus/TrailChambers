function Ezekiel(startposx, startposy, size){
//startup
this.px = startposx;
this.py = startposy;
this.pz = 0; //distance up.
this.size = size;

//character poster/character color
this.postColor = "#0000FF";
this.color = "#0088FF";
this.desc = ["The Summoner! Overwhelm your foes with superior numbers, and swap places with your Tim when you're in danger!", "Tim: Your skeletal companion teleports around at random and fires magical orbs at your opponents!", "    He is completely autonomous, teleports instantly when in danger, and cannot be killed.", "1. Whip: A VERY long reach melee attack! A successful hit marks your opponent for death", "    When marked for death, all summons target the enemy, and summons do additional damage to marked enemies.", "2. Swap: swap places with Tim. Tim can just teleport out of danger anyway! Goes on cooldown if Tim teleports.", "3. Death Sphere: Summon up to 10 autonomous death spheres that fire projectiles and rush at enemies!", "Death Spheres block projectiles, BUT if Ezekiel takes damage, there's a 50% chance for a Death Sphere to be die. Death Spheres don't take damage.", "4. PANIC/ATTACK: Changes stance to PANIC stance, causing all death sphere to orbit you, and Tim to stop attacking.", "  While PANIC is active, Tim emits an aura that negates 75% of damage instead of attacking. This aura passively damages bosses, but it's weak", "    Use again to go back to ATTACK stance. Can be used in hitstun"]
//game stats
this.playershift = [0, 0];//shift the position of the player
this.cooldowns = [0, 0, 0, 0];
this.damagetypemod = [];
this.hp = 100;
this.damagemod = 1;
this.speed = 10;
this.speedcause = [];//causes of speed buffs/nerfs
this.speedmod = 1;//modifies speed, multiplicately
this.DI = 1;
this.knockback = [0, 0]; //knockback resistance, essentially.
this.facing = [0, 0]; //what direction the player is facing
this.hitstunmod = 1;
this.knockbackmod = 1;
this.height = 8;
this.iframe = false;
//perfectly unremarkable...

//special
this.marked = null;
this.extendedbox = new hitbox(0, 0, 0, 99, 100)
this.stance = "ATTACK"

this.whipdefaultsize = 50;
this.whip = new hitbox(canvhalfx, canvhalfy, 1, 7, this.whipdefaultsize)
this.whip.disable();
this.whip.immunityframes(12);
this.whipframe = -6;
this.whipattack = false;
//for Tim
this.Timstats = [canvhalfx + 200, canvhalfy + 200, this.size];
this.Timshots = 175;
this.Timbox = new hitbox(this.Timstats[0], this.Timstats[1], 0, 8, this.Timstats[2]);

//for death orbs
this.deathorbs = [];
this.deathphase = [];
this.meleedirect = [];
this.targetting = [];
this.deathshift = []



}
Ezekiel.prototype.listname = function(){
//to help position the characters correctly
return "Ezekiel";
}
Ezekiel.prototype.greeting = function(){
//The formal greeting for the console log! Useless? Sure, but still!
console.log("Ezekiel, the summoner, has an army ready!")
}
Ezekiel.prototype.exist = function(){



this.whip.updateimmunity();

//revealing the marked enemies
if(typeof this.marked == "number" && enemies.length > 0){
    try{
        if(enemies[this.marked].markedfordeathdebuff == true){
            //the current enemy is marked for death
            this.extendedbox.reassign(enemies[this.marked].x + this.px, enemies[this.marked].y + this.py, 0, 999, enemies[this.marked].size * 5);
            this.extendedbox.showbox("rgb(100, 100, 255, 0.1)");
            for(let i = 0 ; i < projectiles.length ; i++){
                if(["chaos sphere", "death orb", "boosted!"].includes(projectiles[i].name) && this.extendedbox.scanproj(i)){
                    
                    //boost the projectile!
                    if(projectiles[i].name != "boosted!"){
                    projectiles[i].dmg+=10;
                    projectiles[i].name = "boosted!"
                    }
                    
            
             let dx = this.extendedbox.x - (projectiles[i].x + player.px - projectiles[i].shift[0]);
            let dy = this.extendedbox.y - (projectiles[i].y + player.py - projectiles[i].shift[1]);
            let magnitude = Math.sqrt(dx * dx + dy * dy);
            velocityX = (dx / magnitude) * 40;
            velocityY = (dy / magnitude) * 40;
            projectiles[i].mx = velocityX;
            projectiles[i].my = velocityY;

                }
            }
            

        }else{
            //remove the mark
            this.marked = null;

        }
    }catch(e){
         //remove the mark
            this.marked = null;
    }
    
    
    

    }
//HP check
if(this.hp > 100){
    //I'm generous enough to give you a BIT of extra power for a set time
    this.hp-=0.15;
    if(this.hp <= 100){
        this.hp = 100;
        //yes, I'm aware this is effectively a free defense
    }

}else if(this.hp <=0 ){
    //play the death anmiation, then call off
    this.death();
    return;
}
timeplayed++;
//TIM LIVES!!!!!
this.tim();

//DEATHORBS KILLS!
for(let i = 0 ; i < this.deathorbs.length ; i++){
    this.DIE(i);
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
            //hp
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

            //attacking
            //whip (you WILL finish that whipping animation, even in hitstun)
            if(this.whipattack == true || typeof this.whipattack == "object"){
                if(typeof this.whipattack == "boolean"){
                    this.whipattack = [this.facing[0], this.facing[1]];
                }
                this.whip.enable();
                this.whip.move(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1]);
                this.whip.resize(this.whipdefaultsize)
                for(let i = Math.abs(this.whipframe) ;  i < 6 ; i++){
                    
                    this.whip.move(this.whip.x + this.whip.size * this.whipattack[0] * 1.2, this.whip.y + this.whip.size * this.whipattack[1] * 1.2);
                    if(i == 5 && this.whipframe == 0){
                        this.whip.showbox("#00ccff");//tip hitbox (crit)

                        //damage
                        for(let x = 0 ; x < enemies.length ; x++){
                            if(this.whip.checkenemy(x)){
                                enemies[x].hit(52, ["pain", "physical", "CRITICAL"], [9 * this.whipattack[0], 9 * this.whipattack[1]], 60);
                                //That shit hurts!
                                for(let part = 0 ; part < 10 ; part++){
                                    projectiles.push(new movingpart(enemies[x].x + this.px + random(-13, 13), enemies[x].y + this.py + random(-13,13), random(-1, 1), random(-1, 1), 6, "hsla(197, 100.00%, 50.00%, 0.56)", random(25, 35)))
                                }
                                this.whip.grantimmunity(x);
                                if(this.marked != null){
                                    enemies[this.marked].markedfordeathdebuff = false;
                                }
                                this.marked = x;
                                enemies[this.marked].markedfordeathdebuff = true;
                            }

                        }

                    }else{
                    this.whip.showbox("#00fff6");

                    //damage
                    for(let x = 0 ; x < enemies.length ; x++){
                            if(this.whip.checkenemy(x)){
                                enemies[x].hit(16, ["pain", "physical"], [9 * this.whipattack[0], 9 * this.whipattack[1]], 24);
                                //OOWWWW!
                                this.whip.grantimmunity(x);
                                if(this.marked != null){
                                    enemies[this.marked].markedfordeathdebuff = false;
                                }
                                this.marked = x;
                                enemies[this.marked].markedfordeathdebuff = true;
                            }

                        }
                    }
                    
                    this.whip.resize(this.whip.size*.90);
                }
                this.whipframe++;
                if(this.whipframe == 6){
                    this.whipframe = -6;
                    this.whipattack = false;
                    this.cooldowns[0] = 10;
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
}
if(this.cooldowns[2] < 0){
    screen.fillStyle = "#aaa";
    circle(canvhalfx + this.playershift[0], canvhalfy + this.size*1.5 + this.playershift[1], 5)
}
//attacks

if(this.cooldowns[0] <= 0 && inputs.includes(controls[4])){
    this.spec1();
    this.cooldowns[0] = 30;
}
if(this.cooldowns[1] <= 0 && inputs.includes(controls[5])){
    this.spec2();
}
if(this.cooldowns[2] <= 0 && inputs.includes(controls[6]) && this.deathorbs.length < 10){
    this.spec3();
    //no more than 10 bees!
}
if(this.cooldowns[3] <= 0 && inputs.includes(controls[7])){
    this.spec4();
}

}
Ezekiel.prototype.tim = function(){
//TIM LIVES!!!
screen.fillStyle = "#444";
if(this.Timshots < 174 && this.Timshots > 1){
    //basically don't show mid teleport
circle(this.Timstats[0] + this.px, this.Timstats[1] + this.py, this.Timstats[2]);
}
if(this.Timshots == 174){

    //STAND READY FOR MY ARRIVAL, WORMS! (particles)
    for(let i = 0 ; i < 15 ; i++){
        projectiles.push(new movingpart(this.Timstats[0] + this.px, this.Timstats[1] + this.py, random(-17, 17), random(-17, 17), 8, "rgb(102, 0, 150)", 4))

    }
}
this.Timbox.move(this.Timstats[0] + this.px, this.Timstats[1] + this.py);
this.Timshots--;
let damage = 15;
if(this.Timshots != 0 && this.Timshots % 50 == 0 && enemies.length > 0){
    //aim
    if(typeof this.marked != "number"){

    let dx = (this.Timstats[0] + player.px) - (enemies[0].x + this.px);
    let dy = (this.Timstats[1] + player.py) - (enemies[0].y + this.py);
    let magnitude = Math.sqrt(dx * dx + dy * dy);
    velocityX = (dx / magnitude) * 18;
    velocityY = (dy / magnitude) * 18;
    }else{
        let dx = (this.Timstats[0] + player.px) - (enemies[this.marked].x + this.px);
        let dy = (this.Timstats[1] + player.py) - (enemies[this.marked].y + this.py);
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        velocityX = (dx / magnitude) * 18;
        velocityY = (dy / magnitude) * 18;
    }

    projectiles.push(new playerproj("chaos sphere", this.Timstats[0] + this.px, this.Timstats[1] + this.py, 15, velocityX * -1, velocityY * -1, "purple", damage, 200, ["magic"]));
}else if(this.Timshots <= 0){
    //teleport somewhere else
    try{
    if(typeof this.marked == "number"){
    this.Timstats[0] = random(enemies[this.marked].x - 300, enemies[this.marked].x + 300)
    this.Timstats[1] = random(enemies[this.marked].y - 300, enemies[this.marked].y + 300)
    }else{
    this.Timstats[0] = random(enemies[0].x - 300, enemies[0].x + 300)
    this.Timstats[1] = random(enemies[0].y - 300, enemies[0].y + 300) 
    }
    this.cooldowns[1] = 15;
    this.Timshots = 175;
    }catch(e){
        this.Timstats[0] = random(canvhalfx - 50, canvhalfx + 50)
        this.Timstats[1] = random(canvhalfy - 50, canvhalfy + 50) 
        this.Timshots = 175;
    }
}

for(let i = 0 ; i < projectiles.length ; i++){
if(!["chaos sphere", "death orb", "boosted!"].includes(projectiles[i].name) && this.Timbox.scanproj(i)){
//He was hit...
this.Timshots = 0;
}
}
for(let i = 0 ; i < enemies.length ; i++){
if(this.Timbox.checkenemy(i)){
//don't touch Tim!
if(this.Timshots < 170){
    //teleporting into the enemy doesn't deal contact damage!
enemies[i].hit(20, ["magic", "contact"]);
//STAND READY FOR MY ARRIVAL, WORMS! (particles)
    for(let i = 0 ; i < 8 ; i++){
        projectiles.push(new movingpart(this.Timstats[0] + this.px + random(-30, 30), this.Timstats[1] + this.py + random(-30,30), random(-3, 3), random(-3, 3), 8, "hsla(197, 100.00%, 50.00%, 0.56)", random(20, 30)))

    }
}
this.Timshots = 0;
}
}
}
Ezekiel.prototype.DIE = function(orb){
    this.deathorbs[orb].updateimmunity();
    if(this.stance == "ATTACK" && enemies.length > 0){
    if(this.deathphase[orb] > 0 && enemies.length > 0){
        //shooting mode
        //which enemy to target
        if(typeof this.targetting[orb] != "number" || typeof this.marked == "number"){
            let target = this.marked;
        if(typeof target != "number"){
            target = random(0, enemies.length-1, false)
        }
        
        this.targetting[orb] = target
        
        }

        //movement
        try{
           this.deathorbs[orb].move(this.deathorbs[orb].x + this.px - this.deathshift[orb][0], this.deathorbs[orb].y + this.py - this.deathshift[orb][1]);
        if(this.deathorbs[orb].x + 60 + this.px > enemies[this.targetting[orb]].x + this.px){
            this.deathorbs[orb].x-=7;
            
        }
        if(this.deathorbs[orb].x - 60 + this.px < enemies[this.targetting[orb]].x + this.px){
            this.deathorbs[orb].x+=7;
        }

        if(this.deathorbs[orb].y + 60 + this.py>enemies[this.targetting[orb]].y + this.py){
            this.deathorbs[orb].y-=7;
        }
        if(this.deathorbs[orb].y - 60 + this.py < enemies[this.targetting[orb]].y + this.py){
            this.deathorbs[orb].y+=7;
        }
    }catch(e){
        this.targetting[orb] = null;
        this.deathorbs[orb].showbox("#aaa")
        this.deathshift[orb][0] = this.px;
     this.deathshift[orb][1] = this.py;
        return
    }
       if(this.deathphase[orb] % 25 == 0){
        //fire!
        let dx = (this.deathorbs[orb].x + player.px - this.deathshift[orb][0]) - (enemies[this.targetting[orb]].x + this.px);
        let dy = (this.deathorbs[orb].y + player.py - this.deathshift[orb][1]) - (enemies[this.targetting[orb]].y + this.py);
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        velocityX = (dx / magnitude) * 15;
        velocityY = (dy / magnitude) * 15;
        projectiles.push(new playerproj("death orb", this.deathorbs[orb].x + this.px - this.deathshift[orb][0], this.deathorbs[orb].y + this.py - this.deathshift[orb][1], this.deathorbs[orb].size, velocityX * -1, velocityY * -1, "black", 15, 45, ["magic"]));
       }

        this.deathphase[orb]--;
        //console.log(this.deathphase[orb])
    }else if (this.deathphase[orb] == 0){

        let dx = (this.deathorbs[orb].x + player.px - this.deathshift[orb][0]) - (enemies[this.targetting[orb]].x + this.px);
        let dy = (this.deathorbs[orb].y + player.py - this.deathshift[orb][1]) - (enemies[this.targetting[orb]].y + this.py);
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        velocityX = (dx / magnitude) * 15;
        velocityY = (dy / magnitude) * 15;
        this.meleedirect[orb] = [velocityX, velocityY]
        this.deathphase[orb]--;
    }else{
        if(Math.abs(this.deathphase[orb]) > 30){
            this.targetting[orb] = null;
            this.deathphase[orb] = random(200, 300, false);

        }else{
            this.deathphase[orb]--;
            this.deathorbs[orb].x-=this.meleedirect[orb][0];
            this.deathorbs[orb].y-=this.meleedirect[orb][1];
        }



    }
}

     //reveal the orb of doom!
     

     //circle(this.deathorbs[orb].x, this.deathorbs[orb].y, this.deathorbs[orb].size);
     this.deathorbs[orb].showbox("#aaa")
     this.deathshift[orb][0] = this.px;
     this.deathshift[orb][1] = this.py;
     


     //block projectiles
     for(let i = 0 ; i < projectiles.length ; i++){
        if(typeof projectiles[i].lifetime == "number" && !["chaos sphere", "death orb", "boosted!"].includes(projectiles[i].name) && this.deathorbs[orb].scanproj(i)){
            projectiles[i].lifetime = -1;
        }
     }
     //damage enemies
     for(let i = 0 ; i < enemies.length ; i++){
        if(this.deathorbs[orb].checkenemy(i)){

            enemies[i].hit(32, ["physical", "slashing"]);
            this.deathorbs[orb].grantimmunity(i);
        }
     }

}

Ezekiel.prototype.hurt = function(){
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
Ezekiel.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
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

        //kill deathspheres
        for(let i = 0 ; i < this.deathorbs.length ; i++){
            if(random(0, 1, false)){
                this.deathorbs.pop();
                this.deathphase.pop();
                this.targetting.pop();
                this.meleedirect.pop();
                this.deathshift.pop();
            }
        }
    }
Ezekiel.prototype.death = function(){
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
screen.fillText("Ezekiel", canvhalfx, 20);//char name
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
Ezekiel.prototype.spec1 = function(){
//abilities
this.whipattack = true;
}
Ezekiel.prototype.spec2 = function(){
let tp = [canvhalfx - this.Timstats[0], canvhalfy - this.Timstats[1]];
this.Timstats[0] = canvhalfx + this.playershift[0] - this.px;
this.Timstats[1] = canvhalfy + this.playershift[1] - this.py;
this.Timshots = 180;
this.px = tp[0];
this.py = tp[1];
this.cooldowns[1] = 30;
}
Ezekiel.prototype.spec3 = function(){
this.deathorbs.push(new hitbox(canvhalfx - this.px, canvhalfy - this.py, 4, 3, 10));
this.deathorbs[this.deathorbs.length-1].immunityframes(30);
this.deathphase.push(random(35, 45, false));
this.targetting.push(this.marked);
this.meleedirect.push([]);
this.deathshift.push([0, 0]);
this.cooldowns[2] = 150;
}
Ezekiel.prototype.spec4 = function(){

}

Ezekiel.prototype.inst = function(x = this.px, y = this.py, size = this.size){
player = new Ezekiel(x, y, size);
}
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Ezekiel(canvhalfx, canvhalfy, 20));