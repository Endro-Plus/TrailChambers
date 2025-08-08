//HARP stands for Homing Assault Repeater Platform 
function HARP(startposx, startposy, size , lvl = 0, ID = -5){
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
this.hitbox.immunityframes(0);//this boss will do no contact damage, first of its kind!
//color
this.color = "#ff0";
//game
this.lvl = lvl; //difficulty of boss (0 for no dif, 10 for DOOM). You can go over!
this.damagetypemod = [];//some people may take more or less damage from certain sources...
this.hp = 100; //EVEN THE FUCKING BOSSES GET 100!!!!!!
this.facing = [0, 0];
this.damagemod = 0.1;//weaker boss noises
this.speed = lvl; //base speed (shooting speed in this case)
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = 0; //POV: weak ass boss who isn't immune to hitstun
this.knockbackmod = 0; //POV: weak ass boss who isn't immune to knockback
this.knockback = [0, 0];//x and y position of knockback
//extras
this.shots = lvl;
this.cooldown = 60;
this.velocityX = 0;
this.velocityY = 0;
this.phase = -1;
}
HARP.prototype.listname = function(){
//to help position the characters correctly
return "HARP";
}
HARP.prototype.face = function(speed = this.speed){
        let dx = canvhalfx - (this.x + player.px - this.shift[0]);
        let dy = canvhalfy - (this.y + player.py - this.shift[1]);
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        this.velocityX = (dx / magnitude) * speed;
        this.velocityY = (dy / magnitude) * speed;
}
HARP.prototype.exist = function(){
    if(this.hp < 0){
        return "delete";
    }
    //speedmod is ALWAYS 1 to begin with (here anyways)
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
this.hitbox.enable();
this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size);
if(this.hitbox.hitplayer()){
    player.hit(0, ["contact", this.enemyID]);
}




//boss AI goes here
if(this.cooldown < 1){
    if(this.shots != 0){
        //shoot
        if(this.shots > 0){
            //regular shots
            if(this.hp < 50){
                if(this.shots % 2 == 0){
                 this.face(this.speed * 6);
                }
                 this.velocityX += random(-3, 3);
            this.velocityY += random(-3, 3);
            }else{
             if(this.shots % 2 == 0){
                 this.face(this.speed * 3);
                }
            this.velocityX += random(-1, 1);
            this.velocityY += random(-1, 1);
            }
            
            projectiles.push(new enemyproj("Nail", this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 4, this.velocityX, this.velocityY, "rgb(128, 128, 128)", 1, 90, ["physical", "proj", "piercing"], [this.velocityX * -0.5, this.velocityY * -0.5], 6, 5))
           
            if(this.hp < 50){
            //lower cooldown between shots at less than 50%
            if(this.lvl > 5){
                this.shots-=0.1
                this.cooldown = 0;
            }else{
             this.shots-=0.2;
             this.cooldown = 1
            }
            
        }else{
        this.cooldown = random(2, 4, false);
         this.shots-=0.2;
        }
        this.shots = this.shots.toFixed(1)
        }else{
             this.face();
             this.velocityX = random(-30, 30);
             this.velocityY = random(-30, 30);
            projectiles.push(new enemyhomeproj("Homing", this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 15 + (this.lvl), this.velocityX, this.velocityY, "rgba(251, 255, 0, 1)", 10+this.lvl, 210, this.speed * 6, 60, 30, 0.05, ["magic", "proj", "bludgeoning"]))
            this.shots++;
            

            if(this.hp < 50 && !enemyezmode()){
            //lower cooldown between shots at less than 50%
            //this.cooldown = random(3, 5, false);
            if(enemyezmode()){
                this.cooldown = 7;
            }else{
                this.cooldown = random(3, 5, false);
            }
        }else{
            if(enemyezmode()){
                this.cooldown = 10;
            }else{
                this.cooldown = random(5, 8, false);
            }
        }
        }


        //this.shots = (this.shots > 0)? this.shots - 1 : this.shots + 1
        //cooldown for shooting
        
    }else{
        if(enemyezmode()){
            this.cooldown = random(10, 25, false);
        }else{
            this.cooldown = random(20/(100/this.hp + (10 - this.lvl)), 40/(100/this.hp + (10 - this.lvl)), false)//based on hp the cooldown between shots is reduced. level is also a factor!
        }
        
        while(this.shots == 0){
            
            this.shots = random(-this.lvl, this.lvl, false);
            if(this.hp < 50 && Math.abs(this.shots) < this.lvl/2){
                //at 50% hp, there must be a certain amount of shots
            this.shots = (random(0, 1, false)? -this.lvl/2 : this.lvl/2);
            }
        }

    }
}else{
    this.cooldown--;
}

if(this.hp < 50 && this.phase == -1){
    //second phase!
    this.phase = this.lvl * 5;
}
if(this.phase > 0 && this.phase % 5 == 0){
    bosses[6].inst(false, 12, this.lvl/2,this.x - this.shift[0], this.y - this.shift[1], 24);
    //console.log("hi")
}
if(this.phase > 0){
    this.phase--;
}
}




HARP.prototype.hurt = function(){
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
HARP.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
    var dmg = damage * this.damagemod;
    for(let i = 0 ; i < this.damagetypemod.length ; i++){
        if(damagetype.includes(this.damagetypemod[i][0])){
            dmg *= this.damagetypemod[i][1];
        }
    }
    this.hp-=dmg;
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
HARP.prototype.inst = function(lvl = 0, startposx = this.x, startposy = this.y, size = this.size, ){
//adds a boss to the game!
enemies.push(new HARP(startposx, startposy, size, lvl, enemies.length));
}
//center stage and 20 size is the default, feel free to change it up!
bosses.push(new HARP(canvhalfx, canvhalfy, 50));