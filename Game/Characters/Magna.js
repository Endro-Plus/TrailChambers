function Magna(startposx, startposy, size){
this.px = startposx;
this.py = startposy;
this.pz = 0;
this.size = size;

//card info
this.postColor = "#FF4C00";
this.color = "#FF8B00";
this.desc = ["SMALL AND CUUUUTTTEEEE!!!!! His size may leave him going under attacks that would normally hit! A little easier to knock around.", "Adrenaline: This passively makes him stronger overtime. With enough adrenaline, passive healing is possible!", "1. Nunchuck: swing your nunchuck forwards! Can destroy some projectiles", "2. Shuriken: Standard issue projectile. Simple yet effective", "3. Dodge: Quickly dash ahead! Has invincibility, and can be used twice before cooldown!", "4. Parry: Defend yourself. Has about a third of a second worth of parry frames. It doesn't get any better than that!"];
//game stats
this.cooldowns = [0, 0, 0, 0];
this.damagetypemod = [];//POV: you're just a cute lil' guy.
this.hp = 100;
this.damagemod = 1; //And Simia is weaker than a literal fucking child why???
this.speed = 12; //SpEeD
this.speedmod = 1;//modifies speed, multiplicately
this.DI = 1.4; //Bro is definitely not just better Simia I swear!
this.hitstunmod = 0.9; //Easy mode character 2???
this.knockbackmod = 1.2; //Both a blessing, and a curse!
this.height = 5;//Smol boi
}
Magna.prototype.listname = function(){

return "Magna";
}
Magna.prototype.greeting = function(){
//How cute!!!
console.log("Magna, cute lil' child, is ready to fight a deity!")
}
Magna.prototype.exist = function(){
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.px, this.py, this.size)

//movement
if(inputs.includes("shift")){
    this.speed = 6;
}else{
    this.speed = 12;
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
Magna.prototype.spec1 = function(){
//abilities
console.log("working!");
}
Magna.prototype.spec2 = function(){

}
Magna.prototype.spec3 = function(){

}
Magna.prototype.spec4 = function(){

}
chars.push(new Magna(canvhalfx, canvhalfy, 13));//Literally a small child