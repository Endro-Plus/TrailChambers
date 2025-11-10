

/*
Hard mode changes: 
    Introduces the combo system
    all attacks are naturally weaker, but get stronger as comboes extend
    at 7+ combo, start bouncing off walls
    worse air mobility, and using momentum and moving in the air costs more
    lose more momentum when taking damage (which indirectly means you die faster)


*/
function Simia(startposx, startposy, size){
this.px = startposx;
this.py = startposy;
this.pz = 0;
this.size = size;

//poster details
this.postColor = "#553300";
this.color = "#B06300";
this.desc = ["Frail... leaving him more vulnerable to damage and hitstun. Kind of a difficult character to play, be warned!", "lose momentum when damaged. If you have no momentum left, take more damage!", "Desperation: This is a passive boost to damage and DI, based on how much lower your hp is compared to the boss! Might allow for passive momentum gain, and less hitstun!", "1. FlYiNg SiDe KiCk: Get airborne and fly at your helpless victim, leg first!!! On hit, get launched upwards!", "    In the air, this move dives downward with malicious intent! Also bounces on hit.", "2. Momentum: reduce startup of your attacks, and move much faster! Limited by momentum bar. Get more momentum for dishing pain!", "   Can be used while in hitstun. Momentum increases your DI, moreso when using meter!","3. Tornado Kick: Do a small hop and do a tornado kick! Costs an air option to do if already airborne", "Lowers gravity slightly, allowing you to get even higher!", "4. Jump/airdodge: Why wait to hit your opponent when you can just jump yourself! Jumps over attacks and assail your opponent from above!", "    This can be done in the air, once, to swiftly dash, while also cutting down your upward momentum. This kills horizontal movement if you don't move and use it!", "   Using the neutral variant of this gives you extra momentum based on how much speed was killed"]

//game stats
this.playershift = [0, 0];//shift the position of the player
this.cooldowns = [0, 0, 0, 0];
this.damagetypemod = [["pleasure", 4], ["seduction", 2], ["dark", 0.8], ["light", 2], ["pain", 5], ["headpat", 999], ["magic", 0.9], ["physical", 1.2], ["psychic", 2]];//Read it and weep... I know I am.
this.hp = 100;//I was genuinely considering giving me less hp... be no, multiplication and percent math is much better :)
this.damagemod = 1.2; //And to think this character is my self insert... yep, fuck me.
this.speed = 15; //+5 speed so I can run the fuck away.
this.speedmax = 15//yeah, should've had this a while ago.
this.speedmod = 1;
this.speedcause = []
this.DI = 2; //At least I paid extra to direct my influence!
this.hitstunmod = 1.2; //fuck me
this.knockbackmod = 1;
this.height = 8;
this.hitstun = 0;
this.facing = [-1, 0];//because yeah, I have to be different
this.iframe = false;//it would be a shame if I never used this!
this.won = false;//is this even possible to make true???
//at least I get SKILLS!!!
this.desperation = 0;
this.momentum = 100;
this.speedtoggle = false;
this.windup = 0;
this.jumpv = 0;
this.grounded = true;
this.mvlock = false;
this.airmv = [0, 0];
this.airoption = true;
this.sweepbox = new hitbox(this.px, this.py, this.pz, 2, this.size * 3);
this.sweepframes = 0;
this.sweepstartup = 0;
this.savior_frames = 0;//because I literally need iframes
this.sweepbox.disable();
this.sweepbox.immunityframes(9);
this.abilitylock = false;
//hardmode!

this.combo = 1;//imagine comboing being a bad thing!
}
Simia.prototype.listname = function(){
//to help position the characters correctly
return "Simia";
}
Simia.prototype.yell = function(){
//don't even ask, lmao. It was too funny to get rid off.
console.log("AAAHHHHHHHH!");
}

