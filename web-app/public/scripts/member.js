var apiUrl = location.protocol + '//' + location.host + "/api/";

//check user input and call server
$('.sign-in-member').click(function() {
  updateMember();
});

function updateMember() {

  //get user input data
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.member-card-id input').val();

  //create json data
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '"}';
  console.log(inputData);

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'memberData',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      //document.getElementById('loader').style.display = "block";
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
          var str = '<h2><b>' + data.firstName + ' ' + data.lastName + '</b></h2>';
          str = str + '<h2><b>' + data.accountNumber + '</b></h2>';
          str = str + '<h2><b>' + data.points + '</b></h2>';

          return str;
        });

        //update partners dropdown for earn points transaction
        $('.earn-partner select').html(function() {
          var str = '<option value="" disabled="" selected="">select</option>';
          var partnersData = data.partnersData;
          for (var i = 0; i < partnersData.length; i++) {
            str = str + '<option partner-id=' + partnersData[i].id + '> ' + partnersData[i].name + '</option>';
          }
          return str;
        });

        //update partners dropdown for use points transaction
        $('.use-partner select').html(function() {
          var str = '<option value="" disabled="" selected="">select</option>';
          var partnersData = data.partnersData;
          for (var i = 0; i < partnersData.length; i++) {
            str = str + '<option partner-id=' + partnersData[i].id + '> ' + partnersData[i].name + '</option>';
          }
          return str;
        });

        //update earn points transaction
        $('.points-allocated-transactions').html(function() {
          var str = '';
          var transactionData = data.earnPointsResult;

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
		
		

        //remove login section and display member page
        document.getElementById('loginSection').style.display = "none";
        document.getElementById('transactionSection').style.display = "block";
      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      //reload on error
      alert("Error: Try again\n")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
    complete: function() {

    }
  });
}


$('.earn-points-30').click(function() {
  earnPoints(30);
});

$('.earn-points-80').click(function() {
  earnPoints(80);
});

$('.earn-points-200').click(function() {
  earnPoints(200);
});


//check user input and call server
$('.earn-points-transaction').click(function() {

  var formPoints = $('.earnPoints input').val();
  earnPoints(formPoints);
});


function earnPoints(formPoints) {

  //get user input data
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.member-card-id input').val();
  var formPartnerId = $('.earn-partner select').find(":selected").attr('partner-id');

  //create json data
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '", ' + '"points" : "' + formPoints + '", ' + '"partnerid" : "' + formPartnerId + '"}';
  console.log(inputData)

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'earnPoints',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = "block";
      document.getElementById('infoSection').style.display = "none";
    },
    success: function(data) {

      document.getElementById('loader').style.display = "none";
      document.getElementById('infoSection').style.display = "block";

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {
        //update member page and notify successful transaction
        updateMember();
        alert('Transaction successful'+basicCodes);
      }


    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Error: Try again\n")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    }
  });

}

$('.use-points-50').click(function() {
  usePoints(50);
});

$('.use-points-150').click(function() {
  usePoints(100);
});

$('.use-points-200').click(function() {
  usePoints(150);
});


//check user input and call server
$('.use-points-transaction').click(function() {
 // var formPoints = $('.usePoints input').val();
  usePoints(50);
});


function usePoints(formPoints) {

  //get user input data
  var formAccountNum = $('.account-number input').val();
  var formCardId = $('.member-card-id input').val();
  var formPartnerId = $('.use-partner select').find(":selected").attr('partner-id');

  //create json data
  var inputData = '{' + '"accountnumber" : "' + formAccountNum + '", ' + '"cardid" : "' + formCardId + '", ' + '"points" : "' + formPoints + '", ' + '"partnerid" : "' + formPartnerId + '"}';
  console.log(inputData)

  //make ajax call
  $.ajax({
    type: 'POST',
    url: apiUrl + 'usePoints',
    data: inputData,
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function() {
      //display loading
      document.getElementById('loader').style.display = "block";
      document.getElementById('infoSection').style.display = "none";
    },
    success: function(data) {

      document.getElementById('loader').style.display = "none";
      document.getElementById('infoSection').style.display = "block";

      //check data for error
      if (data.error) {
        alert(data.error);
        return;
      } else {
        //update member page and notify successful transaction
        updateMember();
		 var basicCodes = voucher_codes.generate({
			 length: 7,
            count: 1,
			prefix: "promo-",
			postfix: "-2019"
        });
		$('#myModal').find('.voucher').text(basicCodes);
        $('#myModal').modal('show')
		console.log(basicCodes)
       // alert('50 points Reedmed.\nYour gift voucher Code is :   '+basicCodes);
		return basicCodes;
		

      }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert("Error: Try again\n")
      console.log(errorThrown);
      console.log(textStatus);
      console.log(jqXHR);
    },
    complete: function() {}
  });

}
