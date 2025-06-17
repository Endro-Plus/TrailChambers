function Magna(startposx, startposy, size){
this.px = startposx;
this.py = startposy;
    this.pz = 0;
    this.size = size;


//card info
this.postColor = "#FF4C00";
this.color = "#FF8B00";
this.desc = ["SMALL AND CUUUUTTTEEEE!!!!! His size may leave him going under attacks that would normally hit! A little easier to knock around.", "Adrenaline: This passively makes him stronger overtime. With enough adrenaline, passive healing is possible!", "1. Nunchuck: swing your nunchuck forwards! Can parry most projectiles.", "    parried projectiles are reflected as a high damage beam!","    While sliding, this becomes a contact damage move with extremely high damage, but a lot of recovry on miss! This ends slide stance, hit or miss.", "2. Shuriken: Standard issue projectile. Simple yet effective","    Shurikens thrown while sliding are faster, and auto-aim towards nearby shurikens or the boss.", "3. Slide: Move incredibly fast in a single direction, and enter sliding stance! Exit sliding stance if already in it.", "     While sliding, you're lower to the ground, and your moves are replaced with higher damage ones!", "This is at the cost of parrying and mobility, as you cannot turn while sliding", "4. Block: Defend yourself. Has 8 frames worth of parry frames, and blocks for as long as you hold it", "  If you're sliding, this instead has you dash back and forth once, quickly. This variant has immunity frames, but may leave you vulnerable near the end."];
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

//hitboxes
this.chuckbox = new hitbox(0, 0, this.pz+1, this.height - 1, 40);
this.chuckbox.disable();
this.chuckbox.immunityframes(5);
this.autoaim = new hitbox(0, 0, this.pz+1, this.height - 1, 175);
this.autoaim.disable();

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

}else if(this.hp <=0 ){
    //play the death anmiation, then call off
    

for(;this.adrenaline > 9000;this.adrenaline-=1800){
    //you fought a boss for 5 minutes... honestly impressive
    //lose 1 minute worth of adrenaline stats for every hp below 0
    this.hp++;
    if(this.hp > 0){
        break;
    }

}


    
    if(this.hp <= 0){
    this.death();
    }
    return;
}else{
    //if hp is between 0 and 100, apply health regen
    this.hp+=this.regen;
    if(this.hp > 100){
        this.hp = 100;
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
if(this.iframe == true && this.cooldowns[2] < 1){
this.cooldowns[2] = 1;//no defensive options while immune!
}

//adrenaline shenanigins
if(!charezmode()){
this.adrenaline++
//no free adrenaline for hard mode!
}
//damage is always being increased
this.dmgboost = this.adrenaline/900 //roughly +1 damage every 30 seconds (there is no cap for this)
//defense is always being incerased
this.defensebonus = this.adrenaline/450//roughly 1 damage negated every 15 seconds (damage negated by defense can only go to a minimum of 1 damage. other than that, no limits)

//defense is applied before damagemod
if(this.defensebonus > 10 && !charezmode()){
    this.defensebonus = 10;//there's a defense cap on hard mode only!
}
if(this.adrenaline > 2700){
    //passive healing and speed bonus!
    this.regen = (this.adrenaline - 2700)/900 // +1 health regen every 30 seconds
    this.speedbonus = (this.adrenaline - 2700)/450 //+1 speed every 15 seconds
    if(this.regen > 0.5 && !charezmode()){
        this.regen = 0.5;//cap at 0.5 on hard mode
    }else if(this.regen > 3){
        this.regen = 3;//cap at 3 hp regen
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
        enemies[i].hit(9 + this.dmgboost, ['physical', 'bludgeoning'], [5 * this.facing[0], 5 * this.facing[1]], 20);
        this.chuckbox.grantimmunity(i);
        this.cooldowns[0]-=3;
    }
    }
    //for parrying projectiles
        for(let i = 0 ; i < projectiles.length ; i++){
            if(this.chuckbox.scanproj(i) && typeof projectiles[i].lifetime == "number"){
                //PARRY THAT SHIT!
                projectiles[i].lifetime = 0;
                
                this.cooldowns[0] = 0;//parry chain?
                this.cooldowns[2] = 0;//instantly start sliding again!
                
            projectiles.push(new ParryProj(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], (charezmode())? 18:12, (6 * this.facing[0]),6 * this.facing[1], 2));
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
        this.px -= (this.speedmax + this.speedbonus) * this.facing[0] * 2;
        this.py -= (this.speedmax + this.speedbonus) * this.facing[1] * 2;
        this.adrenaline += 1;//essentially double adrenaline gain
        if (timeplayed % 7 == 0) {
            projectiles.push(new Slidedust(canvhalfx + this.playershift[0] + random(-this.size, this.size), canvhalfy + this.playershift[1] + random(-this.size, this.size)))
        }
        this.height = 2;
        if(arena.pleave()){
            this.sliding = false;
            //no sliding through the border!
        }

    } else {
        //backsway movement
        this.px -= (this.speedmax + this.speedbonus) * this.facing[0] * (this.sway + 2);
        this.py -= (this.speedmax + this.speedbonus) * this.facing[1] * (this.sway + 2);

    }
//lower all cooldowns
for(let i = 0; i < this.cooldowns.length ; i++){
    this.cooldowns[i]--;
}
//attacks

if(this.cooldowns[0] <= 0 && inputs.includes(controls[4])){
    this.spec1();
}
if(this.cooldowns[1] <= 0 && inputs.includes(controls[5])){
    this.spec2();
}
if(this.cooldowns[2] <= 0 && inputs.includes(controls[6]) && this.canslide){
    this.spec3();
    this.canslide = false;
}
if(this.cooldowns[3] <= 0 && inputs.includes(controls[7])){
    this.spec4();
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
        this.cooldowns[0] = 2;
        this.cooldowns[1] = 2;
        this.cooldowns[2] = 2;
        if (this.sway < -2) {
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
Magna.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
        //handle damage dealt
        //on parry
        if(this.blocking < 8 && this.blocking != -1){
            //PARRIED!
            this.adrenaline+=150;//5 seconds of adrenaline
            this.immunityframes = 45;//OP PARRY IK
            this.blocking = -1;
            for(let i = 0 ; i < 5 ; i++){
                projectiles.push(new Parrypart(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1]));
            }
            return;


        }else if(this.blocking > 7){
            //only a defense...
            this.blocking+=hitstun/2;
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
            enemies[damagetype[damagetype.length - 1]].hit(69 + this.dmgboost*2, ["contact"], [30*this.facing[0], 30*this.facing[1]], 75);
            this.showchuck = -9;//no need for giving the player hitstun now!
            this.sliding = false;
            this.immunityframes = 15;
            this.adrenaline+=450;//adds 15 seconds worth of adrenaline

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
        var dmg = damage * this.damagemod;
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
            if(charezmode() && inputs.includes(controls[7]) && this.hitstun < 10){
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

Magna.prototype.spec1 = function(){
//abilities
this.showchuck = 4;
this.cooldowns[2] = this.showchuck;
this.cooldowns[0] = 9;
if(this.sliding){
    this.immunityframes = 0;
    //can't be immune while going for that palm!
}
}
Magna.prototype.spec2 = function(){
    if(this.sliding == true){
        let thrown = false;
        this.autoaim.move(canvhalfx, canvhalfy);
        for(let i = 0 ; i < projectiles.length ; i++){
            //aim at shurikens
        if(this.autoaim.scanproj(i)){

        
            let dx = (projectiles[i].x + player.px - projectiles[i].shift[0] + projectiles[i].mx * 2) - (canvhalfx);
            let dy = (projectiles[i].y + player.py - projectiles[i].shift[1] + projectiles[i].my * 2) - (canvhalfy);
            let magnitude = Math.sqrt(dx * dx + dy * dy);
            velocityX = (dx / magnitude) * 50;
            velocityY = (dy / magnitude) * 50;
            projectiles.push(new Shuriken(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, velocityX, velocityY));
            thrown = true;
            break;
        }
        }
        if(thrown == false){
            //aim at bosses
            for(let i = 0 ; i < enemies.length ; i++){
            
        if(this.autoaim.checkenemy(i)){

        
            let dx = (enemies[i].x + player.px - enemies[i].shift[0]) - (canvhalfx);
            let dy = (enemies[i].y + player.py - enemies[i].shift[1]) - (canvhalfy);
            let magnitude = Math.sqrt(dx * dx + dy * dy);
            velocityX = (dx / magnitude) * 50;
            velocityY = (dy / magnitude) * 50;
            projectiles.push(new Shuriken(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, velocityX, velocityY));
            thrown = true;
            break;
        }
        }
    
        }
        if(thrown == false){
            //just throw it the way you're facing
            projectiles.push(new Shuriken(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, (50 * this.facing[0]),50 * this.facing[1]));
        }
        projectiles[projectiles.length - 1].bounces = 1;//enable the ability for the shurikens to bounce
    }else{
projectiles.push(new Shuriken(canvhalfx + this.playershift[0], canvhalfy + this.playershift[1], 12, (15 * this.facing[0]),15* this.facing[1]));
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

function Shuriken(x, y, size, mx, my){
    this.name = "Shuriken";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.lifetime = 150;
    this.bounces = 0;
    this.delay = 0;
    this.origin = [];
    this.endpoint = 0;
    this.destoy = false;
}
Shuriken.prototype.dealdamage = function(){
    for(let i = 0 ; i < enemies.length ; i++){
    if(this.hitbox.checkenemy(i)){
        enemies[i].hit(7 + player.dmgboost + (this.bounces), ["physical", "slashing"]);
        if(this.bounces < 2){
        return "delete";//go through enemeis if bouncing!
        }
    }
}
}
Shuriken.prototype.exist = function(){
    
    if(this.lifetime != null){
    this.lifetime--;
    }
    this.hitbox.enable();
   
    screen.fillStyle = "#AAA";
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
    this.x+=this.mx;
    this.y+=this.my;

    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    //console.log((this.x - (canvhalfx + player.playershift[0])) + " " + (this.y - (canvhalfx + player.playershift[1])));
    //console.log(arena.leavedir(this.x, this.y, this.size))
    if(this.lifetime != null && this.lifetime < 0){
        console.log(this.lifetime)
        return "delete";
    }
    //hitting the player
    //console.log(en);
    if(this.dealdamage() == "delete"){
        return "delete";
    };
    
    for(let i = 0 ; i < projectiles.length && this.bounces == 1; i++){
        //this will not run if the shuriken cannot bounce
        if(projectiles[i].name == "Shuriken" && projectiles[i].hitbox.id != this.hitbox.id && this.hitbox.scanproj(i)){
            /*This can only ricochet off of other shurikens, it cannot be itself, and it has to actually hit something*/
            //I swear this isn't V1!
            this.name = "Beam2";
            console.log(this.hitbox.id + " " + projectiles[i].hitbox.id);
            this.lifetime = null;//now this is unparriable
            this.bounces +=1;
            projectiles[i].lifetime = 0;
            this.origin = [this.x, this.y];
            this.destroy = false;
            break;


        }
    }

    for(let i = 0 ; i < projectiles.length && this.bounces > 1 && this.bounces % 1 == 0; i++){
        if(this.delay > 0){
            //just bounce back and forth
            this.x = this.origin[0];
            this.y = this.origin[1];
                for(let x = 0 ; x < this.endpoint ; x++){
                    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
                    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
                    this.x += this.mx;
                    this.y += this.my;
                    this.dealdamage();

                }
                this.delay--;
                break;//no need to loop this
        }
        
        this.destroy = true;
        if(projectiles[i].name != "Shuriken"){
            //don't even bother with this
            continue;
        }
        this.destroy = false;
        if(this.delay < 1){
            this.endpoint = 0;
            this.origin = [this.x, this.y];
            let dx = (projectiles[i].x + player.px - projectiles[i].shift[0]) - (this.x + player.px - this.shift[0]);
            let dy = (projectiles[i].y + player.py - projectiles[i].shift[1]) - (this.y + player.py - this.shift[1]);
            let magnitude = Math.sqrt(dx * dx + dy * dy);
            this.mx = (dx / magnitude) * 3;
            this.my = (dy / magnitude) * 3;
            let e = 0;
            console.log(this.name)
            while(!this.hitbox.scanproj(i) && e < 400){
                //circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
                this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
                this.hitbox.z = -5;
                this.hitbox.height = 999;
                this.x+=this.mx;
                this.y+=this.my;
                this.endpoint++;
                //this.dealdamage();
                e++;
            }
            if(e == 400){
                this.destoy = true;
                this.x = this.origin[0];
                this.y = this.origin[1];
                this.delay = 0;
            }else{
            this.bounces+=1;
            projectiles[i].lifetime = 0;
            
            this.delay = 3;
            }
        }
    }
    if(this.destroy){
        
        if(this.delay > 0){
            //just bounce back and forth
            this.x = this.origin[0];
            this.y = this.origin[1];
                for(let x = 0 ; x < this.endpoint ; x++){
                    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
                    //this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
                    this.hitbox.disable();
                    this.hitbox.move(9999, 9999);
                    this.hitbox.z = 999;
                    this.x += this.mx;
                    this.y += this.my;
                    //this.dealdamage();

                }
                this.delay--;
                if(this.delay < 1){
                    return "delete";//finally done!
                }
                return;
        }else{
        //go to the first enemy, usually the main boss, and fucking destroy them!
        if(enemies.length == 0){
            return "delete";//there is no enemies
        }
        this.origin = [this.x, this.y];
        this.endpoint = 0;
        this.bounces*=1.5;//bonus damage!
            let dx = (enemies[0].x + player.px - enemies[0].shift[0]) - (this.x + player.px - this.shift[0]);
            let dy = (enemies[0].y + player.py - enemies[0].shift[1]) - (this.y + player.py - this.shift[1]);
            let magnitude = Math.sqrt(dx * dx + dy * dy);
            this.mx = (dx / magnitude) * 12;
            this.my = (dy / magnitude) * 12;
            let e = 0
            console.log("second hit")
            while(!this.hitbox.checkenemy(0) && e < 400){
                this.dealdamage();
                circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
                this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
                this.x+=this.mx;
                this.y+=this.my;
                this.endpoint++;
                
                e++
            }
            //if(e != 400){
            enemies[0].hit(9 + player.dmgboost + (this.bounces), ["magic"]);
            //}
            this.delay = 5;
            if(this.bounces % 1 != 0){
            this.bounces+=0.1;
            }
    }
}
}

function ParryProj(x, y, size, mx, my, delay = 0){
    this.name = "PARRIED";
    this.x = x;
    this.y = y;
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
                enemies[sti].hit(24+player.dmgboost, ["magic"], [this.mx * 2, this.my * 2], 15);
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