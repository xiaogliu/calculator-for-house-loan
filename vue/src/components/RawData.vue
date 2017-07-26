<template>
  <div class="raw-data">
    <p>
    <span>房屋总价：{{mesFather}}</span>
      <input class="totalPrice" type="text" title="totalPrice" v-model="totalPrice">元
    </p>
    <p>
      <span>贷款比例：</span>
      <input class="proportion" type="text" title="proportion" v-model="proportion">成
    </p>
    <p>
      <span>期限：</span>
      <input class="period" type="text" title="period" v-model="period">年
    </p>
    <p>
      <span>贷款利率：</span>
      <input class="interest" type="text" title="interest" v-model="interest">%
    </p>
    <button class="calculate" @click="computeResult()">计算</button>
    {{result}}
  </div>
</template>
<script>
  export default {
    props: ['mesFather'],
    data() {
      return {
        totalPrice: 1260000,
        proportion: 7,
        period: 30,
        interest: 4.9,
        result: '',
        repayPerMouObj: {
          // 等额本息
          repayPerMouObjAi: {
            repayInterestPerMouArrAi: [],
            repayPrincipalPerMouArrAi: [],
            balanceArrAi: [],
            totalRepayedArrAi: [],
            totalRepayPerMouArrAi: [],
          },
          // 等额本金
          repayPerMouObjAp: {
            repayInterestPerMouArrAp: [],
            repayPerMouPriceArrAp: [],
            balanceArrAp: [],
            totalRepayedArrAp: [],
            totalRepayPerMouArrAp: [],
          },
        },
        // // 等额本金每月还款递减金额
        // decreasePerMouAp: 0,
        // 总贷款额度
        // loanTotal: 0,
      };
    },
    methods: {
      // 格式化金额，保留N位小数，小数位数等于decimals
      formatFloat(input, decimals) {
        const formatFloatNumb = Math.round(input * (10 ** decimals)) / (10 ** decimals);
        return formatFloatNumb.toFixed(decimals);
      },
      // 等额本息每月还款金额
      getRepayPerMouPriceAi(loanTotal, interestRatePerMou, totalMouths) {
        const x = (1 + interestRatePerMou) ** totalMouths;
        return ((loanTotal * interestRatePerMou * x) / (x - 1));
      },
      // 等额本息第i个月还款中利息部分
      getRepayInterestPerMouAi(i, loanTotal, interestRatePerMou, totalMouths) {
        const [x, y] = [(1 + interestRatePerMou) ** i, (1 + interestRatePerMou) ** totalMouths];
        return (loanTotal * interestRatePerMou * (x - ((y * (x - 1)) / (y - 1))));
      },
      // 结算结果
      computeResult() {
        const loanTotal = (this.totalPrice * this.proportion) / 10;
        // this.loanTotal = loanTotal;
        const interestRatePerMou = this.interest / 12 / 100;
        const totalMouths = this.period * 12;

        // 等额本息月均还本带息
        const repayPerMouAi = this.getRepayPerMouPriceAi(loanTotal, interestRatePerMou, totalMouths);
        // 等额本息初始化剩余待还本金
        let balancePerMouAi = loanTotal;

        // 等额本息初始化已还总金额
        let totalRepayedPerMouAi = 0;

        // 等额本金每月还款本金
        const repayPrincipalPerMouAp = loanTotal / totalMouths;

        // 等额本金每月还款递减金额
        const decreasePerMouAp = repayPrincipalPerMouAp * interestRatePerMou;

        // 等额本金初始化剩余待还本金
        let balancePerMouAp = loanTotal;

        // 等额本金初始化已还总金额
        let totalRepayedPerMouAp = 0;

        // 初始化数据
        this.repayPerMouObj = {
          // 等额本息
          repayPerMouObjAi: {
            repayInterestPerMouArrAi: [],
            repayPrincipalPerMouArrAi: [],
            balanceArrAi: [],
            totalRepayedArrAi: [],
            totalRepayPerMouArrAi: [],
          },
          // 等额本金
          repayPerMouObjAp: {
            repayInterestPerMouArrAp: [],
            repayPerMouPriceArrAp: [],
            balanceArrAp: [],
            totalRepayedArrAp: [],
            totalRepayPerMouArrAp: [],
          },
        };

        for (let i = 0; i < totalMouths; i += 1) {
          // 等额本息第(i+1)个月需还利息
          const repayInterestPerMouAi = this.getRepayInterestPerMouAi(i, loanTotal, interestRatePerMou, totalMouths);
  
          // 等额本息第(i+1)个月需还本金：月均还本带息 - 利息部分
          const repayPrincipalPerMouAi = repayPerMouAi - repayInterestPerMouAi;
  
          // 等额本息第(i+1)个月待还本金：第i个月剩余待还本金 - 第(i + 1) 个月所还本金，即上月剩余待还本金 - 当月已还本金
          balancePerMouAi -= repayPrincipalPerMouAi;
  
          // 等额本息第(i+1)个月已还总金额
          totalRepayedPerMouAi += repayPerMouAi;
  
          // 等额本金第(i+1)个月若提前还款实际支付
          const totalRepayPerMouAi = balancePerMouAi + totalRepayedPerMouAi;
  
          // 拼接等额本息数组，包括各月份需还利息、本金及剩余待还本金
          this.repayPerMouObj.repayPerMouObjAi.repayInterestPerMouArrAi.push(this.formatFloat(repayInterestPerMouAi, 2));
          this.repayPerMouObj.repayPerMouObjAi.repayPrincipalPerMouArrAi.push(this.formatFloat(repayPrincipalPerMouAi, 2));
          this.repayPerMouObj.repayPerMouObjAi.balanceArrAi.push(this.formatFloat(balancePerMouAi, 2));
          this.repayPerMouObj.repayPerMouObjAi.totalRepayedArrAi.push(this.formatFloat(totalRepayedPerMouAi, 2));
          this.repayPerMouObj.repayPerMouObjAi.totalRepayPerMouArrAi.push(this.formatFloat(totalRepayPerMouAi, 2));
  
          // 等额本金第(i+1)个月需还利息
          const repayInterestPerMouAp = loanTotal * interestRatePerMou * (1 - ((i - 1) / totalMouths));
  
          // 等额本金第(i+1)个月还本带息
          const repayPerMouPriceAp = repayPrincipalPerMouAp + repayInterestPerMouAp;
  
          // 等额本金第(i+1)个月剩余待还本金
          balancePerMouAp -= repayPrincipalPerMouAp;
  
          // 等额本金第(i+1)个月总还本带息
          totalRepayedPerMouAp += repayPerMouPriceAp;
  
          // 等额本金第(i+1)个月若提前还款实际支付
          const totalRepayPerMouAp = balancePerMouAp + totalRepayedPerMouAp;
  
          // 拼接等额本金数组，包括各月份需还利息、本金及剩余待还本金
          this.repayPerMouObj.repayPerMouObjAp.repayInterestPerMouArrAp.push(this.formatFloat(repayInterestPerMouAp, 2));
          this.repayPerMouObj.repayPerMouObjAp.repayPerMouPriceArrAp.push(this.formatFloat(repayPerMouPriceAp, 2));
          this.repayPerMouObj.repayPerMouObjAp.balanceArrAp.push(this.formatFloat(balancePerMouAp, 2));
          this.repayPerMouObj.repayPerMouObjAp.totalRepayedArrAp.push(this.formatFloat(totalRepayedPerMouAp, 2));
          this.repayPerMouObj.repayPerMouObjAp.totalRepayPerMouArrAp.push(this.formatFloat(totalRepayPerMouAp, 2));
        }
        console.log(this.repayPerMouObj);

        // 等额本金总还款金额（直接从等额本金数组中获取）
        const totalRepayPriceAp = this.repayPerMouObj.repayPerMouObjAp.totalRepayedArrAp[this.repayPerMouObj.repayPerMouObjAp.totalRepayedArrAp.length - 1];

        // 等额本金总还款利息： 总还本带息 - 总贷款额
        const totalInterestAp = totalRepayPriceAp - loanTotal;

        // 向父组件发送数据
        // TODO：如果子组件需要向父组件传很多值怎么办？
        const toFatherInfo = {
          repayPerMouObj: this.repayPerMouObj,
          loanTotal: this.formatFloat(loanTotal, 2),
          totalRepayPriceAp: this.formatFloat(totalRepayPriceAp, 2),
          totalInterestAp: this.formatFloat(totalInterestAp, 2),
          decreasePerMouAp: this.formatFloat(decreasePerMouAp, 2),
        };
        this.$emit('repayPerMouObjEve', toFatherInfo);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .raw-data {
    // width: 100%;
  }
</style>