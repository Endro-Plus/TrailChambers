function Tutorial_Bot(startposx, startposy, size , lvl = 0, ID = -5){
//the boss in "bosses" should not be used. It's mostly just a list.
//startup
this.enemyID = ID;
this.x = startposx;
this.y = startposy;
this.shift = ["", ""];
this.z = 0; //distance up.
this.size = size;
this.height = 8;//How tall they are, if small enough, higher hitting attacks may miss! However, if too tall, that's just a hitbox extension.
this.hitbox = new hitbox(this.x, this.y, this.z, this.height, this.size);
this.hitbox.disable();
this.hitbox.immunityframes(9);
//color
this.color = "#AC5900";
//game
this.lvl = lvl; //difficulty of boss (0 for no dif, 10 for DOOM).
this.damagetypemod = [];//some people may take more or less damage from certain sources...
this.hp = 100; //EVEN THE FUCKING BOSSES GET 100!!!!!!
this.facing = [0, 0];
this.damagemod = (this.lvl > 5)? (10 - this.lvl) / 10:1; //Naturally, a lesser damage taken does, in fact, make bosses feel like bosses. Not the tutorial boss though
this.speed = (this.lvl > 5)? this.lvl:3; //base speed
this.speedmod = 1;//modifies speed, multiplicately
this.speedcause = [];
this.hitstunmod = (this.lvl > 5)? 0.1:0.2; //POV: weak ass boss who isn't immune to hitstun
this.knockbackmod = (this.lvl > 5)? 0.1:0.2; //POV: weak ass boss who isn't immune to knockback
this.knockback = [0, 0];//x and y position of knockback


//extras
this.tutorial = 0;
this.turnRate = 0.05;
// Calculate initial direction
        let dx = 0 - this.x;
        let dy = 0 - this.y;
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        this.velocityX = (dx / magnitude) * this.speed;
        this.velocityY = (dy / magnitude) * this.speed;
}
Tutorial_Bot.prototype.listname = function(){
//to help position the characters correctly
return "Tutorial_Bot";
}

Tutorial_Bot.prototype.exist = function(){
    //console.log(arena.leavedir(this.x + player.px, this.y + player.py, this.size))
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
this.hitbox.enable();
this.hitbox.move(this.x + player.px, this.y + player.py);
//The character exists in my plane of existance!
screen.fillStyle = this.color;
circle(this.x + player.px, this.y + player.py, this.size);



//boss AI goes here
//this.move();
if(this.lvl <= 5){

if(this.tutorial < 3){
screen.fillStyle = this.color;
screen.textAlign = "center";
screen.font = "25px Times New Roman";
screen.fillText("Use " + controls[2] + ", " + controls[0] + ", " + controls[3] + ", and " + controls[1] + " to move.", canvhalfx, 100)
this.tutorial+=0.01;
}else if(this.tutorial < 6){
screen.fillStyle = this.color;
screen.textAlign = "center";
screen.font = "25px Times New Roman";
screen.fillText("Use " + controls[4] + ", " + controls[5] + ", " + controls[6] + ", and " + controls[7] + " to use your abilities", canvhalfx, 100)
this.tutorial+=0.01;
}else if(this.tutorial < 9){
 screen.fillStyle = this.color;
 screen.textAlign = "center";
 screen.font = "25px Times New Roman";
 screen.fillText("The abilites correspond to the numbers on the character card.", canvhalfx, 100)
 screen.fillText("1 is "+controls[4], canvhalfx, 120)
 screen.fillText("2 is "+controls[5], canvhalfx, 140)
 screen.fillText("3 is "+controls[6], canvhalfx, 160)
 screen.fillText("4 is "+controls[7], canvhalfx, 180)
 this.tutorial+=0.01;
}else if(this.tutorial < 12){
  screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "20px Times New Roman";
  screen.fillText("Your HP is directly above you, mine is the large one on top", canvhalfx, 100)
  screen.fillText("If you heal over your max hp, you are your hp slowly drains back to its maximum", canvhalfx, 120)
  screen.fillText("A blue bar over your hp bar represents a special defense.", canvhalfx, 140)
  screen.fillText("It limits the amount of damage you can take.", canvhalfx, 160)
  this.tutorial+=0.01;
}else if(this.tutorial < 15){
  screen.fillStyle = this.color;
  screen.textAlign = "center";
  screen.font = "15px Times New Roman";
  screen.fillText("If you take a hit, you can slightly influence the direction you are knocked.", canvhalfx, 100)
  screen.fillText("Some bosses will attempt to combo you. This idea is imperative if you are to reduce that damage!", canvhalfx, 120)
  this.tutorial+=0.01;
 }else if(this.tutorial < 18){
    screen.fillStyle = this.color;
    screen.textAlign = "center";
    screen.font = "20px Times New Roman";
    screen.fillText("I will now attempt to attack you by running into you. Use your abilities to defeat me", canvhalfx, 100)
    screen.fillText("Your chance of failure in this battle is 2%. I will not be giving it my all.", canvhalfx, 120)
    screen.fillText("For future reference, you can skip this whole tutorial by just defeating me", canvhalfx, 140)
    this.tutorial+=0.01;
 }else{
this.move();
 }
 if(this.tutorial < 18){
 this.hitbox.reassign(this.x + player.px, this.y + player.py, this.z, 8, this.size);

         if(this.hitbox.hitplayer()){
         player.hit(0, ['contact', 0]);
         }
         }

//this.move();

}else{
if(this.tutorial < 2){
 screen.fillStyle = this.color;
    screen.textAlign = "center";
    screen.font = "60px Times New Roman";
    screen.fillText("Prepare", canvhalfx, 100)
    this.tutorial+=0.2;
}else{
this.move();
}
}
 }
Tutorial_Bot.prototype.move = function(){
        if(this.hitstun > 0){
        this.hurt();
        this.hitbox.reassign(this.x + player.px, this.y + player.px, this.z, 8, this.size);
        return;
        }
        // really basic following script
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
            if(this.lvl < 5){
            player.hit(5, ["contact", "physical", 0], [6 * this.facing[0], 6 * this.facing[1]], 10);
            this.x+=2*this.speed*this.speedmod*this.facing[0];
            this.y+=2*this.speed*this.speedmod*this.facing[1];
            }else{
                //bro comboed too good using easy mode stats
                player.hit(4, ["contact", "physical", 0], [-(this.speed + 3)  * this.facing[0], -(this.speed + 3) * this.facing[1]], 10);
                this.x+=this.speed*this.speedmod*this.facing[0];
                this.y+=this.speed*this.speedmod*this.facing[1];
            }
            this.hitbox.grantimmunity(player.listname());
        }



}
Tutorial_Bot.prototype.hurt = function(){
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
Tutorial_Bot.prototype.hit = function(damage, damagetype = ["true"], knockback = [0, 0], hitstun = 0){
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
Tutorial_Bot.prototype.inst = function(lvl = 0, startposx = this.x, startposy = this.y, size = this.size, ){
//adds a boss to the game!
enemies.push(new Tutorial_Bot(startposx, startposy, size, lvl, enemies.length));
enemies[enemies.length - 1].shift[0] = player.px;
enemies[enemies.length - 1].shift[1] = player.py;
}
//center stage and 20 size is the default, feel free to change it up!
bosses.push(new Tutorial_Bot(canvhalfx+200, canvhalfy, 20));