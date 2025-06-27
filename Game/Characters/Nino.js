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
this.cooldowns = [0, 0, 0, 0];
this.damagetypemod = [["seduction", 0.6], ["light", 2], ["magic", 0.5], ["dark", 0.1], ["headpat", 999]];//Bro does NOT like his hat being removed. Also, he's a renowned dark wizard, that light weakness caught up to him.
this.hp = 100;
this.damagemod = 1;
this.speed = 10;
this.speedmod = 1;//modifies speed, multiplicately
this.DI = 1;
this.hitstunmod = 1;
this.knockbackmod = 1;
this.height = 6; //POV: canonically short
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
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.px, this.py, this.size)

//movement
if(inputs.includes("shift")){
    this.speed = 5;
}else{
    this.speed = 10;
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
Nino.prototype.spec1 = function(){
//abilities
console.log("working!");
}
Nino.prototype.spec2 = function(){

}
Nino.prototype.spec3 = function(){

}
Nino.prototype.spec4 = function(){

}
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Nino(canvhalfx, canvhalfy, 20));