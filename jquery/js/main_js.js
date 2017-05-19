'use strict';

/**
 * 等额本金、等额本息还款方式详细对比
 * 带有Ai后缀为等额本息还款方式，即average interest
 * 带有Ap后缀为等额本金还款方式，即average principal
 */

// 格式化金额，保留两位小数
const formatFloat = function (input, decimals) {
  let formatFloatNumb = Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
  return formatFloatNumb.toFixed(decimals);
};

// 涉及计算公式
const loanFormula = {
  // 等额本息每月还款金额
  getRepayPerMouPriceAi: function (loanTotal, interestRatePerMou, totalMouths) {
    /**
     * @param loanTotal         总贷款
     * @param interestRatePerMou   月利率
     * @param totalMouths            总月数
     * 每月还款金额 = [总贷款 × 月利率 × (1 + 月利率)^总月数] ÷ [(1 + 月利率)^总月数 - 1]
     */

    // 简化公式，创建变量x
    let x = Math.pow((1 + interestRatePerMou), totalMouths);

    return (loanTotal * interestRatePerMou * x / (x - 1));
  },

  // 等额本息第i个月还款中利息部分
  getRepayInterestPerMouAi: function (i, loanTotal, interestRatePerMou, totalMouths) {
    /**
     * @param i   第(i + 1)个月
     * 第i个月还款中利息部分 = 总贷款 × 月利率 × {(1 + 月利率)^i - (1 + 月利率)^总月数 * [(1 + 月利率)^i - 1] ÷ [(1 + 月利率)^总月数 - 1]}
     */

    // 简化公式，创建变量x、y
    let [x, y] = [Math.pow((1 + interestRatePerMou), i), Math.pow((1 + interestRatePerMou), totalMouths)];

    return (loanTotal * interestRatePerMou * (x - y * (x - 1) / (y - 1)));
  }
};


