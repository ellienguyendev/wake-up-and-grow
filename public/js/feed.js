var star = document.getElementsByClassName("fa-star");
var trash = document.getElementsByClassName("fa-trash");
var commentSubmit = document.querySelectorAll('.commentSubmit')

//favorite posts on motivation wall
Array.from(star).forEach(function(element) {
  element.addEventListener('click', function() {
    const currentUser = document.querySelector('.username').innerHTML
    const userPosted = this.parentNode.parentNode.parentNode.childNodes[3].innerHTML
    const feedMsg = this.parentNode.parentNode.parentNode.childNodes[5].childNodes[1].innerHTML
    const feedDate = this.parentNode.parentNode.childNodes[1].innerHTML

    fetch('favorited', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'currentUser': currentUser,
          'userPosted': userPosted,
          'feedMsg': feedMsg,
          'feedDate': feedDate
        })
      })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});

//send comments to other users --> add to comment [] in document and send text to user who posted
Array.from(commentSubmit).forEach(function(element) {
  element.addEventListener('click', function() {
    const currentUser = document.querySelector('.username').innerHTML
    const comment = this.parentNode.parentNode.childNodes[1].value
    const userPosted = this.parentNode.parentNode.parentNode.parentNode.childNodes[3].innerHTML
    const feedMsg = this.parentNode.parentNode.parentNode.parentNode.childNodes[5].childNodes[1].innerHTML
    const feedDate = this.parentNode.parentNode.parentNode.parentNode.childNodes[7].childNodes[1].innerHTML

    fetch('updateComment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userPosted': userPosted,
        'feedMsg': feedMsg,
        'feedDate': feedDate,
        'currentUser': currentUser,
        'comment': comment
      })
    })
    fetch('sendComment', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'currentUser': currentUser,
          'comment': comment,
          'userPosted': userPosted,
          'feedMsg': feedMsg
        })
      })
      .then(response => {
        console.log(response);
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
      })

    this.parentNode.parentNode.childNodes[5].innerHTML = 'Message sent!'

  });
});

//delete posts
var trash = document.getElementsByClassName("fa-trash-alt");
Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function() {
    const userPosted = this.parentNode.parentNode.parentNode.childNodes[3].innerHTML
    const feedMsg = this.parentNode.parentNode.parentNode.childNodes[5].childNodes[1].innerHTML
    const feedDate = this.parentNode.parentNode.parentNode.childNodes[7].childNodes[1].innerHTML

    fetch('deletePost', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'userPosted': userPosted,
        'feedMsg': feedMsg,
        'feedDate': feedDate
      })
    }).then(function(response) {
      window.location.reload()
    })
  });
});
