function MagnaE(startposx, startposy, size , lvl = 0, ID = -5){
//first boss that's also a character!
//startup
this.enemyID = ID;
this.x = startposx;
this.y = startposy;
this.shift = [this.x, this.y];//how their position may shift
this.z = 0; //distance up.
this.size = size;
this.height = 8;//How tall they are, if small enough, higher hitting attacks may miss! However, if too tall, that's just a hitbox extension.
this.hitbox = new hitbox(this.x, this.y, this.z, this.height, this.size);
this.hitbox.disable();
this.hitbox.immunityframes(9);
//color
this.color = "#0000ff";
//game
this.lvl = lvl; //difficulty of boss (0 for no dif, 10 for DOOM). You can go over!
this.damagetypemod = [];//some people may take more or less damage from certain sources...
this.hp = 100; //EVEN THE FUCKING BOSSES GET 100!!!!!!
this.facing = [0, 0];
this.damagemod = 0.5;//weaker boss noises
this.speed = 5; //base speed
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = 1; //POV: weak ass boss who isn't immune to hitstun
this.knockbackmod = 1.5; //POV: weak ass boss who isn't immune to knockback
this.knockback = [0, 0];//x and y position of knockback


//extras
this.tutorial = 0;
this.turnRate = 0.05;
MagnaE.prototype.listname = function(){
//to help position the characters correctly
return "MagnaE";
}
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
this.move();
this.hitbox.move(this.x + player.px, this.y + player.py);
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.x + player.px, this.y + player.py, this.size);



//boss AI goes here

}
MagnaE.prototype.move = function(){
        if(this.hitstun > 0){
        this.hurt();
        this.hitbox.reassign(this.x + player.px, this.y + player.px, this.z, 8, this.size);
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
this.x += this.knockback[0];
this.y += this.knockback[1];
this.knockback[0]*=0.98;
this.knockback[1]*=0.98;
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
bosses.push(new MagnaE(canvhalfx+200, canvhalfy, 20));