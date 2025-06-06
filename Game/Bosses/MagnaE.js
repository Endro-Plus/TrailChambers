function MagnaE(startposx, startposy, size , lvl = 0, ID = -5){
//first boss that's also a character!
//startup
this.enemyID = ID;
this.x = startposx;
this.y = startposy;
this.shift = [this.x, this.y];//how their position may shift
this.z = 0; //distance up.
this.size = size;
this.height = 5;//How tall they are, if small enough, higher hitting attacks may miss! However, if too tall, that's just a hitbox extension.
this.hitbox = new hitbox(this.x, this.y, this.z, this.height, this.size);
this.hitbox.disable();
this.hitbox.immunityframes(9);

//color
this.color = "#FF8B00";
//game
this.lvl = lvl; //difficulty of boss (0 for no dif, 10 for DOOM). You can go over!
this.damagetypemod = [];//some people may take more or less damage from certain sources...
this.hp = 100; //EVEN THE FUCKING BOSSES GET 100!!!!!!
this.facing = [0, 0, 0];
this.damagemod = 0.5;//weaker boss noises
this.speed = 12; //base speed
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = 0.1; //POV: weak ass boss who isn't immune to hitstun
this.knockbackmod = 2.5; //POV: weak ass boss who isn't immune to knockback
this.knockback = [0, 0];//x and y position of knockback


//extras
this.phase = [0, 99999]; // zoning, attacking, hyperspeed
this.mercyframes = 60; //a couple seconds to get your barrings before death
this.chuckbox = new hitbox(this.x, this.y, this.z+1, this.height - 1, 40);
this.chuckbox.disable();
this.chuckbox.immunityframes(5);
this.runaura = new hitbox(this.x, this.y, this.z+1, this.height - 1, 75);
this.showchuck = 0;
this.chuckdown = 0;
this.shurikenspeed = this.lvl*2;
}
MagnaE.prototype.listname = function(){
//to help position the characters correctly
return "MagnaE";
}


MagnaE.prototype.exist = function(){
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
this.knockback[0]*=0.95;
this.knockback[1]*=0.95;
this.x += this.knockback[0];
this.y += this.knockback[1];
if(this.mercyframes > 0){
this.mercyframes--;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "15px Times New Roman";
  screen.fillText("*Bows*", this.x + player.px, this.y-+ 50 + player.py)
}else{
//this.chuckbox.showbox();
if(this.phase[0] == 0){
this.zone();

}else if (this.phase[0] == 1){
    this.move()

}else{
    this.VROOOM()

}
this.chuckdown--;
this.phase[1]--;
if(this.phase[1] < 0){
    if(this.lvl > 5 && this.phase[0] == 0){
        //instant shuriken parry
        this.chuckdown = 0;
        this.zone();
        this.phase = [2, 20]
    }else{
    this.phase[0] = random(0, 2)
    this.phase[1] = random(30, 250)
    }
    this.chuckdown = 0;
    
}
}
this.hitbox.move(this.x + player.px, this.y + player.py);
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.x + player.px, this.y + player.py, this.size);



