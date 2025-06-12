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

function maddeningflame(startposx, startposy, rand = 0){
this.px = startposx;
this.py = startposy;
this.size = 10 + (rand * .5);
this.heat = 3.00 + (rand * 0.25);
this.decay = 0.03 + (rand * .001);
this.red = 255;
}
maddeningflame.prototype.exist = function(){
screen.fillStyle = "rgb("+this.red+", 0, 0)";
circle(this.px, this.py, this.size)
this.py-= this.heat;
this.heat -= this.decay;

this.red -= this.decay * 100;
if(this.heat < 1){
this.size -= this.decay * 10;
}
if(this.heat <  0 || this.red < 50 || this.size < 2){
return true;
}else{
return false
}
}