var data = new Array();
function checkBox(this1){
    var s = this1.value;
    if(!this1.checked){
        var index = data.indexOf(s);
        if(index > -1){
            data.splice(index,1);
        }
    }
}