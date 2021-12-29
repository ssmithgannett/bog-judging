// vars
let jsonArr = []
let selDivision = ''
let selCat = ''
let removeItems
let adv_fin
let no_adv_fin
let adv_fin_label
let entryOpen = false
let filtersOpen = false

// toggle filter ui
$('#toggle-filters').click(function() {
    if (filtersOpen == false) {
        setTimeout(function() {
            $('#filters form').fadeIn(300)
        }, 500)
        $('#filters').css({'height': 400,'box-shadow':'2px 4px 4px rgba(0,0,0,0.3)'})
        $(this).css('top', 400)
        filtersOpen = true
    }
    else if (filtersOpen == true) {
        setTimeout(function() {
            $('#filters').css({'height': '0','box-shadow':'2px 4px 4px rgba(0,0,0,0.0)'})
            $('#toggle-filters').css('top', '2px')
        }, 300)
        $('#filters form').fadeOut(300)
        filtersOpen = false
    }   
})

// toggle entry form
$('#toggle-entry').click(function() {
    if (entryOpen == false) {
        $('#add-entry iframe').fadeIn(500)
        $('#add-entry').css('height', '100vh')
        $('body').css('overflow', 'hidden')
        $('#open-entry button').html('<div id="add-icon" class="rtate">+</div>Close')
        entryOpen = true
    }
    else if (entryOpen == true) {
        $('#add-entry iframe').fadeOut(500)
        $('#add-entry').css('height', '50px')
        $('body').css('overflow', 'scroll')
        $('#open-entry button').html('<div id="add-icon">+</div>Add Entry')
        entryOpen = false
    }  
})

// pull keyword from URL
function getUrlVars() {
    let vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
};
const encodeUserType = getUrlVars()['user'];
const encodeCatType = getUrlVars()['category']
const userType = decodeURI(encodeUserType);
const urlCatType = decodeURI(encodeCatType).toUpperCase()

const judgeCats = () => {
    $.getJSON('judging-desc.json', function(data) {
        for (let i = 0; i < data.length; i++) {
            if (urlCatType == data[i].Category) {
                $('#category-description').html(`
                <strong>${data[i].Category}: </strong>${data[i].Description}
                `)
                if(data[i].division == 'y') {
                    $('#yes-divisions').show()
                }
                else {
                    $('#no-divisions').show()
                }
            }
        }
    })
}

if (userType == 'regional') {
    removeItems = [
        '117420777', '116893929', '117386486', '117386488', '117386483',
        '117739364', '117739373', '117691001', '117739377', '117739380',
        '117691038', '117739395', '117739398', '117691047', '117739451',
        '117691088', '117739452', '117691099', '117739458', '117739463'
    ]
    adv_fin = 'Advance to internal judges'
    no_adv_fin = 'Do not advance'
}
if (userType == 'internal') {
    removeItems = [
        '117386483', '117570991', '17739364', '117739373','117739377',
        '117739380', '117739395', '117739398', '117739451', '117691088',
        '117739452', '117739458'
    ]
    adv_fin = 'Advance to external judges'
    no_adv_fin = 'Do not advance'
}
if (userType == 'external') {
    removeItems = [
        "117420774", "117420777", "117386486", "117386488", "117386483",
        "117570991", "117571185", "117739364", "117739373", "117691001",
        "117571198", "117739377", "117739380", "117691038", "117571236",
        "117739395", "117739398", "117691047", "117571242", "117739451",
        "117691088", "117631198", "117739452", "117691099", "117739458",
        "117739463"
    ]
    adv_fin = 'Mark as finalist'
    no_adv_fin = 'Remove from finalists'
    $('#external-info').show()
    judgeCats()
}

$('body').addClass(userType)

//Firebase database snapchot to array
function snapshotToArray(snapshot) {
    let returnArr = [];
    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });
    return returnArr;
};
   
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXjConhPXfitVs4h0OdI9ss5eFRh8j04s",
    authDomain: "bog-test-dc99f.firebaseapp.com",
    projectId: "bog-test-dc99f",
    storageBucket: "bog-test-dc99f.appspot.com",
    messagingSenderId: "864469894344",
    appId: "1:864469894344:web:14d83a54439a7d563f91fd",
    measurementId: "G-YLNQPHLFHW"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Get a reference to the database service
