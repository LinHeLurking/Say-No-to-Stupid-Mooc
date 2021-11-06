// ==UserScript==
// @name         Fuck the stupid mooc
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  国科大慕课学习，鼠标离开界面不会暂停，且不用在视频中答题
// @author       LinHe
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.0/jquery.min.js
// @match        http://mooc1.ecourse.ucas.ac.cn/mycourse/*
// @icon         https://www.google.com/s2/favicons?domain=ucas.ac.cn
// @grant        none
// ==/UserScript==

/* global $ */

(function () {
    'use strict';

    // var t2 = window.setInterval(function() {

    //     var eles = document.getElementsByClassName('vjs-big-play-button');
    //     var btn = eles[0];
    //     if(btn.hidden == false){
    //         btn.click();
    //     }



    //  },100)

    //  var tstop = window.setTimeout(function() {

    //     var stop = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-playing")[0];
    //     stop.onclick = function(){
    //          window.clearInterval(t2);
    //         console.log('stop');
    //         var start = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0];
    //         start.onclick = function(){
    //             window.setInterval(t2);
    //         };
    //     };
    //  },1000)

    // while($("#ext-gen1045").style["visibility"] != "hidden"){
    //     $("#ext-gen1045").click();
    // };

    const replayVideo = function () {
        const playButton = $("#video > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused", $("iframe").contents().find("iframe").contents()[0])[0];
        if (playButton) {
            playButton.click();
        }
    };


    $("document").ready(function () {
        console.log("Waiting for loading...");
        setTimeout(async function () {
            const mainFrame = $("iframe");
            if (mainFrame) {
                while (true) {
                    const isQuiz = $("#mainid > h1", mainFrame).text().toLowerCase().includes("quiz");
                    if (!isQuiz) {

                        const frames = $("iframe").contents().find("iframe").contents();
                        if (frames) {
                            const video = frames[0];
                            const docs = frames.slice(1);
                            $(".vjs-big-play-button", video).click();
                            window.setInterval(replayVideo, 100);
                            for (let index = 0; index < docs.length; index++) {
                                const doc = docs[index];
                                const rightButton = $(".nextBtn", doc)[0];
                                while (rightButton.style["visibility"] != "hidden") {
                                    rightButton.click();
                                }
                            }
                        } else {
                            console.log("ERROR: cannot find video and document");
                        }

                        // wait until video finishes.
                        while (true) {
                            console.log("Checking if it's finished.");
                            var flag = true;
                            const icons = $(".ans-attach-ct", $("iframe").contents());
                            for (let index = 0; index < icons.length; index++) {
                                const icon = icons[index];
                                flag = flag && icon.className.includes("finished");
                            }
                            if (flag) {
                                console.log("It's finished.");
                                break;
                            }
                            await new Promise(r => setTimeout(r, 30000));
                        }
                        window.clearInterval(replayVideo);
                    }
                    // click next-button
                    console.log("Next chapter");
                    $(".orientationright").click();
                    await new Promise(r => setTimeout(r, 3000));
                }
            } else {
                console.log("ERROR: cannot find main frame from left");
            }
        }, 3000);
    });

})();
