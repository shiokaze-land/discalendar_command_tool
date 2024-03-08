//読み込み時処理
$(function(){
    modeDispControl();
    controlExample();
    $( 'input[name="mode"]:radio' ).change( function() {
        modeDispControl();
        controlExample();
    });
    $( '#yearCheck' ).change( function() {
        controlExample();
    });

    $('#listResetBtn').click(function(){
        $('#resultArea').empty();
    });
    
    $('#inputResetBtn').click(function(){
        $('#schedule').val('');
    });

    $('#execBtn').click(function(){
        const inputEventName = $('#eventName').val();
        let eventName = '';
        const color = $('#color').val();
        
        let inputText = $('#schedule').val();
        let array = textSplit(inputText);
    
        let modeCheck = $('#mode1').prop("checked");
        let yearCheck = $('#yearCheck').prop("checked");

        let year = '';
        let month = '';
        let day = '';
        let start = '';
        let end = '';
        let place = '';

        for (let i = 0; i < array.length; ++i) {
            let dataArray = [];
            if(yearCheck){
                //年を自動判別する
                month = array[i].substr(0,2);
                year = judgeYear(month);
                day = array[i].substr(2,2);
                start = array[i].substr(4,2);
                end = array[i].substr(6,2);
            }else{
                year = array[i].substr(0,4);
                month = array[i].substr(4,2);
                day = array[i].substr(6,2);
                start = array[i].substr(8,2);
                end = array[i].substr(10,2);
            }

            //イベント名判定
            if (modeCheck){
                //単イベント
                if(yearCheck){
                    eventName = array[i].substr(8);
                }else{
                    eventName = array[i].substr(12);
                }
                place = '-';
            }else{
                //複数イベント
                eventName = inputEventName;
                if(yearCheck){
                    place = array[i].substr(8);
                }else{
                    place = array[i].substr(12);
                }
            }

            dataArray.push(eventName); //eventName0
            dataArray.push(year); //year1
            dataArray.push(month); //month2
            dataArray.push(day); //day3
            dataArray.push(start); //start4
            dataArray.push(end); //end5
            dataArray.push(color); //color6
            dataArray.push(place); //place7
            console.log(dataArray);
            let output = makeCommand(dataArray);
            
            $('#resultArea').append('<p id="result' + i +'">'+ output +'</p><button class="btn btn-primary resultBtn" id="resultBtn' + i + '" value="' + i + '" >Copy</button>');
        }
    
    });



});

function judgeYear(inputMonth){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    let setYear = '';
    if (month<= inputMonth){
        setYear = year;
    }else{
        setYear = year + 1;
    }
    return setYear;
}

function modeDispControl(){
    let modeCheck = $('#mode1').prop("checked")
    if (modeCheck){
        $('#eventNameArea').css('display','none');
    }else{
        $('#eventNameArea').css('display','inline');
    }
}

function controlExample(){
    let modeCheck = $('#mode1').prop("checked");
    let yearCheck = $('#yearCheck').prop("checked");
    if (yearCheck && modeCheck){
        $('#inputExample').text('(例：12011822飲み会)');
    }else if(yearCheck){
        $('#inputExample').text('(例：12011822瀬楽)');
    }else if(modeCheck){
        $('#inputExample').text('(例：202312011822飲み会)');
    }else{
        $('#inputExample').text('(例：202312011822瀬楽)');
    }
}

function makeCommand(array){
    //eventName0,year1,month2,day3,start4,end5,color6,place7
    let output = '/create' + ' name:' +array[0]+ ' start_year:' + array[1] + ' start_month:'+ array[2] +' start_day:' + array[3] + ' start_hour:' + array[4] + ' start_minute:0' + ' end_year:' + array[1] + ' end_month:'+ array[2] +' end_day:' + array[3] + ' end_hour:' + array[5] + ' end_minute:0 color:' + array[6] + ' notify_1:1日前 description:' + array[7];
    //output += ;
    
    return output;
}

function textSplit(value){
    return value.split("\n");
}



$(document).on("click",".resultBtn",function(){
    let number = $(this).val();
    let command = document.getElementById('result'+number).textContent;
    navigator.clipboard.writeText(command);
});

