// sets date to today's date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();
date = mm + '/' + dd + '/' + yyyy;
document.querySelector('.date').innerHTML = date

//brings up empty form when user wants to add goal
var add = document.querySelector('.fa-plus')
var form = document.querySelector('.form')
var results = document.querySelector('.results')

add.addEventListener('click', function() {
  form.classList.remove('hide')
  results.classList.add('hide')
})

var goalsButton = document.querySelector('.goalsButton')
goalsButton.addEventListener('click', function() {
  form.classList.add('hide')
})

//cancel new post
var cancel = document.querySelector('.cancel')
cancel.addEventListener('click', function() {
  form.classList.add('hide')
  results.classList.remove('hide')
})

//delete posts
var trash = document.getElementsByClassName("fa-trash-alt");
Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function() {
    fetch('deletePost', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'date': date
      })
    }).then(function(response) {
      window.location.reload()
    })
  });
});


// when completed goal, send to DB + change color of leaf
var setDate = document.querySelector('.setDate').innerText

var g1Leaf = document.querySelector('.g1Leaf');
g1Leaf.onclick = g1Done

var g2Leaf = document.querySelector('.g2Leaf');
g2Leaf.onclick = g2Done

var g3Leaf = document.querySelector('.g3Leaf');
g3Leaf.onclick = g3Done

function g1Done() {
  const goal1 = document.querySelector('.g1').innerText
  fetch('g1Done', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'date': setDate,
        'goal1': goal1,
        'g1done': true
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
}

function g2Done() {
  const goal2 = document.querySelector('.g2').innerText
  fetch('g2Done', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'date': setDate,
        'goal2': goal2,
        'g2done': true
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
}

function g3Done() {
  const goal3 = document.querySelector('.g3').innerText

  fetch('g3Done', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'date': setDate,
        'goal3': goal3,
        'g3done': true
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
}

// alarm for each activity (must go last in JS in case no active goals)
var sound = new Audio("https://freesound.org/data/previews/170/170613_7037-lq.mp3");
sound.loop = false;

function alarmSet() {
  // calcutate current time then compare to goalTime and play sound when equal
  setInterval(function() {
    var today = new Date();
    var hr = today.getHours().toString()
    if (hr > 12) {
      hr = hr - 12
    } else if (hr === 0) {
      hr = 12
    }

    var mins = today.getMinutes().toString()
    if (mins < 10) {
      mins = '0' + mins
    }

    var secs = today.getSeconds().toString()
    if (secs < 10) {
      secs = '0' + secs
    }

    var ampm = (today.getHours()) < 12 ? 'AM' : 'PM';
    var currentTime = hr + mins + secs + ampm

    var displayTime = document.querySelector('.time');
    displayTime.innerHTML = hr + ":" + mins + "" + ampm;

    var goal1Time = document.querySelector('.goal1Hr').innerHTML + document.querySelector('.goal1Min').innerHTML + '00' + ampm
    var goal2Time = document.querySelector('.goal2Hr').innerHTML + document.querySelector('.goal2Min').innerHTML + ampm  + '00' + ampm
    var goal3Time = document.querySelector('.goal3Hr').innerHTML + document.querySelector('.goal3Min').innerHTML + ampm  + '00' + ampm

    if (currentTime == goal1Time) {
      sound.play()
    }

    if (currentTime == goal2Time) {
      sound.play()
    }

    if (currentTime == goal3Time) {
      sound.play()
    }
  }, 1000);

} // end alarmSet fx
alarmSet()


// goals Error edge cases for empty / same times
// var goalError = document.querySelector('.goalError')
// var timeError = document.querySelector('.timeError')
// var goal1 = document.querySelector('.goal1Val').innerText
// var goal2 = document.querySelector('.goal2Val').innerText
// var goal3 = document.querySelector('.goal3Val').innerText
// var time1 = document.querySelector('.time1Hr').value+document.querySelector('.time1Min').innerText
// var time2 = document.querySelector('.time2Hr').value+document.querySelector('.time2Min').innerText
// var time3 = document.querySelector('.time3Hr').value+document.querySelector('.time3Min').innerText
//
// console.log(goal1);
// // when user submits goals, hide form
// goalsButton.addEventListener('click', function(){
//
//   if (goal1 === "" || goal2 === "" || goal3 === ""){
//     goalError.classList.remove ('hide')
//     goalError.innerHTML = "fill in ya goals G"
//   } else {
//     form.classList.add ('hide')
//   }
//
//   if (time1 === time2 || time1 === time3 || time2 === time3){
//     timeError.classList.remove ('hide')
//     timeError.innerHTML = "pls choose different time"
//   } else {
//     form.classList.add ('hide')
//   }
//
//   console.log(time1);
//   console.log(time2);
//   console.log(time3);
// })
