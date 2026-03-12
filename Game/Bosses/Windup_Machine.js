function Windup_Machine(startposx, startposy, size , lvl = 0, ID = -5){
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
this.color = "#a3a600";
//game
this.lvl = lvl; //difficulty of boss (0 for no dif, 10 for DOOM). You can go over!
this.damagetypemod = [["magic", 0.7]];//some people may take more or less damage from certain sources...
this.hp = 100; //EVEN THE FUCKING BOSSES GET 100!!!!!!
this.facing = [0, 0];
this.damagemod = 0.3;//meh... I guess
this.speed = 10 + lvl*2; //SPPEEEEEDDDDDD
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = 0; //Hitstun? Where?
this.knockbackmod = 1; //Knockback, nah, that's just a player thing!
this.knockback = [0, 0];//x and y position of knockback
this.talking = false;//basically an indicator of whether or not summons should target this boss
this.showimmunity = false;
this.light = 0.7;//overrides the default weight of an enemy (which is determined by knockback mod)
this.talking = false;//basically an indicator of whether or not summons should target this boss
//extras
this.timer = 30;
this.error = false;
this.teammate = null;//sync with one other windup machine
this.leader = false;//the followers sync with the leader, no matter what
this.aim = [];
this.attack = -1;//-1 is when they aim at eachother, 1 is base dash, 2 is dash but more following, 3 is slash barrage
this.enraged = false;
}

Windup_Machine.prototype.listname = function(){
//to help position the characters correctly
return "Windup_Machine";
}

Windup_Machine.prototype.exist = function(){
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



//boss AI goes here

//enraging
if(this.enraged == false && this.sync != null && this.sync.hp <=0){
        this.enraged = true;
        this.sync = null
        projectiles.push(new flashpart(findposition(this)[0], findposition(this)[1], this.size, 20, "red", 20))
        this.color = "rgb(255, 0, 0)"
        this.lvl+=2;
        this.speed+=5;
    }
if(this.error == true && this.sync != null && this.enraged == false){
    if(this.leader){
        //let someone else leed
        this.leader = false;
        this.sync.leader = true;
        this.sync.sync = this;//
    }
    this.attack = -1;
    this.sync.attack = -1;
}
if(this.hitstun > 0){
    this.hurt();
    this.error = true;
    //the enemy was thrown off!
    return;

}


this.timer--;
if(this.hitbox.scanplayer()){
    //so simia can hit things
    player.hit(0, ["contact", this.enemyID]);
}
if(this.timer <= 0){
    if(this.attack == -1 && this.timer > -1){
        //calibrate timings and such
        this.calibrate();
    }
    if(this.attack != 4){
        this.dash();//4 is the slash barrage, no slashes here
    }

}else{
    //only have 1 contact hit per dash
    this.hitbox.updateimmunity();

    if(this.timer < 15 && (this.attack == 1 || this.attack == 2)){
        //telegraph if 1 or 2
        if(this.timer > 13 || this.attack == 2){
            this.aim = aim(findposition(this)[0], findposition(this)[1], canvhalfx, canvhalfy, 2);
        }
        this.x+=this.aim[0] * (this.timer / 4);
        this.y+=this.aim[1] * (this.timer / 4);
        

    }
    if(this.attack == 3){
        if(this.timer > 15){
            if(enemyezmode()){
        this.aim = aim(findposition(this)[0], findposition(this)[1], findposition(this)[0] + random(-20, 20), findposition(this)[1] + random(-20, 20), 2);
            }else{
                //on hard mode, always aim near the player, not just a random direction
                this.aim = aim(findposition(this)[0], findposition(this)[1], canvhalfx + random(-100, 100), canvhalfy + random(-100, 100), 2);

            }
        this.x+= this.aim[0] * 7;
        this.y+= this.aim[1] * 7;
    }else{
        //heavily resist slowdown effects
        if(this.speedmod < 0.6){
            this.speedmod +=0.4;
        }else{
            this.speedmod = 1;
        }
        this.x-=this.aim[0] * (this.speed - (15 - this.timer)) * this.speedmod;
        this.y-=this.aim[1] * (this.speed - (15 - this.timer)) * this.speedmod;
        if(this.hitbox.hitplayer()){
            //a little weaker, but comboes easier into the followup
            player.hit((this.lvl*2), ["contact", "bludgeoning", "physical", this.enemyID], [this.aim[0] * 12, this.aim[1] * 12], 20);
            this.hitbox.grantimmunity(player.listname());
        }
        if(this.timer < 3){
        this.aim = aim(findposition(this)[0], findposition(this)[1], canvhalfx, canvhalfy, 3);
        }
    }
}

}

//if thrown off

}

Windup_Machine.prototype.calibrate = function(){

    if(this.leader == true){
        //it's the leaders job to handle calibration. Followers don't do anything
        this.sync.sync = this;//I know, cursed.
    }
    if(this.sync == null){
        //something's going wrong, do nothing!
        this.timer = 30;
        return;
    }
    if(this.sync.leader){
        //literally recalibrate timing
        this.timer = this.sync.timer;
        
    }
    this.error = false;        
    

    //aim at the teammate
    this.aim = aim2(findposition(this)[0], findposition(this)[1], findposition(this.sync), 2);
}

Windup_Machine.prototype.dash = function(){
    //if enraged, resist slowdown effects
    if(this.speedmod <0.8 && this.enraged){
        this.speedmod = 0.8;
    }
if(this.speed + this.timer > 5){
    //go forth!
    this.x-=this.aim[0] * (this.speed + this.timer) * this.speedmod;
     this.y-=this.aim[1]*(this.speed+this.timer) * this.speedmod;

     if(this.hitbox.hitplayer()){
        player.hit(5 * (this.lvl*0.5), ["contact", "bludgeoning", "physical", this.enemyID], [this.aim[0] * 7, this.aim[1] * 7], 10, 0.5);
        this.hitbox.grantimmunity(player.listname());

     }
}else{
    if(this.enraged){
        this.timer = (enemyezmode())? 10: 5;//go even faster on hard mode
            this.attack = random(1, 2, false);
            this.aim = aim(findposition(this)[0], findposition(this)[1], canvhalfx, canvhalfy, 2);

    }else{
    this.timer = 45 - ((this.leader == true)? this.lvl*3 : this.sync.lvl*3);
    if(this.timer < 20){
        this.timer = 20;
    }
    if(this.hp <= 50 || this.sync.hp <= 50){
        this.timer*=0.75;//go faster when anyone is half hp
    }
    this.attack = random(1, 3, false);
}

}
}
Windup_Machine.prototype.hurt = function(){
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
Windup_Machine.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
    var dmg = damage * this.damagemod;
    for(let i = 0 ; i < this.damagetypemod.length ; i++){
        if(damagetype.includes(this.damagetypemod[i][0])){
            dmg *= this.damagetypemod[i][1];
        }
    }
    if(this.attack == 3 && damagetype.includes("interrupt") && this.timer > 0){
        dmg*=5;
        this.hitstun = 45;
        this.knockback[0] * 10;
        this.knockback[1] * 10;
        player.bonus();
        projectiles.push(new flashpart(findposition(this)[0], findposition(this)[1], this.size, 20, "yellow", 20))
        this.error = true;
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
Windup_Machine.prototype.inst = function(lvl = 0, startposx = this.x, startposy = this.y, size = this.size){
//adds a boss to the game!
enemies.push(new Windup_Machine(startposx, startposy, size, lvl, enemies.length));
}
//center stage and 20 size is the default, feel free to change it up!
bosses.push(new Windup_Machine(canvhalfx+200, canvhalfy, 15));