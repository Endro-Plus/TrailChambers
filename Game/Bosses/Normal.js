function Normal(alive, startposx, startposy, size, speed , lvl = 0, ID = -5){
//the boss in "bosses" should not be used. It's mostly just a list.
//startup
this.alive = alive;
this.enemyID = ID;
this.x = startposx;
this.y = startposy;
this.shift = [0, 0];//how their position may shift
this.z = 0; //distance up.
this.size = size;
this.height = 8;//How tall they are, if small enough, higher hitting attacks may miss! However, if too tall, that's just a hitbox extension.
this.hitbox = new hitbox(this.x, this.y, this.z, this.height, this.size);
this.hitbox.disable();
//this.hitbox.immunityframes(60);
//color
this.color = "rgb(128, 128, 128)";
//game
this.lvl = lvl; //difficulty of boss (0 for no dif, 10 for DOOM). You can go over!
this.damagetypemod = [["CRITICAL", 0.8]];//slightly resistant to crits
this.hp = 100; //EVEN THE FUCKING BOSSES GET 100!!!!!!
this.facing = [0, 0];
this.damagemod = 0.15;//POWER
this.speed = speed; //base speed
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = 1.5; //POV: weak ass boss who isn't immune to hitstun
this.hitstun = 60;//for these enemies, hitstun is just how long they're harmless
this.knockbackmod = 0; //knockback, what's that?
this.knockback = "legacy"

//extras
this.direction = null
Normal.prototype.listname = function(){
//to help position the characters correctly
return "Normal";
}
}
Normal.prototype.exist = function(){
    if(this.alive == true && this.hp < 0|| bossbar.length == 0 && this.alive == false){
        return "delete";
    }
    if(this.hitstun >= 0){
        this.hitstun--;
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
//this.hitbox.updateimmunity();
//The character exists in my plane of existance!
//harmless color
if(this.hitstun > 25){
    this.color = "rgba(128, 128, 128, 0.2)";
}else{
    this.color = `rgba(128, 128, 128, ${1 - this.hitstun/30}`;
}
screen.fillStyle = this.color;
screen.strokeStyle = "black"
screen.lineWidth = 3;
circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size, false, false);
screen.lineWidth = 1;
//damage
if(this.hitbox.scanplayer() && this.hitstun <= 0){
    //deal devestating damage!
    this.hitstun = 30 - (this.lvl*3);
    player.hit(20 + (this.lvl*2), ["contact", this.enemyID]);
}
//moving
if(this.direction == null){
    //time to direct my influence!
    this.direction = [];
    this.direction.push(random(-this.speed, this.speed))
    this.speed-= Math.abs(this.direction[0])
    this.direction.push((random(0, 1, false))? -this.speed:this.speed)
}
if(this.alive){
    screen.fillStyle = "#00000080"
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size * 0.5);
}

this.x+= this.direction[0]*this.speedmod;
this.y+= this.direction[1]*this.speedmod;

//out of bounds
if(this.x - this.shift[0] - this.size < canvhalfx - arena.w){
//bounce right

this.direction[0] = Math.abs(this.direction[0])

}else if(this.x - this.shift[0] + this.size > canvhalfx - arena.w + arena.w*2){
//bounce left

this.direction[0] = Math.abs(this.direction[0]) * -1

}
if(this.y - this.shift[1]  - this.size< canvhalfy - arena.h){
//bounce down

this.direction[1] = Math.abs(this.direction[1])

}else if(this.y - this.shift[1]  + this.size> canvhalfy - arena.h + arena.h*2){
//bounce up

this.direction[1] = Math.abs(this.direction[1]) * -1

}
}
Normal.prototype.hurt = function(){
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
Normal.prototype.hit = function(damage, damagetype = ["true"], knockback = "legacy", hitstun = 0){
    //knockback is gay tbh
    var dmg = damage * this.damagemod;
    for(let i = 0 ; i < this.damagetypemod.length ; i++){
        if(damagetype.includes(this.damagetypemod[i][0])){
            dmg *= this.damagetypemod[i][1];
        }
    }
    this.hp-=dmg;
    
    if(this.hitstun > 0){
        return
    }else{
    this.hitstun = hitstun * this.hitstunmod;
    if(this.hitstun > 90){
        this.hitstun = 90;
        //not too much i frames lol
    }
    }
    //console.log(this.hitstun);
}
Normal.prototype.inst = function(alive, speed, lvl = 0, startposx = this.x, startposy = this.y, size = this.size, ){
//adds a boss to the game!
enemies.push(new Normal(alive, startposx, startposy, size, speed, lvl, enemies.length));
}
//center stage and 20 size is the default, feel free to change it up!
bosses.push(new Normal(canvhalfx+200, canvhalfy, 30));