//boss AI goes here

}
MagnaE.prototype.move = function(){
        if(this.hitstun > 0){
        this.hurt();
        return;
        }
        if(Math.abs(this.knockback[0]) < 1 || Math.abs(this.knockback[1]) < 1){
            //this.hurt();
            //this.hitbox.reassign(this.x + player.px, this.y + player.px, this.z, 8, this.size);

        }
        // stay in his range, which happens to fuck up particular bad character mains... simia
        this.hitbox.updateimmunity();
        this.chuckbox.updateimmunity();
        if(this.x + player.px > canvhalfx + 45){
            this.x-=this.speed * this.speedmod;
            this.facing = [-1, 0];
        }else if (this.x + player.px < canvhalfx - 45){
            this.x+=this.speed * this.speedmod;
            this.facing = [1, 0];
        }if(this.y + player.py < canvhalfy - 45){
            this.y+=this.speed * this.speedmod;
            this.facing = [0, 1];
        }else if (this.y + player.py > canvhalfy + 45){
            this.y-=this.speed * this.speedmod;
            this.facing = [0, -1];
        }
        // attack direction
         if(this.facing[0] == -1){
    //console.log("left")
        if(this.facing[1] == 1){
            //left down
            this.facing[2] = Math.PI / 4;
        }else if (this.facing[1] == -1){
            //left up
            this.facing[2] = 3 * Math.PI / 4;
        }else{
            //just left
            this.facing[2] = Math.PI/2
        }
    }else if (this.facing[0] == 1){
        if(this.facing[1] == 1){
                    //right down
                    this.facing[2] = 7 * Math.PI / 4;
                }else if (this.facing[1] == -1){
                    //right up
                    this.facing[2] = 5 * Math.PI / 4;

                }else{
                    //just right
                    this.facing[2] = 3 * Math.PI / 2;
                    //console.log(this.facing[2])
                }

    }else{
        if(this.facing[1] == -1){
            //just up
            this.facing[2] = Math.PI
        }else{
            //just down
            this.facing[2] = 0
        }
    }
        this.hitbox.reassign(this.x + player.px, this.y + player.py, this.z, 8, this.size);
        this.chuckbox.move(this.x + player.px, this.y + player.py);
        
        //contact damage
        if(this.hitbox.hitplayer()){
        console.log("hit")
        //no contact comboes!!!
            player.hit(2, ["contact", "physical", 0], [2 * this.facing[0], 2 * this.facing[1]], 2);
            this.x-=7*this.speed*this.speedmod*this.facing[0];
            this.y-=7*this.speed*this.speedmod*this.facing[1];
            
            this.hitbox.grantimmunity(player.listname());
        }

        //nunchuck hitbox
        if(enemyezmode() && this.chuckbox.scanplayer() && this.chuckdown < 1 || this.chuckbox.hitplayer() && this.chuckdown < 1){
            //maximum carnage!
            this.showchuck = 4;
            if(enemyezmode()){
            this.chuckdown = 9;
            }else{
                this.chuckdown = 7
            }
            
            if(!enemyezmode() || this.chuckbox.hitplayer()){
                player.hit(8, ["contact", "physical", 0], [12 * this.facing[0], 12 * this.facing[1]], 9);
            }
            
            this.chuckbox.grantimmunity(player.listname());
            
        }

        //show chuck hitbox
        if(this.showchuck > 0){
            this.showchuck--;
            screen.beginPath();
            screen.fillStyle = "#4d1a00";
            screen.arc(this.x + player.px, this.y + player.py, this.chuckbox.size, this.facing[2], this.facing[2] + Math.PI);
            screen.fill();
            screen.closePath();
        }



}
MagnaE.prototype.zone = function(){
        if(this.hitstun > 0){
        this.hurt();
        return;
        }
    
        this.hitbox.updateimmunity();
        //literally run away
        this.runaura.move(this.x + player.px, this.y + player.py);
        if(this.runaura.scanplayer()){
        if(this.x + player.px > canvhalfx){
            this.x+=this.speed * this.speedmod;
            this.facing = [1, 0];
        }else if (this.x + player.px < canvhalfx){
            this.x-=this.speed * this.speedmod;
            this.facing = [-1, 0];
        }if(this.y + player.py < canvhalfy){
            this.y-=this.speed * this.speedmod;
            this.facing = [0, -1];
        }else if (this.y + player.py > canvhalfy){
            this.y+=this.speed * this.speedmod;
            this.facing = [0, 1];
        }
    }

        this.hitbox.reassign(this.x + player.px, this.y + player.py, this.z, 8, this.size);

        if(this.hitbox.hitplayer()){
        console.log("hit")
            player.hit(0, ["contact", "physical", 0]);
        }
        
        if(this.chuckdown < 1){
            this.chuckdown = 30;
            // Calculate direction to throw shuriken
        let dx = canvhalfx - (this.x + player.px);
        let dy = canvhalfy - (this.y + player.py);
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        velocityX = (dx / magnitude) * this.shurikenspeed;
        velocityY = (dy / magnitude) * this.shurikenspeed;

            projectiles.push(new Shuriken(this.x + player.px, this.y + player.py, 12, velocityX,velocityY));

        }
    }



