/* 
    Document   : TriCalc.js
    Created on : 17.04.2012, 10:05:18
    Author     : Alex Buchner
    Description:
        Purpose of the stylesheet follows.
 */

createCalc();
defineFormVars();

function defineFormVars(){
    form_distance=document.getElementById('distance');
    form_timehh=document.getElementById('timehh');
    form_timemm=document.getElementById('timemm');
    form_timess=document.getElementById('timess');
    form_time_mmKm=document.getElementById('timekm_mm');
    form_time_ssKm=document.getElementById('timekm_ss');
    form_tempo_Kmh=document.getElementById('tempo');
}
function getVars(){
    distance=0;
    result_time=new Array(0,0,0);
    result_timeKm=new Array(0,0);
    result_tempoKmh=0;
    distance=checkvar(form_distance.value);
    timehh=checkvar(form_timehh.value);
    timemm=checkvar(form_timemm.value);
    timess=checkvar(form_timess.value);
    time=timehh*3600+timemm*60+timess;
    time_mmKm=checkvar(form_time_mmKm.value);
    time_ssKm=checkvar(form_time_ssKm.value)
    time_Km=time_mmKm*60+time_ssKm;
    tempo_Kmh=checkvar(form_tempo_Kmh.value);
}

/* Die Funktion calculateAll berechnet anhand der eingegebnen Werte die
   entsprechenden fehlenden (gewünschten) Werte)*/
function calculateAll(){
    if(distance>0&&time>0&&time_Km==0&&tempo_Kmh==0){           /*Strecke - Zeit(Strecke)*/
        result_timeKm=calculateTimeMkm(distance,time);
        result_tempoKmh=calculateTempoKmh(distance,time);
        result_time=new Array(timehh,timemm,timess);
    }else if(distance>0&&time==0&&time_Km>0&&tempo_Kmh==0){     /*Strecke - Zeit(pro km)*/
        result_time=calculateTime(distance,time_Km,0);
        result_tempoKmh=calculateTempoKmh(0,0,time_Km)
        result_timeKm=new Array(time_mmKm,time_ssKm);
    }else if(distance>0&&time==0&&time_Km==0&&tempo_Kmh>0){     /*Strecke - Geschwindigkeit*/
        result_time=calculateTime(distance,0,tempo_Kmh);
        result_timeKm=calculateTimeMkm(0,0,tempo_Kmh);
    }else if(distance==0&&time==0&&time_Km==0&&tempo_Kmh>0){    /*Geschwindigkeit*/
        result_timeKm=calculateTimeMkm(0,0,tempo_Kmh);
        result_tempoKmh=tempo_Kmh;
    }else if(distance==0&&time==0&&time_Km>0&&tempo_Kmh==0){    /*Zeit(pro km)*/
        result_tempoKmh=calculateTempoKmh(distance,time,time_Km);
        result_timeKm=new Array(time_mmKm,time_ssKm);
    }else{
        alert("Keine gültige Eingabe");
    }
    form_distance.value=formatString(distance);
    form_timehh.value=formatString(result_time[0]);
    form_timemm.value=formatString(result_time[1]);
    form_timess.value=formatString(result_time[2]);
    form_time_mmKm.value=formatString(result_timeKm[0]);
    form_time_ssKm.value=formatString(result_timeKm[1]);
    form_tempo_Kmh.value=formatString(result_tempoKmh);
    checkInput();
}

/* Die Funktion checkInput prüft während der Eingabe, ob eine Berechung mit den
 * angegebenen Werten durchgeführt werden kann. Bei positver Prüfung wird der
 * Button "berechnen" grün eingefärbt
 * Mögliche Varianten                           
 * Eingabe: Strecke und Zeit für die Strecke    Ausgabe: Zeit pro km und Geschwindigkeit
 * Eingabe: Strecke und Zeit pro km             Ausgabe: Zeit für Strecke und Geschwindigkeit
 * Eingabe: Strecke und Geschwindigkeit         Ausgabe: Zeit für Strecke und Zeit pro km
 * Eingabe: Geschwindigkeit                     Ausgabe: Zeit pro km
 * Eingabe: Zeit pro km                         Ausgabe: Geschwindigkeit*/

