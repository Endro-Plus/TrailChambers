/*
hard mode changes:
    death orbs do less damage
    Tim's defensive aura is smaller, and only defends 50% of the damage
*/
function Ezekiel(startposx, startposy, size){
//startup
this.px = startposx;
this.py = startposy;
this.pz = 0; //distance up.
this.size = size;

//character poster/character color
this.postColor = "#0000FF";
this.color = "#0088FF";
this.desc = ["The Summoner! Overwhelm your foes with superior numbers, and swap places with your Tim when you're in danger!", "Tim: Your skeletal companion teleports around at random and fires magical orbs at your opponents!", "    He is completely autonomous, teleports instantly when in danger, and cannot be killed. If you are damaged, he will automatically swap places with you, negating the attack, at a 10 second cooldown.", "Deathcaller: Summons a death sphere automatically every 5 seconds, up to a maximum of 5. More can be summoned by other methods.", "Death Sphere: Autonomus orbs that shoot and charge your opponents. If you are damaged, one is killed, and the damage is reduced by 50%", "Phantom: Restless spirits that relentlessly charges your opponents. Dies if not touching a mark of death", "1. Whip: A VERY long reach melee attack! A successful hit marks your opponent for death", "    When marked for death, all summons target the enemy, and summons do additional damage to marked enemies.", "  If timed, another whip attack can be done immediately after the first. This can also be charged for the ability to summon death spheres and phantoms, and the ability to interrupt attacks!", "2. Ghastly Orbit: Expend your mark to cause all death orbs to orbit and charge a single enemy!", "  Causes death orbs to orbit and defend you if no mark is available. This can be triggered again to make them attack again.", "3. Sentry: Summon a tower that viciously attacks nearby foes!", "    The tower will break if you're not near it.", "Skeletal Guard:  Tim teleports near you and summons armed skeletons to aid you. The skeletons slowly wither and die, but Tim will use his aura attack to heal them."];
//game stats
this.playershift = [0, 0];//shift the position of the player
this.cooldowns = [0, 0, 0, 0];
this.damagetypemod = [];
this.hp = 100;
this.damagemod = 1;
this.maxspeed = 12;
this.speed = 12;//a little faster. He needs it
this.speedcause = [];//causes of speed buffs/nerfs
this.speedmod = 1;//modifies speed, multiplicately
this.DI = 1;
this.knockback = [0, 0]; //knockback resistance, essentially.
this.facing = [0, 0]; //what direction the player is facing
this.hitstun = 0;
this.hitstunmod = 1;
this.knockbackmod = 1;
this.height = 8;
this.iframe = false;
this.won = false
//perfectly unremarkable...

//special
this.marked = null;
this.extendedbox = new hitbox(0, 0, 0, 99, 100)
this.stance = "ATTACK";
this.canstance = true;

this.whipdefaultsize = 25;
this.whip = new hitbox(canvhalfx, canvhalfy, 1, 7, this.whipdefaultsize)
this.whip.disable();
this.whip.immunityframes(12);

this.whipcount = 12;
this.whipframe = -1 * this.whipcount;
this.whipattack = false;
this.followuptime = 0;
this.whipreverse = 1;
this.whipchargeattack = 0;
this.whipchargeattackmax = 150;
this.whipboost = 0;
//for Tim
this.Timstats = [canvhalfx + 200, canvhalfy + 200, this.size];
this.Timshots = 75;
this.Timbox = new hitbox(this.Timstats[0], this.Timstats[1], 0, 8, this.Timstats[2]);
this.defenseaura = new hitbox(0, 0, 0, 20, this.size * 2);
this.defenseaura.disable();
this.defenseaurashift = [0, 0];
this.defenseauralaunch = [0, 0];
this.tpcooldown = 0;
this.Timaction = "aura";

//for death orbs
this.deathorbs = [];
this.deathphase = [];
this.meleedirect = [];
this.targetting = [];
this.deathshift = []
this.angle = 0;
this.autosummon = 75;


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
if(this.won == true){
    this.win();
    return "dead"
}
if(this.hp <=0){
    this.death()
    return "dead";
}

this.whip.updateimmunity();

//revealing the marked enemies
if(typeof this.marked == "number" && enemies.length > 0){
    try{
        if(enemies[this.marked].markedfordeathdebuff == true){
            //the current enemy is marked for death
            this.extendedbox.reassign(enemies[this.marked].x + this.px - enemies[this.marked].shift[0], enemies[this.marked].y + this.py - enemies[this.marked].shift[1], 0, 999, enemies[this.marked].size * 5);
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

}
timeplayed++;
//TIM LIVES!!!!!
this.tim();

//DEATHORBS KILLS!
if(this.deathorbs.length > 0){
    this.angle+=0.1;
for(let i = 0 ; i < this.deathorbs.length ; i++){
    this.DIE(i);
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
            //hp
            if(this.hp <= 100 && this.won == false){
            //under max
            screen.fillStyle = "#F00";
            screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
            screen.fillStyle = "#0F0";
            screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp

            
                
            }else{
            //over max

            screen.fillStyle = "#0F0";
            screen.fillRect(canvhalfx - 25 - (this.hp - 100) * 0.25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
            screen.fillStyle = "#00F";
            screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
            }

            //whip follow up and charge up
            if(this.followuptime > 0){
                this.followuptime--;
            }

            

            //attacking
            //dark aura
            if(this.defenseaura.enabled){
               //console.log(this.defenseauralaunch)
                if(this.Timaction !="aura"){
                    //move the aura
                    this.defenseaura.move(this.defenseaurashift[0] + this.px, this.defenseaurashift[1]  + this.py);
                    if(Math.abs(this.defenseauralaunch[0]) > 0.5){
                        this.defenseaurashift[0] -= this.defenseauralaunch[0];
                        this.defenseauralaunch[0]*=0.95;
                    }
                    if(Math.abs(this.defenseauralaunch[1])> 0.5){
                        this.defenseaurashift[1] -= this.defenseauralaunch[1];
                        this.defenseauralaunch[1]*=0.95;
                    }
                }
                 this.defenseaura.showbox("rgb(147, 109, 165, 0.1)");
                if(Math.floor(this.defenseaura.size) % 20 == 0){
                    for(let part = 0 ; part < 3 ; part++){
                    projectiles.push(new movingpart(this.defenseaura.x + random(-this.defenseaura.size, this.defenseaura.size), this.defenseaura.y + random(-this.defenseaura.size, this.defenseaura.size),  random(-3, 3), random(-3, 3), random(4, 9), "hsla(251, 100%, 50%, 0.79)", random(45, 60, false)))
                }
                }
                
                //deal damage
            for(let i = 0 ; i < enemies.length ; i++){
                if(this.defenseaura.checkenemy(i)){
                if(i == this.marked){
                    //a miniscule * 2 amount of true damage
                    enemies[i].hit(0.4, ["true"]);
                    enemies[i].speedcause.push(["dark aura", 12, 0.5]);//50% reduction in speed
                }else{
                     //a miniscule amount of true damage
                    enemies[i].hit(0.2, ["true"]);
                    enemies[i].speedcause.push(["dark aura", 1, 0.7]);//30% reduction in speed
                }
            }

             //visual indicator of protection
             if(this.defenseaura.scanplayer()){
               
                screen.fillStyle = "rgb(58, 0, 83)";
                circle(canvhalfx, canvhalfy, this.size+5);
    }
        }
        //dissipate
        this.defenseaura.size-=0.5;
        if(this.defenseaura.size < this.size){
            this.defenseaura.size = this.Timstats[2];
            this.defenseaura.disable();
        }
    }
            //whip (you WILL finish that whipping animation, even in hitstun)

            if(this.whipattack == true || typeof this.whipattack == "object"){
                if(inputs.includes(controls[4])){
                    this.whipchargeattack += 1;
                }else{
                    this.whipchargeattack = 0;
                }
                if(typeof this.whipattack == "boolean"){
                    this.whipattack = [this.facing[0], this.facing[1]];
                }
                this.whip.enable();
                this.whip.move(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1]);
                this.whip.resize(this.whipdefaultsize + (this.whipboost/15))
                for(let i = Math.abs(this.whipframe) ;  i < this.whipcount ; i++){
                    //whip size
                    this.whip.move(this.whip.x + this.whip.size * this.whipattack[0] * 1.3, this.whip.y + this.whip.size * this.whipattack[1] * 1.3);

                    //whip sweep
                    if(this.whipattack[0] == 0){
                        this.whip.move(this.whip.x + this.whipframe * 5 * this.whipreverse * (1 + this.whipboost/this.whipchargeattackmax), this.whip.y);
                    }else if(this.whipattack[1] == 0){
                        
                        this.whip.move(this.whip.x, this.whip.y + this.whipframe * 5 * this.whipreverse * (1 + this.whipboost/this.whipchargeattackmax));
                    }else{
                        this.whip.move(this.whip.x + this.whipattack[0] * (this.whipframe * 3 * this.whipreverse * (1 + this.whipboost/this.whipchargeattackmax)), this.whip.y + this.whipattack[1]);
                    }
                    
                    
                    
                    
                    if(i > this.whipcount - (3 + Math.floor(this.whipboost/90)) && Math.abs(this.whipframe) < (3 + Math.floor(this.whipboost/90))){
                        this.whip.move(this.whip.x + this.whipattack[0] * 15, this.whip.y + this.whipattack[1] * 15);
                        this.whip.showbox("#006680");//tip hitbox (crit)
                        

                        //damage
                        for(let x = 0 ; x < enemies.length ; x++){
                            if(this.whip.checkenemy(x)){
                                crit++;
                                playerattack = "whip"
                                if(this.whipboost > this.whipchargeattackmax/2){
                                    //at least a half charged whip interrupts too!
                                    enemies[x].hit(10, ["interrupt"], [0, 0], 90);
                                }
                                enemies[x].hit(52 * (1 + this.whipboost/90), ["pain", "physical", "CRITICAL"], [9 * this.whipattack[0], 9 * this.whipattack[1]], 60);
                                
                                //That shit hurts!
                                for(let part = 0 ; part < 10 ; part++){
                                    projectiles.push(new movingpart(enemies[x].x + this.px + random(-13, 13), enemies[x].y + this.py + random(-13,13), random(-6, 6), random(-6, 6), 6, "hsla(197, 100.00%, 50.00%, 0.56)", random(25, 35, false)))
                                }
                                //crits summon orbs at 60 charge
                                if(this.whipboost >= 60){
                                this.newOrb2(enemies[x].x + this.px + random(-30, 30), enemies[x].y + this.py + random(-30,30))
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
                                playerattack = "whip"
                                if(this.whipboost > this.whipchargeattackmax/2){
                                    //at least a half charged whip interrupts too!
                                    enemies[x].hit(4, ["interrupt"], [0, 0], 90);
                                }
                                enemies[x].hit(16 * (1 + this.whipboost/100), ["pain", "physical"], [9 * this.whipattack[0], 9 * this.whipattack[1]], 24);
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
                    
                    this.whip.resize(this.whip.size*.95);
                }
                this.whipframe++;
                
                if(this.whipframe == this.whipcount){
                    this.whipframe = -1 * this.whipcount;
                    this.whipattack = false;
                    
                    this.cooldowns[0] = 15;

                    this.followuptime = 5;
                    this.whipboost = 0;
                    
                }
            }


            //summoning deathorbs
            this.autosummon--;
            if(this.autosummon <= 0  && this.deathorbs.length < 5){
                this.newOrb();
                this.autosummon = 150;
            }
            //hitstun
            if(this.hitstun > 0){
                this.hurt();
                
            }else{
            //movement
            if(inputs.includes("shift")){
                this.speed = this.maxspeed * 0.5;
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
if(this.cooldowns[2] < 0 && this.deathorbs.length < 10){
    screen.fillStyle = "#aaa";
    circle(canvhalfx + this.playershift[0], canvhalfy + this.size*1.5 + this.playershift[1], 5)
}
//using attacks

//whip shenanigans
if((this.cooldowns[0] <= 0 || this.followuptime > 0 || this.whipchargeattack > 1) && inputs.includes(controls[4])){
    this.spec1();
    this.cooldowns[0] = 30;

}
//weakened charge attack
if(this.whipchargeattack > 2 && !inputs.includes(controls[4])){
    if(this.whipchargeattack > 60){
    this.whipboost = this.whipchargeattack;
    this.whipchargeattack = 0;
    this.spec1();
    }else{
        this.whipchargeattack = 0;
        this.cooldowns[0] = 10;
    }
    
}
if(this.cooldowns[1] <= 0 && inputs.includes(controls[5])){
    this.spec2();
}
if(this.cooldowns[2] <= 0 && inputs.includes(controls[6])){
    this.spec3();
}
}//things you can't do in hitstun

//you CAN do this in hitstun
if(this.cooldowns[3] <= 0 && inputs.includes(controls[7]) && this.canstance){
    this.spec4();
    this.canstance = false;
}
if(this.canstance == false && !inputs.includes(controls[7])){
    this.canstance = true
}
}
Ezekiel.prototype.tim = function(){
//TIM LIVES!!!


//tim bailing you out
if(this.tpcooldown > 0){
this.tpcooldown--;

}else{
screen.fillStyle = "#00ff8023";
circle(this.Timstats[0] + this.px, this.Timstats[1] + this.py, this.Timstats[2] + 20);
}

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
let damage = 17;
if(this.Timaction == "attack" && this.Timshots != 0 && this.Timshots % 50 == 0 && enemies.length > 0){
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
    if(typeof this.marked != "number" && enemies[0].talking == false || typeof this.marked == "number" && enemies[this.marked].talking == false){
        projectiles.push(new playerproj("chaos sphere", this.Timstats[0] + this.px, this.Timstats[1] + this.py, 15, velocityX * -1, velocityY * -1, "purple", damage, 200, ["magic", "proj"]));
    }
}else if(this.Timaction == "aura" && this.Timshots != 0){
    //show defense aura
    this.defenseaura.enable();
    this.defenseaura.move(this.Timstats[0] + this.px, this.Timstats[1] + this.py);
    if(charezmode()){
        this.defenseaura.size += 2.5;
    }else{
        this.defenseaura.size += 1.5;
    }
    
    this.defenseaurashift = [this.defenseaura.x - this.px, this.defenseaura.y - this.py];
   
    if(this.Timshots < 5){
        this.defenseauralaunch = aim(this.Timbox.x, this.Timbox.y, canvhalfx, canvhalfy, 10 + distance(this.Timbox.x, this.Timbox.y, canvhalfx, canvhalfy)/40);
    }
    
}if(this.Timshots <= 0){
    //teleport somewhere else
    //console.log("john")
    try{
        if(this.stance == "PANIC"){
            //always teleport near the player
            throw new Error("hi guys");
        }
    if(typeof this.marked == "number"){
    this.Timstats[0] = random(enemies[this.marked].x - 300, enemies[this.marked].x + 300)
    this.Timstats[1] = random(enemies[this.marked].y - 300, enemies[this.marked].y + 300)
    }else{
    this.Timstats[0] = random(enemies[0].x - 300, enemies[0].x + 300)
    this.Timstats[1] = random(enemies[0].y - 300, enemies[0].y + 300) 
    }
    this.Timshots = 175;
    this.Timaction = "attack";
    if(this.defenseaura.enabled == false && random(0, 10, false) > -1){
        this.Timaction = "aura";
        this.defenseaura.size = this.Timstats[2]*2;

    }
    }catch(e){
        
        this.Timstats[0] = random(canvhalfx - this.px - 80, canvhalfx - this.px + 80);
        this.Timstats[1] = random(canvhalfy - this.py - 80, canvhalfy - this.py + 80);
        this.Timshots = 175;
         this.Timaction = "attack";
        if(this.defenseaura.enabled == false && random(0, 10, false) > -1){
        this.Timaction = "aura";
        this.defenseaura.size = this.Timstats[2]*2;
        

    }
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
Ezekiel.prototype.ohshit = function(){
let tp = [canvhalfx - this.Timstats[0], canvhalfy - this.Timstats[1]];
this.Timstats[0] = canvhalfx + this.playershift[0] - this.px;
this.Timstats[1] = canvhalfy + this.playershift[1] - this.py;
this.Timshots = 180;
this.px = tp[0];
this.py = tp[1];
this.tpcooldown[1] = 300;
}


Ezekiel.prototype.DIE = function(orb){
    //NOT THE BEEEEESSSSS
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
        if(this.deathorbs[orb].x + 60 + this.px - this.deathshift[orb][0]> findposition(enemies[this.targetting[orb]])[0]){
            this.deathorbs[orb].x-=10;
            
        }
        if(this.deathorbs[orb].x - 60 + this.px - this.deathshift[orb][0]< findposition(enemies[this.targetting[orb]])[0]){
            this.deathorbs[orb].x+=10;
        }

        if(this.deathorbs[orb].y + 60 + this.py - this.deathshift[orb][1]>findposition(enemies[this.targetting[orb]])[1]){
            this.deathorbs[orb].y-=10;
        }
        if(this.deathorbs[orb].y - 60 + this.py - this.deathshift[orb][1]< findposition(enemies[this.targetting[orb]])[1]){
            this.deathorbs[orb].y+=10;
        }
    }catch(e){
        this.targetting[orb] = null;
        this.deathorbs[orb].showbox("#aaa")
        this.deathshift[orb][0] = this.px;
     this.deathshift[orb][1] = this.py;
        return
    }
        try{
       if(this.deathphase[orb] % 25 == 0 && enemies[this.targetting[orb]].talking == false){
        //fire!
        let dx = (this.deathorbs[orb].x + player.px - this.deathshift[orb][0]) - findposition(enemies[this.targetting[orb]])[0];
        let dy = (this.deathorbs[orb].y + player.py - this.deathshift[orb][1]) -findposition(enemies[this.targetting[orb]])[1];
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        velocityX = (dx / magnitude) * 15;
        velocityY = (dy / magnitude) * 15;
        projectiles.push(new playerproj("death orb", this.deathorbs[orb].x + this.px - this.deathshift[orb][0], this.deathorbs[orb].y + this.py - this.deathshift[orb][1], this.deathorbs[orb].size, velocityX * -1, velocityY * -1, "black", 10, 45, ["magic", "proj"]));
       }
       }catch(e){
        this.deathphase[orb] = 25;
       }

        this.deathphase[orb]--;
        //console.log(this.deathphase[orb])
    }else if (this.deathphase[orb] == 0){

        let dx = (this.deathorbs[orb].x + player.px - this.deathshift[orb][0]) - findposition(enemies[this.targetting[orb]])[0];
        let dy = (this.deathorbs[orb].y + player.py - this.deathshift[orb][1]) - findposition(enemies[this.targetting[orb]])[1];
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
    
}else{
    this.deathorbs[orb].x = (canvhalfx) + (this.size + 30) * Math.cos(this.angle + orb*(6.34/this.deathorbs.length));
    this.deathorbs[orb].y = (canvhalfy) + (this.size + 30) * Math.sin(this.angle + orb*(6.34/this.deathorbs.length));


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
        if(this.deathorbs[orb].checkenemy(i) && enemies[i].talking == false){
            playerattack = "deathorb melee"
            enemies[i].hit(32, ["physical", "slashing", "bludgeoning"]);
            if(enemies[i].knockback == "legacy"){
                enemies[i].hitstun = 10;
            }
            this.deathorbs[orb].grantimmunity(i);
        }
     }

}

Ezekiel.prototype.bonus = function(){
    //for interrupting an attack! nothing yet...
    this.newOrb(100, 0);
    this.newOrb(-100, 0);
    this.newOrb(0, 100);
    this.newOrb(0, -100);
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
Ezekiel.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0, DImod = 1){

        if(this.tpcooldown <=0 && damage > 1 && !damagetype.includes("unavoidable")){
            //basically, Tim won't save you from baby damage, and he won't save you from unavoidable attacks
            this.ohshit();//fuck this shit I'm out
            this.tpcooldown = 300;
            this.hitstun = 0;
            this.knockback = [0, 0];
            return;
        }


        //handle damage dealt
        var dmg = damage * ((damagetype.includes("true"))? 1:this.damagemod);
        

         if(this.stance == "ATTACK" && this.deathorbs.length > 0){
            //only do this if damage is actually done (or don't kill death orbs if in panic stance)
                dmg/=2;
                this.deathorbs.pop();
                this.deathphase.pop();
                this.targetting.pop();
                this.meleedirect.pop();
                this.deathshift.pop();
        }else if(this.stance == "PANIC" && this.deathorbs.length > 0){
            //still reduce damage, just not as much
            dmg *= (50 - this.deathorbs.length*2)/100;
            if(dmg <= 0){
                dmg = 0;
                return;//I doubt one will ever acquire that many death orbs, but if they do they are rewarded with straight up invincibility
            }
        }
        for(let i = 0 ; i < this.damagetypemod.length ; i++){
            if(damagetype.includes(this.damagetypemod[i][0])){
                dmg *= this.damagetypemod[i][1];
            }
        }
        if(this.damagetype != ["true"] && this.stance == "PANIC" && this.defenseaura.scanplayer()){
            //if you're in the shield, and it's not true damage
            if(charezmode()){
            dmg*=.25;
            }else{
                dmg*=0.5//75% reduction was OP, 50 is better for hard mode!
            }
            knockback[0]/=2;
            knockback[1]/=2;
            hitstun*=0.10;
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
            if(damagetype.includes("set")){
                this.hitstun = hitstun * this.hitstunmod
            }
        }
        //console.log(this.hp);

        //kill deathspheres
        if(this.stance == "ATTACK"){
            //only do this if damage is actually done (or don't kill death orbs if in panic stance)
                this.deathorbs.pop();
                this.deathphase.pop();
                this.targetting.pop();
                this.meleedirect.pop();
                this.deathshift.pop();
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
screen.fillText(`Started on lvl ${Math.floor(startlevel)} and made it to lvl: ${Math.floor(level)}`, canvhalfx, canvhalfy - 60);//made it to what level
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

if(oneshot == true){
screen.fillText("Press the space bar to go back", canvhalfx, canvas.height - 30);//tell them how to go back
}else{
    screen.fillText("Press the space bar to restart boss", canvhalfx, canvas.height - 30);//tell them how to restart
}

if(input == " "){
if(oneshot == true){
//there's a chance.
player = null;
clearInterval(setup);
setup = setInterval(prep, 1000/fps);
screen.textAlign = "left";
level = 0;
input = '';
bossbar = [];
    }else{
        this.hp = 1
        level = Math.floor(level);
        clearInterval(setup);
        input = '';
        bossbar = [];
        setup = setInterval(gametime, 1000 / fps);
    }
}

}
Ezekiel.prototype.win = function(){
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
screen.fillText("Ezekiel", canvhalfx, 40);//char name
screen.fillText(`Started on lvl ${Math.floor(startlevel)} and won on lvl: ${Math.floor(level)}`, canvhalfx, canvhalfy - 60);//made it to what level
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
if(this.whipchargeattack > 1){
this.whipchargeattack++;

if(this.whipchargeattack % 30 == 0){
    projectiles.push(new flashpart(canvhalfx, canvhalfy, this.size, 10, "#4c00ff", 100, 10 - (this.whipchargeattack / 30)));
}
if(this.whipchargeattack >= this.whipchargeattackmax){
    this.whipattack = true;
    this.whipboost = this.whipchargeattack;
    this.whipchargeattack = 0;
}
}else{
this.whipattack = true;
    if(this.followuptime > 0){
    this.followuptime = 0;
    this.whipreverse *= -1;
    this.whipboost = 15;//a small bonus for timing!
    }else{
        this.whipreverse = 1;
    }
}

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
}

Ezekiel.prototype.newOrb = function(sx = 0 , sy = 0){
        this.deathorbs.push(new hitbox(canvhalfx - this.px + sx, canvhalfy - this.py + sy, 4, 3, 10));
    
this.deathorbs[this.deathorbs.length-1].immunityframes(45);
this.deathphase.push(random(35, 45, false));
this.targetting.push(this.marked);
this.meleedirect.push([]);
this.deathshift.push([0, 0]);
}
Ezekiel.prototype.newOrb2 = function(sx = 0 , sy = 0){
        this.deathorbs.push(new hitbox(sx, sy, 4, 3, 10));
    
this.deathorbs[this.deathorbs.length-1].immunityframes(45);
this.deathphase.push(random(35, 45, false));
this.targetting.push(this.marked);
this.meleedirect.push([]);
this.deathshift.push([0, 0]);
}

Ezekiel.prototype.spec4 = function(){
let tp = [canvhalfx - this.Timstats[0], canvhalfy - this.Timstats[1]];
this.Timstats[0] = canvhalfx + this.playershift[0] - this.px;
this.Timstats[1] = canvhalfy + this.playershift[1] - this.py;
this.Timshots = 180;
this.px = tp[0];
this.py = tp[1];
this.cooldowns[1] = 30;
/*
//stance change no longer!
if(this.stance == "ATTACK"){
    
this.stance = "PANIC";
this.Timshots = (charezmode())? 0:30;
}else{
    this.stance = "ATTACK"
}
this.cooldowns[3] = 15;
if(this.hitstun > 0 && !charezmode()){
        this.cooldowns[3] = 150;
    }
        */
}

Ezekiel.prototype.inst = function(x = this.px, y = this.py, size = this.size){
player = new Ezekiel(x, y, size);
}
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Ezekiel(canvhalfx, canvhalfy, 20));