MagnaE.prototype.VROOOM = function(){
        if(this.hitstun > 0){
        this.hurt();
        return;
        }
        if(Math.abs(this.knockback[0]) < 1 || Math.abs(this.knockback[1]) < 1){
            //this.hurt();
            //this.hitbox.reassign(this.x + player.px, this.y + player.px, this.z, 8, this.size);

        }
        // really basic following script (yes I just copied the tutorial boss)
        this.hitbox.updateimmunity();
        if(this.x + player.px > canvhalfx + 10){
            this.x-=this.speed * this.speedmod;
            this.facing = [-1, 0];
        }else if(this.x + player.px < canvhalfx - 10){
            this.x+=this.speed * this.speedmod;
            this.facing = [1, 0];
        }else if(this.y + player.py < canvhalfy){
            this.y+=this.speed * this.speedmod;
            this.facing = [0, 1];
        }else{
            this.y-=this.speed * this.speedmod;
            this.facing = [0, -1];
        }

        this.hitbox.reassign(this.x + player.px, this.y + player.py, this.z, 8, this.size);

        if(this.hitbox.hitplayer()){
        console.log("hit")
            player.hit(5, ["contact", "physical", 0], [9 * this.facing[0], 9 * this.facing[1]], 10);
            this.x+=2*this.speed*this.speedmod*this.facing[0];
            this.y+=2*this.speed*this.speedmod*this.facing[1];
            
            this.hitbox.grantimmunity(player.listname());
        }



}
MagnaE.prototype.hurt = function(){
this.hitstun--;

//this.x += this.knockback[0];
//this.y += this.knockback[1];
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
MagnaE.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
    //Unlike his training bot, you only get ONE free hit on Magna
    if(this.mercyframes > 0){
        this.mercyframes = 0;
        this.phase = [2, 30];

    }
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
   //this.hitstun = 1
    
}
MagnaE.prototype.inst = function(lvl = 0, startposx = this.x, startposy = this.y, size = this.size, ){
//adds a boss to the game!
enemies.push(new MagnaE(startposx, startposy, size, lvl, enemies.length));
enemies[enemies.length - 1].shift[0] = player.px;
enemies[enemies.length - 1].shift[1] = player.py;
}
//center stage and 20 size is the default, feel free to change it up!
bosses.push(new MagnaE(canvhalfx+200, canvhalfy, 13));

function Shuriken(x, y, size, mx, my){
    this.name = "Shuriken";
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.lifetime = 750
}
Shuriken.prototype.exist = function(){
    this.lifetime--;
   
    screen.fillStyle = "#AAA";
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
    this.x+=this.mx;
    this.y+=this.my;

    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    console.log((this.x - (canvhalfx + player.playershift[0])) + " " + (this.y - (canvhalfx + player.playershift[1])));
    //console.log(arena.leavedir(this.x, this.y, this.size))
    if(this.lifetime < 0){
        return "delete";
    }
    //hitting the player
    //console.log(en);
    if(this.hitbox.hitplayer()){
        player.hit(12, ["physical", "slashing"]);
        return "delete";
    }
}

function ParryProj(x, y, size, mx, my){
    this.name = "PARRIED";
    this.x = x;
    this.y = y;
    this.origin = [this.x, this.y]
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.range = 400
    this.lifetime = 1;
}
ParryProj.prototype.exist = function(){
    
   
    screen.fillStyle = "rgb(213, 217, 221, " + this.lifetime + ")";
    this.x = this.origin[0];
    this.y = this.origin[1];
    for(let i = 0 ; i < this.range ; i++){
        this.x+=this.mx;
        this.y+=this.my;
        circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)

        if(this.lifetime == 1){
            this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
            if(this.hitbox.hitplayer()){
                player.hit(24, ["physical", "slashing"], [this.mx * 2, this.my * 2], 15);
                this.range = i;
                break;
    }
        }

    }
    //console.log(arena.leavedir(this.x, this.y, this.size))
    this.lifetime-=0.1;
    if(this.lifetime <= 0){
        return "delete";
    }
    //hitting the player
    //console.log(en);
    
}