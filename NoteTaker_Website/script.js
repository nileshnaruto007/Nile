displayNotes();
displayQuote();
// add new notes to local storage

let add_note_btn = document.getElementById('add_note_btn');
add_note_btn.addEventListener("click", function (e) {
    // adding alert div again after removal from setTimeout function
    let main_card = document.getElementById('main_card')
    let success_div = document.createElement('div')
    main_card.appendChild(success_div)
    main_card.insertBefore(success_div, main_card.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling)
    success_div.id = "liveAlertPlaceholder"
    var alertPlaceholder = document.getElementById('liveAlertPlaceholder')


    // funciton to  ALERT success
    function alert(message, type) {
        var wrapper = document.createElement('div')
        wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + '<i class="fa fa-check" aria-hidden="true"></i>' + " " + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'

        alertPlaceholder.append(wrapper)
    }
    // function so that date is in dd/mm/yyyy format even if d/m<10
    function appendLeadingZeroes(n) {
        if (n <= 9) {
            return "0" + n;
        }
        return n
    }

    let add_note_text = document.getElementById('add_note_text');
    let add_note_title = document.getElementById('add_note_title');
    /* A NOTE WITH NO TITLE WILL BE INVALID */
    if (add_note_title.value == "") {
        let no_title = document.getElementById('no_title')

        let toast = new bootstrap.Toast(no_title)

        toast.show();
        return;
    }
    let today = new Date();
    let current_date = appendLeadingZeroes(today.getDate()) + '/' + appendLeadingZeroes(today.getMonth() + 1) + '/' + today.getFullYear();
    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];
    }
    else {
        notesObj = JSON.parse(notes);
    }
    let obj = {
        title: add_note_title.value,
        text: add_note_text.value,
        date: current_date,
        pin: "false"
    }
    notesObj.push(obj)// therefore notesObj is now array of object
    localStorage.setItem("notes", JSON.stringify(notesObj));
    add_note_text.value = "";// so that everytime after creation of new notes the texarea is set to blank
    add_note_title.value = "";// so that everytime after creation of new notes the texarea is set to blank


    alert('Your Note is successfully added !', 'success')
    displayNotes()
    // to remove the alert after 5 sec
    setTimeout(function () {
        alertPlaceholder.remove();
    }, 1500);
})


// function to display notes
function displayNotes() {

    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];

    }// notesObj is the array
    else notesObj = JSON.parse(notes);
    let html = "";
    let pin_html = "";
    notesObj.forEach(function (element, index) {
        if (notesObj[index].pin == "false") {
            html += `
        <div class="noteCards my-2 mx-2 card" style="width: 18rem;">
            <div class="card-body">
            <i  class="fa fa-thumbtack pin_icon" onclick ="pinUnpin(${index})"></i>
            <h6 class="time">${element.date}</h6>
            <br><br>
                <h5 class="card-title">${element.title}</h5>
                <p class="card-text">${element.text}</p>
                <br>
                <button  class="btn btn-primary" id="${index}" onclick="warning(this.id)" title="Delete Note">Delete </button>
                <button  class="btn btn-primary edit_note" id="${index}" onclick="edit(this.id)" title="Edit Note">Edit</button>
                </div>
        </div>`// this on click part is done so that we can get index of the note to be deleted
        }
        else {
            pin_html += `
            <div class="noteCards my-2 mx-2 card" style="width: 18rem;">
                <div class="card-body">
                <i  class="fa fa-thumbtack pin_icon fa-2x" onclick ="pinUnpin(${index})"></i>
                <h6 class="time">${element.date}</h6>
                <br><br>
                    <h5 class="card-title">${element.title}</h5>
                    <p class="card-text">${element.text}</p>
                    <br>
                    <button  class="btn btn-primary" id="${index}" onclick="warning(this.id)" title="Delete Note">Delete </button>
                    <button  class="btn btn-primary edit_note" id="${index}" onclick="edit(this.id)" title="Edit Note">Edit</button>
                    </div>
            </div>`// this on click part is done so that we can get index of the note to be deleted
        }
    });
    let notes_element = document.getElementById('notes')
    if (notesObj.length != 0) {
        notes_element.innerHTML = html;
    }
    else {
        notes_element.innerHTML = "You have not added any Notes ";
        notes_element.setAttribute("style", "color : grey;font-size:22px; x; font-family:sans-serif;");
    }
    let pin_notes_element = document.getElementById('pin_notes')
    if (notesObj.length != 0) {
        pin_notes_element.innerHTML = pin_html;

    }
    else {
        pin_notes_element.innerHTML = "You have not pinned any Notes ";
        pin_notes_element.setAttribute("style", "color : grey;font-size:22px; font-family:sans-serif;");
    }
}
// fnc to pin- unpin notes

