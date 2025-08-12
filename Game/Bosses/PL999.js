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
this.damagemod = 0.2;
this.speed = 8 + lvl/2; //base speed
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = 0.5; //POV: weak ass boss who isn't immune to hitstun
this.hitstun = 0;
this.knockbackmod = 0.6; //POV: weak ass boss who isn't immune to knockback
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
this.luckydodge = 50;//chances that pl999 decides that damage is gay
this.boost = 0;
this.chamber = 0;
this.revolver_cooldown = 30;
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
    if(this.boost > 0){
        this.boost-=0.5;
    }else{
        this.boost = 0;
    }
    //lucky bastard... I meant lucky dodge update!
    if(this.luckydodge < 100){
        this.luckydodge+=0.1;
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
circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size);
if(this.hitbox.hitplayer()){
           //um... run?
            player.hit(0, ["contact", this.enemyID]);
            this.x-=15*this.facing[0];
            this.y-=15*this.facing[1];
            this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
        }


//boss AI goes here
//a bit of conversation... if you can call it that
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
    this.talking = false;
    if(this.gosomewhereelse <= 0){
        this.goto[0] = random(canvhalfx - 400, canvhalfx + 400);
        this.goto[1] = random(canvhalfy - 400, canvhalfy + 400 );
        this.gosomewhereelse = random(60, 150, false);//always be moving somewhere! usually near to player, but no obligation to be touching all the time
        if(random(0, 100, false) < this.luckydodge/2){
            this.boost = 3;//autododge, lmao. Though fatigue does set in for lucky dodging too much!
        }
    }else{
        this.gosomewhereelse--;
    }
    //update combolimit
    if(this.combolimit > 0){
        this.combolimit-=0.5;
    }else{
        this.combolimit+=0.2
    }
    this.move(this.goto[0], this.goto[1])

    //actually attacking
    if(this.revolver_cooldown < 0){
        //FIRE!
        let vx = aim(canvhalfx, canvhalfy, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[0];
        let vy = aim(canvhalfx, canvhalfy, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[1]
        projectiles.push(new enemyhitscan("bullet", this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 7, vx, vy, "#ffee00ff", 7, 100, 3 + this.lvl, ["hitscan", "piercing", "proj", "physical"], [vx * -3, vy * -3], 10, 4));
        this.chamber--;
        console.log("shots  " + this.chamber)
        if(this.chamber < 1){
            this.revolver_cooldown = random(60, 120, false);
        }else{
            this.revolver_cooldown = 5;
        }
    }else{
        this.revolver_cooldown--;
        if(this.chamber <6 && this.revolver_cooldown%20 == 0 && this.revolver_cooldown!= 0){
            
        this.chamber++;
        }
    }
}

}
PL999.prototype.move = function(x, y){
        if(this.hitstun > 0){
        this.hurt();
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
        return;
        }
        // really basic following script (yes I just copied the tutorial boss)
        this.hitbox.updateimmunity();
        if(this.x + player.px > x + 40){
            this.x-=this.speed * this.speedmod;
            this.facing[0] = -1
        }else if(this.x + player.px < x - 40){
            this.x+=this.speed * this.speedmod;
            this.facing[0] = 1
        }else{
            //we're getting nowhere... kind of... if they reach their objective, just assign a new one near them
            this.goto[0] = random(this.x + player.px - this.shift[0] - 200, this.x + player.px - this.shift[0] + 200);
            this.facing[0] = 0
        }
            if(this.y + player.py < y  - 40){
            this.y+=this.speed * this.speedmod;
            this.facing[1] = 1;
        }else if(this.y + player.py > y + 40){
            this.y-=this.speed * this.speedmod;
             this.facing[1] = -1;
        }else{
            //we're getting nowhere... kind of... if they reach their objective, just assign a new one near them
            this.goto[1] = random(this.y + player.py - this.shift[1] - 200, this.y + player.py - this.shift[1] + 200);
            this.facing[1] = 0;
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
        this.boost = 4;
        this.combolimit = -30;
        this.hitstun = -10;
        this.goto = [(this.x + player.px - this.shift[0] < canvhalfx)? -9999: 9999, (this.y + player.py - this.shift[1] < canvhalfy)? -9999 : 9999];
        this.gosomewhereelse = 30;
        this.revolver_cooldown = 5;
        this.chamber = 1
        return;
    }
    if(this.hitstun == 0 && random(0 , 100 , false) < this.luckydodge){
        //just dodge instead lol
        this.boost = 3;
        this.luckydodge-=10;
        if(this.luckydodge < -10){
            this.luckydodge = -10;//there's a chance bro just can't dodge... this is for me!
        }
        return;
    }
    if(this.boost > 0){
        //literally immune to damage
        return;
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