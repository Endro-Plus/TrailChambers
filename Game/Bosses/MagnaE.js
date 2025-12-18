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

this.speed = (this.lvl < 4)? this.lvl*3:12; //base speed
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = 0.1; //POV: weak ass boss who isn't immune to hitstun
this.knockbackmod = 2.5; //POV: weak ass boss who isn't immune to knockback
this.knockback = [0, 0];//x and y position of knockback
this.talking = true;

//extras
this.phase = (this.lvl > 5)? [0, 1]:[1, 30]; // zoning, attacking, hyperspeed
this.mercyframes = 60; //a couple seconds to get your barrings before death
this.chuckbox = new hitbox(this.x, this.y, this.z+1, this.height - 1, 40);
this.chuckbox.disable();
this.chuckbox.immunityframes(5);
this.runaura = new hitbox(this.x, this.y, 0, 99, 75);
this.runaura.disable();
this.showchuck = 0;
this.chuckdown = 0;
this.shurikenspeed = this.lvl*2;
this.dashlocale = []
this.combotimer = 0;//can only deal full damage with strong moves without setup!
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
  if(player.listname() == "Magna"){
screen.fillText("*glares*", this.x + player.px, this.y-+ 50 + player.py)
  }else if (player.listname() == "Magmax"){
screen.fillText("*Stares cutely*", this.x + player.px, this.y-+ 50 + player.py)
  }else{
  screen.fillText("*Bows*", this.x + player.px, this.y-+ 50 + player.py);
  }
  if(this.hitbox.scanplayer()){
    player.hit(0, ['contact', this.enemyID])
  }
}else{
    this.talking = false;
    this.combotimer--;
//this.chuckbox.showbox();
if(this.phase[0] == 0){
this.zone();

}else if (this.phase[0] == 1){
    this.move()

}else{
    //go to the player, but be a little off on purpose
    if(this.dashlocale.length == 0){
    let dx = canvhalfx - (this.x + player.px  - this.shift[0]+ random(-40, 40));
    let dy = canvhalfy - (this.y + player.py - this.shift[1] + random(-40, 40));
    let magnitude = Math.sqrt(dx * dx + dy * dy);
    this.dashlocale[0] = (dx / magnitude) * (this.speed + this.lvl);
    this.dashlocale[1] = (dy / magnitude) * (this.speed + this.lvl);
    this.dashlocale[2] = -1
    //console.log(this.dashlocale)
    }
    this.VROOOM(this.dashlocale[0], this.dashlocale[1]);

}
this.chuckdown--;
this.phase[1]--;
if(this.phase[1] < 0){
    if(this.lvl > 5 && this.phase[0] == 0){
        //instant shuriken parry
        this.chuckdown = -5;
        this.zone();
        this.chuckdown = -5;
        this.phase = [1, 20]
    }else{
    this.phase[0] = random(0, 2, false)
    this.phase[1] = random(60, 120, false)
    this.dashlocale = [];
    }
    if(this.lvl < 5){
    this.chuckdown = 10;
    }
    
}
}
this.hitbox.move(this.x + player.px  - this.shift[0], this.y + player.py  - this.shift[0]);
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.x + player.px  - this.shift[0], this.y + player.py  - this.shift[1], this.size);





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
        // stay in his range, which happens to fuck up particular bad characters... simia
        this.hitbox.updateimmunity();
        this.chuckbox.updateimmunity();
        if(this.x + player.px - this.shift[0] > canvhalfx + 40){
            this.x-=this.speed * this.speedmod;
            this.facing = [-1, 0];
        }else if (this.x + player.px  - this.shift[0]< canvhalfx - 40){
            this.x+=this.speed * this.speedmod;
            this.facing = [1, 0];
        }if(this.y + player.py - this.shift[1]< canvhalfy - 40){
            this.y+=this.speed * this.speedmod;
            this.facing = [0, 1];
        }else if (this.y + player.py - this.shift[1] > canvhalfy + 40){
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
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 5, this.size);
        this.chuckbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
        
        //contact damage
        if(this.hitbox.hitplayer()){
        console.log("hit")
        //no contact comboes!!!
            player.hit(2, ["contact", "physical", this.enemyID], [2 * this.facing[0], 2 * this.facing[1]], 2);
            this.x-=7*this.speed*this.speedmod*this.facing[0];
            this.y-=7*this.speed*this.speedmod*this.facing[1];
            
            this.hitbox.grantimmunity(player.listname());
        }

        //nunchuck hitbox
        if(enemyezmode() && this.chuckbox.scanplayer() && this.chuckdown < 1 || this.chuckbox.hitplayer() && this.chuckdown < 1){
            //maximum carnage!
            this.showchuck = 4;
            if(enemyezmode()){
            this.chuckdown = 12;
            }else{
                this.chuckdown = 9
            }
            
            if(this.chuckbox.hitplayer()){
                //a little less damage for easy mode
                player.hit((enemyezmode())? 4:8, ["bludgeoning", "physical"], [-12 * this.facing[0], -12 * this.facing[1]], 4, 8);
                this.phase[1]-=10;//these comboes are too long...
                this.combotimer = 40;
            }
            
            this.chuckbox.grantimmunity(player.listname());
            
        }
        //for parrying projectiles
        for(let i = 0 ; i < projectiles.length ; i++){
            if(this.chuckbox.scanproj(i) && typeof projectiles[i].lifetime == "number" && this.chuckdown < 0){
                //PARRY THAT SHIT!
                projectiles[i].lifetime = 0;
                
                this.showchuck = 4;
                if(enemyezmode()){
            this.chuckdown = 12;
            }else{
                this.chuckdown = 9
            }

            
            
            let dx = canvhalfx - (this.x + player.px - this.shift[0]);
            let dy = canvhalfy - (this.y + player.py - this.shift[1]);
            let magnitude = Math.sqrt(dx * dx + dy * dy);
            velocityX = (dx / magnitude) * this.shurikenspeed;
            velocityY = (dy / magnitude) * this.shurikenspeed;
            
            projectiles.push(new ParryProjE(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 12, velocityX,velocityY, (this.lvl < 9)? 10 - this.lvl:0));
        }

        }

        //show chuck hitbox
        if(this.showchuck > 0){
            this.showchuck--;
            screen.beginPath();
            screen.fillStyle = "#4d1a00";
            screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.chuckbox.size, this.facing[2], this.facing[2] + Math.PI);
            screen.fill();
            screen.closePath();
        }



}
MagnaE.prototype.zone = function(){
        if(this.hitstun > 0){
        this.hurt();
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
        return;
        }
        if(arena.leave(this.x - this.shift[0], this.y - this.shift[1], this.size)){
        this.phase[0] = 1;//if already out of bounds, just go back to trying to attack;

    }
        this.hitbox.updateimmunity();
        //literally run away
        this.runaura.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
        if(this.runaura.scanplayer()){
        if(this.x + player.px - this.shift[0] > canvhalfx){
            this.x+=this.speed * this.speedmod;
            this.facing = [1, 0];
        }else if (this.x + player.px - this.shift[0]< canvhalfx){
            this.x-=this.speed * this.speedmod;
            this.facing = [-1, 0];
        }if(this.y + player.py - this.shift[1] < canvhalfy){
            this.y-=this.speed * this.speedmod;
            this.facing = [0, -1];
        }else if (this.y + player.py - this.shift[1]> canvhalfy){
            this.y+=this.speed * this.speedmod;
            this.facing = [0, 1];
        }
    }

        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 5, this.size);

        if(this.hitbox.hitplayer()){
        console.log("hit")
            player.hit(0, ["contact", "physical", 0]);
        }
        
        if(this.chuckdown < 1){
            if(enemyezmode()){
            this.chuckdown = 30;
            }else{
                this.chuckdown = 15;
            }
            // Calculate direction to throw shuriken
        let dx = canvhalfx - (this.x + player.px - this.shift[0]);
        let dy = canvhalfy - (this.y + player.py - this.shift[1]);
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        velocityX = (dx / magnitude) * this.shurikenspeed;
        velocityY = (dy / magnitude) * this.shurikenspeed;

            projectiles.push(new enemyproj("ShurikenE", this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 12, velocityX,velocityY, "grey", 12, 150, ["physical", "slashing", "proj"]));

        }
    }