function pinUnpin(index) {
    //console.log("entered the pinUnpin fnc")
    //already pin
    if (notesObj[index].pin == "true") {
        // console.log("pin boolean before changing : " + notesObj[index].pin)
        notesObj[index].pin = "false";
        //console.log("entered if fnc  then unenlarged pin");
        //console.log("pin boolean after changing : " + notesObj[index].pin)
    }
    else {
        // console.log("pin boolean before changing : " + notesObj[index].pin)
        // console.log("entered else fnc then enlarged pin")
        notesObj[index].pin = "true";
        // console.log("pin boolean after changing : " + notesObj[index].pin)

    }
    localStorage.setItem("notes", JSON.stringify(notesObj));// updating local storage with this new notesObj array
    displayNotes();
}
// function to edit a saved note
function edit(index) {
    //console.log(notesObj[index]);
    add_note_title.value = notesObj[index].title
    add_note_text.value = notesObj[index].text
    notesObj.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    displayNotes();
}
// warning message on clciking delete note
function warning(index) {
    let toastLiveExample = document.getElementById('liveToast')

    let toast = new bootstrap.Toast(toastLiveExample)

    toast.show()

    let confirm_delete = document.getElementById('confirm_delete');
    confirm_delete.addEventListener('click', function () {
        deleteNote(index);

        document.getElementById("close_warning").click();
    })
    let close_warning = document.getElementById('close_warning');
    close_warning.addEventListener('click', function () {
        location.reload();
    })
    let cross_close = document.getElementById('cross_close');
    cross_close.addEventListener('click', function () {
        location.reload();
    })
}




// function to delete notes
function deleteNote(index) {
    let notes = localStorage.getItem("notes");
    if (notes == null) {
        notesObj = [];

    }
    else notesObj = JSON.parse(notes);
    notesObj.splice(index, 1)// 1 element to be deleted whose index = index\
    localStorage.setItem("notes", JSON.stringify(notesObj));// updating local storage with this new notesObj array
    displayNotes();
}

// to sort notes by search

let search_textarea = document.getElementById('search_textarea');
let search_by_body = document.getElementById('search_by_body');
let search_by_title = document.getElementById('search_by_title');
let search_by_date = document.getElementById('search_by_date');
let search_by_both = document.getElementById('search_by_both');
let dropdown_title = document.getElementById('dropdownMenuButton2');
let close_search_btn = document.getElementById('close_search_btn');

