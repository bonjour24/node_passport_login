

var k=0, tim=0;

window.onscroll = function (e) {
    console.log("x = "+window.scrollY); 
    x = window.scrollY

    if (x>10 && tim==0){
    	tim=1
    	console.log(k)
    	document.getElementById('navbar_top2').classList.add('t');
    	document.getElementById('navbar_top').classList.add('nn');
	}
	if(k-x>0){
		document.getElementById('navbar_top').classList.remove('nn');
		if(x<400){
			document.getElementById('navbar_top2').classList.remove('t');
		}
		tim = 0
	}
	k = x
};

