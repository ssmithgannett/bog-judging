// set up shell for fields title and ids json
var jsonArr = []
var finalists = []
let selDivision = ''
let selCat = ''

const setFinalists = () => {
    $.getJSON('myfile.json', function(data) {
        finalists = []
        for (let x = 0; x < data.length; x++) {
            finalists.push(data[x].id.toString())
        }
    })
}
setFinalists()

// query formstack for all submissions (entries)
const getSubs = () => {
    $.ajax({
    url : 'rawData.json',
    type : 'GET',
    success : function(data) {
        pullSubs(data);
    },
    error : function(request,error)
    {
        console.log("Request: "+JSON.stringify(request));
    }
    });// end ajax"
}

// query Formstack for all field titles and ids
$.ajax({
    url : 'fields.json',
    type : 'GET',
    success : function(data2) {
        pullFields(data2)
        getSubs()
    },
    error : function(request,error)
    {
        console.log("Request: "+JSON.stringify(request));
    }
});// end ajax"

const pullSubs = (data) => {
    $('#entries').html('')
  
    console.log(finalists)
    // loop entries
    for (let i = data.submissions.length - 1; i >= 0; i--) {
        submission = data.submissions[i]

        let hideDiv = ''
        let hideCat = ''
        // create DOM element to hold entry info
        const isFinalist = finalists.includes(submission.id)
        if (selDivision !== submission.data[116893929].value && selDivision.length) {
            hideDiv = 'div-hide'
        }
        if (selCat !== submission.data[116918588].value && selCat.length) {
            hideCat = 'cat-hide'
        }
        $('#entries').append(`
            <div class="entry ${hideDiv} ${hideCat}" id="entry-${submission.id}" data-category="${submission.data[116918588].value}" data-division="${submission.data[116893929].value}" data-isFinalist="${isFinalist}">
                <hr />
                Entry id: ${submission.id}
                <button onClick="pushJson(${submission.id})">Yes</button>
                <button onClick="pullJson(${submission.id})">No</button>
            </div>
          `)
          // loop titles JSON and match entry data with title
          for (let j = 0; j < jsonArr.length; j++) {
            const element = jsonArr[j];
            if (submission.data[element.id]) {
                var label = submission.data[element.id].label
                var value = submission.data[element.id].value
                // manipulate DOM element with entry data
                if (label == 'Your email' || label == 'First Contributor Email' || label == 'Second Contributor Email' || label == 'Third Contributor Email' || label == 'Fourth Contributor Email' || label == 'Fifth Contributor Email') {
                    $(`#entry-${submission.id}`).append(`
                          <p><strong>${label}:</strong> <a href="mailto:${value}">${value}</a></p>
                    `)
                }
                else if (label == "First Contributor Headshot" || label == "Second Contributor Headshot " || label == "Third Contributor Headshot" || label == "Fourth Contributor Headshot" || label == "Fifth Contributor Headshot") {
                    $(`#entry-${submission.id}`).append(`
                        <a target="_blank" href="${value}">View Headshot</a>
                    `)
                }
                else if (label == 'Title of Work/Project') {
                    $(`#entry-${submission.id}`).append(`
                      <h1><strong>${label}:</strong> ${value}</h1>
                `)
                }
                else if (label == 'Enter at least one URL associated with the work' ) {
                    $(`#entry-${submission.id}`).append(`
                        <a href="${value}" target="_blank">Entry Link</a>
                    `)
                }
                else if (label == 'Additional URL 1' || label == 'Additional URL 2' || label == 'Additional URL 3' || label == 'Additional URL 4') {
                    $(`#entry-${submission.id}`).append(`
                    <a href="${value}" target="_blank">Additional Link</a>
                `)
                }
                else {
                    $(`#entry-${submission.id}`).append(`
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

const pushJson = (e) => {
    var finalArr = []
    finalArr.push({
        id: e,
        finalist: 'yes'
    })
    $.getJSON('myfile.json', function(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id != e) {
                finalArr.push(data[i])
                var jsonString = JSON.stringify(finalArr);
                $.ajax({
                    type: "POST",
                    url: "postData.php",
                    data: {data : jsonString},
                    cache: false,
                    success: function(){
                    //    alert(e);
                    }
                });
            }
        }
    })
    // have to wait for PHP to update json before re-pulling data
    console.log(finalists)
    setTimeout(function(){
        repullFinalists()
    }, 3000)
}

const pullJson = (e) => {
    var finalArr = []
    $.getJSON('myfile.json', function(data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id != e) {
                finalArr.push(data[i])
                var jsonString = JSON.stringify(finalArr);
                $.ajax({
                    type: "POST",
                    url: "postData.php",
                    data: {data : jsonString},
                    cache: false,
                    success: function(){
                    //    alert(e);
                    }
                });
            }
        }
    })
    // have to wait for PHP to update json before re-pulling data
    setTimeout(function(){
        repullFinalists()
    }, 3000)
}

// division filter
$('input[type="radio"][name="division"]').on('change', function() {
    $('.entry').removeClass('div-hide')
    selDivision = $(this).val()
    $('.entry').each(function() {
        const thisDivision = $(this).data('division')
        if (thisDivision != selDivision) {
            $(this).addClass('div-hide')
        }
        // clear
        if (selDivision == 'View All') {
            $('.entry').removeClass('div-hide')
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

const repullFinalists = () => {
    setFinalists()
    getSubs()
}

