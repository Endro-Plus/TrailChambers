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
var presets = [['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'z', 'x', 'c', 'v'],
                ['a', 'd', 'w', 's', 'j', 'k', 'l', ';'],
                ['a','d','w','s','arrowleft','arrowdown','arrowright','arrowup'],
                ['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'a', 's', 'd', 'w']];

var controls = presets[1];
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
var level = 0;
var rest = 100;
var resttimer = 0;


{
var selection = 0;
var Hidden = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'earrowleft', 'earrowright', 'earrowleft', 'earrowright', 0];
var settings = function(){
    screen.fillStyle = "#522";
    screen.fillRect(0, 0, 999, 999);

    //changing controls
    screen.fillStyle = (selection != 0)? "#999":"#333";
    screen.fillRect(canvhalfx - 100, canvhalfy - 200, 150, 50);

    //changing fps
    screen.fillStyle = (selection != 1)? "#999":"#333";
    screen.fillRect(canvhalfx - 100, canvhalfy, 150, 50);
    if(selection == 1){
        screen.fillStyle = "#555";
        screen.fillRect(canvhalfx - 165, canvhalfy, 40, 50);
        screen.beginPath();//left
        screen.moveTo(canvhalfx - (165 - 40), canvhalfy);
        screen.lineTo(canvhalfx - 165, canvhalfy + 25);
        screen.lineTo(canvhalfx - (165 - 40), canvhalfy + 50);
        screen.stroke();
        screen.closePath();

        screen.fillRect(canvhalfx + 75, canvhalfy, 40, 50);
        screen.beginPath();//right
        screen.moveTo(canvhalfx + (75), canvhalfy);
        screen.lineTo(canvhalfx + (75 + 40), canvhalfy + 25);
        screen.lineTo(canvhalfx + (75), canvhalfy + 50);
        screen.stroke();
        screen.closePath();
    }
    //changing back
    screen.fillStyle = (selection != 2)? "#999":"#333";
    screen.fillRect(canvhalfx - 100, canvhalfy + 200, 150, 50);
    screen.font = "20px Times New Roman";
    screen.fillStyle = "#000";
    screen.fillText("Change controls", canvhalfx - 95, canvhalfy - 180);
    screen.fillText("FPS: " + fps, canvhalfx - 90, canvhalfy + 20);
    screen.fillText("back", canvhalfx - 95, canvhalfy + 220);
    if(input == 'arrowdown'){
        selection = (++selection == 3)? 0:selection;

        input = '';
    }
    if(input == 'arrowup'){
        selection = (--selection == -1)? 2:selection;

        input = '';
    }
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
    if(input == ' ' && selection == 2){
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
    screen.font = "25px Times New Roman";
    screen.fillStyle = screen_color;
    screen.fillRect(0, 0, 999, 999);

    for(let i = 0; i < chars.length; i++){
        screen.fillStyle = chars[i].postColor;
        screen.fillRect((canvhalfx - 75) + i * 200 - scroll, canvhalfy - 170, 150, 200);
        screen.fillStyle = chars[i].color;
        circle((canvhalfx) + i * 200 - scroll, canvhalfy - 145, chars[i].size)
        screen.textAlign = "center";
        screen.fillText(chars[i].listname(),  (canvhalfx) + i * 200 - scroll, canvhalfy + 05, 200, 75)

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
    screen.fillRect(0, 0, 999, 999);
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
    screen.fillRect(0, 0, 999, 999);
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
    //what people choose

    //after setup, see the play and settings button
    screen.fillStyle = "#311";
    screen.fillRect(0, 0, 999, 999);
    screen.fillStyle = (selection != 0)? "#F00":"#500";
    circle(canvhalfx - 150, canvhalfy, 50);
    screen.fillStyle = (selection != 1)? "#F00":"#500";
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
    screen.fillStyle = "#311";
    screen.strokeStyle = "#000";
    screen.fillRect(0, 0, 999, 999);
    screen.strokeRect(canvhalfx - arena.w + player.px, canvhalfy - arena.h + player.py, arena.w*2, arena.h*2);
    if(level == 0 && !enemyezmode()){
    //This boss gets significatly harder out of normal or player mode
    bosses[0].inst(9);
    level += 0.5;
    }else if (level == 0){
    bosses[0].inst();
    level += 0.5;
    }

    if(player.exist()!="dead"){
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
    enemies.splice(i--, 1);

    }
    enemies[i].enemyID = i;
    }
    }catch(e){}

    //timeplayed++;
    if(enemies.length == 0){
    resttimer++;//give the player a bit of a break!
    if(resttimer > rest){
    resttimer = 0;
    level+=0.5;
    }
    }else{
    resttimer =0;
    }

    if(!["SIMIA", "EGG", "boss rush"].includes(difficulty)){
    //regular progression
    if(level == 1){
    player.inst(100, canvhalfy);
    if(enemyezmode()){
    bosses[1].inst(4);
    }else{
    bosses[1].inst(7);
    }
    arena.w = canvhalfx * 2;
    arena.h = canvhalfy * 2;

    level +=0.5;
    }
    }
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
    let pos2 = [];
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