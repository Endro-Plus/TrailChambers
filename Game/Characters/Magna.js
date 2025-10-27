/*
hard mode changes:
    defense is now limited
    adrenaline no longer is naturally gained
    the projectile parry hitscan is smaller
    you can no longer block in hitstun
    the limits for health regen is more strict
*/
function Magna(startposx, startposy, size){
this.px = startposx;
this.py = startposy;
    this.pz = 0;
    this.size = size;


//card info
this.postColor = "#FF4C00";
this.color = "#FF8B00";
this.desc = ["SMALL AND CUUUUTTTEEEE!!!!! His size may leave him going under attacks that would normally hit! A little easier to knock around.",
     "Adrenaline: This passively makes him stronger overtime. With enough adrenaline, passive healing is possible!",
      "1. Nunchuck: swing your nunchuck forwards! Can parry most projectiles. Can interrupt attacks",
       "    parried projectiles are reflected as a high damage beam, parrying hitscans makes this beam deal critical damage!!!",
       "    While sliding, this becomes a contact damage move with extremely high damage, but a lot of recovry on miss! This ends slide stance, hit or miss. Also can interrupt attacks",
        "2. Shuriken: Standard issue projectile. Simple yet effective",
        "    Shurikens thrown while sliding become hitscans. They bounce off of other shurikens and enemies! Can be parried with nunchuck if no other targets are available!",
         "3. Slide: Move incredibly fast in a single direction, and enter sliding stance! Exit sliding stance if already in it.",
          "     While sliding, you're lower to the ground, and your moves are replaced with higher damage ones!",
           "This is at the cost of parrying and mobility, as you cannot turn while sliding",
            "4. Block: Defend yourself. Has 8 frames worth of parry frames, and blocks for as long as you hold it",
             "  If you're sliding, this instead has you dash back and forth once, quickly. This variant has immunity frames, but may leave you vulnerable near the end."];
//game stats
this.cooldowns = [0, 0, 0, 0];
this.playershift = [0, 0];//shift the position of the player
this.damagetypemod = [];//POV: you're just a cute lil' guy.
this.hp = 100;
this.damagemod = 1; //And Simia is weaker than a literal fucking child why???
this.speed = 12; //SpEeD
this.speedmax = 12;
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = []
this.DI = 2; //Bro is definitely not just better Simia I swear!
this.hitstunmod = 1;
this.knockbackmod = 1.4; //Both a blessing, and a curse!
this.height = 5;//Smol boi
this.facing = [1, 0, -Math.PI/2];//facing x, facing right, facing orientation.
this.iframe = false;
this.hitstun = 0;
this.knockback = [];
this.won = false;
//special abilities!
this.adrenaline = 0;
this.dmgboost = 0;
this.regen = 0;
this.speedbonus = 0;
this.defensebonus = 0;
this.sliding = false;
this.sway = 0;
this.blocking = -1;
this.showchuck = 0;//this variable applies for both using nunchuck, and palm strike\
this.canslide = true;//holding the slide button does nothing
this.immunityframes = 0;
this.shurikenspeed = 20;
this.charge = 30;
//hitboxes
this.chuckbox = new hitbox(0, 0, this.pz+1, this.height - 1, 40);
this.chuckbox.disable();
this.chuckbox.immunityframes(5);

}
Magna.prototype.listname = function(){

return "Magna";
}
Magna.prototype.greeting = function(){
//How cute!!!
console.log("Magna, cute lil' child, is ready to fight a deity!")
}
Magna.prototype.exist = function(){
//HP check
//this.autoaim.showbox();
if(this.hp > 100){
    //I'm generous enough to give you a BIT of extra power for a set time
    this.hp-=0.15;
    if(this.hp <= 100){
        this.hp = 100;
        //yes, I'm aware this is effectively a free defense
    }

}else if(this.hp <=0 || this.won == true){
    //play the death anmiation, then call off
    
if(this.won == false){
for(;this.adrenaline > 9000;this.adrenaline-=1800){
    //you fought a boss for 5 minutes... honestly impressive
    //lose 1 minute worth of adrenaline stats for every hp below 0
    this.hp++;
    if(this.hp > 0){
        break;
    }

}
}

    
    if(this.hp <= 0|| this.won == true){
    if(this.won == false){
        this.death();
    }else{
        this.win()
    }
    }
    return;
}else{
    //if hp is between 0 and 100, apply health regen
    if(this.hp < 100){
    this.hp+=this.regen;
    
    if(this.hp > 100){
        this.hp = 100;
    }
}


}
timeplayed++;

//iframes
if(this.immunityframes > 0){
    this.immunityframes--;
    this.iframe = true;
    if(this.immunityframes == 0){
        this.iframe = false;
    }
}
if(this.iframe == true && this.cooldowns[2] < 2){
this.cooldowns[3] = 2;//no defensive options while immune!
}

//adrenaline shenanigins
if(charezmode()){
this.adrenaline++
//no free adrenaline for hard mode!
}
//damage is always being increased
this.dmgboost = this.adrenaline/450 //roughly +1 damage every 15 seconds (there is no cap for this)
//defense is always being incerased
this.defensebonus = this.adrenaline/900//roughly 1 damage negated every 30 seconds (damage negated by defense can only go to a minimum of 1 damage. other than that, no limits)

//defense is applied before damagemod
if(this.defensebonus > 10 && !charezmode()){
    this.defensebonus = 10;//there's a defense cap on hard mode only!
}
if(this.adrenaline > 2700){
    //passive healing and speed bonus!
    this.regen = (this.adrenaline - 2700)/900 // +1 health regen every 30 seconds
    this.speedbonus = (this.adrenaline - 2700)/450 //+1 speed every 15 seconds
    if(this.regen > 0.06 && !charezmode()){
        this.regen = 0.06;//cap at 0.06 on hard mode (about 2 hp a second)
    }else if(this.regen > 0.2){
        this.regen = 0.2;//cap at 0.2 hp regen (about 6 a second)
    }
    
    if(this.speedbonus > this.speedmax){
        this.speedbonus = this.speedmax;//cap at speedmax (about double the base max speed)
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
if(this.hp <= 100){
//under max
screen.fillStyle = "#F00";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
if(this.immunityframes > 0){
screen.fillStyle = "#00F";
}else{
screen.fillStyle = "#0F0";
}
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
}else{
//over max
if(this.immunityframes > 0){
screen.fillStyle = "#00F";
}else{
screen.fillStyle = "#0F0";
}
screen.fillRect(canvhalfx - 25 - (this.hp - 100) * 0.25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
screen.fillStyle = "#00F";
screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
}
//chuck!
this.chuckbox.updateimmunity();
        if(this.x + player.px > canvhalfx + 45){
            this.x-=this.speed * this.speedmod;
            this.facing = [-1, 0];
        }else if (this.x + player.px < canvhalfx - 45){
            this.x+=this.speed * this.speedmod;
            this.facing = [1, 0];
        }if(this.y + player.py < canvhalfy - 45){
            this.y+=this.speed * this.speedmod;
            this.facing = [0, 1];
        }else if (this.y + player.py > canvhalfy + 45){
            this.y-=this.speed * this.speedmod;
            this.facing = [0, -1];
        }
        // attack direction
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

    if(this.showchuck > 0 && this.sliding == false){

            this.showchuck--;
            screen.beginPath();
            screen.fillStyle = "#4d1a00";
            screen.arc(canvhalfx, canvhalfy, this.chuckbox.size, this.facing[2], this.facing[2] + Math.PI);
            screen.fill();
            screen.closePath();

            //for damage
            this.chuckbox.reassign(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.pz, 2, this.chuckbox.size);
    for(let i = 0 ; i < enemies.length ; i++){
    if(this.chuckbox.checkenemy(i) && this.chuckbox.enemyhalf(i, this.facing)){
        enemies[i].hit(10 + this.dmgboost, ['physical', 'bludgeoning', "interrupt"], [5 * this.facing[0], 5 * this.facing[1]], 20);
        this.chuckbox.grantimmunity(i);
        this.cooldowns[0]-=3;
    }
    }
    //for parrying projectiles
        for(let i = 0 ; i < projectiles.length ; i++){
            if(this.chuckbox.scanproj(i) && typeof projectiles[i].lifetime == "number"){
                //PARRY THAT SHIT!
                projectiles[i].lifetime = 0;
                if(projectiles[i].name != "Shuriken"){
                    this.adrenaline+=450;//+15 seconds of adrenaline for hitting something sick!
                }
                this.cooldowns[0] = 0;//parry chain?
                this.cooldowns[2] = 0;//instantly start sliding again!
                
            projectiles.push(new ParryProj(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], (charezmode())? 18:12, (6 * this.facing[0]),6 * this.facing[1], 2, projectiles[i].type));
        }
    }
}else if(this.showchuck > 0){
    this.showchuck--;
    //da love tap... but recovery only
    this.cooldowns[3] = this.showchuck;
    this.cooldowns[2] = this.showchuck;
    this.cooldowns[1] = this.showchuck;
    if(this.showchuck == 0){
//whiff
this.hitstun = 30;
this.knockback = [-(this.speedmax + this.speedbonus) * this.facing[0] * 2, -(this.speedmax + this.speedbonus) * this.facing[1] * 2];
this.sliding = false;
this.showchuck = -5;

    }

}
            //hitstun
            if(this.hitstun > 0){
                this.hurt();
                return;
            }
            //movement
    if (this.sliding == false && this.sway == 0) {
        //standard movement
        this.height = 5;
        if (inputs.includes("shift")) {
            this.speed = (this.speedmax + this.speedbonus) / 2;
        } else {
            this.speed = this.speedmax + this.speedbonus;
        }
        if (inputs.includes(controls[0]) && !arena.pleavedir().includes('l')) {
            this.px += this.speed * this.speedmod;
            this.facing[0] = -1;
            if (!inputs.includes(controls[2]) && !inputs.includes(controls[3])) {
                this.facing[1] = 0;
            }
        }
        if (inputs.includes(controls[1]) && !arena.pleavedir().includes('r')) {
            this.px -= this.speed * this.speedmod;
            this.facing[0] = 1;
            if (!inputs.includes(controls[2]) && !inputs.includes(controls[3])) {
                this.facing[1] = 0;
            }
        }
        if (inputs.includes(controls[2]) && !arena.pleavedir().includes('u')) {
            this.py += this.speed * this.speedmod;
            this.facing[1] = -1;
            if (!inputs.includes(controls[0]) && !inputs.includes(controls[1])) {
                this.facing[0] = 0;
            }
        }
        if (inputs.includes(controls[3]) && !arena.pleavedir().includes('d')) {
            this.py -= this.speed * this.speedmod;
            this.facing[1] = 1;
            if (!inputs.includes(controls[0]) && !inputs.includes(controls[1])) {
                this.facing[0] = 0;
            }
        }
    } else if (this.sway == 0) {
        //when sliding
        this.height = 2;
        if(arena.pleave()){
            this.sliding = false;
            //no sliding through the border!
        }else{
        this.px -= (this.speedmax + this.speedbonus) * this.facing[0] * 2;
        this.py -= (this.speedmax + this.speedbonus) * this.facing[1] * 2;
        this.adrenaline += 1;//essentially double adrenaline gain
        if (timeplayed % 7 == 0) {
            projectiles.push(new Slidedust(canvhalfx + this.playershift[0] + random(-this.size, this.size), canvhalfy + this.playershift[1] + random(-this.size, this.size)))
        }
    }

    } else {
        //backsway movement
        this.px -= (this.speedmax + this.speedbonus) * this.facing[0] * (this.sway + 2);
        this.py -= (this.speedmax + this.speedbonus) * this.facing[1] * (this.sway + 2);

    }
//lower all cooldowns
for(let i = 0; i < this.cooldowns.length ; i++){
    if(this.blocking > -1){
        //you can still use your abilities, just not as fast
        this.cooldowns[i]-=0.5;
    }else{
    this.cooldowns[i]--;
    }
}
//attacks

if(this.cooldowns[0] <= 0 && inputs.includes(controls[4])){
    this.spec1();
}
if(this.charge < 30 ||this.cooldowns[1] <= 0 && inputs.includes(controls[5]) ){
    this.charge--;
    this.spec2();
    
}
if(this.cooldowns[2] <= 0 && inputs.includes(controls[6]) && this.canslide){
    this.spec3();
    this.canslide = false;
}
if(this.cooldowns[3] <= 0 && inputs.includes(controls[7])){
    this.spec4();
    }
    //using shuriken charge
    if(!inputs.includes(controls[5])){
        //this.charge--;
        this.charge = 30;
    }
        
    
    if (!inputs.includes(controls[7]) && this.blocking == 8 || this.blocking == -1) {
        this.blocking = -1;//blocking is -1 for as long as you aren't holding the button
        //no backing out of punishments!
    }
if(this.canslide == false && !inputs.includes(controls[6])){
    //so holding the slide button doesn't immediately cancel slide
    this.canslide = true;

    }
    //blocking
    if (this.blocking != -1 && this.blocking < 8) {
        this.blocking++;
        this.knockback = [0 , 0];
        //console.log(this.blocking)
    } else if (this.blocking > 8) {
        this.blocking--;
        this.px+=this.knockback[0];
        this.py+=this.knockback[1];
        if(arena.pleave()){
            this.knockback = [0, 0];
            if(arena.pleavedir().includes("l")){
                this.px = arena.w - this.size - 3;
            }else if(arena.pleavedir().includes("r")){
                this.px = -arena.w + this.size + 3;
            }
            if(arena.pleavedir().includes("u")){
                this.py = arena.h - this.size - 3;
            }else if(arena.pleavedir().includes("d")){
                this.py = -arena.h + this.size + 3;
}
        }
        screen.fillStyle = "grey";
        circle(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.size+3, true, false);
    }
    
    if (this.blocking > 7) {
        //only slow down if it makes it this far
        screen.strokeStyle = "#eee";
        circle(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], this.size+3, true, false);
        this.speedcause.push(["blocking", 1, 0.5]);
    }
    //backsway
    if (this.sway < 0) {
        this.sway += 0.2;
        this.cooldowns[3] = 10;
        if(this.sway < -3){
        //cancel backsway into palm strike!
        this.cooldowns[0] = 2;
        }
        this.cooldowns[1] = 2;
        this.cooldowns[2] = 2;
        if (this.sway < -1.2) {
            this.immunityframes = 2;
        }
            
        
    } else {
        this.sway = 0;
    }
}



Magna.prototype.hurt = function(){
this.hitstun--;
if(this.sliding == true){
    //cancel sliding
    this.sliding = false;
    this.cooldowns[2] = 30;
}
console.log(this.hitstun);
this.px += this.knockback[0];
this.py += this.knockback[1];
this.knockback[0]*=0.9;
this.knockback[1]*=0.9;
if(arena.pleavedir().includes("l") || arena.pleavedir().includes('r')){
this.hitstun += 3;
if(!charezmode()){
this.hit(1, ["physical"]);//slamming into walls hurt, but just a little for this little one
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
this.hit(1, ["physical"]);//slamming into walls hurt, but just a little for this little one!
}
this.knockback[1]*=-0.5;
if(arena.pleavedir().includes("u")){
    this.py = arena.h - this.size - 3;
}else{
    this.py = -arena.h + this.size + 3;
}
}

}
Magna.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0, DImod = 1){
        //handle damage dealt
        if(this.iframe){
            return;
        }
        //on parry
        if(this.blocking < 8 && this.blocking != -1 && !damagetype.includes("softblock")){
            //PARRIED!
            parried = true;
            this.adrenaline+=150;//5 seconds of adrenaline
            this.immunityframes = 45;//OP PARRY IK
            this.blocking = -1;
            for(let i = 0 ; i < 5 ; i++){
                projectiles.push(new Parrypart(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1]));
            }
            return;


        }else if(this.blocking > 7 && !damagetype.includes("softblock") || this.blocking < 8 && this.blocking != -1 && damagetype.includes("softblock")){
            //only a defense... "softblock" guardbreaks here! parried softblock moves lead to only blocks 
            this.blocking+=Math.round(hitstun/2);
            if(damagetype.includes("softblock")){
                this.blocking+=20;
                damage = 0;//no damage at least!
            }
            if(this.blocking > 60){
                this.blocking = 60;
            }
            
            this.hitstun = 0;
            hitstun = 0;
            //knockback[0]*=2;
            //knockback[1]*=2;
            damage/=2;
            this.adrenaline+=damage;//give a small boost


        }
        //palmstrike cheese
        if(this.sliding && this.showchuck > 0 && damagetype[0] == "contact"){
            //da love tap
            enemies[damagetype[damagetype.length - 1]].hit(69 + this.dmgboost*2, ["contact", "interrupt"], [30*this.facing[0], 30*this.facing[1]], 75);
            this.showchuck = -9;//no need for giving the player hitstun now!
            this.sliding = false;
            this.immunityframes = 15;
            this.adrenaline+=450;//adds 15 seconds worth of adrenaline

            return;

        }
        //immunity to hitscans if you would've parried it
        if(damagetype.includes("hitscan") && this.showchuck > 0){
            this.immunityframes = 50;
            this.adrenaline+=900;//+30 seconds for absolutely shredding that!
            this.hp+=10;//ngl, you deserve that!
            return;
        }
        //apply defense bonus
        if(damage > 1){
            //don't negate damage if it's under 1 already
        damage-=this.defensebonus;
        if(damage < 1){
            damage = 1;
        }
    }
        var dmg = damage * ((damagetype.includes("true"))? 1:this.damagemod);
        for(let i = 0 ; i < this.damagetypemod.length ; i++){
            if(damagetype.includes(this.damagetypemod[i][0])){
                dmg *= this.damagetypemod[i][1];
            }
        }
        //adrenaline increased based on damage taken
        this.adrenaline+=dmg*2;
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
            if(charezmode() && inputs.includes(controls[7]) && this.hitstun < 20){
                //easy mode only! Block early!
                this.blocking = 10;
            }
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
Magna.prototype.death = function(){
projectiles = [];
summons = [];
enemies = [];
bossbarmode = 0;
//game over man! Game over!

//draw the character, stationary
screen.fillStyle = this.color;
circle(canvhalfx, this.size + 33, this.size)

//here is some statistics
screen.fillStyle = "#FFF";
screen.textAlign = "center";
screen.font = "25px Times New Roman";
screen.fillText("Magna Venandi", canvhalfx, 20);//char name
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
Magna.prototype.win = function(){
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
screen.fillText("Magna", canvhalfx, 40);//char name
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

Magna.prototype.spec1 = function(){
//abilities
this.showchuck = 4;
this.cooldowns[2] = this.showchuck;
this.cooldowns[0] = 9;
if(this.sliding){
    this.immunityframes = -1;
    this.iframe = false;
    if(this.sway < 0){
        //backsway palmstrike has additional active frames, and immediately ends backsway
        this.showchuck = 8;
        this.sway = 0;
    }
    
    //can't be immune while going for that palm!
}else{
    if(this.cooldowns[1] < 4){
    //skillbased shuriken parrying
    this.cooldowns[1] = 4;
}
}
}
Magna.prototype.spec2 = function(){
    if(this.sliding == true){
        projectiles.push(new Shuriken_beam(canvhalfx + this.playershift[0], canvhalfy + this.playershift[0]));
        this.cooldowns[1] = 10;
        this.charge = 30;
    }else{
    if(inputs.includes(controls[5]) && this.charge >= 0){
        for(let i = 0 ; i < this.cooldowns.length ; i++){
            if(this.cooldowns[i] < 2){
                //no using items while charging
                this.cooldowns[i] = 2;
            }
        }
        screen.fillStyle = "#fff";
        circle(canvhalfx, canvhalfy+this.size+8, 3)
        if(this.charge <=20){
            //indicators
            
            circle(canvhalfx + this.size + 3, canvhalfy+this.size, 3)
            circle(canvhalfx - this.size - 3, canvhalfy+this.size, 3)
            if(this.charge <= 10){
                circle(canvhalfx + this.size + 8, canvhalfy, 3)
                circle(canvhalfx - this.size - 8, canvhalfy, 3)
            }
        }

    }else{
        if(this.charge <=20){
            //shoot 2 more projectiles
                    if(Math.abs(this.facing[0]) + Math.abs(this.facing[1]) <= 1){
                    projectiles.push(new playerproj("Shuriken", canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, 
                        (this.shurikenspeed-1) * ((this.facing[0] != 0)? this.facing[0] : this.facing[0]-0.25),
                        (this.shurikenspeed-1) * ((this.facing[1] != 0)? this.facing[1] : this.facing[1]-0.25), "grey", 18, 120, ["physical", "proj", "slashing"]));
                        
                    }else{
                        
                    projectiles.push(new playerproj("Shuriken", canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, 
                        (this.shurikenspeed-1) * ((this.facing[0] == this.facing[1])? this.facing[0]+0.25 : this.facing[0]-0.25),
                        (this.shurikenspeed-1) * ((this.facing[1] == this.facing[0])? this.facing[1]-.25 : this.facing[1]-0.25), "grey", 18, 120, ["physical", "proj", "slashing"]));
                    }
                    if(Math.abs(this.facing[0]) + Math.abs(this.facing[1]) <= 1){
                    projectiles.push(new playerproj("Shuriken", canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, 
                        (this.shurikenspeed-1) * ((this.facing[0] != 0)? this.facing[0] : this.facing[0]+0.25),
                        (this.shurikenspeed-1) * ((this.facing[1] != 0)? this.facing[1] : this.facing[1]+0.25), "grey", 18, 120, ["physical", "proj", "slashing"]));
                        
                    }else{
                        
                    projectiles.push(new playerproj("Shuriken", canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, 
                        (this.shurikenspeed-1) * ((this.facing[0] == this.facing[1])? this.facing[0]-0.25 : this.facing[0]+0.25),
                        (this.shurikenspeed-1) * ((this.facing[1] == this.facing[0])? this.facing[1]+.25 : this.facing[1]+0.25), "grey", 18, 120, ["physical", "proj", "slashing"]));
                    }

                    if(this.charge <= 10){
                        //shoot the last 2 projectiles
                        if(Math.abs(this.facing[0]) + Math.abs(this.facing[1]) <= 1){
                    projectiles.push(new playerproj("Shuriken", canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, 
                        (this.shurikenspeed-3) * ((this.facing[0] != 0)? this.facing[0] : this.facing[0]-0.5),
                        (this.shurikenspeed-3) * ((this.facing[1] != 0)? this.facing[1] : this.facing[1]-0.5), "grey", 18, 120, ["physical", "proj", "slashing"]));
                        
                    }else{
                        
                    projectiles.push(new playerproj("Shuriken", canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, 
                        (this.shurikenspeed-3) * ((this.facing[0] == this.facing[1])? this.facing[0]+0.5 : this.facing[0]-0.5),
                        (this.shurikenspeed-3) * ((this.facing[1] == this.facing[0])? this.facing[1]-.5 : this.facing[1]-0.5), "grey", 18, 120, ["physical", "proj", "slashing"]));
                    }
                    if(Math.abs(this.facing[0]) + Math.abs(this.facing[1]) <= 1){
                    projectiles.push(new playerproj("Shuriken", canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, 
                        (this.shurikenspeed-3) * ((this.facing[0] != 0)? this.facing[0] : this.facing[0]+0.5),
                        (this.shurikenspeed-3) * ((this.facing[1] != 0)? this.facing[1] : this.facing[1]+0.5), "grey", 18, 120, ["physical", "proj", "slashing"]));
                        
                    }else{
                        
                    projectiles.push(new playerproj("Shuriken", canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, 
                        (this.shurikenspeed-3) * ((this.facing[0] == this.facing[1])? this.facing[0]-0.5 : this.facing[0]+0.5),
                        (this.shurikenspeed-3) * ((this.facing[1] == this.facing[0])? this.facing[1]+.5 : this.facing[1]+0.5), "grey", 18, 120, ["physical", "proj", "slashing"]));
                    }
                    }

        }
        

        
        if(this.charge > 0){
        projectiles.push(new playerproj("Shuriken", canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, (this.shurikenspeed * this.facing[0]), this.shurikenspeed * this.facing[1], "grey", 18, 120, ["physical", "proj", "slashing"]));
        }else{
        projectiles.push(new playerproj("Shuriken", canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 18, (this.shurikenspeed * this.facing[0]), this.shurikenspeed * this.facing[1], "grey", 24, 120, ["physical", "proj", "slashing"]));

        }
        this.charge = 30;
        this.cooldowns[1] = 10;
    }
if(this.cooldowns[0] < 9 - this.charge/5 && this.charge != 30){
    //skillbased shuriken parrying
    this.cooldowns[0] = Math.floor(9 -  this.charge/5);
    
}    
}
this.cooldowns[1] = 10;
}
Magna.prototype.spec3 = function(){
if(this.sliding == false){
    this.sliding = true;
}else{
    this.sliding = false;
    this.cooldowns[2] = 15;
}
}
Magna.prototype.spec4 = function(){
    if (this.sliding == false && this.blocking < 0) {
        this.blocking = 0;//activate blocking
        this.immunityframes = 0;
        this.iframe = false;
    
    }
    if (this.sliding == true) {
        this.sway = -4;//activate backsway
    }
}

Magna.prototype.inst = function(x = this.px, y = this.py, size = this.size){
player = new Magna(x, y, size);
}
chars.push(new Magna(canvhalfx, canvhalfy, 13));//Literally a small child


//projectiles

function Shuriken_beam(x, y, dmg = 8){
    this.name = "Shuriken beam";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = 12
    //this.facing = [...facing];
    this.type = "hitscan";
    this.hitbox = new hitbox(x, y, 2, this.size/2, this.size);
    this.hitbox.disable();
    this.lifetime = null;
    this.bounces = 5;
    this.dmg = dmg
    this.delay = 0;
    this.origin = [];
    this.endpoint = [];
    this.detectionrange = 750;
    this.memory = [null, null, null]//enemies in memory won't be targetted
}
Shuriken_beam.prototype.findenemy = function(){
    //find a suitable enemy
    let choice = false;
    for(let i = 0 ; i < enemies.length ; i++){
       //console.log(Math.abs(Math.abs(enemies[i].x - enemies[i].shift[0] + enemies[i].y - enemies[i].shift[1])) - (Math.abs(this.x - this.shift[0] +this.y - this.shift[1])))
       
        if(!this.memory.includes(enemies[i]) && Math.abs(enemies[i].x - enemies[i].shift[0] + (enemies[i].y - enemies[i].shift[1])) - Math.abs(this.x - this.shift[0] +(this.y - this.shift[1])) < this.detectionrange){
            if(choice != false){
                choice = (random(0, 1, false) == 0)? choice : enemies[i];
                if(random(0, 100) > 75){
                    break;
                }
            }else{
                choice = enemies[i];
            }
        }
    }
    //console.log(false)
    return choice;

}
Shuriken_beam.prototype.findproj = function(){
    //find the first suitable shuriken projectile
    
    for(let i = 0 ; i < projectiles.length ; i++){
       
        if(projectiles[i].name == "Shuriken" && Math.abs(projectiles[i].x - projectiles[i].shift[0] + (projectiles[i].y - projectiles[i].shift[1])) - Math.abs(this.x - this.shift[0] +(this.y - this.shift[1])) < this.detectionrange){
            return projectiles[i];
        }
        
    }
    return false;

}
Shuriken_beam.prototype.remember = function(r){
    this.memory.push(r);
    this.memory.shift();
    //imagine having a memory like that! how bad could it be!!!
    
}
Shuriken_beam.prototype.dmgup = function(){
    if(this.dmg < 10){
        this.dmg = 18;
    }else if(this.dmg < 36){
        this.dmg+=2;
    }
}
Shuriken_beam.prototype.exist = function(){
    if(this.bounces > 0){
        if(this.delay == 0){
            //TIME TO GO
            this.origin = [this.x - this.shift[0], this.y - this.shift[1]];

            let enemy = this.findenemy()
            let proj = this.findproj();
            if(enemy != false && this.bounces >= 3){
                //only target 1 enemy, then a projectile, unless there's no projectile available
                console.log(enemy != false)
                playerattack = this.name
                enemy.hit(this.dmg + player.dmgboost, ["magic", "slashing", "proj"]);
                if(enemy.knockback == "legacy"){
                    enemy.hitstun = 30;
                }
                this.dmgup();
                this.remember(enemy);
                //this.bounces--;
                this.delay = 3;
                this.endpoint = [enemy.x - enemy.shift[0], enemy.y - enemy.shift[1]];
                
            }else if (proj != false){
                //target the shuriken!
                proj.lifetime = 0;
               
                this.bounces = 5;
                this.delay = 3;
                this.endpoint = [proj.x - proj.shift[0], proj.y - proj.shift[1]];
                this.remember(null);
                 this.dmgup();
            }else if(player.showchuck > 0){
                //Magna will just do it himself!               
                this.bounces = 0.5;
                this.delay = 3;
                this.endpoint = [canvhalfx, canvhalfy];
                this.lifetime = 0;
                this.hitbox.move(canvhalfx, canvhalfy);
                this.hitbox.enable();
                
            }else{
                //no targets?
                if(enemy != false){
                    playerattack = this.name
                enemy.hit(this.dmg + player.dmgboost, ["magic", "slashing", "proj"]);
                if(enemy.knockback == "legacy"){
                    enemy.hitstun = 30;
                }
                this.remember(enemy.name);
                 this.dmgup();
                this.bounces--;
                this.delay = 3;
                this.endpoint = [enemy.x - enemy.shift[0], enemy.y - enemy.shift[1]];
                }else{
                    //no targets... time to die
                return "delete";
                }
            }
            
        }else{
            this.delay--;
            screen.beginPath();
            screen.lineWidth = this.size;
            screen.strokeStyle = "#aaa";
    
            screen.moveTo(this.origin[0]+ player.px, this.origin[1]+ player.py);
            if(this.bounces == 0.5){
                screen.lineTo(this.endpoint[0], this.endpoint[1]);
            }else{
                screen.lineTo(this.endpoint[0]+ player.px, this.endpoint[1]+ player.py);
            }
            
            screen.stroke();
            screen.closePath();
            if(this.delay == 0){
                this.x = this.endpoint[0] + this.shift[0];
                this.y = this.endpoint[1] + this.shift[1];
                this.bounces--;
                if(this.detectionrange > 400){
                    this.detectionrange-=50;
                }
                
            }

        }
    }else{
        //after it runs out of bounces, die out...
        return "delete"
    }

}

function ParryProj(x, y, size, mx, my, delay = 0, parried = null){
    this.name = "PARRIED";
    this.x = x;
    this.y = y;
    this.parried = parried
    this.origin = [this.x, this.y]
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.range = 400
    this.delay = delay;
    this.life = 1;
    this.lifetime = null;//yeah this ain't parriable
    proj_parry.push(parried);
}
ParryProj.prototype.exist = function(){
    
    
   
    
    this.x = this.origin[0];
    this.y = this.origin[1];
    if(this.delay > 0){
        screen.fillStyle = "rgb(213, 217, 221, 0.5)";
        this.delay--;
        circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size * 5)
    }else{
        screen.fillStyle = "rgb(213, 217, 221, " + this.life + ")";
        this.hitbox.enable();
        let breakout = false;
    for(let i = 0 ; i < this.range ; i++){
        this.x+=this.mx;
        this.y+=this.my;
        circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)

        if(this.life == 1){
            this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
            for(let sti = 0; sti < enemies.length ; sti++){
            if(this.hitbox.checkenemy(sti)){
                playerattack = this.name;
                
                enemies[sti].hit(24+player.dmgboost, ["magic", "proj", "hitscan"], [this.mx * 2, this.my * 2], 15);
                if(this.parried == "hitscan"){
                    enemies[sti].hit(100+player.dmgboost, ["CRITICAL"], [this.mx * 2, this.my * 2], 15);
                }
                this.range = i;
                breakout = true
                break;
    }
}
        for(let i = 0 ; i < projectiles.length ; i++){
            //if hitting another shuriken, create a shuriken beam!
            if(projectiles[i].name == "Shuriken" && this.hitbox.scanproj(i)){
                projectiles.push(new Shuriken_beam(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 24));
                projectiles[i].lifetime = 0;

                this.range = i;
                breakout = true
                break;
            }
        }
        }
if(breakout == true){
    break;
}
        

    }
    //console.log(arena.leavedir(this.x, this.y, this.size))
    this.life-=0.1;
    if(this.life <= 0){
        return "delete";
    }
}
    //hitting the player
    //console.log(en);
    
}

//partical (counts as projectile)
function Slidedust(x, y){
    this.name = "Slidedust";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = 4
    this.lifetime = null;
    this.life = 1
}
Slidedust.prototype.exist = function(){
    //all this does is disappear
    screen.fillStyle = `rgb(255, 255, 255, ${this.life})`
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size);
    this.life-=0.05;
    if(this.life < 0){
        return "delete";
    }
}
function Parrypart(x, y) {
    this.name = "particle";
    this.x = x;
    this.y = y;
    this.mx = random(-12, 12);
    this.my = random(-12, 12);
    this.shift = [player.px, player.py];
    this.size = 4
    this.lifetime = null;
    this.life = 1
}
Parrypart.prototype.exist = function () {
    //all this does is disappear, and move!
   
    screen.fillStyle = `rgb(255, 80, 80, ${this.life})`
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size);
    this.x += this.mx;
    this.y += this.my;
    this.life -= 0.2;
    if (this.life < 0) {
        return "delete";
    }
}