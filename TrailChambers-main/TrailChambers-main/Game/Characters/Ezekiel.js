function Ezekiel(startposx, startposy, size){
//startup
this.px = startposx;
this.py = startposy;
this.pz = 0; //distance up.
this.size = size;

//character poster/character color
this.postColor = "#0000FF";
this.color = "#0088FF";
this.desc = ["The Summoner! Overwhelm your foes with superior numbers, and swap places with your summons when you're in danger!", "    High cooldowns if a summon dies. They're real bulky, but a death could hurt you a lot...", "use a summon ability while it's still alive to swap places.", "1. Whip: A VERY long reach melee attack! A successful hit focuses all your offensive summons on that enemy.", "2. Conjure tower: Place a stationary tower down. Has a weak projectile, but the bulk leaves for a reliable escape point!", "   Automatically swaps places while it's alive and you take damage, though this feature inflicts longer cooldown.", "3. Tim: Summon a skeletal mage companion that teleports around and fires strong dark orbs at your opponent!", "    Is a bit frail.", "4. Orbiters: Summon spiked orbs that revolve around you, dealing decent damage and taking hits for you!", "   Using this ability while it's already active destroys the old ones, and creates 3 new ones."]
//game stats
this.cooldowns = [0, 0, 0, 0];
this.damagetypemod = [];
this.hp = 100;
this.damagemod = 1;
this.speed = 10;
this.speedmod = 1;//modifies speed, multiplicately
this.DI = 1;
this.hitstunmod = 1;
this.knockbackmod = 1;
this.height = 8;
//perfectly unremarkable...
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
//center stage and 20 size is the default, feel free to change it up!
chars.push(new Ezekiel(canvhalfx, canvhalfy, 20));