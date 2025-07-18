/*
hard mode changes:
    all healing is limited now, and you can no longer have 999 overheal
    parry timing is shorter
    cooldowns are no longer reset on dash
    
*/
function Jade(startposx, startposy, size){
this.px = startposx;
this.py = startposy;
this.pz = 0;
this.size = size; //no she is NOT fat

//card info
this.postColor = "#FFFF00";
this.color = "#9E9D27"
this.desc = ["This is the main character! Beware her tenacity!", "1. Radiant Echo/Slash: Shoots a basic projectile that heals on hit while in magic stance. Can be charged to summon trailing projectiles that follow it around!", "    Slash with a sword in sword stance. Does more damage, and less cooldown, but no healing.", "2. Luminous Burst/Radiant Spin: In magic stance, shoot a large projectile that detonates, healing on hit, and leaves a lingering area of effect!", "    Perform a spin attack in Sword mode, heals on hit, and is a multihit!", "    Both attacks can be charged for more range and overal damage!", "3. Celestial Beam/Defend: In magic stance, aim and fire a hyperlaser from the heavens! Hitting yourself powers up your next move.", "    In sword stance, parry an incoming attack, and leave light sparks that trail Radiant Echo. There are 15 parry frames!", "    Whiffing a parry inflicts 15 additonal vulnerability frames, leaving you completely inactionable", "4. Stance Change: Dash forwards, evading attacks! By the end of this move, you swap stances."];
//not me changing some of the move's names so I don't get hit with the copyright strike.
//game stats
this.playershift = [0, 0];//shift the position of the player
this.cooldowns = [0, 0, 0, 0]
this.damagetypemod = [["seduction", 0.5], ["sexual", 0.8], ["dark", 0.4]]; //as a canon succubus, it makes sense she's be resistant to these. Thanks to her light affinity, dark magic is particularly ineffective.
this.hp = 100;
this.damagemod = 1;
this.speed = 10;
this.speedmod = 1
this.speedcause = [];//causes of speed buffs/nerfs
this.DI = 1;
this.hitstunmod = 1;
this.knockbackmod = 1;
this.height = 8;
this.facing = [1, 0, -Math.PI/2];//facing x, facing right, facing orientation.
this.iframe = false;
//character exclusive!
this.miracle = 10; //if taken fatal damage, the amount of miracles is the chance for hp go to 1 instead of death. This also determines how long Jade can ignore death for.
this.stance = "magic";
this.dashtime = 0;
this.powerup = 0;
this.slashtime = 0;
this.swordbox = new hitbox(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.pz, 2 , this.size * 3);
this.swordbox.disable();
this.swordbox.immunityframes(5);
this.spin = false;
this.parry = 0;
this.truemiracle = 0;
this.parryiframes = 0;
this.abraxusind = -1;//abraxus and parry now has an indicator if they are ready
}
Jade.prototype.listname = function(){
//to help position the characters correctly
return "Jade";
}
Jade.prototype.greeting = function(){
console.log("Jade, the main character, is now ready to play!");
}
Jade.prototype.exist = function(){
//lowering parry frames
this.parry--;
this.truemiracle--;
if(this.parryiframes > 0){
this.parryiframes--;
this.iframe = true;
}else{
this.iframe = false;
}
//HP check
if(this.hp > 100){
    //I'm generous enough to give you a BIT of extra power for a set time
    this.hp-=0.15;
    if(this.hp <= 100){
        this.hp = 100;
        //yes, I'm aware this is effectively a free defense
    }

}else if(this.hp <=0 || this.truemiracle > 0){
    //play the death anmiation, then call off
    this.death();
    return "dead";
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

    console.log(this.speedcause[i])
    if(this.speedcause[i][1]-- < 0){
        //delete all effects that ran out
        this.speedcause.splice(i--, 1);
    }else{
        //cause every lasting effect to effect speed
        this.speedmod*=this.speedcause[i][2];
    }
}
//first character to exist and move!
this.swordbox.updateimmunity();
if(this.slashtime > 0 && this.spin == false){
    //slash effect
    this.swordbox.enable();
    this.slashtime--;
    screen.fillStyle = "#FF8";
    screen.beginPath();
    if(this.facing[0] == -1){
    //console.log("left")
        if(this.facing[1] == 1){
            //left down
            this.facing[2] = Math.PI / 4;
        }else if (this.facing[1] == -1){
            //left up
            this.facing[2] = 3 * Math.PI / 4;
        }else{
            //just left
            this.facing[2] = Math.PI/2
        }
    }else if (this.facing[0] == 1){
        if(this.facing[1] == 1){
                    //right down
                    this.facing[2] = 7 * Math.PI / 4;
                }else if (this.facing[1] == -1){
                    //right up
                    this.facing[2] = 5 * Math.PI / 4;

                }else{
                    //just right
                    this.facing[2] = 3 * Math.PI / 2;
                    //console.log(this.facing[2])
                }

    }else{
        if(this.facing[1] == -1){
            //just up
            this.facing[2] = Math.PI
        }else{
            //just down
            this.facing[2] = 0
        }
    }
    if(this.powerup > 0){
            screen.fillStyle = "#fc03db";
            screen.arc(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.size * 8, this.facing[2], this.facing[2] + Math.PI);
            screen.fill();
            screen.closePath();
            screen.beginPath();
        }
    screen.fillStyle = "#FF8";
    screen.arc(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.size * 4, this.facing[2], this.facing[2] + Math.PI);
    screen.fill();
    screen.closePath();
    this.swordbox.reassign(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.pz, 2, this.size * 4);
    for(let i = 0 ; i < enemies.length ; i++){
    if(this.swordbox.checkenemy(i) && this.swordbox.enemyhalf(i, this.facing)){
        enemies[i].hit(15, ['physical', 'slashing'], [5 * this.facing[0], 5 * this.facing[1]], 20);
        this.swordbox.grantimmunity(i);
    }
    }
    if(this.powerup > 0){
        this.swordbox.refreshimmune();
        this.swordbox.reassign(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.pz, 2, this.size * 8);
        for(let i = 0 ; i < enemies.length ; i++){
            if(this.swordbox.checkenemy(i) && this.swordbox.enemyhalf(i, this.facing)){
                enemies[i].hit(7, ['light']);
                this.swordbox.grantimmunity(i);
                this.hp+=1;

            
        }
    }
        this.powerup -= 10;
    }


}
else if(this.slashtime > 0 && this.spin == true){
this.swordbox.enable();
this.slashtime--;
if(this.powerup > 0){
//power up spin size
screen.fillStyle = "#fc03db";
circle(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.size * 6)
}
screen.fillStyle = "#DD" + random(0, 9, false);

circle(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.size * 4);
if(this.powerup > 0){
this.swordbox.reassign(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.pz, 2, this.size * 6);
this.powerup = this.slashtime;
if(Math.floor(this.powerup) % 3 == 0){
projectiles.push(new Light_Spark(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 5, random(-10, 10), random(-10, 10)));
projectiles.push(new Nosferatu_blast(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.size, 0, 0));
}
}else{
this.swordbox.reassign(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.pz, 2, this.size * 4);
}
    
    for(let i = 0 ; i < enemies.length ; i++){
    if(this.swordbox.checkenemy(i)){
        enemies[i].hit(7.5, ['light', 'physical', 'slashing'], [(canvhalfx + this.playershift[0] < enemies[i].x)? -2:2 , (canvhalfy + this.playershift[1] < enemies[i].y)? -2:2], 20);
        this.swordbox.grantimmunity(i);
        if(this.hp > 95){
            //grant more hp at max hp for more armor frames
            this.hp+= 5;
        }else if(charezmode()){
            this.hp+=0.25;
            }

        }


}
}
else if (this.spin == "charge"){
}else{
this.spin = false;
}


//player
screen.fillStyle = this.color;
if(this.parry > 0){
screen.fillStyle = "#ff9";
}else if(this.stance == "sword"){
screen.fillStyle = "#fc0";
}
circle(canvhalfx, canvhalfy, this.size)
//hp
if(this.hp <= 100){
//under max
screen.fillStyle = "#F00";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
if(this.parry > 0){
screen.fillStyle = "#00F";
}else{
screen.fillStyle = "#0F0";
}
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
}else{
//over max
if(this.parry > 0){
screen.fillStyle = "#00F";
}else{
screen.fillStyle = "#0F0";
}
screen.fillRect(canvhalfx - 25 - (this.hp - 100) * 0.25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
screen.fillStyle = "#00F";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
}

//powered up passive
if(this.powerup > 0){
    if( this.powerup % 25 == 0){
    if(charezmode()){
        projectiles.push(new Light_Spark(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.size / 3, random(-2, 2), random(-2, 2)));
    }else{
        projectiles.push(new Light_Spark(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.size / 5, random(-2, 2), random(-2, 2)));
    }
    }
    this.powerup--;
}
//movement
if(this.hitstun > 0){
    this.hurt();
    return;
}
for(let i = 0; i < this.speedcause.length ; i++){
//console.log(this.speecause[i][0])
if(this.speedcause[i][0] == "ab4"){
this.speedcause[i][2] *= 0.8;
if(this.speedcause[i][2] < 1){
this.speedcause[i][2] = 1;
}
break;
}
}


//console.log(this.speedmod);
if(inputs.includes("shift")){
    if(this.powerup > 0){
    this.speed = 6;
    }else{
    this.speed = 5;
    }
}else{
    if(this.powerup > 0){
    this.speed = 12
    }else{
    this.speed = 10;
    }
}
if(this.stance != "abraxas"){
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
    if(this.cooldowns[2] == 0){
    //determine if abraxus is ready
    if(this.stance == "magic"){
        //make it known!
        this.abraxusind = 9;
    }else{
        //parry is less known
        this.abraxusind = 5;
    }
    this.cooldowns[2] = -1;
    }

}
//release particles if abraxus is ready
for(let i = 0 ; i < this.abraxusind ; this.abraxusind--){
projectiles.push(new movingpart(canvhalfx, canvhalfy, random(-12, 12), random(-12, 12), 4, "#999", 5));
}
//attacks

if(this.cooldowns[0] <= 0 && inputs.includes(controls[4]) && this.stance != "abraxas"){
    this.spec1();
    if(this.stance == "magic"){

        this.cooldowns[0] = 30;
    }else{
        this.cooldowns[0] = 6;
    }
}
if(this.cooldowns[1] <= 0 && inputs.includes(controls[5]) && this.stance != "abraxas"){
    this.spec2();
    if(this.stance == "magic"){

            this.cooldowns[1] = 120;
        }else{

        }
}
if(!inputs.includes(controls[5]) && this.spin == "charge"){
this.spin = true;
this.spec2();
}
if(this.cooldowns[2] <= 0 && inputs.includes(controls[6])){
    this.spec3();


}
if(this.cooldowns[3] <= 0 && inputs.includes(controls[7]) && this.stance != "abraxas"){
    this.spec4();
    //this.cooldowns[3] = 60;
}
}
Jade.prototype.spec1 = function(){
//abilities
if(this.stance == "magic"){
if(this.powerup > 0){
    projectiles.push(new Seraphim(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 15, this.facing[0] * 12, this.facing[1] * 12, 30));
    for(let i = 0 ; i < 4 ; i++){
        projectiles.push(new Light_Spark(canvhalfx + random(-40, 40), canvhalfy + random(-40, 40), 15 / 2, 0, 0));
    }
    this.powerup -= 300;
}else{
projectiles.push(new Seraphim(canvhalfx, canvhalfy, 10, this.facing[0] * 12, this.facing[1] * 12, 30));
}
}else{
this.slashtime = 3;
}
}
Jade.prototype.spec2 = function(){
if(this.stance ==  "magic"){
if(this.powerup > 0){
this.powerup = 0;
projectiles.push(new Nosferatu(canvhalfx + this.playershift[0] + (this.facing[0] * 30), canvhalfy + this.playershift[1] + (this.facing[1] * 30), 90, this.facing[0] * 3, this.facing[1] * 3, 90, 3));
}else{
projectiles.push(new Nosferatu(canvhalfx + this.playershift[0] + (this.facing[0] * 30), canvhalfy + this.playershift[1] + (this.facing[1] * 30), 45, this.facing[0] * 2, this.facing[1] * 2, 90, 2));
}
}else{
if(this.spin == false){
this.spin = "charge";
this.slashtime = 40;
}else if(this.spin == "charge" && this.slashtime < 80){
this.slashtime+=2;
this.speedcause.push(["charging spin", 1, 0.1]);
}else{
this.spin = true;
this.speedcause.push(["spin attack!", this.slashtime, 0.5])
for(let i = 0 ; i < this.cooldowns.length ; i++){
    this.cooldowns[i] = this.slashtime;
}
this.cooldowns[1] = 100;
}

}
}
Jade.prototype.spec3 = function(){
if(this.stance == "magic"){
        if(this.powerup > 0){
        projectiles.push(new Abraxas(canvhalfx + this.playershift[0] + (this.facing[0] * 120), canvhalfy + this.playershift[1] + (this.facing[1] * 120), this.size * 5));
        this.powerup = 0;
        }else{
        projectiles.push(new Abraxas(canvhalfx + this.playershift[0] + (this.facing[0] * 120), canvhalfy + this.playershift[1] + (this.facing[1] * 120), this.size));
        }
            this.stance = "abraxas";
        }else if (this.stance == "sword" && this.parry < 0){
            //essentially a half a second parry, with a half a second vulnerability time
            this.parry = 15;
            for(let i = 0 ; i < this.cooldowns.length ; i++){
                if(this.cooldowns[i]<30){
                    this.cooldowns[i] = 30;
                }
            }
            this.cooldowns[3] = 30;
            if(charezmode()){
                this.speedcause.push(["PARRY", 30, 0.4]);
            }else{
                this.parry = 7;//yep, lowered parry timing
                this.speedcause.push(["PARRY", 30, 0.2]);
            }
        }

}
Jade.prototype.spec4 = function(){
    //this.dashtime = 10;
    this.speedcause.push(["ab4", 10, 8]);
    if(this.stance == "magic"){
        this.stance = "sword";
    }else{
        this.stance = "magic";
    }
    if(charezmode()){
        this.cooldowns = [10, 10, 10, 60];
    }else{
        this.cooldowns[3] = 60;
    }

}

chars.push(new Jade(0, 0, 20));

Jade.prototype.hurt = function(){
if(this.truemiracle > 1){
        return;
        }
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
Jade.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0,  DImod = 1){
        //handle damage dealth
        if(this.truemiracle > 1){
        return;
        }
        if(this.cooldowns[2] < 15){
            this.cooldowns[2] = 15;//no parry cheesing!
        }
        
        if(this.parry >= 0){
            parried++;
            if(this.powerup < 1){
                this.powerup = 0;
            }
            if(this.powerup < 1000){
                this.powerup += 300 ;
            }
        
            for(let i = 0 ; i < damage+1 / 2; i++){
                if(charezmode() || i % 2 == 1){
                projectiles.push(new Light_Spark(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.size / 2, random(-2, 2) + knockback[0], random(-2, 2) + knockback[1]));
                }
            }
            this.hp+=(damage + 3) * 1.5;
            this.cooldowns = [0, 0, 35, 0];//kinda broke, IK
            this.parry = -1;
            for(let i = 0 ; i < this.speedcause.length ; i++){
                if(this.speedcause[i][0] == "PARRY"){
                    this.speedcause.splice(i, 1);
                    break;
                }
            }
            if(charezmode()){
            this.parryiframes = 30;//to get out of there!
            }else{
            this.parryiframes = 15;//HURRY UP!!!
            }
            return;
        }
        var dmg = damage * this.damagemod;
        for(let i = 0 ; i < this.damagetypemod.length ; i++){
            if(damagetype.includes(this.damagetypemod[i][0])){
                dmg *= this.damagetypemod[i][1];
            }
        }
        if(this.hp > 100 && this.hp - dmg < 100){
        this.hp = 100;
        }else{
        if(this.hp - dmg < 1 && random(0, 100, false) < this.miracle){
        //those miracles we be talking about! HER TENACITY!!!!!!
        this.hp = 1;
        knockback[0]*=2;
        knockback[1]*=2;
        this.parry = 999;
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

Jade.prototype.death = function(){
//NOT YET!
while(this.miracle > 0 && this.hp < 1){
this.miracle-=0.5;
this.hp+=3;
//this is effectively +60 free hp
}

if(this.hp >=1 && this.truemiracle < 1){
//IT'S NOT OVER UNTIL IT'S OVER!!!!!
return;
}else if(random(0, 100, false) == 50 && this.truemiracle < 1 && this.hp != null){
//NOOOTTTT YEEEEEEEETTTTTTTT!!!!!!!!!
this.hp = 200;
this.miracle = 20;
this.truemiracle = random(45, 75);
this.parry = 99999;//a gift from the Demon Lord!


}else if(this.truemiracle < 1){
//that's game...
projectiles = [];
summons = [];
enemies = [];
bossbarmode = 0;
this.truemiracle = -5;
this.hp = null;
}


//game over man! Game over!

//draw the character, stationary
screen.fillStyle = this.color;
circle(canvhalfx, this.size + 40, this.size)

//here is some statistics
screen.fillStyle = "#FFF";
screen.textAlign = "center";
screen.font = "25px Times New Roman";
screen.fillText("Jade", canvhalfx, 20);//char name
screen.fillText("Made it to lvl: " + Math.floor(level), canvhalfx, canvhalfy - 60);//made it to what level
screen.fillText("Was playing on " + difficulty + " mode", canvhalfx, canvhalfy - 20);//On what difficulty
if(this.truemiracle > 1 && this.truemiracle < 5){
screen.fillStyle = "#FFF";
screen.textAlign = "center";
screen.font = "35px Times New Roman";
screen.fillText("You were not chosen to die Jade. Get up!", canvhalfx, canvhalfy - 100);
screen.fillStyle = "#FFF";
screen.textAlign = "center";
screen.font = "25px Times New Roman";
}


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

if(input == " " && this.hp < 1){
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
//Projectiles
function Seraphim(x, y, size, mx, my, charge){
    this.name = "Seraphim";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.chargetime = charge;
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.lifetime = 700;//this is universal to all projectiles!
}
Seraphim.prototype.exist = function(){
    //First existing projectile!

    //charge by holding attack
    if(inputs.includes(controls[4]) && this.chargetime > 0){
        this.chargetime++;
        this.x = canvhalfx + player.playershift[0];
        this.y = canvhalfy + player.playershift[1];
        this.shift = [player.px, player.py];
        this.mx = player.facing[0] * 12;
        this.my = player.facing[1] * 12;
        player.cooldowns[0]+=1;
        player.speedcause.push(["seraphim charge", 1, 0.8]);
        if(this.chargetime % 10 == 0){
        projectiles.push(new Light_Spark(random(this.x - 30, this.x + 30), random(this.y - 30, this.y + 30), this.size / 2, 0, 0));
        }

    }else{
        //ensures it doesn't teleport back to the player
        this.chargetime = -1;
        this.hitbox.enable();
        this.lifetime--;

    }
    screen.fillStyle = "#FF8";
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
    this.x+=this.mx;
    this.y+=this.my;

    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    console.log((this.x - (canvhalfx + player.playershift[0])) + " " + (this.y - (canvhalfx + player.playershift[1])));
    //console.log(arena.leavedir(this.x, this.y, this.size))
    if(arena.leave(this.x - this.shift[0], this.y - this.shift[1], this.size) || this.lifetime < 1){
        return "delete";
    }
    //hitting the enemy
    let en = this.hitbox.hitenemy();
    //console.log(en);
    if(typeof en != "boolean"){
        playerattack = this.name;
        enemies[en].hit(this.size / 2, ["light", "magic"]);
        if(charezmode() || player.hp < 110){
        player.hp += this.size / 5;
        }
        return "delete";
    }
}

function Nosferatu(x, y, size, mx, my, charge, speed){
    this.startup = 5;
    this.name = "Nosferatu"
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.speed = speed
    this.detin = 100;
    this.charge = charge; //+5 startup
    this.hitbox = new hitbox(x, y, 0, size, size);
    this.hitbox.disable();
    this.lifetime = 99999;//this isn't required to go down though
}
Nosferatu.prototype.exist = function(){


    screen.fillStyle = "#FFF";
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size);
        if(this.startup > 0){
        //this move has a startup!
        this.x = canvhalfx + player.playershift[0] + (player.facing[0] * 30);
        this.y = canvhalfy + player.playershift[1] + (player.facing[1] * 30);
        this.shift = [player.px, player.py];
        this.mx = player.facing[0] * this.speed;
        this.my = player.facing[1] * this.speed;
        this.startup--;
        player.speedcause.push(["nosferatu startup", 1, 0.25])
        return;
        }
        //this can be charged
    if(inputs.includes(controls[5]) && this.charge > 0){
           this.x = canvhalfx + player.playershift[0] + (player.facing[0] * 30);
           this.y = canvhalfy + player.playershift[1] + (player.facing[1] * 30);
           this.shift = [player.px, player.py];
            this.mx = player.facing[0] * this.speed;
            this.my = player.facing[1] * this.speed;
            this.size+=0.5;
            this.charge--;
            player.cooldowns[1]+=1;
            player.speedcause.push(["nosferatu charge", 1, 0.5])
            return;
    }else{
        this.charge = -1;


    }
    if(this.detin > 0 && !this.hitbox.hitproj("Seraphim")){
        //console.log(!this.hitbox.hitproj("Seraphim"))

        this.x+=this.mx;
        this.y+=this.my;
        this.detin--;
        this.hitbox.enable();
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 0, this.size, this.size);

    }else{
        for(let i = 0 ; i < 40+this.size; i++){
        if(this.size>=90 && random(0,1,false)){
        projectiles.push(new Light_Spark(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], random(2,8), random(-this.size/4, this.size/4), random(-this.size/4, this.size/4)))
        }else{

        projectiles.push(new Nosferatu_blast(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], random(6,12), random(-this.size/2, this.size/2), random(-this.size/2, this.size/2)));

        }
        }
        return "delete";
    }
    if(arena.leave(this.x - this.shift[0], this.y - this.shift[1], this.size)){
        this.detin = 0;
    }
    if(this.lifetime < 1){
        return "delete"
    }
    //hitting the enemy
        let en = this.hitbox.hitenemy();
        //console.log(en);
        if(typeof en != "boolean"){
            playerattack = this.name;
            enemies[en].hit(this.size / 4, ["light", "magic"], [this.mx * this.size, this.my * this.size], this.size * 5);
            for(let i = 0 ; i < 40+this.size; i++){
                    if(this.size>=90 && random(0,1,false)){
                        projectiles.push(new Light_Spark(this.x, this.y, random(2,8), random(-this.size/4, this.size/4), random(-this.size/4, this.size/4)))
                    }else{

                        projectiles.push(new Nosferatu_blast(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], random(6,12), random(-this.size/2, this.size/2), random(-this.size/2, this.size/2)));

                    }
                    }
                    return "delete";
        }

}

function Nosferatu_blast(x, y, size, mx, my){
    this.name = "Nosferatu_blast"
    this.x = x;
    this.y = y;
    this.shift = [player.px , player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.last = random(95, 110);
    this.hitbox = new hitbox(this.x, this.y, 0, 4, this.size);
    this.hitbox.disable();
    this.hitbox.immunityframes(15);
    this.lifetime = null;//for unparriable projectiles

}
Nosferatu_blast.prototype.exist = function(){
    this.hitbox.enable();
    this.hitbox.updateimmunity();
    screen.fillStyle = "#FFF";
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
    if(this.last > 0){
        this.x+=this.mx;
        this.y+=this.my;
        this.mx*= 0.9;
        this.my*= 0.9;
        this.last--;
        this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    }
    if(this.last <=0){
        return "delete";
    }
    //hitting the enemy
        let en = this.hitbox.hitenemy();
        //console.log(en);
        if(arena.leave(this.x - this.shift[0], this.y - this.shift[1], this.size)){
                    this.last = -5;
                    }
        for(let en = 0 ; en < enemies.length ; en++){
            if(this.hitbox.checkenemy(en)){
            playerattack = this.name;
            enemies[en].hit(this.size / 10, ["light", "magic"]);
            if(Math.abs(this.mx) + Math.abs(this.my) > 20){
                enemies[en].hit(0, ["light", "magic"], [this.mx / 2, this.my / 2], 40);
            }
            this.last -= 5;
            if(charezmode() || player.hp < 110){
            player.hp+=0.5;
            }

            this.hitbox.grantimmunity(en);
        }
        }
}

function Abraxas(x, y, size){
    this.name = "Abraxas";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.mx = 0;
    this.my = 0;
    this.size = size
    this.maxautofire = 250
    this.autofire = this.maxautofire;
    this.stage = 0;
    this.hitbox = new hitbox(x, y, 0, 99, size); //for owning a hitbox
    this.hitbox.disable();
    this.hitbox.immunityframes(60);
    this.lifetime = null;
}
Abraxas.prototype.exist = function(){


    this.hitbox.updateimmunity();
    if(this.stage == 0){
    screen.fillStyle = "#662";
        circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size);
        if(inputs.includes(controls[0])){
            this.mx-=1;
        }
        if(inputs.includes(controls[1])){
            this.mx+=1;
        }
        if(inputs.includes(controls[2])){
            this.my-=1;
        }
        if(inputs.includes(controls[3])){
            this.my+=1;
        }
        if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('l')){
            this.x -= this.size + 5 + this.mx;
            this.mx*=-1;
        }
        else if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('r')){
            this.x +=this.size + 5 + this.mx;
            this.mx*=-1;
        }
        if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('u')){
                    this.y -= this.size + 5 + this.my;
                    this.my*=-1;
                }
        else if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('d')){
                    this.y += this.size + 5 + this.my;
                    this.my*=-1;
                }
        if(inputs.includes(controls[6]) && this.autofire < this.maxautofire - 30 || this.autofire < 0){
            this.stage = 1;
            player.cooldowns[2] = this.maxautofire;
            player.stance = "magic";
            this.mx*=0.3;
            this.my*=0.3;
        }
        this.autofire--;
        this.size += 0.25;


    }else{
    
       screen.fillStyle = "#FFF";
       circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size);
       if(player.powerup > 0){
        this.size-=0.75;
       }else{
        this.size-=0.50;
        }
        if(this.autofire % 2 == 0){
           projectiles.push(new Nosferatu_blast(this.x + player.px - this.shift[0]+ random(-this.size, this.size), this.y + player.py - this.shift[1] + random(-this.size, this.size), this.size/2, random(-8, 8), random(-8, 8)));
            if(player.powerup > 0){
                projectiles.push(new Light_Spark(this.x + player.px - this.shift[0] + random(-this.size, this.size), this.y + player.py - this.shift[1] + random(-this.size, this.size), this.size*0.25, random(-4, 4), random(-4, 4)));
            }
        }
        if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('l')){
                    this.x = (canvhalfx - arena.w) + arena.w*2 - this.size*3
                    this.mx*=-1;
                }
        else if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('r')){
                    this.x = canvhalfx - arena.w + this.size;
                    this.mx*=-1;
                }
        if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('u')){
                            this.y = (canvhalfy - arena.h) + arena.h*2 - this.size*3;
                            this.my*=-1;
                        }
        else if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('d')){
                            this.y = canvhalfy - arena.h + this.size;
                            this.my*=-1;
                        }
        this.autofire++;
        if(this.size < 5 || this.lifetime < 1){
            return "delete";
        }
        //hitting the enemy
            for(let en = 0 ; en < enemies.length ; en++){
            //console.log(en);
            if(this.hitbox.checkenemy(en)){
                playerattack = this.name;
                enemies[en].hit(30, ["light", "magic"]);
                player.hp+=5;
                this.hitbox.grantimmunity(en);

                if(enemies[en].knockback == "legacy"){
                enemies[en].hit(0, [], [], 30)
            }
            }
        }
        //contact with player
        this.hitbox.enable();
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 0, 999, this.size);
       if(this.hitbox.hitplayer()){
            player.powerup = 750;
            if(charezmode() || player.hp < 105){
            player.hp+=1;
            }
            //this.size-=0.25;
            //projectiles.push(new Light_Spark(this.x + random(-this.size, this.size), this.y + random(-this.size, this.size), this.size*0.25, random(-15, 15), random(-15, 15)));

       }

    }
    this.x += this.mx;
    this.y += this.my;
    this.lifetime = 1;//make a previously unparriable projectile parriable

}

