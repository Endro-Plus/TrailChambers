"use strict"
//fps
var fps = 30;
//set up canvas
var canvas = document.getElementsByTagName("canvas")[0];
var screen = canvas.getContext("2d");
//set the canvas size
canvas.width = 750 //half is 375
canvas.height = 600 // half is 300
var topmargin = 0; //the top margin of the canvas is 0
var canvhalfx = canvas.width / 2;
var canvhalfy = canvas.height / 2;

//a list of every character
/*
Do not include .js, this is added automatically. The name you put in this should be the same
as the listname in the listname function for each character.

This is not only a list of character names, but the order that they appear
*/
var charlist = ["Jade", "Magmax", "Simia", "Magna", "Ezekiel", "Nino", "Shojo", "Dorn"];
//this will always be the last
charlist.push("Realgame");

//list of every boss. Once again, this is ordered based on how you put them in.
var bosslist = ["Tutorial_Bot", 'The_Eye', "MagnaE"]

//another list of characters a for loop will make use of
var chars = [];
var bosses = [];
{
//literally the loading screen
let x = canvas.width / 2;
let y = canvas.height / 2;
var loading = function(){
    //first, set a background

    screen.fillStyle = "#100";
    screen.fillRect(0, 0, 999, 999);

    //2 moving rectangles using Math.cos
    screen.fillStyle = "white";
    screen.fillRect(canvhalfx - 30 - Math.cos(x+=0.03) * 100, y, 60, 30)
    screen.fillRect(canvhalfx - 30 + Math.cos(x+=0.03) * 100, y, 60, 30)

}

}
//inputs
var input = '';
var inputs = [];
var inp = function(event){
    input = (event.key).toLowerCase();
    if(!inputs.includes((event.key).toLowerCase())){
        inputs.push((event.key).toLowerCase());
    }
    //console.log(input);
}
var endinp = function(event){
    if(inputs.includes((event.key).toLowerCase())){
        inputs.splice(inputs.indexOf((event.key).toLowerCase()), 1);

    }
}

var load = setInterval(loading, 1000 / fps);
//load the bosses!
for(let i = 0; i < bosslist.length;i++){
    try{
        let x = document.createElement("script");
        if(i != bosslist.length){
        x.src = "Bosses/" + bosslist[i];
        }else{
        x.src = "./" + bosslist[i];
        }

        //because I don't trust people to listen
        if(!x.src.includes(".js", -3)){
            x.src+=".js";
        }
        document.body.appendChild(x);
    }catch(e){
        console.log("error finding " + bosslist[i] + ". Moving on");
        continue;
    }
}
//load the characters!
for(let i = 0; i < charlist.length;i++){
    try{
        let x = document.createElement("script");
        if(i != charlist.length-1){
        x.src = "Characters/" + charlist[i];
        }else{
        x.src = "./" + charlist[i];
        }

        //because I don't trust people to listen
        if(!x.src.includes(".js", -3)){
            x.src+=".js";
        }
        document.body.appendChild(x);
    }catch(e){
        console.log("error finding " + charlist[i] + ". Moving on");
        continue;
    }


}


//clearInterval(load);

