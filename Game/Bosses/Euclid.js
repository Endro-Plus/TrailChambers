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
this.damagemod = 0.1;//bro... you're cooked
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
this.phase = 0;//this boss has 2 phases! fun...
this.attack = [0, 60];//basically what attack she's doing, and for how long
//(0 is walking, 1 is teleport, 2 is leap slash, 3 is gun stance, 4 is impale)
this.swordbox = new hitbox(0, 0, 2, 2, 100)
this.buffer = null;//forces attack to be a specific number
this.swordbox.immunityframes(3)
this.showsword = 0;
this.sworddown = 0;
this.comboscaling = 1;//bro is going to be comboing for years... I'll show pity this time
this.tp_proration = 0;//immediately after tp, attacks hit raw bring the combo scaling down more
this.tp_locale = null;
this.tp_shift = null;
this.foresight = null;//I SEE IT!
this.leapdir = [];
this.shots = 0;
this.impale_aim = []
this.playerhpbeforeimpale = null

//for speaking
this.line = "";
this.lineframes = 0;
Euclid.prototype.listname = function(){
//to help position the characters correctly
return "Euclid";
}
}
Euclid.prototype.exist = function(){
    if(this.hp < 0){
        if(this.phase != 2){
            this.phase = 2;
            this.hp = 50;
            this.damagemod = 0.05;
            this.line = "HAHAHAHA!"
            this.lineframes = 60;
        }else{
        return "delete";
        }
    }
    if(this.phase == 2){
        this.hp-=0
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
circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size + this.z);
if(this.foresight != null){
    screen.fillStyle = "#e15eed88"
    circle(this.foresight[0] + player.px - this.tp_shift[0],this.foresight[1] + player.py - this.tp_shift[1], this.size)
}


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
//for lines mid fight
if(this.lineframes > 0){
    this.lineframes--;
screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "25px Times New Roman";

  screen.fillText(this.line, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1] - 50);
}
    //combo scaling going down
    console.log(this.comboscaling)
    if(this.comboscaling < 1 && player.hitstun <=0){
        this.comboscaling+=0.01;
        if(this.comboscaling > 1){
            this.comboscaling = 1;
        }
    }
    if(this.comboscaling < 0.2){
        //a minimum of 80% damage reduction sounds fair
        this.comboscaling = 0.2
    }
    //tp proration
    if(this.tp_proration > 0){
        
        this.tp_proration-=0.01;
        if(this.tp_proration == 0){
            this.tp_proration = 0;
        }
    }
    this.attack[1]--;
    
    if(this.attack[1] <= 0){
        if(this.buffer != null){
                this.attack[0] = this.buffer;
                this.buffer = null
        }else if(this.attack[0] == 1){
            //swap to either walking or gun stance
            this.attack[0] = 0;
        }else{
            if(this.hp > 50){
        this.attack[0] = random(0, 3, false)
            }else{
                this.attack[0] = random(1, 3, false);//no more lame walking
            }
            
        }
        if(this.attack[0] != 1){
            this.color = "#405806ff"
        }else{
            this.color = "#e15eed88"
        }
        switch(this.attack[0]){
            case 0:
                if(this.hp > 50){
                this.attack[1] = random(30, 60, false);
                }else{
                    //fuck walking tbh
                    this.attack[1] = 10;
                }
                break;
            
            case 1:
                this.attack[1] = 10;
                this.tp_locale = null;
                break;
            
            case 2:
                this.attack[1] = 999;
                this.leapdir = aim2(canvhalfx, canvhalfy, findposition(this), (15+this.lvl < 20)? 15+this.lvl:20);
                this.leapdir.push(4);//distance up
                break;
            case 3:
                //click
                if(this.phase != 2){
                    switch(random(1, 3, false)){
                        case 1:
                            this.line = "Stay on your toes!"
                            break;
                        case 2:
                            this.line = "Think fast!"
                            break;
                        case 3:
                            if(["Jade", "Magna"].includes(player.listname())){
                                this.line = "Parry this one!";
                            }else{
                                this.line = "Can't you defend!"
                            }
                            break;
                    }

                    this.lineframes = 30;

                }else{
                    switch(random(1, 1, false)){
                        case 1:
                            var potential = ["Dance! ", "Faster! ", "Harder! ", "More! "]
                            this.line = '';
                            for(let i = 0 ; i < 3 ; i++){
                                this.line+=potential[random(0, potential.length() - 1)]
                                console.log(this.line)
                                console.log(i)
                            }
                            break;
                        case 2:
                            if(["Simia"].includes(player.listname())){
                                this.line = "You're really special aren't you~!";
                            }else{
                                this.line = "Keep up the pace! HHAHAHAHA!"
                            }
                            break;
                    }

                    this.lineframes = 30;
                }
                this.attack[1] = 10
                this.shots = 0;
                projectiles.push(new flashpart(findposition(this)[0], findposition(this)[1], this.size, 5, "yellow", 100, 15))
                break;
            default:
                //Shojo's most hated move
                this.attack[1] = 45;
                this.swordbox.refreshimmune();
                this.line = "";
                if(this.phase == 2){
                    this.line = `Oh ${player.listname()}~!`
                }else{
                this.line = "BOO!";
                }
                this.lineframes = 15;
                break;
                
                
        }
    }
    this.swordbox.reassign(0, 0, 2, 2, 100);
    if(this.attack[0] == 0){
    this.walk()
    }else if(this.attack[0] == 1){
        if(this.tp_locale == null && this.foresight == null){
        while(this.tp_locale == null || Math.abs(this.tp_locale[0] - canvhalfx) < 50 || Math.abs(this.tp_locale[1] - canvhalfy) < 50){
        this.tp_locale = [random(canvhalfx-70, canvhalfx+70), random(canvhalfy-70, canvhalfy+70)];
        this.tp_shift = [player.px, player.py];
        }
    }
        if(this.tp_locale != "not null" && this.foresight == null){
            this.tp(this.tp_locale[0] + player.px - this.tp_shift[0], this.tp_locale[1] + player.py - this.tp_shift[1])
        }else if(this.foresight != null){
            //foresight
            this.tp(this.foresight[0] + player.px - this.tp_shift[0],this.foresight[1] + player.py - this.tp_shift[1])
        }
    }else if(this.attack[0] == 2){
        this.leap();
        if(this.z <= 0){
            this.attack[1] = 0;
            this.z = 0;
        }
    }else if(this.attack[0] == 3){
        //KITCHEN GUN!
        this.gun();
    }else{
        //stabby stab
        this.impale();
    }
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
        if(this.x + player.px - this.shift[0] > canvhalfx + (this.size + 10)){
            this.x-=this.speed * this.speedmod;
            this.facing = [-1, 0];
        }else if (this.x + player.px - this.shift[0] < canvhalfx - (this.size + 10)){
            this.x+=this.speed * this.speedmod;
            this.facing = [1, 0];
        }if(this.y + player.py - this.shift[1] < canvhalfy - (this.size + 10)){
            this.y+=this.speed * this.speedmod;
            this.facing = [0, 1];
        }else if (this.y + player.py - this.shift[1]> canvhalfy + (this.size + 10)){
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
                
                player.hit(10 * this.comboscaling,  ["slashing", "physical"], [-12 * this.facing[0], -12 * this.facing[1]], 12, 2);
                this.showsword = 2;
                this.sworddown = 3;
                if(this.comboscaling == 1){
                    //imagine actually running into this...
                    this.comboscaling = 0.99 - this.tp_proration;
                }
                this.comboscaling-=0.05;
                this.swordbox.grantimmunity(player.listname());
                if(player.hitstun > 30){
                    //hitstun might go crazy real quick
                    player.hitstun = 30;
                }
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
            
            player.hit(7, ["contact", "physical", 0], [-24 * this.facing[0], -24 * this.facing[1]], 10);
            this.x+=2*this.speed*this.speedmod*this.facing[0];
            this.y+=2*this.speed*this.speedmod*this.facing[1];
            
            this.hitbox.grantimmunity(player.listname());
        }



}
Euclid.prototype.tp = function(x, y){
    if(this.tp_locale != null){
circle(x, y, this.size);
if(this.attack[1] <= 2){
    if(this.foresight == null && random(0, 2, false) > 0 ){
        //just tp
        this.x = x;
        this.y = y;
        this.shift = [player.px, player.py]
        this.tp_locale = "not null"
        this.tp_proration = .4;
        if(random(1, 5) < 2){
            //IMPALE!
            this.buffer = 4;
        }
    }else{
        //set a foresight and do something else
        this.foresight = [this.tp_locale[0], this.tp_locale[1]];
        this.attack[1] = 0;
        //this.attack[0] = 0;
    }
}
    }else{
        //just teleport to the foresight... that cuts a lot of time!
        if(this.attack[1] > 5){
            this.attack[1] = 5
        }else if(this.attack[1] <=1){
            this.attack[1] = 0;
            this.x = x;
            this.y = y;
            this.shift = [player.px, player.py]
            this.tp_locale = "not null"
            this.tp_proration = .30;//it's a bit more on you if you somehow get hit by an attack after the enemy literally showed you where they would teleport
            this.foresight = null
            this.color = "#405806ff"
            if(distance2(canvhalfx, canvhalfy, findposition(this), true) < 200){
                
                this.buffer = 2;
            }else{
                this.buffer = 3//GuN
            }
        }
    }
}
Euclid.prototype.leap = function(){
        if(this.hitstun > 0){
        this.hurt();
        this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
        return;
        }
        console.log("fs")
        this.hitbox.updateimmunity();
        this.swordbox.updateimmunity();
        //this.swordbox.showbox("#fff5")
        //this is basically just for facing now
        if(this.x + player.px - this.shift[0] > canvhalfx + (this.size + 30)){
            //this.x-=this.speed * this.speedmod;
            this.facing = [-1, 0];
        }else if (this.x + player.px - this.shift[0] < canvhalfx - (this.size + 30)){
            //this.x+=this.speed * this.speedmod;
            this.facing = [1, 0];
        }if(this.y + player.py - this.shift[1] < canvhalfy - (this.size + 30)){
            //this.y+=this.speed * this.speedmod;
            this.facing = [0, 1];
        }else if (this.y + player.py - this.shift[1]> canvhalfy + (this.size + 30)){
            //this.y-=this.speed * this.speedmod;
            this.facing = [0, -1];
        }

        //movement
        this.x+=this.leapdir[0];
        this.y+=this.leapdir[1];
        this.z+=this.leapdir[2];
        this.leapdir[2]-=(999-this.attack[1])/10
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
        this.swordbox.z = this.z;

        if(this.swordbox.hitplayer() && this.sworddown<=0){
                
                player.hit(10 * this.comboscaling,  ["slashing", "physical"], [-12 * this.facing[0], -12 * this.facing[1]], 12, 5);
                this.showsword = 2;
                this.sworddown = 3;
                if(this.comboscaling == 1){
                    //okay this deserves some downscaling
                    this.comboscaling = 0.90 - this.tp_proration;
                }
                this.comboscaling-=0.05;
                this.swordbox.grantimmunity(player.listname());
                if(player.hitstun > 30){
                    //hitstun might go crazy real quick
                    player.hitstun = 30;
                }
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
            
            player.hit(7, ["contact", "physical", 0], [-24 * this.facing[0], -24 * this.facing[1]], 10);
            this.x+=2*this.speed*this.speedmod*this.facing[0];
            this.y+=2*this.speed*this.speedmod*this.facing[1];
            
            this.hitbox.grantimmunity(player.listname());
        }



}
Euclid.prototype.gun = function(){


this.hitbox.reassign(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.z, 8, this.size);
if(this.hitbox.hitplayer()){
        //console.log("hit")
            
            player.hit(30, ["contact", "physical", "bludgeoning", 0], [-36 * this.facing[0], -36 * this.facing[1]], 24);
            //heavy pistol whipping noise
            this.attack[1] = 0;
            
            this.hitbox.grantimmunity(player.listname());
        }

if(this.attack[1] == 1 && (this.shots < 2 || this.shots < 3 && this.phase == 2)){
    //6 IS TOO MUCH!
    
    this.shots++;
    this.attack[1] = 7
    //always aim where the player will be.
    var accountx = 0;
    var accounty = 0;
    if(inputs.includes(controls[0]) || inputs.includes(controls[1])){
                //take facing[0] into account
                accountx = player.speed * player.facing[0] * distance(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], canvhalfx, canvhalfy, true)/(10 * 4) 
            }
             if(inputs.includes(controls[2]) || inputs.includes(controls[3])){
                //take facing[0] into account
                accounty = player.speed * player.facing[1] * distance(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], canvhalfx, canvhalfy, true)/(10 * 4)

            }
            var vx = aim(canvhalfx + accountx, canvhalfy + accounty, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[0];
            var vy = aim(canvhalfx + accountx, canvhalfy + accounty, this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 10)[1];
            //these are affected by current combo scaling, but they do not scale with combo
            if(this.tp_proration > 0 && this.comboscaling == 1){
                this.comboscaling = 1 - this.tp_proration;
                
            }

            projectiles.push(new enemyhitscan("bullet", this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], 7, vx, vy, "#ffee00ff", 15 * this.comboscaling, 50, 4, ["hitscan", "piercing", "proj", "physical"], [vx * -3, vy * -3], 20, 4));

}           

}
Euclid.prototype.impale = function(){
    //contact damage? Never heard of that since the days of Simia!
   
    if(this.attack[1] == 31){
        this.impale_aim = aim2(canvhalfx, canvhalfy, findposition(this), 20)
        this.playerhpbeforeimpale = player.hp;
        if(player.hp > 100){
            this.playerhpbeforeimpale = 100;
        }
    }else if(this.attack[1] < 30){
        this.swordbox.reassign(findposition(this)[0], findposition(this)[1], this.z, 2, 10)
        //this.swordbox.showbox()
        for(let i = 0; i < 10 ; i++){
            //this.swordbox.showbox()
            this.swordbox.move(this.swordbox.x+this.impale_aim[0], this.swordbox.y+this.impale_aim[1]);
            if(this.swordbox.hitplayer()){
                //first command grab... but on the player
                if(this.attack[0] == 4){
                    //first 
                player.hit(30, ["piercing", "physical", "softblock"], [0, 0], 90, 0)
                this.attack[0] = 5;//still impale
                }else{
                    player.hit(0.5, ["true"], [0, 0], 0, 0)
                }
                if(this.playerhpbeforeimpale > player.hp){
                    //no getting out of this now!
                    this.playerhpbeforeimpale = 999;
                player.hitstun = 45;
                player.knockback = [0, 0];
                this.attack[0] = 5;//still impale
                //continue;
                }else{
                    //this was likely blocked
                    this.swordbox.grantimmunity(player.listname())
                }
                
                
            }
        }

        screen.beginPath();
        screen.lineWidth = 7;
        screen.strokeStyle = "#444"
    
    screen.moveTo(findposition(this)[0], findposition(this)[1]);
    screen.lineCap = "round"
    screen.lineTo(this.swordbox.x, this.swordbox.y);
  
    screen.stroke();
    screen.lineCap = "butt"
    screen.closePath();
    screen.lineWidth = 1;

    if(this.attack[0] == 5 && this.attack[1] <= 2){
        //chuck them off the sword!
        player.knockback = [this.impale_aim[0]*4, this.impale_aim[1]*4]
        this.comboscaling-=0.2;
    }
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
        this.attack = [1, 5]
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