const database = firebase.database();
// query FIREBASE for all submissions (entries)
const getSubs = () => {
 //pull data, format as array
 database.ref('submissions').once('value', function(snapshot) {
    const dbReturn = snapshotToArray(snapshot);
    //set user dropdowns
    pullSubs(dbReturn)
    for (let i = 0; i < dbReturn.length; i++) {
        let submission = dbReturn[i].data
    }
  });// end firebase.database
}

// pull json for fields ids and names
$.getJSON('fields.json', function(data2) {
    pullFields(data2)
    getSubs()
})

// submissions data to front-end modules
const pullSubs = (data) => {
    $('#entries > div').html('')
    // loop entries
    for (let i = data.length - 1; i >= 0; i--) {
        submission = data[i]
        let disableYes = ''
        let disableNo = 'disabled'
        let winDisableYes = ''
        let winDisableNo = 'disabled'
        // set up classes for finalists/filters
        let hideDiv = ''
        let hideCat = ''
        let isFinalist = 'nonFinalist'
        let isWinner = 'nonWinner'
        if(submission.finalist == true) {
            isFinalist = 'isFinalist'
            disableYes = 'disabled'
            disableNo = ''
        }
        if(submission.is_winner == true && userType == 'external') {
            isWinner = 'winner'
            winDisableYes = 'disabled'
            winDisableNo = ''

        }
        if (selDivision !== submission.data[116893929].value && selDivision.length) {
            hideDiv = 'div-hide'
        }
        if (selCat !== submission.data[116918588].value && selCat.length) {
            hideCat = 'cat-hide'
        }
        const upperCat = submission.data[116918588].value.toUpperCase()
        if (userType == 'external' && urlCatType != upperCat) {
            continue
        }
        // create DOM element to hold entry info
        $(`#entries #entries-division-${submission.data[116893929].value}`).append(`
            <div 
                class="entry ${hideDiv} ${hideCat} ${isFinalist} ${isWinner}" 
                id="entry-${submission.id}" 
                data-category="${submission.data[116918588].value}" 
                data-division="${submission.data[116893929].value}" 
                data-isfinalist="${isFinalist}"
            >
               
                <div class="entry-header"></div>

                <button onClick="showMore(${submission.id})" class="read-more">Read More</button>
                <button class="read-less" onClick="showLess(${submission.id})" disabled>Read less</button>

                <div class="entry-body">
                    <div class="entry-meta"></div>
                    <div class="entry-links"></div>
                </div>

                <hr />

                <div class="finalist-selectors">
                    <button 
                        ${disableYes} class="finalist-yes" onClick="pushJson(${i}, ${submission.id})"><div class="yes-adv">&#9989;</div>${adv_fin}</button>
                    <button ${disableNo} class="finalist-no" onClick="pullJson(${i}, ${submission.id})"><div class="no-adv">&#10060;</div>${no_adv_fin}</button>
                </div><!-- .finalist-selectors -->
                
                <div class="winner-selectors">
                    <button ${winDisableYes} class="winner-yes" onClick="markWinner(${i}, ${submission.id})"><div class="trophy">&#127942;</div>Mark as winner</button>
                    <button ${winDisableNo} class="winner-no" onClick="unmarkWinner(${i}, ${submission.id})"><div class="no-adv">&#10060;</div>Unmark as winner</button>
                </div><!-- .winner-selectors -->

                <div class="winner-comments comments-${submission.id}">
                    <p>Write your comments about the winner below:</p>
                    <textarea class="enter-comments" id="comments-${submission.id}" rows="6">${submission.winner_comments}</textarea>
                    <div class="submission-ui">
                        <button class="submit-comments" onClick="commentsUpdate(${i}, ${submission.id})">Submit</button>
                        <div style="display: none;" class="success">Comments recorded</div>
                    </div>
                </div><!-- .winner-comments -->
                
            </div>
          `)
          // loop titles JSON and match entry data with title
          let removeItem
          for (let j = 0; j < jsonArr.length; j++) {
            const element = jsonArr[j];
            if (submission.data[element.id]) {
                const label = submission.data[element.id].label
                const value = submission.data[element.id].value
                if (removeItems.includes(submission.data[element.id].field)) {
                    // do nothing -- don't create DOM element for that field
                }
                // manipulate DOM element with entry data
                else if (label == 'Your email' || label == 'First Contributor Email' || label == 'Second Contributor Email' || label == 'Third Contributor Email ' || label == 'Fourth Contributor Email' || label == 'Fifth Contributor Email') {
                    $(`#entry-${submission.id} .entry-body .entry-meta`).append(`
                          <p><strong>${label}:</strong> <a href="mailto:${value}">${value}</a></p>
                    `)
                }
                else if (label == "First Contributor Headshot" || label == "Second Contributor Headshot " || label == "Third Contributor Headshot" || label == "Fourth Contributor Headshot" || label == "Fifth Contributor Headshot") {
                    $(`#entry-${submission.id} .entry-body .entry-meta`).append(`
                        <a target="_blank" href="${value}">View Headshot</a>
                    `)
                }
                else if (label == 'Title of Work/Project') {
                    $(`#entry-${submission.id} .entry-header`).append(`
                      <h2>${value}</h2>
                `)
                }
                else if (label == 'Enter at least one URL associated with the work' ) {
                    $(`#entry-${submission.id} .entry-body .entry-links`).append(`
                        <a class="main-link" href="${value}" target="_blank">View entry</a>
                    `)
                }
                else if (label == 'Additional URL 1' || label == 'Additional URL 2' || label == 'Additional URL 3' || label == 'Additional URL 4') {
                    $(`#entry-${submission.id} .entry-body .entry-links`).append(`
                    <a class="extra-link" href="${value}" target="_blank">Additional Link</a>
                `)
                }
                else if (label == 'Additional material to upload 1' || label == 'Additional material to upload 2' || label == 'Additional material to upload 3' || label == 'Additional material to upload 4' || label == 'Additional material to upload 5') {
                    $(`#entry-${submission.id} .entry-body .entry-links`).append(`
                    <a class="extra-link" href="${value}" target="_blank">Additional Material</a>
                `)
                }
                else if (label == 'Supplemental URL 1' || label == 'Supplemental URL 2' || label == 'Supplemental URL 3' || label == 'Supplemental URL 4' || label == 'Supplemental URL 5') {
                    $(`#entry-${submission.id} .entry-body .entry-links`).append(`
                    <a class="extra-link" href="${value}" target="_blank">Supplemental URL</a>
                `)
                }
                else if (label == 'Your name') {
                    $(`#entry-${submission.id} .entry-body .entry-meta`).append(`
                    <p><strong>Submitted by:</strong> ${value}</p>
                `)
                }
                else {
                    $(`#entry-${submission.id} .entry-body .entry-meta`).append(`
                        <p><strong>${label}:</strong> ${value}</p>
                    `)
                }
            }
        }
    }
}

