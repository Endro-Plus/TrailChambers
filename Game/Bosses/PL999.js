function PL999(startposx, startposy, size , lvl = 0, ID = -5){
//the boss in "bosses" should not be used. It's mostly just a list.
//startup
this.enemyID = ID;
this.x = startposx;
this.y = startposy;
this.shift = [0, 0];//how their position may shift
this.z = 0; //distance up.
this.size = size;
this.height = 8;//How tall they are, if small enough, higher hitting attacks may miss! However, if too tall, that's just a hitbox extension.
this.hitbox = new hitbox(this.x, this.y, this.z, this.height, this.size);
this.hitbox.disable();
this.hitbox.immunityframes(9);
//color
this.color = "#5c5cff";
//game
this.lvl = lvl; //difficulty of boss (0 for no dif, 10 for DOOM). You can go over!
this.damagetypemod = [["proj", 0.5], ["magic", 0.5]];//POV: Nino counter
this.hp = 100; //EVEN THE FUCKING BOSSES GET 100!!!!!!
this.facing = [-1, 0];
this.damagemod = 0.25;
this.speed = 8 + lvl/2; //base speed
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = 1; //POV: weak ass boss who isn't immune to hitstun
this.hitstun = 0;
this.knockbackmod = 1; //POV: weak ass boss who isn't immune to knockback
this.knockback = [0, 0];//x and y position of knockback
this.talking = true;//basically an indicator of whether or not summons should target this boss
//extras
this.modelnumber = 100;//this isn't truly the original... just a cheap knockoff
this.convo = 0;
this.files = [
    "revolvertrick.exe",
    "combatscenario4320",
    "720 degree spin",
    "depth_perception.java",
    "quickswap.zip",
    "this.modelnumber",
    "prior_model_AI.txt",
    "sniper_rifle.obj",
    "sawed_off.obj",
    "M1873_peacemaker.obj",
    "ammunition.zip",
    "CZ_Bobwhite_G2.obj",
    "20_gauge.obj",
    "evades.io",
    "Remington_700_Tactical.obj",
    "762_Nato.obj",
    "45ACP.obj",
    "Leading_shot.exe",
    "Unload.exe",
    "Reload.zip",
    "fullrange_movement.zip",
    "approach.java",
    "retreat.java",
    "Auto_recoil_compensation.java"
]//nah, nothing is being downloaded actually!
this.closing_statement = [
    "Ready yourself.",
    "Prepare yourself.",
    "Be ready for my signal.",
    "Running file: Openning_shot.exe",
    "May the best fighter win.",
    "*Places hand on holster*",
    "Do not hold back!",
    "My victory is assured!",
    "I will, supersede, PL999."
];//9 unique opennings depending on model number
this.gosomewhereelse = 0;//at 0, go somewhere else... bottom text
this.goto = [0, 0];
this.combolimit = 0;//at a high enough number, escape a combo
this.luckydodge = 0;//chances that pl999 decides that damage is gay
this.boost = 0;
this.chamber = 1;
this.revolver_cooldown = 1;
this.leadingshot = 0;//on easy mode, it's predictable, on hard mode, it's rng
this.shotgunchamber = 2;
this.shotgun_cooldown = 100
this.shotgun_spread = 100;
this.snipercooldown = 150;
this.aim = 0;
this.targetshift = [];//hard mode only... the sniper rifle will autolock onto the player at a certain point.
this.mercysniper = 0;//shotgun into sniper rifle is no longer a 0 to death combo
this.specialcap = null;//special abilities for certain pl models!
this.special = null;
PL999.prototype.listname = function(){
//to help position the characters correctly
return "PL999";
}
}
PL999.prototype.exist = function(){
    if(this.hp < 0){
        return "delete";
    }
    //speedmod is ALWAYS 1 to begin with (here anyways)
    this.speedmod = 1 + this.boost;
    //dodgeboost update
    if(this.boost > 0 ){
        this.boost-=1;
    }else{
        this.boost = 0;
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
this.hitbox.enable();
this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size + this.z);
if(this.hitbox.hitplayer()){
           //um... run?
           if(this.specialcap == "melee" && this.special != null && this.special > 39){
                //DAMAGE BABY!!!
                this.special = 30;
                this.hitstun = 10;
                player.hit(15, ["contact", "physical", "bludgeoning", this.enemyID], [15 * this.facing[0], 15 * this.facing[1]], 30);
           }else{
            player.hit(0, ["contact", this.enemyID]);
            this.x-=15*this.facing[0];
            this.y-=15*this.facing[1];
           }
            this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
        }


//boss AI goes here
//a bit of conversation... if you can call it that
if(this.hitstun > 0){
        this.hurt();
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
        if(this.hitstun > 60){
            this.hitstun = 60;
        }
        return;
        }
if(this.convo < 60){
    this.convo++;
    this.modelnumber = random(100, 998, false)
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "15px Times New Roman";

  screen.fillText("Initializing" + '.'.repeat(Math.ceil(this.convo % 18 / 6)), this.x + player.px, this.y-+ 50 + player.py);
}else if(this.convo < 90){
    this.convo++;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "15px Times New Roman";

  screen.fillText(`downloading file: ${this.files[random(0, this.files.length-1, false)]}`, this.x + player.px, this.y-+ 50 + player.py);
}else if(this.convo < 120){
    this.convo++;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "15px Times New Roman";

  screen.fillText(`booting: ${(((this.convo - 90) / 30)*100).toFixed(0)}%`, this.x + player.px, this.y-+ 50 + player.py);
}else if(this.convo < 200){
    this.convo++;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "15px Times New Roman";

  screen.fillText(`PL${this.modelnumber} is now ready for protocol: Simulation Battle 1`, this.x + player.px, this.y-+ 50 + player.py);
}else if(this.convo < 260){
    this.convo++;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "15px Times New Roman";

  screen.fillText(this.closing_statement[Math.floor(this.modelnumber/100)-1], this.x + player.px, this.y-+ 50 + player.py);
}else if(this.convo < 265){
    this.convo++;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "15px Times New Roman";

  screen.fillText((this.modelnumber%2 == 0)? "DRAW!":"*BANG*", this.x + player.px, this.y-+ 50 + player.py);
}else{
    //the battle begins!
    //lucky bastard... I meant lucky dodge update!
    if(this.luckydodge < 50 || this.luckydodge < 100 && this.specialcap == "evades"){
        this.luckydodge+=0.1;
    }

    //combo detection (reduces both damage from revolver and sniper rifle)
    if(player.hitstun > 1){
        if(this.mercysniper < player.hitstun){
            this.mercysniper = player.hitstun;
        }
    }else{
        this.mercysniper--;
        if(this,this.mercysniper > 45){
            this.mercysniper= 45
        }
    }
    //change variables depending on model
    if(this.specialcap == null){
    switch(Math.floor(this.modelnumber/100)){
        case 1:
            //revolver barrage
            this.specialcap = "rev";
            this.chamber = 6;
            break;
        case 2:
            //melee!
            this.specialcap = "melee";
            
            break;
        case 3:
            //autoreload and unparriable sniper rifle
            this.specialcap = "ar"
            break;
        case 4:
            //careful aim
            this.specialcap = "aim";
            break;
        case 5:
            //+aggression
            this.specialcap = "CMERE";
            this.special = 200;
            break;
        case 6:
            //quickdraw
            this.specialcap = "quickdraw"
            break;
        case 7:
            //has a pump action instead with spud rounds!
            this.shotgun_spread = 60;
            this.shotgunchamber = 6;
            this.chamber = 0;
            this.shotgun_cooldown = 5;
            this.specialcap = "showgun"
            this.special = 0;
            break;
        case 8:
            //More dodges
            this.specialcap = "evades";
            
            break;
        case 9:
            //infinite ammo
            this.specialcap = "inf"
    }
}
    this.talking = false;
    if(this.gosomewhereelse <= 0){
        if(this.specialcap == "CMERE"){
            this.goto[0] = random(canvhalfx - this.special, canvhalfx + this.special);
        this.goto[1] = random(canvhalfy - this.special, canvhalfy + this.special );
        this.gosomewhereelse = random(30, 90, false);//always be moving somewhere! usually near to player, but no obligation to be touching all the time
        if(random(0, 100, false) < this.luckydodge*2 || this.specialcap == "evades" && random(0, 1, false) == 1){
            this.boost = 2;//autododge, lmao. Though fatigue does set in for lucky dodging too much!
            if(this.specialcap != "evades"){
            this.luckydodge-=10;
            }else{
                this.luckydodge-=5;
            }
        }
        }else{
        this.goto[0] = random(canvhalfx - 300, canvhalfx + 300);
        this.goto[1] = random(canvhalfy - 300, canvhalfy + 300 );
        this.gosomewhereelse = random(60, 150, false);//always be moving somewhere! usually near to player, but no obligation to be touching all the time
        if(random(0, 100, false) < this.luckydodge*2){
            this.boost = 2;//autododge, lmao. Though fatigue does set in for lucky dodging too much!
            this.luckydodge-=10;
        }
    }
    }else{
        this.gosomewhereelse--;
    }
    //update combolimit
    if(this.combolimit > 0){
        this.combolimit-=0.2;
    }else{
        this.combolimit+=0.2
    }
    

    //actually attacking
    if(this.snipercooldown > 10 && this.special == null && this.specialcap == "quickdraw" && (inputs.includes(controls[4]) || inputs.includes(controls[5]) || inputs.includes(controls[6]) || inputs.includes(controls[7]))){
        this.revolver_cooldown = -1;
        this.special = 60;
        
        //basically, just shoot when the player does ANY ability.
    }else if(this.special !=null && this.specialcap == "quickdraw"){
        this.special--;
        if(this.special <= 0){
            this.special = null;
        }
    }
    if(this.revolver_cooldown == 6){
        if(this.shotgun_cooldown < 30){
            this.shotgun_cooldown = 40;
        }
        projectiles.push(new flashpart(findposition(this)[0], findposition(this)[1], this.size, 5, "yellow", 100, 15))
    }if(this.revolver_cooldown < 0){
        //FIRE!
        
        if(this.special == "BARRAGE!" || this.specialcap == "rev" && this.chamber == 6){
            //console.log(this.chamber + "fdsa")
            //unload the whole thing!
            this.special = (this.chamber == 1)? null:"BARRAGE!"
            if(enemyezmode() && this.leadingshot >= 5 || notenemyezmode() && this.leadingshot <= random(0, 5, false)){
            //every sixth shot is aimed where the player is going to be... on hard mode, it may be done early, with the chance increasing with every shot
            var accountx = 0;
            var accounty = 0;
           //this.leadingshot = 0;
            if(enemyezmode()){
                this.leadingshot = 0;//on easy mode, it cannot lead again, but on harder difficulties... HAHAHAHAHAHA!
            }
            if(inputs.includes(controls[0]) || inputs.includes(controls[1])){
                //take facing[0] into account
                accountx = player.speed * player.facing[0] * distance(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], canvhalfx, canvhalfy, true)/(10 * 4+this.lvl) 
            }
             if(inputs.includes(controls[2]) || inputs.includes(controls[3])){
                //take facing[0] into account
                accounty = player.speed * player.facing[1] * distance(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], canvhalfx, canvhalfy, true)/(10 * 4+this.lvl) 
            }

                var vx = aim(canvhalfx + accountx, canvhalfy + accounty, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[0];
                var vy = aim(canvhalfx + accountx, canvhalfy + accounty, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[1];
        }else{
        var vx = aim(canvhalfx  , canvhalfy , this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[0];
        var vy = aim(canvhalfx , canvhalfy , this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[1];
        }
        }else{
            //normal shooting
        if(this.specialcap == "aim" && enemyezmode() && this.leadingshot >= 3 || enemyezmode() && this.leadingshot >= 5 || notenemyezmode() && this.specialcap == "aim" ||notenemyezmode() && this.leadingshot <= random(0, 5, false)){
            //every sixth shot is aimed where the player is going to be... on hard mode, it may be done early, with the chance increasing with every shot
            var accountx = 0;
            var accounty = 0;
            this.leadingshot = 0;
            if(enemyezmode() && this.specialcap != "aim"){
                this.chamber = 1;//on easy mode, this is always the last shot... unless bro can just aim like that
            }
            if(inputs.includes(controls[0]) || inputs.includes(controls[1])){
                //take facing[0] into account
                accountx = player.speed * player.facing[0] * distance(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], canvhalfx, canvhalfy, true)/(10 * 4+this.lvl) 
            }
             if(inputs.includes(controls[2]) || inputs.includes(controls[3])){
                //take facing[0] into account
                accounty = player.speed * player.facing[1] * distance(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], canvhalfx, canvhalfy, true)/(10 * 4+this.lvl) 
            }

                var vx = aim(canvhalfx + accountx, canvhalfy + accounty, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[0];
                var vy = aim(canvhalfx + accountx, canvhalfy + accounty, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[1];
        }else{
        var vx = aim(canvhalfx, canvhalfy, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[0];
        var vy = aim(canvhalfx, canvhalfy, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[1];
        }
    }
        projectiles.push(new enemyhitscan("bullet", this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 7, vx, vy, "#ffee00ff", (this.mercysniper > 0)? 3:10, 50, 3 + this.lvl, ["hitscan", "piercing", "proj", "physical"], [vx * -3, vy * -3], 10, 4));
        this.chamber--;
        this.leadingshot++;
                if(this.shotgun_cooldown < 13){
                    this.shotgun_cooldown = 12
                }

        this.snipercooldown+=6;
        //console.log("shots  " + this.chamber)
        if(this.chamber < 1){
            this.revolver_cooldown = random(60, 120, false);
        }else{
            if(this.special == "BARRAGE!"){
                //BANG BANG BANG BANG BANG BANG BA- aw man...
            this.revolver_cooldown = 1;
            }else{
            this.revolver_cooldown = 5;
            }
        }
    }else{
        this.revolver_cooldown--;
        if(this.chamber <6 && this.revolver_cooldown%20 == 0 && this.revolver_cooldown!= 0 || this.chamber <6 && this.specialcap == "rev" && this.revolver_cooldown%18 == 0 && this.revolver_cooldown!= 0 ){
        if(this.specialcap == "inf"){
            this.chamber = 6;
        }else{
        this.chamber++;
        }
        }
    }
    if(this.shotgun_cooldown == 11){
        projectiles.push(new flashpart(findposition(this)[0], findposition(this)[1], this.size, 10, "red", 100, 20))
    }if(this.shotgun_cooldown < 0){
        //FIRE!!!!!!!!!
        for(let i = 0 ; i < 10 ; i++){
            //fire several shots
            let aimx = canvhalfx;
            let aimy = canvhalfy;
            let maxloops = 20;
            while(distance2(aimx, aimy, findposition(this), true) < 200 && maxloops>0){
                if(aimx < findposition(this)[0]){
                aimx/=2;
                }else{
                aimx*=2;
                }
                //using fucking slope intercept shenanigans, change y... fucking hate math, why couldn't it just be simple multiplication!!!
                aimy = slopeintercept2(canvhalfx, canvhalfy, findposition(this))[0] * aimx + slopeintercept2(canvhalfx, canvhalfy, findposition(this))[1];
                
                maxloops--;
            }
            console.log("failure"+maxloops)
            if(maxloops <=0){
                console.log(aimx + "fdsafdsafsf" + aimy)
            }
            
        let vx = aim(aimx + random(-this.shotgun_spread, this.shotgun_spread), aimy + random(-this.shotgun_spread, this.shotgun_spread), this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 5)[0];
        let vy = aim(aimx + random(-this.shotgun_spread, this.shotgun_spread), aimy + random(-this.shotgun_spread, this.shotgun_spread), this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 5)[1];
        if(this.specialcap == "showgun"){
        projectiles.push(new enemyhitscan("bullet", this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 5, vx, vy, "#ff7300ff", 4, 40, 5 + this.lvl, ["hitscan", "piercing", "proj", "physical"], [vx * -6, vy * -6], 5, 4));

        }else{
        projectiles.push(new enemyhitscan("bullet", this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 7, vx, vy, "#ffae00ff", 3, 30, 4 + this.lvl, ["hitscan", "piercing", "proj", "physical"], [vx * -6, vy * -6], 5, 4));
        }    
    }
        this.shotgunchamber--;
        this.revolver_cooldown+=4;
        this.snipercooldown += 12;
        //console.log("shots  " + this.chamber)
        if(this.shotgunchamber < 1){
            
            this.shotgun_cooldown = random(150, 250, false);
        }else{
            this.shotgun_cooldown = 10;
        }

    }else{
        this.shotgun_cooldown--;
        if(this.shotgunchamber <2 && this.shotgunchamber%100 == 0 || this.shotgunchamber <6 && this.specialcap == "showgun" && this.shotgunchamber%40 == 0){
            if(this.specialcap == "inf"){
                this.shotgunchamber = 2;
            }else{
                this.shotgunchamber++;
            }
        }
    }
    if(this.snipercooldown < 0){
        //ULTIMATE TIME BABY!
        //making sure they don't change courses mid jump
        if(this.snipercooldown == 0){
            
            this.aim = random(0, 300);//randomize aim
        }
        
        if(this.specialcap == "showgun"){
        this.shotgun_cooldown = 15
        this.shotgunchamber = 3;
        this.revolver_cooldown = random(30, 99);;
        }else{
        this.shotgun_cooldown = random(30, 99);
        this.revolver_cooldown = 12;
        }
        if(this.specialcap == "ar"){
            this.shotgunchamber = 2;
            this.chamber = 6;
        }
        if(Math.abs(this.goto[0]) < 5000){
        this.goto[0] = 9999 * this.facing[0];
        }
        if(Math.abs(this.goto[1]) < 5000){
        this.goto[1] = 9999 * this.facing[1];
        }
        this.gosomewhereelse = 5;
        this.z = (Math.sin(Math.abs(this.snipercooldown/10)))*20;//jump arc
        
        
        if(enemyezmode()){
            var x = this.x + player.px - this.shift[0] + (this.size + this.z + 30) * Math.cos(this.aim/2);
            var y = this.y + player.py - this.shift[1] + (this.size + this.z + 30) * Math.sin(this.aim/2);
            var bx = this.x + player.px - this.shift[0] + (this.size + this.z + 3000) * Math.cos(this.aim/2);
            var by = this.y + player.py - this.shift[1] + (this.size + this.z + 3000) * Math.sin(this.aim/2);
            
        }else{
            var x = this.x + player.px - this.shift[0] + (this.size + this.z + 30) * Math.cos(this.aim);
            var y = this.y + player.py - this.shift[1] + (this.size + this.z + 30) * Math.sin(this.aim);
            if(Math.abs(this.snipercooldown) == 25){
                this.targetshift = [player.px, player.py]
            }
        }
        if(Math.abs(this.snipercooldown) == 25 && this.specialcap == "ar"){
                projectiles.push(new flashpart(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 40, 3, "#7777ff", 100, 10));
            }


        
        this.aim++;

         screen.beginPath();
        screen.lineWidth = 20;
        screen.strokeStyle = "#444"
    
    screen.moveTo(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    screen.lineCap = "round"
    screen.lineTo(x, y);
  
    screen.stroke();
    if(enemyezmode()){
        screen.strokeStyle = "#f00";
            screen.lineTo(bx, by)
        screen.lineWidth = 3;
        screen.stroke();
    }
    screen.lineCap = "butt"
    screen.closePath();
    screen.lineWidth = 1;
    screen.fillStyle = this.color;
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size + this.z);
        if(this.z < 0 && this.snipercooldown < -20){
            this.z = 0;
            if(this.specialcap == "inf"){
                this.snipercooldown = 90
            }else{
            this.snipercooldown = 300;
            }
            //console.log(this.z + "z");
            if(enemyezmode()){
            var vx = aim(x, y, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 20)[0];
            var vy = aim(x, y, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 20)[1];
            }else{
                var vx = aim(canvhalfx + player.px - this.targetshift[0], canvhalfy + player.py - this.targetshift[1], this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 20)[0];
                var vy = aim(canvhalfx + player.px- this.targetshift[0], canvhalfy + player.py - this.targetshift[1], this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 20)[1];
            }
        }
        //console.log(this.snipercooldown + "fds")
        if(this.specialcap == "ar"){
        projectiles.push(new enemyhitscan("bullet", this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10, vx, vy, "#00658aff", (this.mercysniper > 0)? 50:100, 4, 20, ["hitscan", "piercing", "proj", "physical", "softblock"], [vx * -1, vy * -1], 3, 0));

        }else{
        projectiles.push(new enemyhitscan("bullet", this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10, vx, vy, "#fff9a1ff", (this.mercysniper > 0)? 50:100, 4, 20, ["hitscan", "piercing", "proj", "physical"], [vx * -1, vy * -1], 3, 0));
        }
        this.snipercooldown--;
        
    }
    if(this.snipercooldown >= 0){
        this.snipercooldown--;
    }
    
this.move(this.goto[0], this.goto[1])
}

}
PL999.prototype.move = function(x, y){
        
        // really basic following script (yes I just copied the tutorial boss)
        this.hitbox.updateimmunity();
        if(this.special == null && this.specialcap == "melee" && distance2(canvhalfx, canvhalfy, findposition(this), true) < 50){
            this.goto = [canvhalfx, canvhalfy];
            this.gosomewhereelse = 6;
            this.boost = 2;
            this.special = 45;
            projectiles.push(new flashpart(findposition(this)[0], findposition(this)[1], this.size*2, 20, "black", 100, 20));
            }else if(this.specialcap == "melee" && this.special != null){
            this.special--;
            if(this.special >39){
                this.goto = [canvhalfx, canvhalfy];
            }
            if(this.special < 0){
                this.special = null;
            }
        }
        if(this.x + player.px > x + 40){
            this.x-=this.speed * this.speedmod;
            this.facing[0] = -1
        }else if(this.x + player.px < x - 40){
            this.x+=this.speed * this.speedmod;
            this.facing[0] = 1
        }else{
           
            //we're getting nowhere... kind of... if they reach their objective, just assign a new one near them
            if(this.specialcap == "CMERE"){
            this.gosomewhereelse = -5;
            this.facing[0] = 0
            }else{
                
                this.goto[0] = random(this.x + player.px - this.shift[0] - 200, this.x + player.px - this.shift[0] + 200);
            this.facing[0] = 0 
            }
        }
            if(this.y + player.py < y  - 40){
            this.y+=this.speed * this.speedmod;
            this.facing[1] = 1;
        }else if(this.y + player.py > y + 40){
            this.y-=this.speed * this.speedmod;
             this.facing[1] = -1;
        }else{
            //we're getting nowhere... kind of... if they reach their objective, just assign a new one near them
            if(this.specialcap == "CMERE"){
            this.gosomewhereelse = -5;
            this.facing[1] = 0
            }else{
                this.goto[1] = random(this.y + player.py - this.shift[1] - 200, this.y + player.py - this.shift[1] + 200);
            this.facing[1] = 0 
            }
        }

        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
        //out of bounds
    if(this.x - this.shift[0] - this.size < canvhalfx - arena.w){
    //go right

this.goto[0] = 2000

}else if(this.x - this.shift[0] + this.size > canvhalfx - arena.w + arena.w*2){
//go left

this.goto[0] = -2000

}
if(this.y - this.shift[1]  - this.size< canvhalfy - arena.h){
//go down

this.goto[1] = 2000

}else if(this.y - this.shift[1]  + this.size> canvhalfy - arena.h + arena.h*2){
//go up

this.goto[1] = -2000
}

        



}
PL999.prototype.hurt = function(){
this.hitstun--;
this.x += this.knockback[0];
this.y += this.knockback[1];
this.knockback[0]*=0.9;
this.knockback[1]*=0.9;
if(arena.leavedir(this.x - this.shift[0], 0, this.size).includes("l") || arena.leavedir(this.x - this.shift[0], 0, this.size).includes('r')){
this.knockback[0]*=-0.5;
if(arena.leavedir(this.x - this.shift[0], 0, this.size).includes("r")){
    this.x = canvhalfx - arena.w + this.size;
}else{
    this.x = (canvhalfx - arena.w) + arena.w*2 - this.size*3
}
}
if(arena.leavedir(canvhalfx, this.y - this.shift[1], this.size).includes('u') || arena.leavedir(canvhalfx, this.y - this.shift[1], this.size).includes('d')){
this.knockback[1]*=-0.5;
if(arena.leavedir(0, this.y - this.shift[1], this.size).includes('u')){
    this.y = (canvhalfy - arena.h) + arena.h*2 - this.size*3;
}else{
    
    this.y = canvhalfy - arena.h + this.size;
    
}
}

}
PL999.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
    if(this.talking == true){
        this.convo = 999;//instantly skip the yapping
        this.luckydodge = 100;//saw that comin'!
        this.revolver_cooldown = 5;
        this.chamber = 2
    }
    console.log(`limit: ${this.combolimit}  lucky: ${this.luckydodge}`)
    if(this.combolimit > 30){
        //dodge out of a combo... like a bi-
        this.boost = 6;
        this.combolimit = -30;
        this.hitstun = -10;
        this.goto = [(this.x + player.px - this.shift[0] < canvhalfx)? -9999: 9999, (this.y + player.py - this.shift[1] < canvhalfy)? -9999 : 9999];
        this.gosomewhereelse = 30;
        if(this.shotgunchamber > 0){
            //use the shotgun as a get off me tool... because of course that clanker would do that!
            this.shotgun_cooldown = 5;
            
        }
        this.revolver_cooldown = 5;
        this.chamber = 1
        return;
    }
    if(this.hitstun == 0 && random(0 , 100 , false) < this.luckydodge){
        //just dodge instead lol
        this.boost = 2;
        this.luckydodge-=20;
        if(this.luckydodge < -10){
            this.luckydodge = -10;//there's a chance bro just can't dodge... this is for me!
        }
        return;
    }
    if(this.boost > 0){
        //literally immune to damage
        return;
    }
    if(this.snipercooldown < 0){
        this.snipercooldown = 300;//imagine getting knocked out of your super, couldn't be me!
        this.z = 0;
    }
    var dmg = damage * this.damagemod;
    for(let i = 0 ; i < this.damagetypemod.length ; i++){
        if(damagetype.includes(this.damagetypemod[i][0])){
            dmg *= this.damagetypemod[i][1];
            
        }
    }
    //console.log(damagetype)
    this.hp-=dmg;
    this.combolimit+=dmg*3;
    knockback[0] *= this.knockbackmod;
    knockback[1] *= this.knockbackmod;
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
    //console.log(this.hitstun);
}
PL999.prototype.inst = function(lvl = 0, startposx = this.x, startposy = this.y, size = this.size, ){
//adds a boss to the game!
enemies.push(new PL999(startposx, startposy, size, lvl, enemies.length));
}
//center stage and 20 size is the default, feel free to change it up!
bosses.push(new PL999(canvhalfx+200, canvhalfy, 20));