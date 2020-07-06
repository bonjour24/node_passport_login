

        window.onscroll = function() {scrollFunction()};

		function scrollFunction() {
		    if (document.body.scrollTop > 330 || document.documentElement.scrollTop > 330) {
		        document.getElementById("nav-footer").classList.add("hide");
		        setTimeout(function(){document.getElementById("nav-footer").classList.add("bl");}, 300);
		        
		    } 
		    else {
		        document.getElementById("nav-footer").classList.remove("hide");	
		        setTimeout(function(){document.getElementById("nav-footer").classList.remove("bl");}, 300);
		    }
		} 