console.log('SCRIPT WORKING')

const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('#chat-messages')
const userList = document.getElementById('users')
var audio_element = document.querySelectorAll('audio')
console.log(audio_element)
const socket = io('http://localhost:3000')
const name = prompt('What is your name?')
socket.emit('new-user', roomid, name)

function handleplaysound(id) {
    const play_icon = document.getElementById(id)
    const pause_icon = document.getElementById(id + '-')
    play_icon.classList.add('d-none')
    pause_icon.classList.remove('d-none')
    for (var i = 0; i < audio_element.length; i++) {
        if (audio_element[i].paused !== true) {
            audio_element[i].paused === true
            var ret = audio_element[i].id.replace('audio', '')
            handlepausesound(ret)
        }
    }
    socket.emit('clientEvent', {
        msg: 'Sent an event from the client by play button!',
        id: id
    })
}

function handlepausesound(id) {
    const play_icon = document.getElementById(id.slice(0, -1))
    const pause_icon = document.getElementById(id)
    play_icon.classList.remove('d-none')
    pause_icon.classList.add('d-none')
    socket.emit('clientEventPause', {
        msg: 'Sent an event from the client by pause button!',
        id: id
    })
}

socket.on('playonall', data => {
    const id = data.id
    const play_icon = document.getElementById(id)
    const pause_icon = document.getElementById(id + '-')
    play_icon.classList.add('d-none')
    pause_icon.classList.remove('d-none')
    var x = document.getElementById(id + '-audio')
    x.play()
})
socket.on('pauseonall', data => {
    const id = data.id
    const play_icon = document.getElementById(id.slice(0, -1))
    const pause_icon = document.getElementById(id)
    play_icon.classList.remove('d-none')
    pause_icon.classList.add('d-none')
    var x = document.getElementById(id + 'audio')
    x.pause()
})
socket.on('message', message => {
    outputMessage(message)
})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputUsers(users)
})

//chat message submit
// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault()

    // Get message text
    let msg = e.target.elements.msg.value

    msg = msg.trim()

    if (!msg) {
        return false
    }

    // Emit message to server
    socket.emit('chatMessage', msg)

    // Clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('msg-area')
    div.innerHTML = `<span class="sender">${message.username}</span>
    <span class="time">${message.time}</span>
    <p class="msg">${message.text}</p>`
    chatMessages.prepend(div)
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = ''
    users.forEach(user => {
        const li = document.createElement('li')
        li.innerText = user.username
        userList.appendChild(li)
    })
}

// CHATBOX FUNCTIONALITY

var headingChat = document.querySelector('.heading-chat')
var headingPeople = document.querySelector('.heading-people')
var people = document.querySelector('.people')
var msgSection = document.querySelector('.msg-section')

headingChat.addEventListener('click', () => {
    headingChat.classList.add('current-tab')
    headingPeople.classList.remove('current-tab')
    people.classList.add('d-none')
    msgSection.classList.remove('d-none')
    msgSection.classList.add('d-flex')
})

headingPeople.addEventListener('click', () => {
    headingChat.classList.remove('current-tab')
    headingPeople.classList.add('current-tab')
    people.classList.remove('d-none')
    msgSection.classList.remove('d-flex')
    msgSection.classList.add('d-none')
})