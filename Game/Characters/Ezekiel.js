function Ezekiel(startposx, startposy, size){
//startup
this.px = startposx;
this.py = startposy;
this.pz = 0; //distance up.
this.size = size;

//character poster/character color
this.postColor = "#0000FF";
this.color = "#0088FF";
this.desc = ["The Summoner! Overwhelm your foes with superior numbers, and swap places with your Tim when you're in danger!", "Tim: Your skeletal companion teleports around at random and fires magical orbs at your opponents!", "    He is completely autonomous, teleports instantly when in danger, and cannot be killed.", "1. Whip: A VERY long reach melee attack! A successful hit marks your opponent for death", "    When marked for death, all summons target the enemy, and summons do additional damage to marked enemies.", "2. Swap: swap places with Tim. Tim can just teleport out of danger anyway! Goes on cooldown if Tim teleports.", "3. Death Sphere: Summon up to 9 autonomous death spheres that fire projectiles and rush at enemies!", "Death Spheres block projectiles, BUT if Ezekiel takes damage, there's a 50% chance for a Death Sphere to be die. Death Spheres don't take damage.", "4. PANIC/ATTACK: Changes stance to PANIC stance, causing all death sphere to orbit you, and Tim to stop attacking.", "  While PANIC is active, Tim emits an aura that negates 75% of damage instead of attacking. This aura passively damages bosses, but it's weak", "    Use again to go back to ATTACK stance. Can be used in hitstun"]
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
//for Tim
this.Timstats = [canvhalfx + 200, canvhalfy + 200, this.size];
this.Timshots = 175;
this.Timbox = new hitbox(this.Timstats[0], this.Timstats[1], 0, 8, this.Timstats[2]);


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
//TIM LIVES!!!!!
this.tim();
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
Ezekiel.prototype.tim = function(){
//TIM LIVES!!!
screen.fillStyle = "#444";
circle(this.Timstats[0] + this.px, this.Timstats[1] + this.py, this.Timstats[2])
this.Timbox.move(this.Timstats[0] + this.px, this.Timstats[1] + this.py);
this.Timshots--;
if(this.Timshots != 0 && this.Timshots % 50 == 0){
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

    projectiles.push(new playerproj("chaos sphere", this.Timstats[0] + this.px, this.Timstats[1] + this.py, 15, velocityX * -1, velocityY * -1, "purple", 15, 200, ["magic"]));
}else if(this.Timshots <= 0){
    //teleport somewhere else
    this.Timstats[0] = random(canvhalfx - 300, canvhalfx + 300)
    this.Timstats[1] = random(canvhalfy - 300, canvhalfy + 300)
    this.Timshots = 175;
}

for(let i = 0 ; i < projectiles.length ; i++){
if(projectiles[i].name != "chaos sphere" && this.Timbox.scanproj(i)){
//He was hit...
this.Timshots = 0;
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
console.log("working!");
}
Ezekiel.prototype.spec2 = function(){

}
Ezekiel.prototype.spec3 = function(){

}
Ezekiel.prototype.spec4 = function(){

}

Ezekiel.prototype.inst = function(x = this.px, y = this.py, size = this.size){
player = new Ezekiel(x, y, size);
}
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Ezekiel(canvhalfx, canvhalfy, 20));