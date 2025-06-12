function Dorn(startposx, startposy, size){
//startup
this.px = startposx;
this.py = startposy;
this.pz = 0;
this.size = size;

//character poster/character color
this.postColor = "#003300";
this.color = "#009900";
this.desc = ["This, is a slime. Resistant to damage, but is also a bit slower.", "Regeneration: Slowly regenerates hp when below than 2/3 hp", "1. Harden: Become MORE resistant to damage, along with resistant to hitstun, for 2 seconds. Can be used in hitstun", "2. Slime: Throw slime at your opponent. Lingers for a bit if you miss.", "3. Split: Split yourself into 4 smaller pieces! quadrouple your DPS!", "    You control all the pieces, but you all share the same HP. Careful not to let an ally be hurt!", "    You can use the ability again to reform into one again. Can use this in hitstun", "4. deform/reform: If reformed, using this turns you into a puddle. Deal consistent damage to all standing in you, but it hurts to be stepped on", "    While deformed, be immune to all forms of damage! If deformed, use this ability to reform again. Can be used in hitstun", "    Reforming where your missed projectiles landed heals you a bit."];

//game stats
this.cooldowns = [0, 0, 0, 0];
this.damagetypemod = [["fire", 1.5], ["poison", 0], ["slashing", 0.1], ["bludgeoning", 1.3], ["magic", 1.2], ["physical", 0.8]];//guys, the slime is immune to poison, and cannot be hurt by slashing!!! Who would've thought!!!!!!
this.hp = 100;
this.damagemod = 0.8; //It's hard to hurt a slime...
this.speed = 9; //Kinda hard to move as a slime, just sliding around
this.speedmod = 1;//modifies speed, multiplicately
this.DI = 1; //I SURE HOPE YOU'RE USING DI, DORN MAIN!!!
this.hitstunmod = 0.8 //When getting hurt is hard, recoiling in pain is unlikely!
this.knockbackmod = 0.6; //Knock away a slime by punching it, I dare you.
this.height = 8;
}
Dorn.prototype.listname = function(){
//to help position the characters correctly
return "Dorn";
}
Dorn.prototype.greeting = function(){
//The formal greeting for the console log! Useless? Sure, but still!
console.log("Dorn, a slime, is ready to slide his way to victory!")
}
Dorn.prototype.exist = function(){
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.px, this.py, this.size)

//movement
if(inputs.includes("shift")){
    //become more liquidy when using shift.
    this.speed = 2;
    this.damagemod = 0.7;
    this.height = 5;
}else{
    this.speed = 9;
    this.damagemod = 0.9;
    this.height = 8;
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
Dorn.prototype.spec1 = function(){
//abilities
console.log("working!");
}
Dorn.prototype.spec2 = function(){

}
Dorn.prototype.spec3 = function(){

}
Dorn.prototype.spec4 = function(){

}
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Dorn(canvhalfx, canvhalfy, 20));