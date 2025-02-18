﻿function printmoney(num) {
    return num && num.toString()
        .replace(/\d+/, function(s){
             return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
         })
  }
DefineMacroS("printmoney", printmoney);


window.showcharainfo = function () {
	new Wikifier(null, '<<replace #charainfo>><<charainfo>><</replace>><<CMApply>>');
}

window.basepercent = function(name) {
    var min = V.PC.base[name][0]
    var max = V.PC.base[name][1]
    return Math.clamp(Math.trunc(((min/max)*100)),1,100)
};

function percent(min,max){
    return Math.clamp(Math.trunc(((min/max)*100)),1,100)
}
window.percent = percent
F.percent = percent

// Make .divs-links clickable as if they're anchors
window.linkifyDivs = function (parentSelector = "") {
	$(document).ready(() => { $(parentSelector + " .div-link").click(function (e) { $(this).find('a').first().click(); }) });
	$(document).ready(() => { $(parentSelector + " .div-link a").click(function (e) { e.stopPropagation(); }) });
}

function bookmark(name) {
    var bk = {}
    bk[name] = V.event
    bk[name].visited = true

    Object.assign(V.bookmark,bk)

    return ""
}
F.bookmark = bookmark
DefineMacroS("bookmark", bookmark)


window.hairlenth = function(num){
    if( between(num,0,99)) return 1;
    else if(between(num,100,499)) return 2;
    else if(between(num,500,799)) return 3;
    else if(num>= 800) return 4;
    else return 1;
}

function timebetween(a,b){
    return between(V.date.time,a*60,b*60)
}
F.timebetween = timebetween
DefineMacroS("inTime", timebetween)

window.randomtext = function(a){
    if(typeof(a)=="string")return a;
    else{
        let i = random(0,a.length)
        return a[i]
    }
}

function REP(){
    V.REP = random(0,100)
}
F.REP = REP
DefineMacroS("setREP",REP)