function checkInput(){ 
    getVars();
    var checkit=false;
    if(distance>0&&time>0&&time_Km==0&&tempo_Kmh==0){
        checkit=true;
    }else if(distance>0&&time==0&&time_Km>0&&tempo_Kmh==0){
        checkit=true;
    }else if(distance>0&&time==0&&time_Km==0&&tempo_Kmh>0){
        checkit=true;
    }else if(distance==0&&time==0&&time_Km==0&&tempo_Kmh>0){
        checkit=true;
    }else if(distance==0&&time==0&&time_Km>0&&tempo_Kmh==0){
        checkit=true;
    }
    if(checkit==true){
        document.getElementById('calc').className='button green';
    }else{
        document.getElementById('calc').className='button neutral';
    }
}

/* Die Funktion calculateTime berechnet mit Strecke, ssKm und Geschwindigkeit
 * die Zeit für die Strecke
 * Eingabe: Strecke und Geschwindigkeit     Ausgabe: Zeit für die Strecke
 * Eingabe: Strecke und Zeit pro km         Ausgabe: Zeit für die Strecke*/

function calculateTime(distance,ssKm,kmh){
    if(distance>0&&ssKm==0&&kmh>0){
        time_ss=distance/kmh*3600;
    }else{
        time_ss=distance*ssKm;
    }
    time_hh=parseInt(time_ss/3600); /*parseInt wandelt eine Zeichenkette in eine Zahl um, schneidet nachdem Komma ab*/
    time_ss=time_ss-time_hh*3600;
    time_mm=parseInt(time_ss/60);
    time_ss=parseInt(time_ss-(time_mm*60));
    return new Array(time_hh,time_mm,time_ss);
}

/* Die Funktion calculateTimeMkm berechnet mit Strecke, Zeit für die Strecke und
 * Geschwindigkeit die Zeit pro km
 * Eingabe: Geschwindigkeit                 Ausgabe: Zeit pro km
 * Eingabe: Strecke und Zeit pro Strecke    Ausgabe: Zeit pro km und Geschwindigkeit*/

function calculateTimeMkm(distance,time,kmh){
    if(distance==0&&time==0&&kmh>0){    /*Wenn nur Geschwindigkeit angegeben*/
        seconds_km=3600/kmh;            /**/
    }else{
        seconds_km=time/distance;
    }
    time_mm=parseInt(seconds_km/60);
    time_ss=parseInt(seconds_km-(time_mm*60));
    return new Array(time_mm,time_ss);
}
function calculateTempoKmh(distance,time,ssKm){
    if(distance>0&&time>0){
        return Math.round(distance/time*3600);
    }else if(distance==0&&time==0&&ssKm>0){
        return(3600/ssKm);
    }
}
function checkvar(variable){
    variable=variable.replace(/,/g,".");
    if(isNaN(parseFloat(variable))){
        back=0;
    }else{
        back=eval(variable);
    }
    return back;
}
function formatString(inputVar){
    stringVar='';
    if(isNaN(inputVar)){
        inputVar='00';
    }else{
        if(inputVar<10){
            stringVar='0';
        }
        stringVar=stringVar+String(inputVar);
    }
    return stringVar;
}
function showHelp(){
    var helpLayer=document.getElementById('Help');
    helpLayer.style.visibility='visible';
}
function closeHelp(){
    var helpLayer=document.getElementById('Help');
    helpLayer.style.visibility='hidden';
}
function createCalc(){
    stylesheet=document.createElement("link");
    stylesheet.rel="stylesheet";
    stylesheet.type="text/css";
    stylesheet.href="widgets\/SwimCalc.css";
    stylesheet.media="all";
    document.lastChild.firstChild.appendChild(stylesheet);
    document.write("<div id=\"SwimCalc\"><\/div>");
    var container=document.getElementById('calc');
    document.getElementById('calc').innerHTML=form;
}
