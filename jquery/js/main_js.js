var formatFloat = function (input, position) {
  return Math.round(input*Math.pow(10, position))/Math.pow(10, position);
};

$(document).ready(function () {
  var calculate = $('.calculate');
  // 计算总价
  calculate.click(function () {
    var totalPrice = parseInt($('.totalPrice').val());
    var proportion = $('.proportion').val() / 10;
    var period = $('.period').val() * 12;
    var interest = $('.interest');
    var repayPerMouth = $('.repayPerMouth');
    var totalInterest = $('.totalInterest');
    var totalRepay = $('.totalRepay');
    var totalLoan = $('.totalLoan');
    var repayPerMouSep = {
      repayInterestPerMouth: [],
      repayCapitalPerMouth: [],
      restCapital: []
    };
    
    var interestPerMouth = interest.val() / 12 / 100;
    
    var repayPerMouthPrice = (totalPrice * proportion * interestPerMouth * Math.pow((1 + interestPerMouth), period) / (Math.pow((1 + interestPerMouth), period) - 1));
    // repayPerMouthPrice = formatFloat(repayPerMouthPrice, 2);
    var restCapitalIMouth = totalPrice * proportion;
    var getRepayInterestPerMouth = function () {
      for(var i = 0; i < period; i++) {
        // 第(i + 1)个月需要还的利息
        var repayInterestIMouth = (totalPrice * proportion * interestPerMouth * (Math.pow((1 + interestPerMouth), i) - ((Math.pow((1 + interestPerMouth), period) * (Math.pow((1 + interestPerMouth), i) - 1)) / (Math.pow((1 + interestPerMouth), period) - 1))));
        // repayInterestIMouth = formatFloat(repayInterestIMouth, 2);
        
        // 第(i + 1)个月要还的现金
        var repayCapitalIMouth = repayPerMouthPrice - repayInterestIMouth;
        restCapitalIMouth = restCapitalIMouth - repayCapitalIMouth;
        // repayCapitalIMouth = formatFloat(repayCapitalIMouth, 2); // 中间计算不要近似，不然误差越来越大

        
        // restCapitalIMouth = formatFloat(restCapitalIMouth, 2);

        repayPerMouSep.repayInterestPerMouth.push(formatFloat(repayInterestIMouth, 2));

        repayPerMouSep.repayCapitalPerMouth.push(formatFloat(repayCapitalIMouth, 2));

        repayPerMouSep.restCapital.push(formatFloat(restCapitalIMouth, 2));
      }
      return repayPerMouSep;
    };
    getRepayInterestPerMouth();

    var totalInterestPrice = totalPrice * proportion * ((interestPerMouth * period * Math.pow((1 + interestPerMouth), period) / (Math.pow((1 + interestPerMouth), period) - 1)) - 1);
    
    var totalRepayPrice = totalInterestPrice + totalPrice * proportion;
    
    console.log(repayPerMouSep);

        // 直接使用^计算n次方有问题
    // console.log((totalPrice * proportion * interestPerMouth * ((1 + interestPerMouth)^period)) / ((1 + interestPerMouth)^period - 1));

    totalLoan.html(formatFloat(totalPrice * proportion, 2));
    totalInterest.html(formatFloat(totalInterestPrice, 2));
    totalRepay.html(formatFloat(totalRepayPrice, 2));
    repayPerMouth.html(formatFloat(repayPerMouthPrice, 2));

    for(var i = 0; i < repayPerMouSep.repayInterestPerMouth.length; i++) {
      $(".detail table").append(
          "<tr><td>" + (i + 1) + "</td><td>" + formatFloat(repayPerMouthPrice, 2) + "(<span class='detail-capital'>" + repayPerMouSep.repayCapitalPerMouth[i] + "</span>/<span class='detail-interest'>" + repayPerMouSep.repayInterestPerMouth[i] + "</span>)" + "</td><td>" + repayPerMouSep.restCapital[i] + "</td></tr>"
      )
    }
  });
});

