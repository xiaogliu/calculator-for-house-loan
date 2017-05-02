/**
 * 等额本金、等额本息还款方式详细对比
 * 带有Ai后缀为等额本息还款方式，即average interest
 * 带有Ac后缀为等额本金还款方式，即average capital
 */

// 格式化金额
var formatFloat = function (input, decimals) {
  var formatFloatNumb = Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return formatFloatNumb.toFixed(decimals);
};

// 涉及计算公式
var loanFormula = {
  // 等额本息每月还款金额
  getRepayPerMouthPriceAi: function (loanTotalPrice, interestRatePerMouth, totalMouths) {
    /**
     * @param loanTotalPrice         总贷款
     * @param interestRatePerMouth   月利率
     * @param totalMouths            总月数
     * 每月还款金额 = [总贷款 × 月利率 × (1 + 月利率)^总月数] ÷ [(1 + 月利率)^总月数 - 1]
     */

    // 简化公式，创建变量x
    var x = Math.pow((1 + interestRatePerMouth), totalMouths);

    return (loanTotalPrice * interestRatePerMouth * x / (x - 1));
  },
  
  // 等额本息第i个月还款中利息部分
  getRepayInterestPerMouthAi: function (i, loanTotalPrice, interestRatePerMouth, totalMouths) {
    /**
     * @param i   第(i + 1)个月
     * 第i个月还款中利息部分 = 总贷款 × 月利率 × {(1 + 月利率)^i - (1 + 月利率)^总月数 * [(1 + 月利率)^i - 1] ÷ [(1 + 月利率)^总月数 - 1]}
     */

    // 简化公式，创建变量x、y
    var x = Math.pow((1 + interestRatePerMouth), i);
    var y = Math.pow((1 + interestRatePerMouth), totalMouths);

    return (loanTotalPrice * interestRatePerMouth * (x - y * (x - 1) / (y - 1)));
  },
};


$(document).ready(function () {
  $('.calculate').click(function () {
    var loanTotalPrice = $('.totalPrice').val() * $('.proportion').val() / 10;
    var interestRatePerMouth = $('.interest').val() / 12 / 100;
    var totalMouths = $('.period').val() * 12;

    // 等额本息每月需还利息、本金、剩余待还本金、已还总金额
    var repayPerMouthObjAi = {
      repayInterestPerMouthArrAi: [],
      repayCapitalPerMouthArrAi: [],
      restCapitalArrAi: [],
      totalRepayedArrAi: [],
    };

    // 等额本息月均还款额
    var repayPerMouthPriceAi = loanFormula.getRepayPerMouthPriceAi(loanTotalPrice, interestRatePerMouth, totalMouths);

    // 等额本息初始化剩余待还本金
    var restCapitalPerMouthAi = loanTotalPrice;

    // 等额本息初始化已还总金额
    var totalRepayedPerMouthAi = 0;
    
    var getRepayPerMouthObjAi = function () {
      for(var i = 0; i < totalMouths; i++) {
        // 等额本息第(i+1)个月需还利息
        var repayInterestPerMouthAi = loanFormula.getRepayInterestPerMouthAi(i, loanTotalPrice, interestRatePerMouth, totalMouths);
        
        // 等额本息第(i+1)个月需还本金：月均还款额 - 利息部分
        var repayCapitalPerMouthAi = repayPerMouthPriceAi - repayInterestPerMouthAi;

        // 等额本息第(i+1)个月待还本金：第i个月剩余待还本金 - 第(i + 1)个月所还本金，即上月剩余待还本金 - 当月已还本金
        restCapitalPerMouthAi = restCapitalPerMouthAi - repayCapitalPerMouthAi;

        // 等额本息第(i+1)个月已还总金额
        totalRepayedPerMouthAi = totalRepayedPerMouthAi + repayPerMouthPriceAi;

        // 拼接数组，包括各月份需还利息、本金及剩余待还本金
        repayPerMouthObjAi.repayInterestPerMouthArrAi.push(formatFloat(repayInterestPerMouthAi, 2));
        repayPerMouthObjAi.repayCapitalPerMouthArrAi.push(formatFloat(repayCapitalPerMouthAi, 2));
        repayPerMouthObjAi.restCapitalArrAi.push(formatFloat(restCapitalPerMouthAi, 2));
        repayPerMouthObjAi.totalRepayedArrAi.push(formatFloat(totalRepayedPerMouthAi, 2));
      }
      return repayPerMouthObjAi;
    };
    getRepayPerMouthObjAi();

    // 等额本息总还款额： 月均还款额 × 总月数
    var totalRepayPrice = repayPerMouthPriceAi * totalMouths;
    
    // 等额本息总还款利息： 总还款额 - 总贷款额
    var totalInterestPrice = totalRepayPrice - loanTotalPrice;

    // html中填充数据
    $('.totalLoan').html(formatFloat(loanTotalPrice, 2));
    $('.totalInterest').html(formatFloat(totalInterestPrice, 2));
    $('.totalRepay').html(formatFloat(totalRepayPrice, 2));
    $('.repayPerMouth').html(formatFloat(repayPerMouthPriceAi, 2));

    // 拼接每月还款明细：每月还款本金、利息及待还本金
    for(var i = 0; i < repayPerMouthObjAi.repayInterestPerMouthArrAi.length; i++) {

      var detailTable = $('.detail table');

      if((i%12 + 1) === 1) {
        detailTable.append(
            '<tr><td>第' + (parseInt(i/12) + 1) + '年</td><td></td><td></td><td></td></tr>'
        )
      }
      
      detailTable.append(
          '<tr><td>' + (i%12 + 1) + '</td><td>' + formatFloat(repayPerMouthPriceAi, 2)
          + '(<span class="detail-capital">' + repayPerMouthObjAi.repayCapitalPerMouthArrAi[i]
          + '</span>/<span class="detail-interest">' + repayPerMouthObjAi.repayInterestPerMouthArrAi[i]
          + '</span>)' + '</td><td>' + repayPerMouthObjAi.restCapitalArrAi[i] + '</td><td>'
          + repayPerMouthObjAi.totalRepayedArrAi[i] + '</td></tr>'
      )
    }
  });
});

