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

    // 每月需还利息、本金、剩余待还本金、已还总金额
    var repayPerMouthObj = {
      // 等额本息
      repayPerMouthObjAi: {
        repayInterestPerMouthArrAi: [],
        repayCapitalPerMouthArrAi: [],
        restCapitalArrAi: [],
        totalRepayedArrAi: [],
      },

      // 等额本金
      repayPerMouthObjAc: {
        repayInterestPerMouthArrAc: [],
        repayPerMouthPriceArrAc: [],
        restCapitalArrAc: [],
        totalRepayedArrAc: [],
      }
    };

    // 等额本息月均还本带息
    var repayPerMouthPriceAi = loanFormula.getRepayPerMouthPriceAi(loanTotalPrice, interestRatePerMouth, totalMouths);

    // 等额本息初始化剩余待还本金
    var restCapitalPerMouthAi = loanTotalPrice;

    // 等额本息初始化已还总金额
    var totalRepayedPerMouthAi = 0;

    // 等额本金每月需还利息、本金、剩余待还本金、已还总金额
    var repayPerMouthObjAc = {
      repayInterestPerMouthArrAc: [],
      repayPerMouthPriceArrAc: [],
      restCapitalArrAc: [],
      totalRepayedArrAc: [],
    };

    // 等额本金每月还款本金
    var repayCapitalPerMouthAc = loanTotalPrice / totalMouths;

    // 等额本息初始化剩余待还本金
    var restCapitalPerMouthAc = loanTotalPrice;

    // 等额本金初始化已还总金额
    var totalRepayedPerMouthAc = 0;
    
    var getRepayPerMouthObj = function () {
      for(var i = 0; i < totalMouths; i++) {
        // 等额本息第(i+1)个月需还利息
        var repayInterestPerMouthAi = loanFormula.getRepayInterestPerMouthAi(i, loanTotalPrice, interestRatePerMouth, totalMouths);
        
        // 等额本息第(i+1)个月需还本金：月均还本带息 - 利息部分
        var repayCapitalPerMouthAi = repayPerMouthPriceAi - repayInterestPerMouthAi;

        // 等额本息第(i+1)个月待还本金：第i个月剩余待还本金 - 第(i + 1)个月所还本金，即上月剩余待还本金 - 当月已还本金
        restCapitalPerMouthAi = restCapitalPerMouthAi - repayCapitalPerMouthAi;

        // 等额本息第(i+1)个月已还总金额
        totalRepayedPerMouthAi = totalRepayedPerMouthAi + repayPerMouthPriceAi;

        // 拼接等额本息数组，包括各月份需还利息、本金及剩余待还本金
        repayPerMouthObj.repayPerMouthObjAi.repayInterestPerMouthArrAi.push(formatFloat(repayInterestPerMouthAi, 2));
        repayPerMouthObj.repayPerMouthObjAi.repayCapitalPerMouthArrAi.push(formatFloat(repayCapitalPerMouthAi, 2));
        repayPerMouthObj.repayPerMouthObjAi.restCapitalArrAi.push(formatFloat(restCapitalPerMouthAi, 2));
        repayPerMouthObj.repayPerMouthObjAi.totalRepayedArrAi.push(formatFloat(totalRepayedPerMouthAi, 2));

        // 等额本金第(i+1)个月需还利息
        var repayInterestPerMouthAc = loanTotalPrice * interestRatePerMouth * (1 - (i - 1) / totalMouths);

        // 等额本金第(i+1)个月还本带息
        var repayPerMouthPriceAc = repayCapitalPerMouthAc + repayInterestPerMouthAc;

        // 等额本金第(i+1)个月剩余待还本金
        restCapitalPerMouthAc = restCapitalPerMouthAc - repayCapitalPerMouthAc;

        // 等额本金第(i+1)个月总还本带息
        totalRepayedPerMouthAc = totalRepayedPerMouthAc + repayPerMouthPriceAc;

        // 拼接等额本金数组，包括各月份需还利息、本金及剩余待还本金
        repayPerMouthObj.repayPerMouthObjAc.repayInterestPerMouthArrAc.push(formatFloat(repayInterestPerMouthAc, 2));
        repayPerMouthObj.repayPerMouthObjAc.repayPerMouthPriceArrAc.push(formatFloat(repayPerMouthPriceAc, 2));
        repayPerMouthObj.repayPerMouthObjAc.restCapitalArrAc.push(formatFloat(restCapitalPerMouthAc, 2));
        repayPerMouthObj.repayPerMouthObjAc.totalRepayedArrAc.push(formatFloat(totalRepayedPerMouthAc, 2));
      }
      return repayPerMouthObj;
    };
    getRepayPerMouthObj();
    console.log(repayPerMouthObj);

    // 等额本息总还本带息： 月均还本带息 × 总月数
    var totalRepayPriceAi = repayPerMouthPriceAi * totalMouths;
    
    // 等额本息总还款利息： 总还本带息 - 总贷款额
    var totalInterestPriceAi = totalRepayPriceAi - loanTotalPrice;

    // 等额本息
    $('.total-loan').html(formatFloat(loanTotalPrice, 2));
    $('.total-interest-ai').html(formatFloat(totalInterestPriceAi, 2));
    $('.total-repay-ai').html(formatFloat(totalRepayPriceAi, 2));
    $('.repay-per-mouth-ai').html(formatFloat(repayPerMouthPriceAi, 2));



    // 拼接每月还款明细：每月还款本金、利息及待还本金
    for(var i = 0; i < repayPerMouthObj.repayPerMouthObjAi.repayInterestPerMouthArrAi.length; i++) {

      var detailTable = $('.detail table');

      if((i%12 + 1) === 1) {
        detailTable.append(
          '<tr><td>第' + (parseInt(i/12) + 1) + '年</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
          )
      }
      
      detailTable.append(
        '<tr><td>' + (i%12 + 1) + '</td><td>' + formatFloat(repayPerMouthPriceAi, 2)
        + '(<span class="detail-capital">' + repayPerMouthObj.repayPerMouthObjAi.repayCapitalPerMouthArrAi[i]
        + '</span>/<span class="detail-interest">' + repayPerMouthObj.repayPerMouthObjAi.repayInterestPerMouthArrAi[i]
        + '</span>)</td><td>' + repayPerMouthObj.repayPerMouthObjAc.repayPerMouthPriceArrAc[i]
        + '(<span class="detail-capital">' + repayPerMouthObj.repayPerMouthObjAc.restCapitalArrAc[i]
        + '</span>/<span class="detail-interest">' + repayPerMouthObj.repayPerMouthObjAc.repayInterestPerMouthArrAc[i]
        + '</span>)</td><td>' + repayPerMouthObj.repayPerMouthObjAi.restCapitalArrAi[i] + '</td><td>' 
        + repayPerMouthObj.repayPerMouthObjAc.restCapitalArrAc[i] + '</td><td>'
        + repayPerMouthObj.repayPerMouthObjAi.totalRepayedArrAi[i] + '</td><td>'
        + repayPerMouthObj.repayPerMouthObjAc.totalRepayedArrAc[i] + '</td></tr>'
        )
    }
  });
});

