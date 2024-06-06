import { LightningElement } from 'lwc';
import AlarmClockAssets from '@salesforce/resourceUrl/AlarmClockAssets';
export default class AlarmClockApp extends LightningElement {
    clockImage = AlarmClockAssets+'/AlarmClockAssets/clock.png'
    ringtone = new Audio(AlarmClockAssets+'/AlarmClocksets/Clocksound.mp3')
    currentTime  = ''
    hours = []
    minutes = []
    meridiens = ['AM', 'PM']
    alarmTime
    isAlarmSet = false
    isAlarmTriggered = false
    hourSelected
    minSelected
    meridienSelected

    get isFieldNotSelected(){
        return !(this.hourSelected && this.minSelected && this.meridienSelected)
    }

    get shakeImage(){
        return this.isAlarmTrigger ? 'shake':''
    }

    connectedCallback(){
        this.createHoursOptions()
        this.createMinuteOptions()
        this.currentTimeHandler()   
    }
    currentTimeHandler(){
        setInterval(() => {
        let dateTime = new Date()
        let hour = dateTime.getHours() //getHours() returns, the hour (0 to 23) of a date.
        let min = dateTime.getMinutes()
        let sec = dateTime.getSeconds()
        let ampm = "AM"
        if(hour == 0){
            hour = 12
        } else if(hour >= 12){
            hour = hour - 12
            ampm = "PM"
        }
        hour = hour < 10 ? "0" + hour : hour
        min  = min < 10 ? "0" + min : min
        sec = sec < 10 ? "0" + sec : sec

        this.currentTime = `${hour}:${min}:${sec} ${ampm}`
        if(this.alarmTime === `${hour}:${min} ${ampm}`) {
            console.log("Alarm Triggered!!")
            this.isAlarmTriggered = true
            this.ringtone.play()
            this.ringtone.loop = true
        }
        }, 1000)
    }

    createHoursOptions() {
        for(let i = 1; i <= 12; i++){
            let val = i<10 ? "0"+i : i
            this.hours.push(val)
        }
    }
    createMinuteOptions() {
        for(let i = 0; i <= 59; i++){
            let val = 1 < 10 ? "0"+i : i
            this.minutes.push(val)
        }
    }
    
    optionhandler(event){
        const {label, value} = event.detail
        if(label === "Hour(s)"){
            this.hourSelected = value
        }else if(label === "Minute(s)"){
            this.minSelected = value
        }else if(label === "AM/PM"){
            this.meridienSelected = value
        }else {}

        // console.log("this.hourSelected", this.hourSelected)
        // console.log("this.minSelected", this.minSelected)
        // console.log("this.meridienSelected", this.meridienSelected)
    }
    setAlarmHandler(){
        this.alarmTime = `${this.hourSelected}:${this.minSelected} ${this.meridienSelected}`
        this.isAlarmSet = true
    }
    clearAlarmHandler(){
        this.alarmTime = ''
        this.isAlarmSet = false
        this.isAlarmTriggered = false
        this.ringtone.pause()
        const elements = this.template.querySelectorAll('c-clock-dropdown')
        Array.from(elements).forEach(element=>{
            element.reset("")
        })
    }
}