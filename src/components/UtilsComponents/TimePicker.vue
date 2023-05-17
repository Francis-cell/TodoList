<template>
    <div class="container" ng-app="timepicker" ng-controller="timeCtrl" ng-class="{'am': timeframe == 'am', 'pm': timeframe == 'pm' }">
        <div class="timepicker-container-outer" selectedtime="time" timetravel>
            <div class="timepicker-container-inner">
                <div class="timeline-container">
                    <div class="current-time">
                        <div class="actual-time">{{ time }}</div>
                    </div>
                    <div class="timeline">
                    </div>
                    <div class="hours-container">
                        <div class="hour-mark" ng-repeat="hour in getHours() track by $index"></div>
                    </div>
                </div>
                <div class="display-time">{{ time }} {{ timeframe }}</div>
                <div class="am-pm-container">
                    <div class="am-pm-button" ng-click="changetime('am')">am</div>
                    <div class="am-pm-button" ng-click="changetime('pm')">pm</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TimePicker",
        data() {
            return {
                time: '1:00',
                timeframe: 'am'
            }
        }
    }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }
    body,
    html {
        background: #333;
        margin: 0;
        height: 100%;
    }
    .container {
        height: 100%;
        width: 100%;
        background: white;
        transition: background 0.25s ease;
    }
    .container.pm {
        background: #00897B;
    }

    .timepicker-container-outer {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        display: block;
        border-radius: 2px;
        padding: 30px;
        background: white;
        position: relative;
        overflow: hidden;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        top: 50%;
        transform: translateY(-50%);
        transition: background 0.25s ease;
    }
    .pm .timepicker-container-outer {
        background: #00897B;
    }

    .timepicker-container-inner {
        width: 100%;
        height: 100%;
        position: relative;
        display: block;
    }

    .timeline-container {
        display: block;
        float: left;
        position: relative;
        width: 100%;
        height: 36px;
    }

    .current-time {
        display: block;
        position: absolute;
        z-index: 1;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        top: -23px;
        left: -20px;
        cursor: ew-resize;
        user-select: none;
    }
    .current-time::after {
         content: '';
         display: block;
         width: 30px;
         height: 30px;
         position: absolute;
         background: #FF7043;
         transform: rotate(45deg);
         border-radius: 20px 20px 3px 20px;
         z-index: -1;
         top: 0;
     }
    .current-time .am::after {
             background: #00897B;
     }
    .current-time .pm ::after {
             background: white;
     }

    .actual-time {
        color: white;
        line-height: 36px;
        font-size: 10px;
        margin-left: 4px;
        text-align: center;
        font-family: sans-serif;
    }
    .am .actual-time {
        color: white;
    }
    .pm .actual-time {
        color: #FF7043;
    }

    .timeline {
        display: block;
        z-index: 1;
        width: 100%;
        height: 2px;
        position: absolute;
        bottom: 0;
    }
    .timeline::before,
    .timeline::after {
         content: '';
         display: block;
         width: 2px;
         height: 10px;
         top: -6px;
         position: absolute;
         background: #00897B;
         left: -1px;
     }
    .timeline::after {
         left: auto;
         right: -1px;
     }

    .pm .timeline::before,
    .pm .timeline::after {
         background: white;
     }
    .hours-container {
        display: block;
        z-index: 0;
        width: 100%;
        height: 10px;
        position: absolute;
        top: 31px;
    }
    .hour-mark {
        width: 2px;
        display: block;
        float: left;
        height: 4px;
        background: #00897B;
        position: relative;
        margin-left: calc((100% / 12) - 2px);
    }
    .hour-mark:nth-child(3n) {
         height: 6px;
         top: -1px;
     }
    .pm .hour-mark {
        background: white;
    }
    .display-time {
        width: 60%;
        display: block;
        padding: 30px 0 0;
        float: left;
        font-size: 25px;
        font-family: sans-serif;
        text-align: center;
    }
    .am .display-time {
        color: #FF7043;
    }
    .pm .display-time {
        color: white;
    }

    .am-pm-container {
        width: 40%;
        float: left;
        height: 36px;
        display: block;
        position: relative;
        padding: 33px 0 0 10px;
    }
    .am-pm-button {
        width: calc(50% - 5px);
        height: 36px;
        line-height: 36px;
        background: #2196F3;
        text-align: center;
        font-family: sans-serif;
        color: white;
        border-radius: 4px;
        float: left;
        cursor: pointer;
    }
    .am-pm-button:first-child {
         background: #00897B;
         color: white;
     }
    .am-pm-button:last-child {
         background: white;
         color: #00897B;
         margin-left: 10px;
     }
    .am-pm-button .pm:last-child {
             color: #FF7043;
    }
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        line-height: 100vh;
        font-family: sans-serif;
        background: white;
        pointer-events: none;
        opacity: 1;
        visibility: visible;
        animation: fade-out 0.5s forwards;
    }
    @keyframes fade-out {
        0% {
            opacity: 1;
            visibility: visible;
        }
        100% {
            opacity: 0;
            visibility: hidden;
        }
    }
</style>