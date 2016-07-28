$(document).ready(function(){
		var sMH=[
		  {
	    	quote:"I'm published",
	    },
			{
				quote: "I thought you were my boy"
			},
			{
				quote: "too lazy to come up with more of these"
			}
	];
    $("#card").flip({
      axis: 'y',
      trigger: 'click'
    });
    $("#card").click(function(){
      var sourceLength = sMH.length;
      var randomNumber= Math.floor(Math.random()*sourceLength);
			var flip = $("#card").data("flip-model");
			var toomuch='';
			if(flip.isFlipped){
				var COMEON=$('#ayy');
			var toomuch=sMH[randomNumber].quote;
			}
			COMEON.html('');
      COMEON.append('<p>'+toomuch+'</p>');
    });
});
