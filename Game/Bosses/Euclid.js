function Euclid(startposx, startposy, size , lvl = 0, ID = -5){
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
this.color = "#405806ff";
//game
this.lvl = lvl; //difficulty of boss (0 for no dif, 10 for DOOM). You can go over!
this.damagetypemod = [];//some people may take more or less damage from certain sources...
this.hp = 100; //EVEN THE FUCKING BOSSES GET 100!!!!!!
this.facing = [0, 0];
this.damagemod = 0.2;//bro... you're cooked
this.speed = (lvl > 4)? 4: lvl; //base speed
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = 0;
this.knockbackmod = 0;
this.knockback = [0, 0];//x and y position of knockback
this.talking = false;//basically an indicator of whether or not summons should target this boss
this.showimmunity = false;
this.light = false;//overrides the default weight of an enemy (which is determined by knockback mod)
this.talking = true;//basically an indicator of whether or not summons should target this boss
//extras
this.speaking = 0;
this.phase = 1;//this boss has 2 phases! fun...
this.attack = [0, 0];//basically what attack she's doing, and for how long
//(0 is walking, 1 is teleport slash, 2 is leap slash, 3 is gun stance, 4 is impale)
this.swordbox = new hitbox(0, 0, 2, 2, 150)
this.swordbox.immunityframes(3)
this.showsword = 0;
this.sworddown = 0;
Euclid.prototype.listname = function(){
//to help position the characters correctly
return "Euclid";
}
}
Euclid.prototype.exist = function(){
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
//first, talk
if(this.speaking < 120){
        this.speaking++;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "25px Times New Roman";

  screen.fillText(`Well well well, seems you've got some style, ${player.listname()}!`, this.x + player.px, this.y - 50 + player.py);
}else if(this.speaking < 240){
        this.speaking++;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "25px Times New Roman";

  screen.fillText(`What's more, you decided that you wanted to challenge the combat god!`, this.x + player.px, this.y - 50 + player.py);
}else if(this.speaking < 460){
        this.speaking++;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "25px Times New Roman";

  screen.fillText(`I think you knew I was going to go easy, but don't think I'm taking it too easy!`, this.x + player.px, this.y - 50 + player.py);
}else if(this.speaking < 680){
        this.speaking++;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "25px Times New Roman";

  screen.fillText(`Don't waver now, because this is going to be a GRAND battle!`, this.x + player.px, this.y - 50 + player.py);
}else if(this.speaking < 720){
        this.speaking++;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "25px Times New Roman";

  screen.fillText(`EN GARDE!`, this.x + player.px, this.y - 50 + player.py);
}else{
    this.talking = false
}

if(this.talking == false){
    this.walk()
}

}
Euclid.prototype.walk = function(){
        if(this.hitstun > 0){
        this.hurt();
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
        return;
        }
        console.log("fs")
        this.hitbox.updateimmunity();
        this.swordbox.updateimmunity();
        //this.swordbox.showbox("#fff5")
        if(this.x + player.px - this.shift[0] > canvhalfx + 95){
            this.x-=this.speed * this.speedmod;
            this.facing = [-1, 0];
        }else if (this.x + player.px - this.shift[0] < canvhalfx - 95){
            this.x+=this.speed * this.speedmod;
            this.facing = [1, 0];
        }if(this.y + player.py - this.shift[1] < canvhalfy - 95){
            this.y+=this.speed * this.speedmod;
            this.facing = [0, 1];
        }else if (this.y + player.py - this.shift[1]> canvhalfy + 95){
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
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
        this.swordbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);

        if(this.swordbox.hitplayer() && this.sworddown<=0){
                //a little less damage for easy mode
                player.hit(12,  ["slashing", "physical"], [-12 * this.facing[0], -12 * this.facing[1]], 12, 2);
                this.showsword = 2;
                this.sworddown = 3
                this.swordbox.grantimmunity(player.listname());
            }
            if(this.showsword > 0){
            this.showsword--;
            screen.beginPath();
            screen.fillStyle = "#fff";
            screen.arc(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.swordbox.size, this.facing[2], this.facing[2] + Math.PI);
            screen.fill();
            screen.closePath();
        }
        this.sworddown--;
            
        if(this.hitbox.hitplayer()){
        console.log("hit")
            
            player.hit(24, ["contact", "physical", 0], [-24 * this.facing[0], -24 * this.facing[1]], 10);
            this.x+=2*this.speed*this.speedmod*this.facing[0];
            this.y+=2*this.speed*this.speedmod*this.facing[1];
            
            this.hitbox.grantimmunity(player.listname());
        }



}
Euclid.prototype.hurt = function(){
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
Euclid.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
    if(this.talking == true){
        this.speaking = 999;
        this.talking = false;
        return;
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
}
Euclid.prototype.inst = function(lvl = 0, startposx = this.x, startposy = this.y, size = this.size, ){
//adds a boss to the game!
enemies.push(new Euclid(startposx, startposy, size, lvl, enemies.length));
}
//center stage and 20 size is the default, feel free to change it up!
bosses.push(new Euclid(canvhalfx+200, canvhalfy, 20));