$(document).ready(function () {
  const detailBtn = $('.detail-btn');
  const detail = $('.detail');
  const hideDetailBtn = $('.hide-detail-btn');
  $('.calculate').click(function () {
    let loanTotal = $('.totalPrice').val() * $('.proportion').val() / 10;
    let interestRatePerMou = $('.interest').val() / 12 / 100;
    let totalMouths = $('.period').val() * 12;

    // 每月需还利息、本金、剩余待还本金、已还总金额
    let repayPerMouObj = {
      // 等额本息
      repayPerMouObjAi: {
        repayInterestPerMouArrAi: [],
        repayPrincipalPerMouArrAi: [],
        balanceArrAi: [],
        totalRepayedArrAi: [],
      },

      // 等额本金
      repayPerMouObjAp: {
        repayInterestPerMouArrAp: [],
        repayPerMouPriceArrAp: [],
        balanceArrAp: [],
        totalRepayedArrAp: [],
      },
    };

    // 等额本息月均还本带息
    let repayPerMouAi = loanFormula.getRepayPerMouPriceAi(loanTotal, interestRatePerMou, totalMouths);

    // 等额本息初始化剩余待还本金
    let balancePerMouAi = loanTotal;

    // 等额本息初始化已还总金额
    let totalRepayedPerMouAi = 0;

    // 等额本金每月还款本金
    let repayPrincipalPerMouAp = loanTotal / totalMouths;

    // 等额本金每月还款递减金额
    let decreasePerMouAp = repayPrincipalPerMouAp * interestRatePerMou;

    // 等额本金初始化剩余待还本金
    let balancePerMouAp = loanTotal;

    // 等额本金初始化已还总金额
    let totalRepayedPerMouAp = 0;

    const getRepayPerMouObj = function () {
      for(let i = 0; i < totalMouths; i++) {
        // 等额本息第(i+1)个月需还利息
        let repayInterestPerMouAi = loanFormula.getRepayInterestPerMouAi(i, loanTotal, interestRatePerMou, totalMouths);

        // 等额本息第(i+1)个月需还本金：月均还本带息 - 利息部分
        let repayPrincipalPerMouAi = repayPerMouAi - repayInterestPerMouAi;

        // 等额本息第(i+1)个月待还本金：第i个月剩余待还本金 - 第(i + 1)个月所还本金，即上月剩余待还本金 - 当月已还本金
        balancePerMouAi = balancePerMouAi - repayPrincipalPerMouAi;

        // 等额本息第(i+1)个月已还总金额
        totalRepayedPerMouAi = totalRepayedPerMouAi + repayPerMouAi;

        // 拼接等额本息数组，包括各月份需还利息、本金及剩余待还本金
        repayPerMouObj.repayPerMouObjAi.repayInterestPerMouArrAi.push(formatFloat(repayInterestPerMouAi, 2));
        repayPerMouObj.repayPerMouObjAi.repayPrincipalPerMouArrAi.push(formatFloat(repayPrincipalPerMouAi, 2));
        repayPerMouObj.repayPerMouObjAi.balanceArrAi.push(formatFloat(balancePerMouAi, 2));
        repayPerMouObj.repayPerMouObjAi.totalRepayedArrAi.push(formatFloat(totalRepayedPerMouAi, 2));

        // 等额本金第(i+1)个月需还利息
        let repayInterestPerMouAp = loanTotal * interestRatePerMou * (1 - (i - 1) / totalMouths);

        // 等额本金第(i+1)个月还本带息
        let repayPerMouPriceAp = repayPrincipalPerMouAp + repayInterestPerMouAp;

        // 等额本金第(i+1)个月剩余待还本金
        balancePerMouAp = balancePerMouAp - repayPrincipalPerMouAp;

        // 等额本金第(i+1)个月总还本带息
        totalRepayedPerMouAp = totalRepayedPerMouAp + repayPerMouPriceAp;

        // 拼接等额本金数组，包括各月份需还利息、本金及剩余待还本金
        repayPerMouObj.repayPerMouObjAp.repayInterestPerMouArrAp.push(formatFloat(repayInterestPerMouAp, 2));
        repayPerMouObj.repayPerMouObjAp.repayPerMouPriceArrAp.push(formatFloat(repayPerMouPriceAp, 2));
        repayPerMouObj.repayPerMouObjAp.balanceArrAp.push(formatFloat(balancePerMouAp, 2));
        repayPerMouObj.repayPerMouObjAp.totalRepayedArrAp.push(formatFloat(totalRepayedPerMouAp, 2));
      }
      return repayPerMouObj;
    };
    getRepayPerMouObj();

    // 等额本息总还本带息： 月均还本带息 × 总月数
    let totalRepayAi = repayPerMouAi * totalMouths;

    // 等额本息总还款利息： 总还本带息 - 总贷款额
    let totalInterestAi = totalRepayAi - loanTotal;

    // 等额本息
    $('.total-loan').html(formatFloat(loanTotal, 2));
    $('.total-interest-ai').html(formatFloat(totalInterestAi, 2));
    $('.total-repay-ai').html(formatFloat(totalRepayAi, 2));
    $('.repay-per-mouth-ai').html(formatFloat(repayPerMouAi, 2));

    // 等额本金总还款金额（直接从等额本金数组中获取）
    const totalRepayPriceAp = repayPerMouObj.repayPerMouObjAp.totalRepayedArrAp[repayPerMouObj.repayPerMouObjAp.totalRepayedArrAp.length - 1];

    // 等额本金总还款利息： 总还本带息 - 总贷款额
    const totalInterestAp = totalRepayPriceAp - loanTotal;
    

    // 等额本金
    $('.total-interest-ap').html(formatFloat(totalInterestAp, 2));
    $('.total-repay-ap').html(formatFloat(totalRepayPriceAp, 2));
    $('.repay-per-mouth-ap').html(formatFloat(repayPerMouObj.repayPerMouObjAp.repayPerMouPriceArrAp[0], 2));
    $('.decrease-per-mouth-ap').html(formatFloat(decreasePerMouAp, 2));

    // 展示明细按钮
    detailBtn.css('display', 'block');
    hideDetailBtn.css('display', 'none');
    detail.css('display', 'none');

    // 拼接每月还款明细：每月还款本金、利息及待还本金
    let detailTable = $('.detail table');
    detailTable.html('' +
        '<table>' +
          '<tr>' +
            '<th>月份</th>' +
            '<th>等额本息月供金额（<span class="detail-principal">本金</span>/<span class="detail-interest">利息</span>）</th>' +
            '<th>等额本金月供金额（<span class="detail-principal">本金</span>/<span class="detail-interest">利息</span>）</th> ' +
            '<th>等额本息剩余本金</th>' +
            ' <th>等额本金剩余本金</th>' +
            ' <th>等额本息已还总额</th>' +
            ' <th>等额本金已还总额</th>' +
          ' </tr>' +
        ' </table>'); // 每次计算前清空数据

    for(let i = 0; i < repayPerMouObj.repayPerMouObjAi.repayInterestPerMouArrAi.length; i++) {

      if((i%12 + 1) === 1) {
        detailTable.append(
          '<tr><td>第' + (parseInt(i/12) + 1) + '年</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
          )
      }

      detailTable.append(
        '<tr><td>' + (i%12 + 1) + '</td><td>' + formatFloat(repayPerMouAi, 2)
        + '(<span class="detail-principal">' + repayPerMouObj.repayPerMouObjAi.repayPrincipalPerMouArrAi[i]
        + '</span>/<span class="detail-interest">' + repayPerMouObj.repayPerMouObjAi.repayInterestPerMouArrAi[i]
        + '</span>)</td><td>' + repayPerMouObj.repayPerMouObjAp.repayPerMouPriceArrAp[i]
        + '(<span class="detail-principal">' + formatFloat(repayPrincipalPerMouAp, 2)
        + '</span>/<span class="detail-interest">' + repayPerMouObj.repayPerMouObjAp.repayInterestPerMouArrAp[i]
        + '</span>)</td><td>' + repayPerMouObj.repayPerMouObjAi.balanceArrAi[i] + '</td><td>'
        + repayPerMouObj.repayPerMouObjAp.balanceArrAp[i] + '</td><td>'
        + repayPerMouObj.repayPerMouObjAi.totalRepayedArrAi[i] + '</td><td>'
        + repayPerMouObj.repayPerMouObjAp.totalRepayedArrAp[i] + '</td></tr>'
        )
    }
  });

  // 展示明细
  detailBtn.click(function () {
    detail.css('display', 'block');
    hideDetailBtn.css('display', 'block');
    detailBtn.css('display', 'none');
  });
  
  // 隐藏明细
  hideDetailBtn.click(function () {
    detail.css('display', 'none');
    detailBtn.css('display', 'block');
    hideDetailBtn.css('display', 'none');
  });
});
