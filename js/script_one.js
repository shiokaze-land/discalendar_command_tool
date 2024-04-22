//読み込み時処理
$(function(){
    controlExample();
    $( '#yearCheck' ).change( function() {
        controlExample();
    });

    $( '#minuteCheck' ).change( function() {
        controlExample();
    });

    $('#inputResetBtn').click(function(){
        $('#oneEventDateInput').val('');
    });

    $('#addNotificationArea').hide();
    $('#addNotificationButton').click(function(){
        $('#addNotificationArea').toggle();
    });

    $('#color').addClass("optionBlack");
    $('#color').change( function() {
        controlOptionBackground();
    });

    $('#execBtn').click(function(){
        const color = $('#color').val();
        let eventName = '';
        
        let inputText = escapeHTML($('#oneEventDateInput').val());
        let array = textSplit(inputText);
    
        let yearCheck = $('#yearCheck').prop("checked");
        let minuteCheck = $('#minuteCheck').prop("checked");

        let notify1 = $('#notificationTime1').val();
        let notify2 = $('#notificationTime2').val();
        let notify3 = $('#notificationTime3').val();
        let notify4 = $('#notificationTime4').val();

        let year = '';
        let month = '';
        let day = '';
        let start = '';
        let end = '';
        let startMinute = '';
        let endMinute = '';

        for (let i = 0; i < array.length; ++i) {
            let dataArray = [];
            if(yearCheck){
                //年を自動判別する
                month = array[i].substr(0,2);
                year = judgeYear(month);
                day = array[i].substr(2,2);
                start = array[i].substr(4,2);

                if(!minuteCheck){
                    startMinute = array[i].substr(6,2);
                    end = array[i].substr(8,2);
                    endMinute = array[i].substr(10,2);
                    eventName = array[i].substr(12);
                }else{
                    startMinute = '0';
                    endMinute = '0';
                    end = array[i].substr(6,2);
                    eventName = array[i].substr(8);
                }
                
            }else{
                year = array[i].substr(0,4);
                month = array[i].substr(4,2);
                day = array[i].substr(6,2);
                start = array[i].substr(8,2);

                if(!minuteCheck){
                    startMinute = array[i].substr(10,2);
                    end = array[i].substr(12,2);
                    endMinute = array[i].substr(14,2);
                    eventName = array[i].substr(16);
                }else{
                    startMinute = '0';
                    endMinute = '0';
                    end = array[i].substr(10,2);
                    eventName = array[i].substr(12);
                }
                
            }

            description = '-';
            
            dataArray.push(eventName); //eventName0
            dataArray.push(year); //year1
            dataArray.push(month); //month2
            dataArray.push(day); //day3
            dataArray.push(start); //start4
            dataArray.push(startMinute); //startMinute5
            dataArray.push(end); //end6
            dataArray.push(endMinute); //endMinute7
            dataArray.push(color); //color8
            dataArray.push(description); //description9

            dataArray.push(notify1); //notify1 10
            dataArray.push(notify2); //notify2 11
            dataArray.push(notify3); //notify3 12
            dataArray.push(notify4); //notify4 13

            let output = makeCommand(dataArray);
            
            $('#resultArea').html('<p id="result' + i +'">'+ output +'</p><button class="btn btn-primary resultBtn" id="resultBtn' + i + '" value="' + i + '" >コピーする</button><span id="copyResult' + i + '"></span>');
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

function controlExample(){
    let minuteCheck = $('#minuteCheck').prop("checked");
    let yearCheck = $('#yearCheck').prop("checked");
    if (yearCheck && !minuteCheck){
        $('#inputExample').text('(例：120118002200飲み会)');
    }else if(yearCheck){
        $('#inputExample').text('(例：12011822飲み会)');
    }else if(!minuteCheck){
        $('#inputExample').text('(例：2023120118002200飲み会)');
    }else{
        $('#inputExample').text('(例：202312011822飲み会)');
    }
}

function controlOptionBackground(){
    let selectedClass = $('[name=color] option:selected').attr("class");
    $('#color').attr('class', selectedClass);
}

function makeCommand(array){
    //eventName0,year1,month2,day3,start4,startMinute5,end6,endMinute7,color8,description9
    let output = '/create' + ' name:' +array[0]+ ' start_year:' + array[1] + ' start_month:'+ array[2] +' start_day:' + array[3] + ' start_hour:' + array[4] + ' start_minute:' + array[5];
    output += ' end_year:' + array[1] + ' end_month:'+ array[2] +' end_day:' + array[3] + ' end_hour:' + array[6] + ' end_minute:' + array[7] + ' color:' + array[8]; 

    for (let i = 0; i < 4; ++i) {
        output += notifyJudge(array[10+i],i+1);
    }
    //output += ' description:' + array[9];

    return output;
}

function textSplit(value){
    return value.split("\n");
}

function notifyJudge(str, num){
    if (str === ''){
        return ' ';
    }else{
        return ' notify_' + num + ':' + str;
    }
}

function escapeHTML(string){
    return string.replace(/&/g, '&lt;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "&#x27;");
}

$(document).on("click",".resultBtn",function(){
    let number = $(this).val();
    let command = document.getElementById('result'+number).textContent;
    navigator.clipboard.writeText(command);
    $('#copyResult'+number).text('　＼コピーしました！／');
});

