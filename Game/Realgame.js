//universal classes
function movingpart(x, y, mx, my, size, color, life) {
    this.name = "particle";
    this.x = x;
    this.y = y;
    this.mx = mx;
    this.my = my;
    this.shift = [player.px, player.py];
    this.size = size;
    this.color = color;
    this.lifetime = null;
    this.life = life;
}
movingpart.prototype.exist = function () {
    //all this does is disappear, and move!
    screen.fillStyle = this.color;
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size);
    this.x += this.mx;
    this.y += this.my;
    this.life -= 1;
    if (this.life < 0) {
        return "delete";
    }
}
function enemyproj(name, x, y, size, mx, my, color, dmg, lifetime, dmgtype = ["true"], knockback = [0, 0], hitstun = 0){
    this.name = name;
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.color = color;
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.lifetime = lifetime;
    this.dmg = dmg
    this.dmgtype = dmgtype;
    this.knockback = knockback;
    this.hitstun = hitstun;
}
enemyproj.prototype.exist = function(){
    if(typeof this.lifetime == "number"){
    //no subtracting null!
    this.lifetime--;
    }
    this.hitbox.enable();

    screen.fillStyle = this.color;
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
        player.hit(this.dmg, this.dmgtype, this.knockback, this.hitstun);
        return "delete";
    }
}
function playerproj(name, x, y, size, mx, my, color, dmg, lifetime, dmgtype = ["true"], knockback = [0, 0], hitstun = 0){
    this.name = name;
    this.x = x;
    this.y = y;
    this.shift = [player.px, player.py];
    this.size = size
    this.mx = mx;
    this.my = my;
    this.color = color;
    this.hitbox = new hitbox(x, y, 2, size/2, size);
    this.hitbox.disable();
    this.lifetime = lifetime;
    this.dmg = dmg;
    this.dmgtype = dmgtype;
    this.knockback = knockback;
    this.hitstun = hitstun;
}
playerproj.prototype.exist = function(){
    
    if(typeof this.lifetime == "number"){
    //no subtracting null!
    this.lifetime--;
    }
    this.hitbox.enable();

    screen.fillStyle = this.color;
    circle(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1], this.size)
    this.x+=this.mx;
    this.y+=this.my;

    this.hitbox.move(this.x + player.px - this.shift[0], this.y + player.py - this.shift[1]);
    //console.log((this.x - (canvhalfx + player.playershift[0])) + " " + (this.y - (canvhalfx + player.playershift[1])));
    //console.log(arena.leavedir(this.x, this.y, this.size))
    if(this.lifetime < 0){
        return "delete";
    }
    //hitting the enemy
    //console.log(en);
    for(let i = 0 ; i < enemies.length ; i++){
    if(this.hitbox.checkenemy(i)){
        playerattack = this.name;
        enemies[i].hit(this.dmg, this.dmgtype, this.knockback, this.hitstun);
        return "delete";
        }
        }
    }

//vars

var arena = {
    //arena size and stats
    "w": canvhalfx + 40,
    "h": canvhalfy + 40,
    "pleavedir":function(x = player.px, y = player.py, s = player.size){
    var ans = []
    if(x + s > this.w){
    ans.push("l")
    }else if(x - s < -this.w){
    ans.push("r")
    }
    if(y + s > this.h){
        ans.push("u")
        }else if(y - s < -this.h){
        ans.push("d")
        }
    return ans;
    },
    "pleave":function(x = player.px, y = player.py, s = player.size){

        if(x + s > this.w){
        return true;
        }else if(x - s < -this.w){
        return true;
        }
        else if(y + s > this.h){
            return true;
            }else if(y - s < -this.h){
            return true;
            }
        return false;
        },
    "leavedir":function(x, y, s ){
            x -=  (canvhalfx + player.playershift[0])
            y -=  (canvhalfy + player.playershift[1])
            var ans = []
            if(x + s > this.w){
            ans.push("l")
            }else if(x - s < -this.w){
            ans.push("r")
            }
            if(y + s > this.h){
                ans.push("u")
                }else if(y - s < -this.h){
                ans.push("d")
                }
            return ans;
            },
    "leave":function(x, y, s){
            x -=  (canvhalfx + player.playershift[0])
            y -=  (canvhalfy + player.playershift[1])

                if(x + s > this.w){
                return true;
                }else if(x - s < -this.w){
                return true;
                }
                else if(y + s > this.h){
                    return true;
                    }else if(y - s < -this.h){
                    return true;
                    }
                return false;
                }
}
var boss_title = ""
var bossbar = []//enemies that are included in the boss hp bar goes here
var bossbarmode = 1; //0 = not showing, 1 = standard, 2 = BIG BOSS
var totalbosshp = 0;//for passives such as desperation
var circle = function(x, y, size, noFill = false, noStroke = true){
    //because I'm not typing beginPath and closePath every damn time!
     screen.beginPath();
     screen.arc(x, y, size, 0, 2 * Math.PI);
     if(!noStroke){
     screen.stroke();
     }
     if(!noFill){
     screen.fill();
     }
     screen.closePath();

}
function random(min, max, dec = true) {
  //inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  if(!dec){
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  return Math.random() * (max - min + 1) + min;
}

var difficulty = "normal";
var charezmode = function(){
return ["normal", "Mob"].includes(difficulty)//if true, then easy mode!
}
var enemyezmode = function(){
return ["normal", "Player"].includes(difficulty)//if true, then easy enemies!
}
var notcharezmode = function(){
return !["normal", "Mob"].includes(difficulty)//if true, then easy mode!
}
var notenemyezmode = function(){
return !["normal", "Player"].includes(difficulty)//if true, then easy enemies!
}
//for challenges
var nohitstatus = function(challengenum){
if(player.hp  < 100){
    challengenum[2] = false;
}
}

