var apiUrl = location.protocol + '//' + location.host + "/api/";

//check user input and call server
$('.sign-in-partner').click(function() {
	updatePartner();
});

function updatePartner() {			 

  //get user input data
  var formPartnerId = $('.partner-id input').val();
  var formCardId = $('.partner-card-id input').val();

  //create json data
  var inputData = '{' + '"partnerid" : "' + formPartnerId + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'partnerData',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
     document.getElementById('loader').style.display = "block";
    },
    success: function(data) {

      //remove loader
      document.getElementById('loader').style.display = "none";

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {

        //update heading
        $('.heading').html(function() {
          var str = '<h2><b> ' + data.name + ' </b></h2>';
          str = str + '<h2><b> ' + data.id + ' </b></h2>';

          return str;
        });

        //update dashboard
        $('.dashboards').html(function() {
          var str = '';
          str = str + '<h5>Credit to customers: ' + data.pointsGiven + ' </h5>';
          str = str + '<h5>Redeemed by Customers: ' + data.pointsCollected + ' </h5>';
          return str;
        });

        //update earn points transaction
        $('.points-allocated-transactions').html(function() {
          var str = '';
		   var transactionData = data.earnPointsResults;
          for (var i = 0; i < transactionData.length; i++) {
			var days=transactionData[i].points;
			var checkin=new Date(transactionData[i].timestamp.substring(0,10));
			checkin=checkin.toString().substring(0,15);
			var checkout=new Date(transactionData[i].timestamp.substring(0,10));
			checkout.setDate(days);
			checkout=checkout.toString().substring(0,15);
            str = str + '<p><b>TimeStamp: </b>  ' + transactionData[i].timestamp + '<br/><b>Brand:</b>   ' + transactionData[i].partner + '<br /><b>Customer: </b>  ' + transactionData[i].member +'<br /><b>Check-In: </b>  ' + checkin + '<br /><b>Check-Out: </b>  ' + checkout +'<br/><b>MarCoins Added:</b>    ' + transactionData[i].points + '<br/><b>TransactionName:</b>    ' + transactionData[i].$class + '<br /><b>TransactionID:  </b>  ' + transactionData[i].transactionId + '</p><br>';
          }
          return str;
        });

        //update use points transaction
        $('.points-redeemed-transactions').html(function() {
          var str = '';
          var transactionData = data.usePointsResults;

         for (var i = 0; i < transactionData.length; i++) {
			var days=transactionData[i].points;
			var checkin=new Date(transactionData[i].timestamp.substring(0,10));
			checkin=checkin.toString().substring(0,15);
			var checkout=new Date(transactionData[i].timestamp.substring(0,10));
			checkout.setDate(days);
			checkout=checkout.toString().substring(0,15);
            str = str + '<p><b>TimeStamp: </b>  ' + transactionData[i].timestamp + '<br/><b>Brand:</b>   ' + transactionData[i].partner + '<br /><b>Customer: </b>  ' + transactionData[i].member +'<br /><b>Check-In: </b>  ' + checkin + '<br /><b>Check-Out: </b>  ' + checkout +'<br/><b>MarCoins Deducted:</b>    ' + transactionData[i].points + '<br/><b>TransactionName:</b>    ' + transactionData[i].$class + '<br /><b>TransactionID:  </b>  ' + transactionData[i].transactionId + '</p><br>';
          }
          return str;
        });

        //remove login section
        document.getElementById('loginSection').style.display = "none";

        //display transaction section
        document.getElementById('transactionSection').style.display = "block";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Please re-try with Valid inputs")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);

      location.reload();
    }
  });

}

