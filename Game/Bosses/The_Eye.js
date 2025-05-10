function The_Eye(startposx, startposy, size , lvl = 0, ID = 2){
//the boss in "bosses" should not be used. It's mostly just a list.
//startup
this.enemyID = ID;
this.x = startposx;
this.y = startposy;
this.z = 2; //distance up.
this.size = size;
this.height = 20;//How tall they are, if small enough, higher hitting attacks may miss! However, if too tall, that's just a hitbox extension.
this.hitbox = new hitbox(this.x, this.y, this.z, this.height, this.size);
this.hitbox.disable();
this.hitbox.immunityframes(15);
//color
this.color = "#888";
//game
this.lvl = lvl; //difficulty of boss (0 for no dif, 10 for DOOM).
this.damagetypemod = [];//some people may take more or less damage from certain sources...
this.hp = 100; //
this.facing = [-1, 0];
this.damagemod = 0.2; //Naturally, a lesser damage taken does, in fact, make bosses feel like bosses. Not the tutorial boss though
this.speed = 8 + lvl * 2//base speed
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = 0.0; //POV: regular boss
this.knockbackmod = 0 //POV: no knockback?
this.knockback = [0, 0];//x and y position of knockback


//extras
this.phase = (lvl < 5)? -1:0;
this.phasetimer = 200;
this.mx = 0;
this.my = 0;

}
The_Eye.prototype.face = function(){
        let dx = canvhalfx - (this.x + player.px);
        let dy = canvhalfy - (this.y + player.py);
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        this.velocityX = (dx / magnitude) * this.speed;
        this.velocityY = (dy / magnitude) * this.speed;
}
The_Eye.prototype.listname = function(){
//to help position the characters correctly
return "The_Eye";
}

The_Eye.prototype.exist = function(){
this.hitbox.updateimmunity();
    if(this.hp < 0){
        return "delete";
    }
    //can't take too much hitstun on hard mode!
    if(!enemyezmode() && this.hitstun > 30){
        this.hitstun = 30;
    }
    //speedmod is ALWAYS 1 to begin with
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

        if(this.phase <= 0){
        if(this.phasetimer % 75 == 0){
            enemies.push(new Eye(this.x, this.y, this.z, this.lvl, this.lvl/20));
        }
        if(this.x + player.px < canvhalfx && this.mx < this.lvl){
            //it can go faster based on what it's level is!
            if(this.hp > 50){
            this.mx+=(1 + this.lvl)/10;
            }else{
            this.mx+=(1 + this.lvl)/5;
            }
        }else if(this.x + player.px > canvhalfx && this.mx > -(this.lvl)){
                    //it can go faster based on what it's level is!
                    if(this.hp > 50){
                                this.mx-=(1 + this.lvl)/10;
                                }else{
                                this.mx-=(1 + this.lvl)/5;
                                }
                }

        if(this.y + player.py > canvhalfy - 200 && this.my > -(this.lvl)){
                    //aim over the player, not on!
                    if(this.hp > 50){
                                this.my-=(1 + this.lvl)/10;
                                }else{
                                this.my-=(1 + this.lvl)/5;
                                }
                }else if(this.y + player.py < canvhalfy - 200 && this.my < (this.lvl)){
                            //it can go faster based on what it's level is!
                            if(this.hp > 50){
                                        this.my+=(1 + this.lvl)/10;
                                        }else{
                                        this.my+=(1 + this.lvl)/5;
                                        }
                        }

        this.phasetimer--;
        if(this.phasetimer<0){
        //this.phasetimer = 50 - this.lvl * 3
        //this.face();
        //this.mx = this.velocityX;
        //this.my = this.velocityY;
        this.phase = Math.ceil(this.lvl/2);
        this.phasetimer = 0
        }
        }
        if(this.phase>0){
        console.log(this.phase)
            if(this.phasetimer-- > 0){

                this.mx = this.velocityX;
                this.my = this.velocityY;

                if(this.hp < 50){
                this.mx*=(1.25 + (50 - this.hp)/100);
                this.my*=(1.25 + (50 - this.hp)/100);
                }
               // console.log(this.phasetimer)
            }else{
                if(this.hp < 50){
                this.phase-=0.25
                this.face();
                this.phasetimer = 50 - this.lvl * 4.75;

                }else{
               this.phase-=0.5
               this.face();
               this.phasetimer = 50 - this.lvl * 4;

               }
               if(this.phase <= 0){
                              this.phase = 0;
                              this.phasetimer = 200;
                              }
            }
        }

        this.x+=this.mx;
        this.y+=this.my;
        this.hitbox.enable();
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.x + player.px, this.y + player.py, this.size);
screen.fillStyle = "#FF0000";
screen.fillRect(canvhalfx+ 100, 20, 250, 40);
screen.fillStyle = "#559900";
screen.fillRect(canvhalfx+ 100, 20, this.hp * 2.5, 40);




        this.hitbox.reassign(this.x + player.px, this.y + player.py, this.z, 8, this.size);

        if(this.hitbox.hitplayer()){
            if(charezmode()){
                player.hit(1 + ((Math.abs(this.mx) + Math.abs(this.my))/2), ["contact", "physical", this.enemyID], [this.mx * 15, this.my * 15], 20);
            }else{
                //hey, ever heard of pong?
                player.hit(Math.ceil(((Math.abs(this.mx) + Math.abs(this.my)))), ["contact", "physical", this.enemyID], [this.mx * 100, this.my * 100], 15);
            }

            this.hitbox.grantimmunity(player.listname());
        }


}