MagnaE.prototype.VROOOM = function(speedx, speedy){
    if(this.hitstun > 0){
        this.hurt();
        this.phase[0] = random(0, 1, false);//stop sliding when knocked back
        return;
    }
    this.hitbox.updateimmunity();
    this.chuckbox.updateimmunity();
    
    this.knockback = [0, 0]//negate all knockback when sliding
    if(arena.leave(this.x - this.shift[0], this.y - this.shift[1], this.size)){
        this.phase[0] = 1;//if already out of bounds, just go back to trying to attack;

    }
        //SPEED SLIDE
        this.x+=speedx * this.dashlocale[2];
        this.y+=speedy * this.dashlocale[2];
        if(this.dashlocale[2] < 2){
            this.dashlocale[2]+=0.2;

        }else{
            this.dashlocale[2] = 2;
        }
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 2, this.size);//VERY low profile
        
        //contact damage
        if(this.hitbox.hitplayer()){
        console.log("hit")
        //the love tap (now does less damage in comboes, because magna just LOVES comboing into it)
            player.hit((player.hitstun > 0 || this.combotimer > 0)? 25:69, ["contact", "physical", "set", 0], [speedx * 10, 40 * speedy * 10], 30, 0);
            this.hitstun = 45;
            this.phase[1] = 0;
            this.combotimer = 120;//yes, get unlucky enough and you too will suffer the wrath of lovetap > lovetap > lovetap > lovetap ...
            this.hitbox.grantimmunity(player.listname());
        }

        //for parrying projectiles (hard mode only this time)
        if(!enemyezmode()){
            this.chuckbox.move(this.x + player.px, this.y + player.py);
        
        for(let i = 0 ; i < projectiles.length ; i++){
            if(this.chuckbox.scanproj(i) && typeof projectiles[i].lifetime == "number"){
                //PARRY THAT SHIT!
                projectiles[i].lifetime = 0;
                this.showchuck = 4;
                if(enemyezmode()){
            this.chuckdown = 9;
            }else{
                this.chuckdown = 7;//bro's damn near immune to projectiles
            }

            
            
            let dx = canvhalfx - (this.x + player.px - this.shift[0]);
            let dy = canvhalfy - (this.y + player.py - this.shift[1]);
            let magnitude = Math.sqrt(dx * dx + dy * dy);
            velocityX = (dx / magnitude) * this.shurikenspeed;
            velocityY = (dy / magnitude) * this.shurikenspeed;
            //as a bonus, parried projectiles make Magna beeline towards you!
            this.dashlocale[0] = (dx / magnitude) * (this.speed + this.lvl);
            this.dashlocale[1] = (dy / magnitude) * (this.speed + this.lvl);

            projectiles.push(new ParryProjE(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 12, velocityX,velocityY, (this.lvl < 9)? 10 - this.lvl:0));
        }

        }
    

        //show chuck hitbox
        if(this.showchuck > 0){
            this.showchuck--;
            screen.beginPath();
            screen.fillStyle = "#4d1a00";
            screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.chuckbox.size, this.facing[2], this.facing[2] + Math.PI);
            screen.fill();
            screen.closePath();
        }
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
this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 5, this.size);
}
MagnaE.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
    //Unlike his training bot, you only get ONE free hit on Magna
    if(this.mercyframes > 0){
        this.mercyframes = 0;
        this.phase = [2, 30];

    }
    if(this.dashlocale[2] < 0){
        return;//first boss with Iframes!
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


function ParryProjE(x, y, size, mx, my, delay = 0){
    this.name = "PARRIED";
    this.x = x;
    this.y = y;
    this.type = "hitscan"
    this.origin = [this.x, this.y]
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.range = 400
    this.delay = delay;
    this.lifetime = 1;//yes, this is supposed to be parriable, good luck
}
ParryProjE.prototype.exist = function(){
    
    
   
    
    this.x = this.origin[0];
    this.y = this.origin[1];
    if(this.delay > 0){
        screen.fillStyle = "rgb(213, 217, 221, 0.5)";
        this.delay--;
        circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size * 5)
    }else{
        screen.fillStyle = "rgb(213, 217, 221, " + this.lifetime + ")";
        this.hitbox.enable();
    for(let i = 0 ; i < this.range ; i++){
        this.x+=this.mx;
        this.y+=this.my;
        circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)

        if(this.lifetime == 1){
            this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
            if(this.hitbox.hitplayer()){
                enemyattack = this.name;
                player.hit(24, ["magic", "hitscan", "set"], [this.mx * -2, this.my * -2], 30);
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
}
    //hitting the player
    //console.log(en);
    
}