var presets = [['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'z', 'x', 'c', 'v'],
                ['a', 'd', 'w', 's', 'j', 'k', 'l', ';'],
                ['a','d','w','s','arrowleft','arrowdown','arrowright','arrowup'],
                ['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 's', 'd', 'w']];

var controls = [...presets[1]];
//left, right, up, down, spec1, spec2, spec3, spec4
//for the setup
var timeplayed = 0;
var estimatedtime;
var estimatedmin;
var setup;
var player;
var projectiles = [];
var enemies = [];
var summons = [];
var level = 2;
var rest = 100;
var resttimer = 0;
var pauseselection = 0;

//for challenges
var challenges = 
    [
    //lvl 0
    [[enemyezmode, "Have fun!!!", true], [notenemyezmode, "No hit the boss!!!", true], [["Jade", "Magmax"], "End the encounter with 100+% hp", false], [["Simia"], "Hit a tornado kick", false], [["Magna","Jade"], "Hit a parry!", false], [["Ezekiel"], "Hit the boss with a deathorb while in PANIC", false], [[ "Nino"], "Electrically charge a miasma ball", false], [[ "Magna"], "Use nunchuck and parry your own shuriken", false], [[ "Magmax"], "Use flow to cancel harden", false], [["Ezekiel", "Nino"], "Land a critical hit!", false]],
    //lvl 1
    [[enemyezmode, "rout the enemies!", false], [notenemyezmode, "kill the boss last", true]], 
    //lvl 2
    [[true, "don't get parried", true], ["Magna", "Parry the parry beam!", false]],
    //lvl 3
    [[true, "Don't take any damage!", true], [notenemyezmode, "Kill both bosses within 3 seconds of the other dying"]]
]//visibility condition, description, completed
var completedchallenges = 0;
var parried = 0;
var crit = 0;
var proj_parry = [];
var playerattack;
var enemyattack;
var playerhp = 0;//remember what it was before a reset
var framesplayed = 0;//good for calculating time
{
var selection = 0;
var Hidden = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'earrowleft', 'earrowright', 'earrowleft', 'earrowright', 0];
var thicc = function(){//change the screen size
    screen.fillStyle = "#522";
    screen.fillRect(0, 0, 9999, 9999);
    screen.fillStyle = "#744";
    screen.fillRect(canvhalfx - 150, canvhalfy - 150, 300, 300);
    screen.fillStyle = "#000"
    screen.textAlign = "left";
    screen.font = "20px Times New Roman";
    screen.fillText("Use arrow keys to enlarge/reduce", canvhalfx - 130, canvhalfy - 130);
    screen.fillText("screen size.", canvhalfx - 130, canvhalfy - 110);
    screen.textAlign = "center";
    screen.fillText("left and right to shrink/enlarge", canvhalfx, canvhalfy - 10);
    screen.fillText("up and down to move the screen", canvhalfx, canvhalfy + 10);
    screen.fillText("space to save and go back", canvhalfx, canvhalfy + 130);

    if(input == "arrowright"){
        input = '';
        canvas.width += 15;
        canvas.height += 15;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px"
        canvhalfx = canvas.width/2;
        canvhalfy = canvas.height/2;
    }
    if(input == "arrowleft"){
        input = '';
        canvas.width -= 15;
        canvas.height -= 15;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px"
        canvhalfx = canvas.width/2;
        canvhalfy = canvas.height/2;
    }
    if(input == "arrowup"){
        input = '';
        topmargin-=15;
        canvas.style.marginTop = topmargin + "px";
    }
    if(input == "arrowdown"){
        input = '';
        topmargin+=15;
        canvas.style.marginTop = topmargin + "px";
    }
    if(input == " "){
        
        input = '';
        clearInterval(setup);
        selection = 2;
        setup = setInterval(settings, 1000 / fps);
    }
    
}
var controlscheme = function(){//change the controls
    screen.fillStyle = "#522";
    screen.fillRect(0, 0, 9999, 9999);
    screen.fillStyle = "#000"
    screen.textAlign = "left";
    screen.font = "20px Times New Roman";
    if(presets.some(x => x.toString() == controls)){
        screen.fillText(`current scheme [${presets.findIndex(x => x.toString() == controls)}]:`, canvhalfx - 130, canvhalfy - 190);
    }else{
        screen.fillText("custom control scheme :)", canvhalfx - 130, canvhalfy - 190);
    }
    //showing controls
    screen.fillText(`left = [${controls[0]}]`, canvhalfx - 130, canvhalfy - 130);    
    screen.fillText(`right = [${controls[1]}]`, canvhalfx - 130, canvhalfy - 110);
    screen.fillText(`up = [${controls[2]}]`, canvhalfx - 130, canvhalfy - 90);
    screen.fillText(`down = [${controls[3]}]`, canvhalfx - 130, canvhalfy - 70);
    screen.fillText(`ability 1 = [${controls[4]}]`, canvhalfx - 130, canvhalfy - 50);
    screen.fillText(`ability 2 = [${controls[5]}]`, canvhalfx - 130, canvhalfy - 30);
    screen.fillText(`ability 3 = [${controls[6]}]`, canvhalfx - 130, canvhalfy - 10);
    screen.fillText(`ability 4 = [${controls[7]}]`, canvhalfx - 130, canvhalfy + 10);


    //changing controls
    if(selection < 8){
    screen.fillStyle = "#999";
    screen.fillRect(canvhalfx + 50, canvhalfy - 150 + (selection * 20), 100, 30);
    screen.fillStyle = "#000";
    screen.fillText("change " + (selection+1), canvhalfx + 60, canvhalfy - 130 + (selection * 20));
    }

    //previous scheme
    screen.fillStyle = (selection != 8)? "#999":"#333";
    screen.fillRect(canvhalfx - 150, canvhalfy + 40, 100, 30);
    screen.fillStyle = "#000";
    screen.fillText("Previous", canvhalfx - 135, canvhalfy + 60);
    //next scheme
    screen.fillStyle = (selection != 9)? "#999":"#333";
    screen.fillRect(canvhalfx, canvhalfy + 40, 100, 30);
    screen.fillStyle = "#000";
    screen.fillText("Next", canvhalfx + 30, canvhalfy + 60);
    //back
    screen.fillStyle = (selection != 10)? "#999":"#333";
    screen.fillRect(canvhalfx - 70, canvhalfy + 90, 100, 30);
    screen.fillStyle = "#000";
    screen.fillText("Back", canvhalfx - 40, canvhalfy + 110);


    //actually changing the controls
    if(controls[selection] == "none"){
        screen.fillStyle = "#999";
        screen.fillRect(canvhalfx + 50, canvhalfy - 150 + (selection * 20), 175, 30);
        screen.fillStyle = "#000";
        screen.fillText("esc to unbind", canvhalfx + 60, canvhalfy - 130 + (selection * 20));



        if(input != ''){
            if(input == "escape"){
                controls[selection] = "unbound";
            }else{
                controls[selection] = input;
            }
            input = '';
        }else{
            return;
        }
    }
    if(input == 'arrowdown'){
        selection = (++selection == 11)? 0:selection;
        
        if(selection > 8){
            selection = 10;
        }
        input = '';
    }
    if(["arrowleft", "arrowright"].includes(input)){
        if(input == "arrowright" && selection < 8 || selection == 10){
            selection = 9
        }else{
        selection = (selection == 8)? 9:8;
        }
        
        input = '';
    }
    if(input == 'arrowup'){
        selection = (--selection == -1)? 10:selection;
        if([7, 8].includes(selection)){
            selection = 7;
        }
        input = '';
    }
    if(input == " "){
        if(selection == 8){
            if(presets.some(x => x.toString() == controls) &&presets.findIndex(x => x.toString() == controls)-1 >= 0){
                controls =  [...presets[presets.findIndex(x => x.toString() == controls)-1]]
                
            }else{
                controls =  [...presets[0]]
            }
        }else if (selection == 9){
            if(presets.some(x => x.toString() == controls) && presets.findIndex(x => x.toString() == controls) < presets.length - 1){
                controls =  [...presets[presets.findIndex(x => x.toString() == controls)+1]]
            }else{
                controls =  [...presets[presets.length-1]]
            }
        }else if (selection == 10){
            selection = 0;
            clearInterval(setup);
            input = '';
            setup = setInterval(settings, 1000 / fps);
        }else{
            //custom
            controls[selection] = "none"
        
        }

    }




    input = '';


    
}
var settings = function(){
    screen.fillStyle = "#522";
    screen.fillRect(0, 0, 9999, 9999);
    screen.textAlign = "left";
    screen.font = "20px Times New Roman";
    //changing controls
    screen.fillStyle = (selection != 0)? "#999":"#333";
    screen.fillRect(canvhalfx - 100, canvhalfy - 250, 150, 50);

    //changing fps
    screen.fillStyle = (selection != 1)? "#999":"#333";
    screen.fillRect(canvhalfx - 100, canvhalfy - 180, 150, 50);
    if(selection == 1){
        screen.fillStyle = "#555";
        screen.fillRect(canvhalfx - 165, canvhalfy - 180, 40, 50);
        screen.beginPath();//left
        screen.moveTo(canvhalfx - (165 - 40), canvhalfy - 180);
        screen.lineTo(canvhalfx - 165, canvhalfy - 155);
        screen.lineTo(canvhalfx - (165 - 40), canvhalfy - 130);
        screen.stroke();
        screen.closePath();

        screen.fillRect(canvhalfx + 75, canvhalfy - 180, 40, 50);
        screen.beginPath();//right
        screen.moveTo(canvhalfx + (75), canvhalfy - 180);
        screen.lineTo(canvhalfx + (75 + 40), canvhalfy - 155);
        screen.lineTo(canvhalfx + (75), canvhalfy - 130);
        screen.stroke();
        screen.closePath();
    }
    //changing screen size
    screen.fillStyle = (selection != 2)? "#999":"#333";
    screen.fillRect(canvhalfx - 100, canvhalfy - 110, 150, 50);

    //changing back
    screen.fillStyle = (selection != 3)? "#999":"#333";
    screen.fillRect(canvhalfx - 100, canvhalfy + 250, 150, 50);

    screen.font = "20px Times New Roman";
    screen.fillStyle = "#000";
    screen.fillText("Change controls", canvhalfx - 95, canvhalfy - 230);
    screen.fillText("FPS: " + fps, canvhalfx - 90, canvhalfy - 160);
    screen.fillText("Screen Size", canvhalfx - 90, canvhalfy - 90);
    screen.fillText("Back", canvhalfx - 50, canvhalfy + 270);
    if(input == 'arrowdown'){
        selection = (++selection == 4)? 0:selection;

        input = '';
    }
    if(input == 'arrowup'){
        selection = (--selection == -1)? 3:selection;

        input = '';
    }
    if(input == ' ' && selection == 0){
            selection = 0;
            clearInterval(setup);
            input = '';
            setup = setInterval(controlscheme, 1000 / fps);
        }
    //fps
    if(input == "arrowleft" && selection == 1 && fps > 1){

        fps--;
        clearInterval(setup);
        setup = setInterval(settings, 1000 / fps);
        input = '';
    }
    if(input == "arrowright" && selection == 1 && fps < 999){
         fps++;
         clearInterval(setup);
         setup = setInterval(settings, 1000 / fps);
         input = '';
    }
    //screen change
    if(input == ' ' && selection == 2){
            clearInterval(setup);
            input = '';
            setup = setInterval(thicc, 1000 / fps);
        }
        //go back!
    if(input == ' ' && selection == 3){
            clearInterval(setup);
            selection = 1;
            input = '';
            setup = setInterval(prep, 1000 / fps);
        }
}
var screen_color = "#311";
var cruel_delay = 2;
var scroll = 0;
var charSelect = function(){
    if(enemyezmode()){
        completedchallenges = 1;//simply being on easy mode is a challenge!
    }
    screen.font = "25px Times New Roman";
    screen.fillStyle = screen_color;
    screen.fillRect(0, 0, 9999, 9999);

    for(let i = 0; i < chars.length; i++){
        screen.fillStyle = chars[i].postColor;
        screen.fillRect((canvhalfx - 75) + i * 200 - scroll, canvhalfy - 170, 150, 200);
        screen.fillStyle = chars[i].color;
        circle((canvhalfx) + i * 200 - scroll, canvhalfy - 145, chars[i].size)
        screen.textAlign = "center";
        screen.fillText(chars[i].listname(),  (canvhalfx) + i * 200 - scroll, canvhalfy + 5, 200, 75)

    }

    screen.fillStyle = "#900";
    screen.fillRect(0, canvhalfy + 50, 999, 999);
    screen.fillStyle = "#000";
    screen.textAlign = "left";
    screen.font = "15px Times New Roman";
    for(let i = 0; i < chars[selection].desc.length ; i++){
        screen.fillText(chars[selection].desc[i], 0, canvhalfy + 75 + (i * 20), canvas.width);
    }
    if(input == "arrowright"){
        if(scroll < (chars.length - 1) * 200){
            scroll += 200;
            selection++;

        }else{
            scroll = 0;
            selection = 0;
        }
        input = '';
    }
    else if(input == "arrowleft"){
        if(scroll > 0){
            scroll -= 200;
            selection--;
        }else{
            scroll = (chars.length - 1) * 200;
            selection = chars.length - 1
        }

        input = '';
    }
    if(input == " "){
        //time to start the game
        timeplayed = 0;
        chars[selection].inst(0, 0);
        clearInterval(setup);
        setup = setInterval(gametime, 1000 / 30);
        selection = 0;

    }


}
var stageSelect = function(){
    scroll = 0;
    //Normal, Hard, Maddening
    screen.fillStyle = screen_color;
    screen.fillRect(0, 0, 9999, 9999);
    screen.fillStyle = (selection != 0)? "#C00":"#500";
    circle(canvhalfx - 150, canvhalfy, 75);

    //for hard
    screen.fillStyle = (selection != 1)? "#C00":"#500";
    circle(canvhalfx + 25, canvhalfy, 75);
    if(selection == 1){
        circle(canvhalfx + 25, canvhalfy - 125, 25);
        screen.fillStyle = "#F00";
        screen.beginPath();
        screen.moveTo(canvhalfx + 5, canvhalfy - 110);
        screen.lineTo(canvhalfx + 25, canvhalfy - 150);
        screen.lineTo(canvhalfx + 45, canvhalfy - 110);
        screen.stroke();
        screen.closePath();
    }
    //back
    screen.fillStyle = (selection != 3)? "#C00":"#500";
    circle(canvhalfx + 25, canvhalfy + 200, 50);
    //for maddening
    if(selection == 2){
            screen_color = "#200";
            screen.fillStyle = "#F00";
                circle(canvhalfx + 200, canvhalfy, 85);
        }else{
            screen_color = "#311";
        }
    screen.fillStyle = (selection != 2)? "#F33":"#400";
    circle(canvhalfx + 200, canvhalfy, 75);

    //text
    screen.fillStyle = "#000";
    screen.font = "25px Times New Roman";
    screen.fillText("Pick a difficulty!", canvhalfx - 75, canvhalfy - 200);
    screen.fillText("Normal", canvhalfx - 200, canvhalfy + 5);
    screen.fillText("Hard", canvhalfx + 0, canvhalfy + 5);
    screen.fillText("back", canvhalfx + 0, canvhalfy + 205);
    //bonus hard text
    if(selection == 1 && difficulty == "Player"){
        screen.fillText("Change Player", canvhalfx - 50, canvhalfy + 125);

    }else if(selection == 1 && difficulty != "Player"){
        screen.fillText("Change Enemy", canvhalfx - 50, canvhalfy + 125);

    }


    screen.fillStyle = (selection!=2)? "#400":"#F00";

    screen.fillText("Maddening", canvhalfx + 150, canvhalfy + 5);

    //inputs
    if(selection == 2 && cruel_delay > 0 && (input == "arrowleft" || input == "arrowright")){
        cruel_delay--;
        input = 'e' + input;
    }else{
        if(input == "arrowleft"){
            selection = (--selection < 0)? 3:selection;
            input = '';
            if(selection == 0){
                difficulty = "normal";
            }else if (selection == 1){
                difficulty = "Player";
            }else if(selection == 2){
                difficulty = "maddening"
            }
        }
        if(input == "arrowright"){
            selection = (++selection > 3)? 0:selection;
            input = '';
            if(selection == 0){
                difficulty = "normal";
            }else if (selection == 1){
                difficulty = "Player";
            }else{
                difficulty = "maddening"
            }
        }
    }
    if(input == 'arrowup' && selection == 1){
    difficulty = (difficulty == "Mob")? "Player":"Mob";
    input = '';
    }
    if(input == 'arrowdown' && selection == 1){
        selection = 3;
        input = '';
    }
    if(input == 'arrowup' && selection == 3){
        selection = 1;
        input = '';
    }
    if(input == ' '){
        if(selection != 3){
         Hidden[Hidden.length - 1] = 0;
         cruel_delay = 2;
         clearInterval(setup);
         setup = setInterval(charSelect, 1000 / fps);
         input =  '';
         selection = 0;
        }else{
        //go back to the prep screen
        Hidden[Hidden.length - 1] = 0;
        cruel_delay = 2;
        clearInterval(setup);
        setup = setInterval(prep, 1000 / fps);
        input =  '';
        selection = 0;
        }
    }

    if(selection == 2 && input == Hidden[Hidden[Hidden.length - 1]]){
        //this makes it so the last part of the Hidden array is always chosen, and you can change the inputs by using the list easily
        Hidden[Hidden.length - 1]++;

        if(Hidden[Hidden.length - 1] == Hidden.length - 1){
            //made it to the end of the list? Start animation for hidden stage select
            clearInterval(setup);
            setup = setInterval(Hidden1Select, 1000 / fps);
            input = '';
            selection = 2;
        }
        if(cruel_delay == 0){
            cruel_delay = 1;
        }

        input = '';
    }
}
var fire = [];
spawntime = 480;
var Hidden1Select = function(){
    while(spawntime > 20){
        fire.push(new maddeningflame(random(0, canvas.width), random(0, canvas.height + 100), random(-2, 2)));
        spawntime--;
    }
    spawntime--;

    screen.fillStyle = screen_color;
    screen.fillRect(0, 0, 9999, 9999);
    //EGG
    if(selection == 0){
        screen.fillStyle = "#F00";
        circle(canvhalfx - 150, canvhalfy, 85);
        screen.fillStyle = "#400";
        circle(canvhalfx - 150 , canvhalfy, 75);
        screen.fillStyle = "red";
        screen.font = "50px Times New Roman";
        screen.fillText("EGG", canvhalfx - 200, canvhalfy + 10);
    }else{
        screen.fillStyle =  "#C00";
        circle(canvhalfx - 150, canvhalfy, 75);
    }

    //SIMIA!
    if(selection == 1){
            screen.fillStyle = "#F00";
            circle(canvhalfx + 25, canvhalfy, 85);
            screen.fillStyle = "#400";
            circle(canvhalfx + 25, canvhalfy, 75);
            screen.fillStyle = "red";
            screen.font = "25px Times New Roman";
            screen.fillText("SIMIA!", canvhalfx, canvhalfy + 10);
        }else{
            screen.fillStyle =  "#C00";
            circle(canvhalfx + 25, canvhalfy, 75);
        }

    screen_color = "#200";

    if(selection == 2){
    screen.fillStyle = "#F00";
    circle(canvhalfx + 200, canvhalfy, 85);
    screen.fillStyle = "#400";
    circle(canvhalfx + 200, canvhalfy, 75);

    screen.fillStyle = "#F00";
    screen.font = "25px Times New Roman";
    screen.fillText("Boss Rush!", canvhalfx + 150, canvhalfy + 5);
    }else{
    screen.fillStyle = "#C00";
    circle(canvhalfx + 200, canvhalfy, 75);
    }
    if(spawntime < 1){
        fire.push(new maddeningflame(random(0, canvas.width), random(100, canvas.height), random(-5, 5)));
        spawntime = random(8, 12);
        if(selection == 0){
        fire.push(new maddeningflame(canvhalfx + random(-250, -50), canvhalfy + random(-100, 100), random(3, 7)));
        spawntime = 2;
        for(let i = 5; i > 0; i--){
        fire.push(new maddeningflame(random(0, canvas.width), canvas.height, random(-1, 2)));
        }
        }
        if(selection == 1){
                fire.push(new maddeningflame(random(0, canvas.width), random(100, canvas.height), random(-7, -5)));
                fire.push(new maddeningflame(random(0, canvas.width), canvas.height, random(-4, -2)));
        }
    }
    for(let i = 0 ; i < fire.length ; i++){
        if(fire[i].exist()){
            //delete the flame.
            fire.splice(i, 1);
            i--;
        }
    }

    if(input == 'arrowleft'){
    selection = (--selection < 0)? 2:selection;
    input = 'blast';

    //alert("fds")
    }
    if(input == 'arrowright'){
        selection = (++selection > 2)? 0:selection;
        input = 'blast';
        }

    if(input == "blast"){
    for(let i = 0; i < 75 ; i++){
        if(selection == 0){
            fire.push(new maddeningflame(canvhalfx + random(-250, -50), canvhalfy + random(-100, 100), random(5, 15)));
            i-= 0.75;
            spawntime = 120;
        }else if(selection == 1){
            fire.push(new maddeningflame(canvhalfx + random(-50, 100), canvhalfy + random(-75, 75), random(2, 8)));
            spawntime = 40;
        }else{
        fire.push(new maddeningflame(canvhalfx + random(150, 250), canvhalfy + random(-50, 50), random(-5, 1)));
        }
    }
    input = '';
    }

}
var prep = function(){
    //reset challenges
challenges = 
    [
    //lvl 0
    [[enemyezmode, "Have fun!!!", true], [notenemyezmode, "No hit the boss!!!", true], [["Jade", "Magmax"], "End the encounter with 100+% hp", false], [["Simia"], "Hit a tornado kick", false], [["Magna","Jade"], "Hit a parry!", false], [["Ezekiel"], "Hit the boss with a deathorb while in PANIC", false], [[ "Nino"], "Electrically charge a miasma ball", false], [[ "Magna"], "Use nunchuck and parry your own shuriken", false], [[ "Magmax"], "Use flow to cancel harden", false], [["Ezekiel", "Nino"], "Land a critical hit!", false]],
    //lvl 1
    [[enemyezmode, "rout the enemies!", false], [notenemyezmode, "kill the boss last", true]], 
    //lvl 2
    [[true, "don't get parried", true], ["Magna", "Parry the parry beam!", false]],
    //lvl 3
    [[true, "Don't take any damage!", true], [notenemyezmode, "Kill both bosses within 3 seconds of the other dying"]]
]//visibility condition, description, completed
completedchallenges = 0;
parried = 0;
crit = 0;
proj_parry = [];
playerattack;
enemyattack;
playerhp = 0;//remember what it was before a reset
framesplayed = 0;//good for calculating time

    //what people choose

    //after setup, see the play and settings button
    screen.fillStyle = "#311";
    screen.fillRect(0, 0, 9999, 9999);
    screen.fillStyle = (selection != 0)? "#500":"#F00";
    circle(canvhalfx - 150, canvhalfy, 50);
    screen.fillStyle = (selection != 1)? "#500":"#F00";
    circle(canvhalfx + 150, canvhalfy, 50);
    screen.fillStyle = "#000";
    screen.font = "25px Times New Roman";
    screen.fillText("Play", canvhalfx - 170, canvhalfy + 5);
    screen.fillText("Settings", canvhalfx + 110, canvhalfy + 5);
    screen.fillText("Space to select, arrow keys to move", canvhalfx - 175, canvhalfy - 200);
    if(input == 'arrowleft' || input == 'arrowright'){
        selection = (selection == 0)? 1:0;
        input = '';
    }
    if(input == ' ' && selection == 1){
    selection = 0;
        clearInterval(setup);
        setup = setInterval(settings, 1000 / fps);
        input = '';
    }
    if(input == ' ' && selection == 0){
        clearInterval(setup);
        setup = setInterval(stageSelect, 1000 / fps);
        difficulty = "normal";
        input = '';
    }



}
}
//playing the game
var gametime = function(){
     screen.lineWidth = 1;
    screen.fillStyle = "#311";
    screen.strokeStyle = "#000";
    screen.fillRect(0, 0, 9999, 9999);
    screen.strokeRect(canvhalfx - arena.w + player.px, canvhalfy - arena.h + player.py, arena.w*2, arena.h*2);
    //bossbar
    if(bossbarmode == 2){
        //Large bossbar
        screen.fillStyle = "#FF0000";
        screen.strokeStyle = "orange";
        //screen.lineWidth = 5
        screen.fillRect(30, 10, canvas.width - 60, 40);
        screen.strokeRect(30, 10, canvas.width - 60, 40);
        //screen.lineWidth = 1

        screen.fillStyle = "#559900";
        {//calculating total boss hp
            var currentbosshp = 0;

            for(let i = 0 ; i < bossbar.length ; i++){


                currentbosshp+=bossbar[i].hp;
            }
            screen.fillRect(30,  10, (canvas.width - 60) / (bossbar.length * 100 / currentbosshp), 40);
            totalbosshp = (bossbar.length * 100 / currentbosshp);
        }
        //boss name
        screen.fillStyle = "white";
        screen.textAlign = "center"
        screen.font = "35px Times New Roman";
        screen.fillText(boss_title, canvhalfx, 40)
    }else if(bossbarmode == 1){
        //small bossbar
        screen.fillStyle = "#FF0000";
        screen.fillRect(canvhalfx+ 100, 20, 250, 40);
        screen.fillStyle = "#559900";
        {//calculating total boss hp
                    var currentbosshp = 0;

                    for(let i = 0 ; i < bossbar.length ; i++){


                        currentbosshp+=bossbar[i].hp;
                    }
        screen.fillRect(canvhalfx+ 100, 20, 250 / (bossbar.length * 100 / currentbosshp), 40);
        totalbosshp = (bossbar.length * 100 / currentbosshp);

        }
        //boss name
        screen.fillStyle = "white";
        screen.textAlign = "center"
        screen.font = "20px Times New Roman";
        screen.fillText(boss_title, (canvhalfx + 100) + (230/2), 40);//can't be bothered with the math
    }
    //console.log(totalbosshp)
    if(level == 0 && !enemyezmode()){
        projectiles = [];
        bossbar = [];
    enemies = [];
    player.inst(100, 0);
    arena.w = canvhalfx + 40;
    arena.h = canvhalfy + 40;
    //This boss gets significatly harder out of normal or player mode
    boss_title = "Magna's Lorem Machinam"
    bossbarmode = 2;
    bosses[0].inst(9);
    bossbar.push(enemies[0]);
    level += 0.5;
    }else if (level == 0){
        projectiles = [];
    enemies = [];
    bossbar = [];
    player.inst(0, 0);
    boss_title = "Tutorial Bot"
    bossbarmode = 1;
    bosses[0].inst();
    bossbar.push(enemies[0]);
    level += 0.5;
    }

    if(player.exist()!="dead"){
        //challenges in levels
        switch (Math.floor(level)){

            case 0:
                playerhp = player.hp
                //no hit on hard mode
                if(notenemyezmode()){
                    nohitstatus(challenges[0][1]);
                }
                //parry
                if(parried == true){
                    challenges[0][4][2] = true;
                }
                //projectile parry
                if(proj_parry.length > 0){
                    challenges[0][7][2] = true;
                }

                //hitting tornado kick
                if(playerattack == "Tornado Kick"){
                    challenges[0][3][2] = true;
                }
                //going from harden to flow
                if(challenges[0][8][2] == false){
                if(player.state == "harden"){
                    crit = 1;
                }else if(player.state == "flow" && crit == 1){
                    challenges[0][8][2] = true;
                    crit = 0;
                }else if(player.listname() == "Magmax"){
                    crit = 0;
                }
            }
                //critical hit
                if(crit > 0 && player.listname() != "Magmax"){
                    challenges[0][challenges[0].length-1][2] = true;
                }

                //charging a miasma ball
                for(let i = 0 ; challenges[0][6][2] == false && i < projectiles.length ; i++){
                    if(projectiles[i].name == "Miasma" && projectiles.some(x => x.name == "chain lightning" && x.hitbox.scanproj(i))){
                        challenges[0][6][2] = true;
                    }
                }

                //deathorb
                if(playerattack == "deathorb melee" && player.stance == "PANIC"){
                    challenges[0][5][2] = true;
                }

                



            break;
            case 1:
                //acquire challenge points
                //check for completed challenges (in this case, hp being over 100)
                
                if(challenges[0][2][2] == false && playerhp > 100){
                    challenges[0][2][2] = true;
                    completedchallenges++;
                }
                //no hit in hard mode
                if(!enemyezmode() && challenges[0][1][2]){
                    challenges[0][1][2] = false;
                    completedchallenges++;
                }
                //parry
                if(challenges[0][4][2] == true){
                    challenges[0][4][2] = false;
                    completedchallenges++
                }
                //proj parry
                if(challenges[0][7][2] == true){
                    challenges[0][7][2] = false;
                    completedchallenges++
                }
                //hitting tornado kick
                if(challenges[0][3][2] == true){
                    challenges[0][3][2] = false;
                    completedchallenges++
                }
                //proj parry
                if(challenges[0][8][2] == true){
                    challenges[0][8][2] = false;
                    completedchallenges++
                }
                //critical hit
                if(challenges[0][challenges[0].length-1][2] == true){
                    challenges[0][challenges[0].length-1][2] = false;
                    completedchallenges++;
                }
                //charged miasma ball
                if(challenges[0][6][2] == true){
                    challenges[0][6][2] = false;
                    completedchallenges++;
                }
                //deathorb
                if(challenges[0][5][2] == true){
                    challenges[0][5][2] = false;
                    completedchallenges++;
                }

                //level 1 challenges
                framesplayed++;

                //routing the enemy (easy)
                if(enemies.length == 0 && enemyezmode() && framesplayed > 10){
                    challenges[1][0][2] = true;
                }
                //boss killed last
                if(notenemyezmode() && framesplayed > 10 && enemies.length > 0 && enemies[0].phasetimer == undefined){
                    challenges[1][1][2] = false;
                }


                break;

                case 2:
                //acquire points

                //easy
                if(challenges[1][0][2] == true){
                    challenges[1][0][2] = false;
                    completedchallenges++;
                }

                //hard
                if(challenges[1][1][2] == true){
                    challenges[1][1][2] = false;
                    completedchallenges++;
                }

                //challenges


                //don't get parried! (and hit... shhhhhh)
                if(enemyattack == "PARRIED"){
                    challenges[2][0][2] = false;
                }
                //counterparry!
                




        }





    //console.log(inputs);
    //console.log(projectiles);
    for(let i = 0; i < projectiles.length ; i++){
    if(projectiles[i].exist() == "delete"){
        projectiles.splice(i--, 1);
    }
    }
    try{
    for(let i = 0 ; enemies.length; i++){
    if (enemies[i].exist() == "delete"){
        enemies[i].hp == -999;
    bossbar.splice(i, 1);
    enemies.splice(i--, 1);


    }
    enemies[i].enemyID = i;
    }
    }catch(e){}

    //timeplayed++;
    if(bossbar.length == 0){
    resttimer++;//give the player a bit of a break!
    if(resttimer > rest){
    resttimer = 0;
    level+=0.5;
    }
    }else{
    resttimer =0;
    }
    if(level % 1 == 0){
        //reset challenge variables
        parried = 0;
        proj_parry = [];
        crit = 0;
    }
    if(!["SIMIA", "EGG", "boss rush"].includes(difficulty)){
    //regular progression
    if(level == 1){
    

    bossbar = [];
    projectiles = [];
    enemies = [];
    player.inst(100, 0);
    if(enemyezmode()){
    bosses[1].inst(4);
    bossbarmode = 1;
    }else{
    bossbarmode = 2;
    bosses[1].inst(7);
    }

    bossbar.push(enemies[0]);
    boss_title = "The Orb of Duplication"
    arena.w = canvhalfx * 3;
    arena.h = canvhalfy * 3;

    level +=0.5;
    }else if(level == 2){
        projectiles = [];
        enemies = [];
        player.inst(0, 0);
        if(enemyezmode()){
            bosses[2].inst(2, canvhalfx, canvhalfy - 100);
            bossbarmode = 2;
        }else{
            bosses[2].inst(6, canvhalfx, canvhalfx - 100);
            bossbarmode = 2;
        }

        bossbar.push(enemies[0]);
        boss_title = "Magna Venandi"
        arena.w = canvhalfx * .75;
        arena.h = canvhalfy * .75;

        level +=0.5;
        
    }else if(level == 3){
        projectiles = [];
        enemies = [];
        player.inst(0, 0);
        arena.w = canvhalfx * 2;
        arena.h = canvhalfy * 2;
        if(enemyezmode()){
            bosses[3].inst(true, 2, 4, random(canvhalfx - arena.w,  canvhalfx - arena.w + arena.w*2), random(canvhalfy - arena.h,  canvhalfy - arena.h + arena.h*2), 45);
            //bosses[3].inst(true, 2, 4, random(canvhalfx - arena.w,  canvhalfx - arena.w + arena.w*2), random(canvhalfy - arena.h,  canvhalfy - arena.h + arena.h*2), 45);
            boss_title = "Slowing Enemy"
            bossbarmode = 1;
            for(let i = 0 ; i < 45 ; i++){
                bosses[4].inst(false, 6, 2, random(canvhalfx - arena.w,  canvhalfx - arena.w + arena.w*2), random(canvhalfy - arena.h,  canvhalfy - arena.h + arena.h*2), 24);
            }
             bossbar.push(enemies[0]);
        }else{
             bosses[3].inst(true, 8, 9,  random(canvhalfx - arena.w,  canvhalfx - arena.w + arena.w*2), random(canvhalfy - arena.h,  canvhalfy - arena.h + arena.h*2), 60);
             bosses[3].inst(true, 12, 6, random(canvhalfx - arena.w,  canvhalfx - arena.w + arena.w*2), random(canvhalfy - arena.h,  canvhalfy - arena.h + arena.h*2), 42);
            bossbarmode = 2;
            for(let i = 0 ; i < 30 ; i++){
                if(i < 5){
                    bosses[3].inst(false, 10, 8,  random(canvhalfx - arena.w,  canvhalfx - arena.w + arena.w*2), random(canvhalfy - arena.h,  canvhalfy - arena.h + arena.h*2), 36);
                }
                bosses[4].inst(false, 10, 5, random(canvhalfx - arena.w,  canvhalfx - arena.w + arena.w*2), random(canvhalfy - arena.h,  canvhalfy - arena.h + arena.h*2), 24);
            }
            boss_title = "Slowing Enemies"
            bossbar.push(enemies[0]);
        bossbar.push(enemies[1]);
        }
        
        

        level +=0.5;
    }
    }


    if(input == "escape"){
        //pause the game
        pauseselection = 0;
        clearInterval(setup);
        setup = setInterval(pause, 1000 / fps);
        screen.fillStyle = "#00000099";
        screen.fillRect(0, 0, 9999, 9999);
        input = '';
    


    }
    }
}
var pause = function(){
    //no background needed here
    let challengeskip = challenges[Math.floor(level)]//I'm not typing that all the time!
    let challengenum = 0;
    //challenges
    screen.fillStyle = "#161616";
    for(let i = 0 ; challengeskip != undefined && i < challengeskip.length ; i++){
    screen.fillStyle = "#161616";
    //console.log(challengeskip[i])
    //first, are there any challenges???
    
    //second, does the challenge even show?
    if(Array.isArray(challengeskip[i][0])){
        //there are many character names or conditions. all functions must be true, only 1 string has to be true
        
        let strings = false;
        let skipstring = false;
        let contin = false
        for(let x = 0 ; x < challengeskip[i][0].length ; x++){
            if(typeof challengeskip[i][0][x] == "function" && challengeskip[i][0][x]() == false){
                //this was false
                contin = true;
                break;
            }else if(skipstring == false && challengeskip[i][0][x] == player.listname()){
                //check no more strings!
                skipstring = true;
            }else if(skipstring == false && challengeskip[i][0][x] != player.listname()){
                //this was a string, but not OUR string
                strings = true;
            }
        }
        if(contin == true || strings == true && skipstring == false){
            //a single false function, or the character isn't what we want it to be, skip this challenge
            continue;
        }
    }else if(typeof challengeskip[i][0] == "function" && challengeskip[i][0]() == false){
        //only proceed if the function is true!
        
        continue;
    }else if(typeof challengeskip[i][0] == "string" && challengeskip[i][0] != player.listname()){
        
        //it's a string, check to see if it's the same as the player name
        continue

    }else if (challengeskip[i][0] == false){
        //it's a booleon... for some reason
        continue;
    }
    
    screen.fillRect(canvhalfx - 300, 30 + (challengenum * 50), 600, 50);
    
    screen.fillStyle = (challengeskip[i][2] == true)? "#0f0" : "#fff";
    screen.font = "25px Times New Roman";
    screen.textAlign = "center"
    screen.fillText(challengeskip[i][1], canvhalfx, 65 + (challengenum * 50))
    challengenum++;

   

}
 //resume
    screen.fillStyle = (pauseselection == 0)? "#666" : "#333";
    screen.fillRect(canvhalfx - 80, canvhalfy - 40, 160, 50);
    
    screen.fillStyle = "#fff";
    screen.font = "25px Times New Roman";
    screen.textAlign = "center"
    screen.fillText("Resume", canvhalfx, canvhalfy - 10)
    //reset
    screen.fillStyle = (pauseselection == 1)? "#666" : "#333";
    screen.fillRect(canvhalfx - 80, canvhalfy + 80, 160, 50);
    
    screen.fillStyle = "#fff";
    screen.font = "25px Times New Roman";
    screen.textAlign = "center"
    screen.fillText("Reset", canvhalfx, canvhalfy + 110)
    //exit
    screen.fillStyle = (pauseselection == 2)? "#666" : "#333";
    screen.fillRect(canvhalfx - 80, canvhalfy + 200, 160, 50);
    
    screen.fillStyle = "#fff";
    screen.font = "25px Times New Roman";
    screen.textAlign = "center"
    screen.fillText("Exit", canvhalfx, canvhalfy + 230)

    //going up or down
    if(input == "arrowdown"){
        pauseselection = (++pauseselection > 2)? 0: pauseselection;
        input = '';
    }
    if(input == "arrowup"){
        pauseselection = (--pauseselection < 0)? 2: pauseselection;
        input = '';
    }

    //inputs
    if(input == "escape" || input == ' ' && pauseselection == 0){
        //resume the game

        //pause the game
        pauseselection = 0;
        clearInterval(setup);
        setup = setInterval(gametime, 1000 / fps);
        
        input = '';
    }else if(input == ' ' && pauseselection == 1){
        //restart the current level
        level = Math.floor(level);
        pauseselection = 0;
        clearInterval(setup);
        setup = setInterval(gametime, 1000 / fps);
        
        input = '';
    }else if (input == ' '){
        player = null;
        clearInterval(setup);
        setup = setInterval(prep, 1000/fps);
        screen.textAlign = "left";
        level = 0;
        input = '';
        bossbar = [];

    }
}

document.body.onload = function(){
    //the game setup. This is the first function to run!
    console.log("Running game")

    {
    //ensure the positioning is correct
    let truepos = [];
    let pos2 = [];
    //console.log(charlist)
    for(let i = 0; i < chars.length; i++){
        if(charlist[i] == "undefined"){
            //JUUUUST incase.
            console.log(i + " was not found in the charlist");
            continue;
        }
    if(chars[i].listname() == charlist[i]){
        //if the listname of the character in chars is the same as what is in the same position in charlist is true, the position is correct
        console.log(chars[i].listname() + " is " + charlist[i]);
        truepos.push(chars[i]);
    }else{
        console.log(chars[i].listname() + " is not " + charlist[i]);
        for(let x = 0; x < charlist.length;x++){
            if(chars[x].listname() == charlist[i]){
                console.log("but " + chars[x].listname() + " IS " + charlist[i]);
                truepos.push(chars[x]);
                break;
            }
        }
    }

    }
    chars = truepos;
    }
    {
    //do the same thing for bosses
    //console.log(bosslist)
    let truepos = [];
    //let pos2 = [];
    for(let i = 0; i < bosses.length; i++){
            if(bosslist[i] == "undefined"){
                //JUUUUST incase.
                console.log(i + " was not found in the bosslist");
                continue;
            }
        if(bosses[i].listname() == bosslist[i]){
            //if the listname of the character in chars is the same as what is in the same position in charlist is true, the position is correct
            console.log(bosses[i].listname() + " is " + bosslist[i]);
            truepos.push(bosses[i]);
        }else{
            console.log(bosses[i].listname() + " is not " + bosslist[i]);
            for(let x = 0; x < bosslist.length;x++){
                if(bosses[x].listname() == bosslist[i]){
                    console.log("but " + bosses[x].listname() + " IS " + bosslist[i]);
                    truepos.push(bosses[x]);
                    break;
                }
            }
        }

        }
        bosses = truepos;


    }
    //console.log(chars);


    for(let i = 0; i<chars.length; i++){
    //greetings for everyone
    chars[i].greeting();
    if(chars[i].listname() == "Simia"){
        //The most to say, and yet still the one nobody remembers
        chars[i].yell();

    }
    }
    //After everything is set up, stop loading and begin the game!
    clearInterval(load);
    document.title = "Trail Chambers";
    setup = setInterval(prep, 1000 / fps);
}