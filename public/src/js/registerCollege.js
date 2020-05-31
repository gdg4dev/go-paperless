var questions = [
    { question: "College Name", id: "collegeName" },
    {
        question: "Official College Email",
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        type: "text"
    },
    {
        question: "Create Secure Password (minimum 10 letters)",
        type: "password",
        id: "collegePass",
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{10,50}$/
    }
]

var onComplete = function() {
    collegeData = {
        name: CryptoJS.AES.encrypt(questions[0].answer, 'MaILEncrYptIoNKey919@dwq343f#').toString(),
        email: CryptoJS.AES.encrypt(questions[1].answer, 'MaILEncrYptIoNKey919@dwq343f#').toString(),
        pass: CryptoJS.AES.encrypt(questions[2].answer, 'MaILEncrYptIoNKey919@dwq343f#').toString()
    }
    $.ajax({
        url: '/core/login/up/c',
        method: 'post',
        data: collegeData,

    }).done(d => {
        eval(d);
        setTimeout(() => {
            $('h1')[0].innerHTML = responseData.msg
        }, 1200);
    }).fail(() => {
        setTimeout(() => {
            $('h1')[0].val = 'Something Went Wrong!'
        }, 1200);
    })

    var h1 = document.createElement('h1')
    h1.appendChild(document.createTextNode('Wait a min!! Verifying Your Details 🧐.....'))

    setTimeout(function() {
        register.parentElement.appendChild(h1)
        setTimeout(function() { h1.style.opacity = 1 }, 50)
    }, 1000)

}

;
(function(questions, onComplete) {

    var tTime = 100
    var wTime = 200
    var eTime = 1000
    if (questions.length == 0) return
    var position = 0

    putQuestion()

    forwardButton.addEventListener('click', validate)
    inputField.addEventListener('keyup', function(e) {
        transform(0, 0)
        if (e.keyCode == 13) validate()
    })

    previousButton.addEventListener('click', function(e) {
        if (position === 0) return
        position -= 1
        hideCurrent(putQuestion)
    })


    // functions
    // --------------

    // load the next question
    function putQuestion() {
        inputLabel.innerHTML = questions[position].question
        inputField.type = questions[position].type || 'text'
        inputField.value = questions[position].answer || ''
        inputField.className = questions[position].id || ''
        inputField.focus()
        progress.style.width = position * 100 / questions.length + '%'

        previousButton.className = position ? 'ion-android-arrow-back' : 'ion-person'

        showCurrent()

    }

    function validate() {

        var validateCore = function() {
            return inputField.value.match(questions[position].pattern || /.+/)
        }

        if (!questions[position].validate) questions[position].validate = validateCore

        // check if the pattern matches
        if (!questions[position].validate()) wrong(inputField.focus.bind(inputField))
        else ok(function() {

            // execute the custom end function or the default value set
            if (questions[position].done) questions[position].done()
            else questions[position].answer = inputField.value

            ++position

            // if there is a new question, hide current and load next
            if (questions[position]) hideCurrent(putQuestion)
            else hideCurrent(function() {
                // remove the box if there is no next question
                register.className = 'close'
                progress.style.width = '100%'

                onComplete()

            })

        })

    }

    function numSet() {
        $("input[type='number']").prop('min', 8);
        $("input[type='number']").prop('max', 20);
    }

    // helper
    // --------------

    function hideCurrent(callback) {
        inputContainer.style.opacity = 0
        inputLabel.style.marginLeft = 0
        inputProgress.style.width = 0
        inputProgress.style.transition = 'none'
        inputContainer.style.border = null
        setTimeout(callback, wTime)
    }

    function showCurrent(callback) {
        inputContainer.style.opacity = 1
        inputProgress.style.transition = ''
        inputProgress.style.width = '100%'
        setTimeout(callback, wTime)
    }

    function transform(x, y) {
        register.style.transform = 'translate(' + x + 'px ,  ' + y + 'px)'
    }

    function ok(callback) {
        register.className = ''
        setTimeout(transform, tTime * 0, 0, 10)
        setTimeout(transform, tTime * 1, 0, 0)
        setTimeout(callback, tTime * 2)
    }

    function wrong(callback) {
        register.className = 'wrong'
        for (var i = 0; i < 6; i++) // shaking motion
            setTimeout(transform, tTime * i, (i % 2 * 2 - 1) * 20, 0)
        setTimeout(transform, tTime * 6, 0, 0)
        setTimeout(callback, tTime * 7)
    }
}(questions, onComplete))