//if (search_by_title) {
search_by_title.addEventListener('click', function () {

    dropdown_title.innerHTML = search_by_title.innerHTML;
    search_textarea.style.display = "block";
    close_search_btn.style.display = "block";
    dropdownMenuButton2.style.display = "none";
    search_title();
})
// }
//else if (search_by_body) {
search_by_body.addEventListener('click', function () {

    dropdown_title.innerHTML = search_by_body.innerHTML;
    dropdownMenuButton2.style.display = "none";
    search_textarea.style.display = "block";
    close_search_btn.style.display = "block";

    search_body()
})
//}
//else if (search_by_date) {
search_by_date.addEventListener('click', function () {

    dropdown_title.innerHTML = search_by_date.innerHTML;
    dropdownMenuButton2.style.display = "none";
    search_textarea.style.display = "block";
    search_textarea.placeholder = "dd/mm/yyyy"
    close_search_btn.style.display = "block";

    search_date()
})
//}
// else {
search_by_both.addEventListener('click', function () {

    dropdown_title.innerHTML = search_by_both.innerHTML;
    dropdownMenuButton2.style.display = "none";
    search_textarea.style.display = "block";
    close_search_btn.style.display = "block";
    search_both()
})
//}
close_search_btn.addEventListener('click', function () {
    search_textarea.value = null;

    displayNotes();
    document.getElementsByClassName("dropdown").style.display = "block";
})
// sort notes by title and body
function search_both() {

    search_textarea.addEventListener("input", function () {

        let searchVal = search_textarea.value;
        // console.log(`event triggered!! ${ searchVal } was searched`)
        let noteCards = document.getElementsByClassName('noteCards');
        Array.from(noteCards).forEach(function (element) {
            let cardTxt = element.getElementsByTagName("p")[0].innerText

            let cardTitle = element.getElementsByTagName("h5")[0].innerText
            if (cardTxt.toLowerCase().includes(searchVal.toLowerCase()) ||
                cardTxt.toUpperCase().includes(searchVal.toUpperCase()) ||
                cardTitle.toLowerCase().includes(searchVal.toLowerCase()) ||
                cardTitle.toUpperCase().includes(searchVal.toUpperCase())) {// so that irrespective of the case the text is searched
                element.style.display = "block";
            }
            else {
                element.style.display = "none";
            }

        })
    })

}
// sort notes by body
function search_body() {

    search_textarea.addEventListener("input", function () {

        let searchVal = search_textarea.value;
        // console.log(`event triggered!! ${ searchVal } was searched`)


        let noteCards = document.getElementsByClassName('noteCards');
        Array.from(noteCards).forEach(function (element) {
            let cardTxt = element.getElementsByTagName("p")[0].innerText// as for classnotesCard , the  elements like div etc has only one paragraph tag inside them but still we had addded 0 index
            // . innerText as else it would be just element and to use include funtion we need string


            if (cardTxt.toLowerCase().includes(searchVal.toLowerCase()) || cardTxt.toUpperCase().includes(searchVal.toUpperCase())) {// so that irrespective of the case the text is searched
                element.style.display = "block";
            }
            else {
                element.style.display = "none";
            }
        })

    })

}
// sort notes by title
function search_title() {


    search_textarea.addEventListener("input", function () {

        let searchVal = search_textarea.value;
        // console.log(`event triggered!! ${ searchVal } was searched`)


        let noteCards = document.getElementsByClassName('noteCards');
        Array.from(noteCards).forEach(function (element) {
            let cardTitle = element.getElementsByTagName("h5")[0].innerText// as for classnotesCard , the  elements like div etc has only one paragraph tag inside them but still we had addded 0 index
            // . innerText as else it would be just element and to use include funtion we need string


            if (cardTitle.toLowerCase().includes(searchVal.toLowerCase()) || cardTitle.toUpperCase().includes(searchVal.toUpperCase())) {// so that irrespective of the case the text is searched
                element.style.display = "block";
            }
            else {
                element.style.display = "none";
            }
        })

    })

}
// sort notes by date
function search_date() {


    search_textarea.addEventListener("input", function () {

        let searchVal = search_textarea.value;
        // console.log(`event triggered!! ${ searchVal } was searched`)


        let noteCards = document.getElementsByClassName('noteCards');
        Array.from(noteCards).forEach(function (element) {
            let cardDate = element.getElementsByTagName("h6")[0].innerText// as for classnotesCard , the  elements like div etc has only one paragraph tag inside them but still we had addded 0 index
            // . innerText as else it would be just element and to use include funtion we need string


            if (cardDate.toLowerCase().includes(searchVal.toLowerCase()) || cardDate.toUpperCase().includes(searchVal.toUpperCase())) {// so that irrespective of the case the text is searched
                element.style.display = "block";
            }
            else {
                element.style.display = "none";
            }
        })

    })

}
let quote = document.getElementById('quote');
let author = document.getElementById('author');
// Fetch a random quote from the Quotable API
async function displayQuote() {

    let quote_num = Math.floor(Math.random() * 1643)
    const response = await fetch("https://type.fit/api/quotes")
    const data = await response.json();
    if (response.ok) {
        // Update DOM elements
        quote.innerHTML = `"${data[quote_num].text}"`
        author.innerHTML = `~${data[quote_num].author} `
    }
    else {
        fetch("http://api.quotable.io/random")
            .then(res => res.json())// to convert into json format
            .then(data => {
                quote.innerHTML = `"${data.content}"`
                author.innerHTML = `~${data.author} `
            })

    }

}

/**
 * Back to top button
 */

//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
