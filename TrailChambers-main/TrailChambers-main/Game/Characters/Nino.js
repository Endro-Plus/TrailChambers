function Nino(startposx, startposy, size){
//startup
this.px = startposx;
this.py = startposy;
this.pz = 0;
this.size = size;

//character poster/character color
this.postColor = "#000088";
this.color = "#7700CC";
this.desc = ["The wizard! Many strong projectiles that are hard to miss, but not many mobility options. Also, don't tell him this, but he's kinda short", "1. Magic Missile: Shoot a small projectile that homes onto a nearby boss!", "2. Infernal Aegis: Slow down a bit, but gain armor frames. Upon using this move again, burn your surroundings with dark flames!", "The flames leave miasma, dealing damage over time!", "   Armor can be broken, which leads to taking more damage than before, and the follow up auto-triggering. Take more knockback as well.", "3. Darkflare: Spawn a fast moving projectile that automatically detonates after some time, or after hitting an enemy! Leaves miasma on the ground for damage over time!", "   Using this while one is active detonates it manually", "    Knocks you back a bit if you're too close to the blast. Launches you far if you're in the blast zone!", "   Does recoil damage if you're in the blast zone.", "4. Dark Beam: Charge up and fire a deadly laser! High DPS, but you cannot move while doing it.", "   This is technically a stance move, cancelled when you move, or when damaged."]
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