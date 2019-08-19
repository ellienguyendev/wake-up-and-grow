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

//brings up editUserInfo forms
var edit = document.querySelector('.editPencil')
var editForm = document.querySelector('.editUserInfo')
var userInfo = document.querySelector('.userInfoShow')

edit.addEventListener('click', function() {
  editForm.classList.remove('hide')
  userInfo.classList.add('hide')
})

var saveUserInfo = document.querySelector('.saveUserInfo')
saveUserInfo.addEventListener('click', function() {
  const editUsername = document.querySelector('.editUsername').value
  const editNumber = document.querySelector('.editNumber').value
  const optIn = document.querySelector('.optIn').value
  const editEmail = document.querySelector('.editEmail').value

  fetch('saveUserInfo', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': editUsername,
        'number': editNumber,
        'optIn': optIn,
        'email': editEmail
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })

    editForm.classList.add('hide')
    userInfo.classList.remove('hide')
})

//cancel editUserInfo
var cancelEdit = document.querySelector('.cancelEdit')
cancelEdit.addEventListener('click', function() {
  editForm.classList.add('hide')
  userInfo.classList.remove('hide')
})


// variables needed for multiple functions
var setDate = document.querySelector('.setDate').innerText
var goal1 = document.querySelector('.g1').innerText
var goal2 = document.querySelector('.g2').innerText
var goal3 = document.querySelector('.g3').innerText


// when completed goal, send to DB + change color of leaf
var g1Leaf = document.querySelector('.g1Leaf');
g1Leaf.onclick = g1Done

var g2Leaf = document.querySelector('.g2Leaf');
g2Leaf.onclick = g2Done

var g3Leaf = document.querySelector('.g3Leaf');
g3Leaf.onclick = g3Done

function g1Done() {
  const g1Count = parseFloat(document.querySelector('.g1Count').innerText)
  fetch('g1Done', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'date': setDate,
        'goal1': goal1,
        'g1Count': g1Count
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
  const g2Count = parseFloat(document.querySelector('.g2Count').innerText)
  fetch('g2Done', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'date': setDate,
        'goal2': goal2,
        'g2Count': g2Count
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
  const g3Count = parseFloat(document.querySelector('.g3Count').innerText)
  fetch('g3Done', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'date': setDate,
        'goal3': goal3,
        'g3Count': g3Count
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

//delete posts
var trash = document.getElementsByClassName("fa-trash-alt");
Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function() {
    fetch('deleteGoal', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'date': setDate,
        'goal1': goal1,
        'goal2': goal2,
        'goal3': goal3
      })
    }).then(function(response) {
      window.location.reload()
    })
  });
});
