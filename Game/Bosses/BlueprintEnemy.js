function Blueboss(startposx, startposy, size , lvl = 0, ID = -5){
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
this.knockbackmod = 1; //POV: weak ass boss who isn't immune to knockback
this.knockback = [0, 0];//x and y position of knockback
this.talking = false;//basically an indicator of whether or not summons should target this boss
this.showimmunity = false;
this.light = false;//overrides the default weight of an enemy (which is determined by knockback mod)
//extras
this.tutorial = 0;
this.turnRate = 0.05;
Blueboss.prototype.listname = function(){
//to help position the characters correctly
return "Blueboss";
}
}
Blueboss.prototype.exist = function(){
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
circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);



//boss AI goes here

}
Blueboss.prototype.move = function(){
        if(this.hitstun > 0){
        this.hurt();
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
        return;
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

        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);

        if(this.hitbox.hitplayer()){
        console.log("hit")
            if(this.lvl < 5){
            player.hit(5, ["contact", "physical", 0], [6 * this.facing[0], 6 * this.facing[1]], 10);
            this.x+=2*this.speed*this.speedmod*this.facing[0];
            this.y+=2*this.speed*this.speedmod*this.facing[1];
            }else{
                //bro comboed too good using easy mode stats
                player.hit(4, ["contact", "physical", 0], [(this.speed + 3)  * this.facing[0], (this.speed + 3) * this.facing[1]], 10);
                this.x+=this.speed*this.speedmod*this.facing[0];
                this.y+=this.speed*this.speedmod*this.facing[1];
            }
            this.hitbox.grantimmunity(player.listname());
        }



}
Blueboss.prototype.hurt = function(){
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
Blueboss.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
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
Blueboss.prototype.inst = function(lvl = 0, startposx = this.x, startposy = this.y, size = this.size, ){
//adds a boss to the game!
enemies.push(new Blueboss(startposx, startposy, size, lvl, enemies.length));
}
//center stage and 20 size is the default, feel free to change it up!
bosses.push(new Blueboss(canvhalfx+200, canvhalfy, 20));