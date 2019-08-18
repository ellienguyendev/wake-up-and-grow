// alarm for each activity
var sound = new Audio("https://freesound.org/data/previews/170/170613_7037-lq.mp3");
sound.loop = false;

function alarmSet() {
  // calcutate current time then compare to goalTime and play sound when equal
  setInterval(function() {
    var today = new Date();
    var hr = today.getHours()
    if (hr > 12) {
      hr = hr - 12
    } else if (hr === 0) {
      hr = 12
    } else if (hr < 10) {
      hr = '0' + hr
    }

    var mins = today.getMinutes()
    if (mins < 10) {
      mins = '0' + mins
    }

    var secs = today.getSeconds()
    if (secs < 10) {
      secs = '0' + secs
    }

    var ampm = (today.getHours()) < 12 ? 'AM' : 'PM';
    var currentTime = hr.toString() + mins + secs + ampm

    var goal1Time = document.querySelector('.goal1Hr').innerHTML + document.querySelector('.goal1Min').innerHTML + '00' + ampm
    var goal2Time = document.querySelector('.goal2Hr').innerHTML + document.querySelector('.goal2Min').innerHTML + ampm  + '00' + ampm
    var goal3Time = document.querySelector('.goal3Hr').innerHTML + document.querySelector('.goal3Min').innerHTML + ampm  + '00' + ampm

    const name = document.querySelector('.firstName').innerHTML
    const number = document.querySelector('.phoneNumber').innerHTML
    const goal1 = document.querySelector('.g1').innerText
    const goal2 = document.querySelector('.g2').innerText
    const goal3 = document.querySelector('.g3').innerText
    const why1 = document.querySelector('.why1').innerText
    const why2 = document.querySelector('.why2').innerText
    const why3 = document.querySelector('.why3').innerText
    const msg1 = `Rise and shine, ${name}! It's time for ${goal1}. Remember: ${why1}`
    const msg2 = `Nothing can stop you today, onto ${goal2}. ${why2}`
    const msg3 = `All that's left to do is ${goal3}. Thank you for showing up for you. ${why3}// `

    if (currentTime == goal1Time) {
      sound.play()

      fetch('/textGoal1', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'number': '1' + number,
            'msg': msg1
          })
        })
        .then(response => {
          console.log(response);
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
        })
    }

    if (currentTime == goal2Time) {
      sound.play()

      fetch('/textGoal2', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'number': '1' + number,
            'msg': msg2
          })
        })
        .then(response => {
          console.log(response);
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
        })
    }

    if (currentTime == goal3Time) {
      sound.play()

      fetch('/textGoal3', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'number': '1' + number,
            'msg': msg3
          })
        })
        .then(response => {
          console.log(response);
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
        })
    }
  }, 1000);

} // end alarmSet fx
alarmSet()