Simia.prototype.greeting = function(){
//Who is this man again???
console.log("The forgotten one is ready to help!");
}
Simia.prototype.exist = function(){
//savior frame i frames
if(this.savior_frames > 0){
this.savior_frames--;
this.iframe = true;
if(this.savior_frames < 1){
this.savior_frames= 0;
this.iframe = false;
}
}
this.sweepbox.updateimmunity();
//combo
if(!charezmode()){
if(this.combo < 1){
this.combo = 1;
}
if(this.pz <=0 ){
this.combo = 1;
}
}
//HP check
if(this.hp > 100){
    //I'm generous enough to give you a BIT of extra power for a set time
    this.hp-=0.15;
    if(this.hp <= 100){
        this.hp = 100;
        //yes, I'm aware this is effectively a free defense
    }

}else if(this.hp <=0|| this.won == true ){
    //play the death anmiation, then call off
    if(this.won == false){
        this.death();
    }else{
        this.win()
    }
    return "dead";
}
timeplayed++;
//update desperation
try{
this.desperation = enemies[0].hp - this.hp;
if(this.desperation < 10){
this.desperation = 0;
}else{
this.desperation*=1.4;//I really need the extra damage
if(this.desperation > 20 && this.momentum < this.desperation && this.speedtoggle == false){
this.momentum+=0.3;//so I can actually make use of desperation without immediately dying, sometimes...
this.hitstun-=this.desperation/100;//THE ABILITY TO ESCAPE COMBOS!!!!
}
console.log(this.desperation)
}
}catch(e){
//the enemies are dead
}
//speedmod is sometimes 1
if(this.speedtoggle == true){
if(this.momentum < 0){
this.speedtoggle = false;
this.speedmod = 1;
}else{
this.speedmod = 3;//SPEED!
this.momentum-=0.2;
}
}else{
this.speedmod = 1;
}
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
            circle(canvhalfx, canvhalfy, this.size + this.pz);
            //hp
            if(this.hp <= 100){
            //under max
            screen.fillStyle = "#500";
            screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
            screen.fillStyle = (this.iframe)? "#00F":"#0F0";
            screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
            }else{
            //over max
            screen.fillStyle = "#0F0";
            screen.fillRect(canvhalfx - 25 - (this.hp - 100) * 0.25, canvhalfy - this.size - 10, this.hp / 2, 4);//current hp
            screen.fillStyle = "#00F";
            screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 10, 50, 4);//max hp
            }
            //momentum bar
             screen.strokeStyle = (this.momentum <= 0)? "#F00":"#000";
             screen.fillStyle = "#F00";
             screen.strokeRect(canvhalfx - 25, canvhalfy - this.size - 15, 50, 4);//max momentum
             screen.fillRect(canvhalfx - 25, canvhalfy - this.size - 15, this.momentum/2, 4);//current momentum
             if(inputs.includes(controls[0]) || inputs.includes(controls[1]) || inputs.includes(controls[2]) || inputs.includes(controls[3])){
                /*if(this.hitstun < 1 && this.mvlock == false){
                this.momentum+=0.25;
                }*///no longer able to regen momentum by standard movement
             }
             if(this.momentum > 100){
             this.momentum = 100;
             //POV: no natural regen
             }
                //air options
                if(this.pz < 2){
                    this.airoption = true;
                }
                //jumping
                 //console.log(this.windup)
                 if(this.pz > 1 && this.windup == 0){
                        if(this.sweepframes > 0 && this.sweepstartup < 1){
                        this.jumpv-=0.1
                        }else{
                       this.jumpv-=0.5
                       }
                        this.pz += this.jumpv;
                        if(this.pz < 1){
                            this.pz = 0;
                            this.jumpv = 0;

                        }

                 }
                 //jump movement
                 //console.log(this.airmv)
                 if(this.pz > 2 && this.mvlock == false){
                    this.px += this.airmv[0];
                    this.py += this.airmv[1];
                    if(arena.pleavedir().includes('l')){
                        this.px = arena.w - this.size + 3;
                    }else if(arena.pleavedir().includes('r')){
                        this.px = -arena.w + this.size - 3;
                    }
                    if(arena.pleavedir().includes('u')){
                        this.py = arena.h - this.size + 3
                    }else if(arena.pleavedir().includes('d')){
                        this.py = -arena.h +  this.size - 3;
                    }
                 }
                //attacks
                if(this.windup > 0){
                this.windup--;
                console.log(this.grounded)
                if(this.grounded == true){
                    if(this.speedtoggle){
                    this.pz+=2.5;
                    }else{
                    this.pz += 2;
                    }

                }else{
                    this.pz+=0.1;
                }
                if(this.windup == 0 ){
                    this.windup = -1;
                    this.mvlock = true;
                    if(this.speedtoggle){
                        this.airmv[0] *= 3;
                        this.airmv[1] *= 3;
                    }else{
                        this.airmv[0] *= 1.5;
                        this.airmv[1] *= 1.5;
                    }
                }
                }

                if(this.windup == -1){
                    if(this.pz > 0){
                        if(this.grounded == true){
                            this.pz-=1;
                            this.px += this.airmv[0];
                            this.py += this.airmv[1];
                        }else{
                            this.pz -= 6;
                            this.px += 2 * this.facing[0];
                            this.py += 2 * this.facing[1];
                        }
                        if(arena.pleavedir().includes('l')){
                            this.px = arena.w - this.size + 3;
                            if(!charezmode() && this.combo > 7){
                            this.airmv[0] *= -1;
                            this.facing[0] *= -1;
                            }
                        }else if(arena.pleavedir().includes('r')){
                            this.px = -arena.w + this.size - 3;
                            if(!charezmode() && this.combo > 7){
                                                        this.airmv[0] *= -1;
                                                        this.facing[0] *= -1;
                                                        }
                        }
                        if(arena.pleavedir().includes('u')){
                            this.py = arena.h - this.size + 3
                            if(!charezmode() && this.combo > 7){
                                                        this.airmv[1] *= -1;
                                                        this.facing[1] *= -1;
                                                        }
                        }else if(arena.pleavedir().includes('d')){
                            this.py = -arena.h + this.size - 3;
                            if(!charezmode() && this.combo > 7){
                                                        this.airmv[1] *= -1;
                                                        this.facing[1] *= -1;
                                                        }
                        }


                    }else{
                        this.cooldowns[0] = 5;
                        this.pz = 0;
                        this.windup = 0;
                        this.mvlock = false;

                    }
                }

                if(this.sweepframes > 0){
                this.sweepframes--;
                if(this.pz < 2){
                this.sweepframes = 0;
                this.sweepstartup = 0;
                }
                if(this.sweepstartup > 0){
                this.sweepstartup--;
                }else{

                screen.fillStyle = this.postColor;
                circle(canvhalfx, canvhalfy, this.pz + this.size * 3);
                screen.fillStyle = this.color;
                circle(canvhalfx, canvhalfy, this.size + this.pz);
                this.sweepbox.enable();
                this.sweepbox.reassign(canvhalfx, canvhalfy, this.pz - 2, 2 , this.size * 3)
                let hi = this.sweepbox.hitenemy();
                if(typeof hi == "number"){
                if(this.speedtoggle){

                this.jumpv = 6
                this.pz += enemies[hi].height + 2;
                this.sweepframes += 5;

                }else{
                this.jumpv = 3;
                this.pz += enemies[hi].height + 2;

                this.sweepframes += 5;
                }
                this.momentum+=10;
                playerattack = "Tornado Kick";

                if(!charezmode()){
                if(this.combo > 12){
                    //this move is fucking cringe
                    enemies[hi].hit((46 + this.desperation) + (this.combo) * 2, ["physical", "bludgeoning", "cringe"], [(this.px < enemies[hi].x)? 5:-5 , (this.py < enemies[hi].y)? 5:-5], 15);
                }else{

                enemies[hi].hit((40 + this.desperation) + (this.combo - 1) * 2, ["physical", "bludgeoning"], [(this.px < enemies[hi].x)? 5:-5 , (this.py < enemies[hi].y)? 5:-5], 15);
                }
                this.combo += 5;//I had to give this some use. This move is fucking ass
                }else{
                enemies[hi].hit((46 + this.desperation), ["physical", "bludgeoning"], [(this.px < enemies[hi].x)? 5:-5 , (this.py < enemies[hi].y)? 5:-5], 15);
                }
                this.savior_frames = 5;
                this.sweepbox.grantimmunity(enemies[hi]);
                }
                }
                }else{
                this.sweepbox.disable();
                }
            //hitstun
            //console.log(this.combo);
            if(this.hitstun > 0){
                this.hurt();


            }else{
            //movement
            if(this.mvlock == false){//can't move if your movement is locked!
            if(inputs.includes("shift")){
                this.speed = this.speedmax/2;
            }else{
                this.speed = this.speedmax;
            }
            if(inputs.includes(controls[0]) && !arena.pleavedir().includes('l')){
            if(this.pz > 2){
            if(this.speedtoggle){
                                if(!charezmode()){
                                    this.momentum-=0.5;
                                }
                                this.airmv[0] += (this.speed * this.speedmod) / 5;
                            }else{
            this.airmv[0] += (this.speed * this.speedmod) / 10;
            }
            }else{
            this.px+=this.speed * this.speedmod;
            }
            if(this.pz < 2){
            this.airmv[0] = this.speed * this.speedmod;
            }
            this.facing[0] = -1;
            if(!inputs.includes(controls[2]) && !inputs.includes(controls[3])){
                this.facing[1] = 0;
                if(this.pz < 2){
                    this.airmv[1] = 0;
                    }
            }
            }
            if(inputs.includes(controls[1]) && !arena.pleavedir().includes('r')){
            if(this.pz > 2){
                if(this.speedtoggle){
                    if(!charezmode()){
                        this.momentum-=0.5;
                    }
                    this.airmv[0] -= (this.speed * this.speedmod) / 5;
                }else{
                     this.airmv[0] -= (this.speed * this.speedmod) / 10;
                }
            }else{
            this.px-=this.speed * this.speedmod;
            }
            if(this.pz < 2){
                this.airmv[0] = -this.speed * this.speedmod;
            }
            this.facing[0] = 1;
            if(!inputs.includes(controls[2]) && !inputs.includes(controls[3])){
                this.facing[1] = 0;
                if(this.pz < 2){
                    this.airmv[1] = 0;
                    }
}
}

if(inputs.includes(controls[2]) && !arena.pleavedir().includes('u')){
if(this.pz > 2){
if(this.speedtoggle){
                    if(!charezmode()){
                        this.momentum-=0.5;
                    }
                    this.airmv[1] += (this.speed * this.speedmod) / 5;
                }else{

            this.airmv[1] += (this.speed * this.speedmod) / 10;
            }
            }else{
this.py+=this.speed * this.speedmod;
}
if(this.pz < 2){
   this.airmv[1] = this.speed * this.speedmod;
}
this.facing[1] = -1;
if(!inputs.includes(controls[0]) && !inputs.includes(controls[1])){
    this.facing[0] = 0;
    if(this.pz < 2){
    this.airmv[0] = 0;
    }
}
}

if(inputs.includes(controls[3]) && !arena.pleavedir().includes('d')){
if(this.pz > 2){
if(this.speedtoggle){
                    if(!charezmode()){
                        this.momentum-=0.5;
                    }
                    this.airmv[1] -= (this.speed * this.speedmod) / 5;
                }else{

            this.airmv[1] -= (this.speed * this.speedmod) / 10;
            }
            }else{
this.py-=this.speed * this.speedmod;
}
if(this.pz < 2){
    this.airmv[1] = -this.speed * this.speedmod;
}
this.facing[1] = 1;
if(!inputs.includes(controls[0]) && !inputs.includes(controls[1])){
    this.facing[0] = 0;
    if(this.pz < 2){
        this.airmv[0] = 0;
        }
}
}
}
//lower all cooldowns
for(let i = 0; i < this.cooldowns.length ; i++){
    this.cooldowns[i]--;
}
//attacks
}
if(this.mvlock == false){
//no abilities either!
if(this.cooldowns[0] <= 0 && inputs.includes(controls[4]) && this.hitstun <=0){
    this.spec1();

}
if(inputs.includes(controls[5]) && !this.abilitylock){
    this.spec2();
    this.abilitylock = true
}
if(this.cooldowns[2] <= 0 && inputs.includes(controls[6])  && this.hitstun <=0){
    this.spec3();
}
if(this.cooldowns[3] <= 0 && inputs.includes(controls[7]) && this.hitstun <=0){
    this.spec4();
}
}
if(!inputs.includes(controls[5])){
this.abilitylock = false;
}




}
Simia.prototype.spec1 = function(){
//abilities (dive kick)
this.savior_frames = 0;
this.iframe = false;
this.jumpv = 0;
if(this.speedtoggle == true){
this.windup = 2;
}else{
this.windup = 5;
}
if(this.pz < 2){
this.grounded = true;
}else{
this.grounded = false;
}
this.cooldowns[0] = 99;
}
Simia.prototype.spec2 = function(){
console.log("e")
if(this.speedtoggle == false){
this.speedtoggle = true;
}else{
this.speedtoggle = false;
}
}
Simia.prototype.spec3 = function(){
if(this.pz < 2){
    //grounded version
    this.pz = 3;
    this.jumpv = 3;
    if(inputs.includes(controls[0])){
    this.airmv[0] = this.speed * this.speedmod;
    }else if(inputs.includes(controls[1])){
    this.airmv[0] = -this.speed * this.speedmod;
    }else{
    this.airmv[0] = 0;
    }

    if(inputs.includes(controls[2])){
    this.airmv[1] = (this.speed * 2) * this.speedmod;
    }else if(inputs.includes(controls[3])){
    this.airmv[1] = -(this.speed * 2) * this.speedmod;
    }else{
    this.airmv[1] = 0;
    }
    this.sweepframes = 18;
    if(!this.speedtoggle){
    this.sweepstartup = 9;
    }

}else if(this.airoption){
    //air version
    this.airoption = false;
        this.sweepframes = 20;
        if(!this.speedtoggle){
        this.sweepstartup = 5;
        }

}
if(this.sweepframes != 0){
this.cooldowns[2] = 20;
}
}
Simia.prototype.spec4 = function(){
if(this.pz < 2){
//jump
this.pz = 3;
this.jumpv = 6;
if(inputs.includes(controls[0])){
this.airmv[0] = this.speed * this.speedmod;
}else if(inputs.includes(controls[1])){
this.airmv[0] = -this.speed * this.speedmod;
}else{
this.airmv[0] = 0;
}

if(inputs.includes(controls[2])){
this.airmv[1] = (this.speed * 2) * this.speedmod;
}else if(inputs.includes(controls[3])){
this.airmv[1] = -(this.speed * 2) * this.speedmod;
}else{
this.airmv[1] = 0;
}
}else if(this.airoption){
//airdodge
this.airoption = false;
if(this.jumpv > 1){
this.jumpv = 1;
}else{
this.jumpv = 0;
}
if(inputs.includes(controls[0])){
this.savior_frames = 10;
this.airmv[0] = (this.speed * 2) * this.speedmod;
}else if(inputs.includes(controls[1])){
this.savior_frames = 10;
this.airmv[0] = -(this.speed * 2) * this.speedmod;
}else{
this.momentum+=Math.abs(this.airmv[0]) / 10;
this.airmv[0] = 0;
}

if(inputs.includes(controls[2])){
this.savior_frames = 10;
this.airmv[1] = this.speed * this.speedmod;
}else if(inputs.includes(controls[3])){
this.savior_frames = 10;
this.airmv[1] = -this.speed * this.speedmod;
}else{
this.momentum+=Math.abs(this.airmv[1]) / 10;
this.airmv[1] = 0;
}
}
this.cooldowns[3] = 8;

}
//for(let i = 0; i < 9999 ; i ++){
console.log("lmao");
//}
Simia.prototype.hurt = function(){
this.hitstun--;
//console.log(this.hitstun);
this.px += this.knockback[0];
this.py += this.knockback[1];
this.knockback[0]*=0.9;
this.knockback[1]*=0.9;
if(arena.pleavedir().includes("l") || arena.pleavedir().includes('r')){
this.hitstun += 3;
if(!charezmode()){
this.momentum-= 3;
this.hit(6, ["physical"]);//OOWWWW
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
this.momentum-= 3;
this.hit(6, ["physical"]);//OOWWWW
}
this.knockback[1]*=-0.5;
if(arena.pleavedir().includes("u")){
    this.py = arena.h - this.size - 3;
}else{
    this.py = -arena.h + this.size + 3;
}
}

}
Simia.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0, DImod = 1){
        if(this.windup == -1 && damagetype.includes("contact") && typeof damagetype[damagetype.length - 1] == "number"){
            playerattack = "Dive kick";

            //dive kick connected!
            this.savior_frames = 8;
            this.jumpv = 5;
            if(this.momentum < 95){
            this.momentum+=5;
            }else{
            this.momentum = 100;
            }
            if(this.speedtoggle){
                this.airmv[0]/=10;
                this.airmv[1]/=10;
            }
            console.log(damagetype[damagetype.length - 1]);

            this.pz = enemies[damagetype[damagetype.length - 1]].height + 2;

            this.windup = 0;
            if(this.grounded == true){
            enemies[damagetype[damagetype.length - 1]].hit((36  + this.desperation), ["contact", "physical"], [this.airmv[0], this.airmv[1]], 30);
            }else{
            if(!charezmode()){
            //a blessing? Or a curse! Gotta use those air options for more damage!
            this.combo+=1;
            enemies[damagetype[damagetype.length - 1]].hit((20 + this.desperation) + this.combo, ["contact", "physical"], [(2 * this.combo + 2) * this.facing[0], (2 * this.combo + 2) * this.facing[1]]);
            }else{

            enemies[damagetype[damagetype.length - 1]].hit((28 + this.desperation), ["contact", "physical"], [2 * this.facing[0], 2 * this.facing[1]], 45);

            }
            if(charezmode()){
            this.airmv[0] = 2 * this.facing[0];
            this.airmv[1] = 2 * this.facing[1];
            }else{
                this.airmv[0] = (this.combo / 2) * 4 * this.facing[0];
                this.airmv[1] = (this.combo / 2) * 4 * this.facing[1];
            }
            }
            this.mvlock = false;
            this.cooldowns[0] = 8;
            return;
        }

        //handle damage dealt
        this.pz = 0;
        this.mvlock = false;
        this.airmv = [0, 0];
        this.jumpv = 0;
        this.windup = 0;
        this.cooldowns[0] = 8;
        var dmg = damage * ((damagetype.includes("true"))? 1.1:this.damagemod);//fuck Simia in particular
        for(let i = 0 ; i < this.damagetypemod.length ; i++){
            if(damagetype.includes(this.damagetypemod[i][0])){
                dmg *= this.damagetypemod[i][1];
            }
        }
        if(this.hp > 100 && this.hp - dmg < 100){
        this.hp = 100;
        }else{
        //oh, did I forget to mention the momentum bar also takes damage?
        if(charezmode()){
        this.momentum-=dmg/2;
        }else{
        this.momentum-=dmg * 1.5;
        }
        if(this.momentum < 0){
            dmg+=Math.abs(this.momentum);//fuck my life
            this.momentum = 0;

        }
        this.hp-=dmg;
        }

        //handle knockback and DI.
        knockback[0] *= this.knockbackmod;
        knockback[1] *= this.knockbackmod;
        //get a little DI bonus for being an otherwise shitty character
        var DIadd = this.momentum / 85;
        if(this.speedtoggle == true){
        //I really needed this
        DIadd*=25 + (this.desperation / 1);
        }
        //console.log(this.DI + DIadd);
        if(inputs.includes(controls[0])){
            knockback[0] += this.DI * DImod + DIadd;
        }
        if(inputs.includes(controls[1])){
            knockback[0] -= this.DI * DImod + DIadd;
        }
        if(inputs.includes(controls[2])){
            knockback[1] += this.DI * DImod + DIadd;
        }
        if(inputs.includes(controls[3])){
            knockback[1] -= this.DI * DImod + DIadd;
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
Simia.prototype.death = function(){
projectiles = [];
summons = [];
enemies = [];
//game over man! Game over!

//draw the character, stationary
screen.fillStyle = this.color;
circle(canvhalfx, this.size + 40, this.size)
bossbarmode = 0;
//here is some statistics
screen.fillStyle = "#FFF";
screen.textAlign = "center";
screen.font = "25px Times New Roman";
screen.fillText("The Forgotten One", canvhalfx, 20);//char name
screen.fillText(`Started on lvl ${Math.floor(startlevel)} and made it to lvl: ${Math.floor(level)}`, canvhalfx, canvhalfy - 60);//made it to what level
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
Simia.prototype.win = function(){
//NICE!
this.won = true;
//draw the character, stationary
screen.fillStyle = this.color;
circle(canvhalfx, this.size + 40, this.size)

//here is some statistics
screen.fillStyle = "#99ff00ff";
screen.textAlign = "center";
screen.font = "25px Times New Roman";

screen.fillText("YOU MADLAD, YOU DID IT!!!!!!", canvhalfx, 20);//PROCLAIM IT!!!
screen.fillText("Simia!", canvhalfx, 40);//char name
screen.fillText(`Started on lvl ${Math.floor(startlevel)} and won on lvl: ${Math.floor(level)}`, canvhalfx, canvhalfy - 60);//made it to what level
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
player = null;
clearInterval(setup);
setup = setInterval(prep, 1000/fps);
screen.textAlign = "left";
level = 0;
input = '';
bossbar = [];
}

}
//when finished, push to chars
Simia.prototype.inst = function(x = this.px, y = this.py, size = this.size){
//adds a player to the game!
player = new Simia(x, y, size);
}
chars.push(new Simia(canvhalfx, canvhalfy, 20));