// create json of field titles and ids
const pullFields = (data2) => {
    for (let j = 0; j < data2.length; j++) {
        const element = data2[j]
        if (element.name) {
            jsonArr.push({
                id: element.id,
                name: element.name
            })
        }
    }
}

const showMore = (id) => {
    $(`#entry-${id} .entry-body`).show()
    $(`#entry-${id} .read-more`).attr('disabled', true)
    $(`#entry-${id} .read-less`).attr('disabled', false)
}

const showLess = (id) => {
    $(`#entry-${id} .entry-body`).hide()
    $(`#entry-${id} .read-more`).attr('disabled', false)
    $(`#entry-${id} .read-less`).attr('disabled', true)
}

// update firebase if entry marked as finalist
const pushJson = (e, id, extMode) => {
    if (userType == 'regional') {
        firebase.database().ref(`submissions/${e}`).update({
            regional_advance: true
        })
    }
    if (userType == 'internal') {
        firebase.database().ref(`submissions/${e}`).update({
            internal_advance: true
        }) 
    }
    if (userType == 'external' && extMode != 'winner') {
        firebase.database().ref(`submissions/${e}`).update({
            finalist: true
        }) 
    }
   $(`entry-${id}`).removeClass('noneFinalist')
   $(`#entry-${id}`).addClass('isFinalist')
   $(`#entry-${id} .finalist-yes`).attr('disabled', true)
   $(`#entry-${id} .finalist-no`).attr('disabled', false)
}

