// ==UserScript==
// @name         Fuck the stupid mooc
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  国科大慕课学习，鼠标离开界面不会暂停，且不用在视频中答题，还会自动翻页刷下一章，遇到小测会卡住
// @author       LinHe
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.0/jquery.min.js
// @match        http://mooc1.ecourse.ucas.ac.cn/mycourse/*
// @grant        none
// ==/UserScript==

/* global $ */

(function () {
    'use strict';

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
                            window.setInterval(replayVideo, 200);
                            const play2x = $("li.vjs-menu-item",video)[0];
                            play2x.click();
                            for (let index = 0; index < docs.length; index++) {
                                const doc = docs[index];
                                const mask = $("#maskLayer", doc);
                                mask.click();
                            }
                        } else {
                            console.log("ERROR: cannot find video and document");
                        }

                        // wait until video finishes.
                        while (true) {
                            console.log("Checking if it's finished.");
                            var flag = true;
                            const icons = $(".ans-attach-ct", $("iframe").contents());
                            // console.log(icons);
                            for (let index = 0; index < icons.length; index++) {
                                const icon = icons[index];
                                flag = flag && icon.className.includes("finished");
                            }
                            if (flag) {
                                console.log("It's finished.");
                                break;
                            }
                            await new Promise(r => setTimeout(r, 15000));
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
