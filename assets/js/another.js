$(document).ready(function(){
		var sMH=[
		  {
	    	quote:"<a href='https://www.cs.rutgers.edu/~zz124/sigmetrics17.pdf'>I'm published</a>",
	    },
			{
				quote: "I thought you were my boy"
			},
			{
				quote: "we're going to need a bigger boat"
			},
			{
				quote: "<a href='./listen.html'>HEY ABDALL</a>"
			}
	];
	var narcissism=[
		{
			quote:"av1.png",
		},
		{
			quote: "av.png"
		},
		{
			quote: "avatar.png"
		},
		{
			quote: "av2.png"
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
			var lmk='';
			if(flip.isFlipped){
				var COMEON=$('#ayy');
			var toomuch=sMH[randomNumber].quote;
			var lmk=narcissism[randomNumber].quote;
			}
			COMEON.html('');
      COMEON.append('<p>'+toomuch+'</p>');
			document.getElementById("me").src="images/"+lmk;
    });
});