// update firebase if entry unmarked as finalist
const pullJson = (e, id) => {
    firebase.database().ref(`submissions/${e}`).update({
        regional_advance: false
    })
    $(`#entry-${id}`).removeClass('isFinalist')
    $(`entry-${id}`).addClass('nonFinalist')
    $(`#entry-${id} .finalist-yes`).attr('disabled', false)
    $(`#entry-${id} .finalist-no`).attr('disabled', true)
}

const markWinner = (e, id) => {
    $(`#entry-${id}`).addClass('winner')
    $(`#entry-${id}`).removeClass('nonWinner')
    $(`#entry-${id} .finalist-selectors`).hide()
    $(`#entry-${id} .winner-yes`).attr('disabled', true)
    $(`#entry-${id} .winner-no`).attr('disabled', false)
    $(`#entry-${id} .winner-comments`).show()
    firebase.database().ref(`submissions/${e}`).update({
        is_winner: true
    })
}

const unmarkWinner = (e, id) => {
    $(`#entry-${id}`).removeClass('winner')
    $(`#entry-${id}`).addClass('nonWinner')
    $(`#entry-${id} .finalist-selectors`).show()
    $(`#entry-${id} .winner-yes`).attr('disabled', false)
    $(`#entry-${id} .winner-no`).attr('disabled', true)
    $(`#entry-${id} .winner-comments`).hide()
   //$(`#entry-${id} .winner-selector`)
    firebase.database().ref(`submissions/${e}`).update({
        is_winner: false
    })
}

const commentsUpdate = (e, id) => {
    const comments = $(`#comments-${id}`).val()
    firebase.database().ref(`submissions/${e}`).update({
        winner_comments: comments
    })
    $(`.comments-${id} .success`).fadeIn(300)
    setTimeout(function() {
        $(`.comments-${id} .success`).fadeOut(300)
    }, 2500)
}

// finalist filter
$('input[type="radio"][name="finalist-filter"]').on('change', function() {
    $('.entry').removeClass('fin-hide')
    selFinal = $(this).val()
    $('.entry').each(function() {
        const thisFinal = $(this).data('isfinalist')
        if (thisFinal != selFinal) {
            $(this).addClass('fin-hide')
        }
        // clear
        if (selFinal == 'View All') {
            $('.entry').removeClass('fin-hide')
        }
    })
})

// division filter
$('input[type="radio"][name="division"]').on('change', function() {
    $('.entries-hold').removeClass('div-hide')
    selDivision = $(this).val()
    $('.entries-hold').each(function() {
        const thisDivision = $(this).data('division')
        if (thisDivision != selDivision) {
            $(this).addClass('div-hide')
        }
        // clear
        if (selDivision == 'View All') {
            $(this).removeClass('div-hide')
        }
    })
    $('#entries > h3').each(function() {
        const thisDivision = $(this).data('division')
        if (thisDivision != selDivision) {
            $(this).addClass('div-hide')
        }
        // clear
        if (selDivision == 'View All') {
            $(this).removeClass('div-hide')
        }
    })
})

// category filter
$('input[type="radio"][name="category"]').on('change', function() {
    $('.entry').removeClass('cat-hide')
    selCat = $(this).val()
    $('.entry').each(function() {
        const thisCat = $(this).data('category')
        if (thisCat != selCat) {
            $(this).addClass('cat-hide')
        }
        // clear
        if (selCat == 'View All') {
            $('.entry').removeClass('cat-hide')
        }
    })
})