The_Eye.prototype.hurt = function(){
this.hitstun--;
this.x += this.knockback[0];
this.y += this.knockback[1];
this.knockback[0]*=0.9;
this.knockback[1]*=0.9;
if(this.x + this.size > canvas.width || this.x - this.size < 0){
this.hitstun += 3;
this.knockback[0]*=-0.5;
if(this.x < canvhalfx){
    this.x = this.size + 3;
}else{
    this.x = canvas.width - this.size - 3;
}
}
if(this.y + this.size> canvas.height || this.y- this.size < 0){
this.hitstun += 3;
this.knockback[1]*=-0.5;
if(this.y < canvhalfy){
    this.y = this.size + 3;
}else{
    this.y = canvas.height - this.size - 3;
}
}

}
The_Eye.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
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
The_Eye.prototype.inst = function(lvl = 0, startposx = this.x, startposy = this.y, size = this.size, ){
//adds a boss to the game!
enemies.push(new The_Eye(startposx, startposy, size, lvl, enemies.length));
}

function Eye(x, y, z, speed, acc, ID = 99){
    //minions!
    this.enemyID = ID;
    this.x = x;
    this.y = y;
    this.mx = 0;
    this.my = 0;
    this.mz = 0;
    this.acc = acc;
    this.hp = 100;//yeah... you thought I'd go low didn't you!
    this.z = z; //distance up.
    this.size = 15;
    this.height = 5;//How tall they are, if small enough, higher hitting attacks may miss! However, if too tall, that's just a hitbox extension.
    this.hitbox = new hitbox(this.x, this.y, this.z, this.height, this.size);
    this.hitbox.disable();
    this.hitbox.immunityframes(8);
    this.damagetypemod = [];
    this.damagemod = 2; //Naturally, a lesser damage taken does, in fact, make bosses feel like bosses. Not the tutorial boss though
    this.speed = speed//base speed
    this.speedmod = 1;//modifies speed, multiplicately
    this.speedcause = [];
    this.hitstun = 0;
    this.hitstunmod = 1;
    this.knockbackmod = 1;
    this.knockback = [0, 0];//x and y position of knockback

}
Eye.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
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
Eye.prototype.hurt = function(){
this.hitstun--;
this.x += this.knockback[0];
this.y += this.knockback[1];
this.knockback[0]*=0.9;
this.knockback[1]*=0.9;
if(this.x + this.size > canvas.width || this.x - this.size < 0){
this.hitstun += 3;
this.knockback[0]*=-0.5;
if(this.x < canvhalfx){
    this.x = this.size + 3;
}else{
    this.x = canvas.width - this.size - 3;
}
}
if(this.y + this.size> canvas.height || this.y- this.size < 0){
this.hitstun += 3;
this.knockback[1]*=-0.5;
if(this.y < canvhalfy){
    this.y = this.size + 3;
}else{
    this.y = canvas.height - this.size - 3;
}
}

}
Eye.prototype.exist = function(){
this.hitbox.updateimmunity();
    if(this.hp < 0){
        return "delete";
    }
        screen.fillStyle = "#222";
        circle(this.x + player.px, this.y + player.py, this.size + this.z);
        this.hitbox.reassign(this.x + player.px, this.y + player.py, this.z, 8, this.size);
    //can't take too much hitstun on hard mode!
    if(!enemyezmode() && this.hitstun > 30){
        this.hitstun = 30;
    }
    if(this.hitstun > 0){
        this.hurt();
        return;
    }
    //speedmod is ALWAYS 1 to begin with
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

        //all these enemies really do is approach
        if(this.x + player.px < canvhalfx && this.mx < this.speed){
                    //it can go faster based on what it's level is!

                    this.mx+=this.acc;

                }else if(this.x + player.px > canvhalfy && this.mx > -(this.speed)){
                            //it can go faster based on what it's level is!

                                        this.mx-=this.acc;

                        }

                if(this.y + player.py > canvhalfy && this.my > -(this.speed)){
                            //aim over the player, not on!

                                        this.my-=this.acc;

                        }else if(this.y + player.py < canvhalfy && this.my < (this.speed)){
                                    //it can go faster based on what it's level is!

                                                this.my+=this.acc

                                }
                //an extra for z
                console.log(this.z)
                if(this.z > player.pz + (player.height/2)+4 && this.mz < this.speed){
                    this.mz -=this.acc/2;

                }else if(this.z < player.pz + (player.height/2)-3 && this.mz > -this.speed){
                    this.mz += this.acc/2;
                }
                if(this.z < 0){
                                    this.mz = 0;
                                    this.z = 2;
                                    }

                //console.log(this.x + "  " + this.y + "  " + this.z)
                this.x +=this.mx;
                this.y+=this.my;
                this.z+=this.mz;
                this.hitbox.enable();


    //The character exists in my plane of existance!


            if(this.hitbox.hitplayer()){
                if(charezmode()){
                    player.hit(10, ["contact", "physical", this.enemyID], [this.mx * 3, this.my * 3], 10);
                }else{
                    //MOAR DAMAGE!
                    player.hit(10 + Math.ceil(((Math.abs(this.mx) + Math.abs(this.my)))), ["contact", "physical", this.enemyID], [this.mx * 8, this.my * 8], 15);
                }

                this.hitbox.grantimmunity(player.listname());
            }

}
//center stage and 20 size is the default, feel free to change it up!
bosses.push(new The_Eye(canvhalfx+200, canvhalfy, 50));