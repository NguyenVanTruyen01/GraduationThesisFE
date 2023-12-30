function GetWinDown(){
    const width  = window.innerWidth;
    if(width < 768){
        return 1;
    }
    else{
        return 3;
    }
}
export default GetWinDown