function Light_Spark(x, y, size, mx, my){
    this.name = "Light_Spark";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.lifetime = random(345, 360);
    this.hitbox = new hitbox(this.x, this.y, 3, 1, this.size);
    this.hitbox.disable();

}
Light_Spark.prototype.exist = function(){
    this.hitbox.enable();
    var track;
    screen.fillStyle = "#883";
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size);
    if(this.lifetime > 0){
        this.x+=this.mx;
        this.y+=this.my;
        this.mx*= 0.98;
        this.my*= 0.98;
        this.lifetime--;
    }
    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
     if(arena.leave(this.x - this.shift[0], this.y - this.shift[1], this.size)){
        this.lifetime-=35;

     if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('l')){
                        this.x -= this.size + 5 + this.mx;
                        this.mx*=-0.5;
                    }
     else if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('r')){
                        this.x +=this.size + 5 + this.mx;
                        this.mx*=-0.5;
                    }
     if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('u')){
                                this.y -= this.size + 5 + this.my;
                                this.my*=-0.5;
                            }
     else if(arena.leavedir(this.x - this.shift[0], this.y - this.shift[1], this.size).includes('d')){
                                this.y += this.size + 5 + this.my;
                                this.my*=-0.5;
                            }
    }
    for(let i = 0 ; i < projectiles.length ; i++){
        if(projectiles[i].name == "Seraphim"){
            try{
                if(Math.sqrt(((this.x + player.px - this.shift[0] - track.x + player.px - track.shift[0]) ** 2) + (this.y + player.py - this.shift[0] - track.y + player.py - track.shift[1]) ** 2) > Math.sqrt(((this.x + player.px - this.shift[0] - projectiles[i].x + player.px - projectiles[i].shift[0]) ** 2) + (this.y + player.py - this.shift[1] - projectiles[i].y + player.py - projectiles[i].shift[1]) ** 2)){
                    track = projectiles[i];
                }
            }catch(e){
                track = projectiles[i];

            }

            //track whatever they caught
            try{
            if(this.x + player.px - this.shift[0] < track.x + player.px - track.shift[0]){
                this.mx+=3;
            }else{
                this.mx-=3;
            }
            if(this.y + player.py - this.shift[1] < track.y + player.py - track.shift[1]){
                 this.my+=3;
            }else{
                 this.my-=3;
            }
            }catch(e){}

        }
    }

    if(this.lifetime <=0){
        return "delete";
    }
    //hitting the enemy
        for(let en = 0 ; en < enemies.length ; en++){
        //console.log(en);
        if(this.hitbox.checkenemy(en)){
            enemies[en].hit(this.size, ["light", "magic"]);
            playerattack = this.name;
            if(charezmode() || player.hp < 110){
            player.hp+=this.size/2
            }
            return "delete";
        }
    }

}

Jade.prototype.inst = function(x = this.px, y = this.py, size = this.size){
player = new Jade(x, y, size);
}