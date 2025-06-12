function Shojo(startposx, startposy, size){
//startup
this.px = startposx;
this.py = startposy;
this.pz = 0;
this.size = size;

//character poster/character color
this.postColor = "#333333";
this.color = "#99CC99";
this.desc = ["Armor Clad: High resistance to damage, knockback, and hitstun! Is a bit less manueverable, but honestly, you'll be fine.", "1. Pierce: Stab with a lance! Not the usual arc movement, but good damage and range regardless! Has armor frames", "2. Stomp: Hop upwards then stomp the ground, and create a 360 shockwave! Who needs to aim when you can just hit the whole stage?", "3. Run Through: Shojo gains really good armor frames, and runs through everything, dealing damage!", "    This is a stance move, and can be ended by using pierce, or the ability again.", "4. Shield: Raise your shield, defending against virtually all damage! Really slows you down though."];
//game stats
this.cooldowns = [0, 0, 0, 0]
this.damagetypemod = [["pain", 0], ["slashing", 0.2], ["physical", 0.8]];//I dare you, hurt the guy in full steel and tungstun, come on.
this.hp = 100; //EVEN THE FUCKING TANK GETS 100! FUCK YOUR OPINION!!!
this.damagemod = 0.6; //40% tungsten
this.speed = 8; //tungsten is very heavy
this.speedmod = 1;//modifies speed, multiplicately
this.DI = 0.9; //Bro's looking more and more like robot from YOMI hustle
this.hitstunmod = 0.2; //Hitstun, what's that?
this.knockbackmod = 0.2; //You know, Barons are bosses in Fire Emblem Thracia 776... (sued)
this.height = 10; //Big boi
}
Shojo.prototype.listname = function(){
return "Shojo";
}
Shojo.prototype.greeting = function(){
//Needs more bulk tbh...
console.log("Shojo, Baron of a distant land, is ready to defend a universe!")
}
Shojo.prototype.exist = function(){
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.px, this.py, this.size)

//movement
if(inputs.includes("shift")){
    this.speed =4;
    //halfguard when using shift
    this.damagemod = 0.4;
}else{
    this.speed = 8;
    this.damagemod = 0.6;
}
if(inputs.includes(controls[0]) && this.px - this.size>0){
this.px-=this.speed * this.speedmod;
}
if(inputs.includes(controls[1]) && this.px+this.size<canvas.width){
this.px+=this.speed * this.speedmod;
}
if(inputs.includes(controls[2]) && this.py - this.size>0){
this.py-=this.speed * this.speedmod;
}
if(inputs.includes(controls[3]) && this.py + this.size<canvas.height){
this.py+=this.speed * this.speedmod;
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
Shojo.prototype.spec1 = function(){
//abilities
console.log("working!");
}
Shojo.prototype.spec2 = function(){

}
Shojo.prototype.spec3 = function(){

}
Shojo.prototype.spec4 = function(){

}
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Shojo(canvhalfx, canvhalfy, 24));//Armor makes him a tad bigger.