<template>
  <div class="average-capital">
    <SideMenu></SideMenu>
    <div main>
      <RawData mes-father="message from father" @repayPerMouObjEve="getRepayPerMouObj"></RawData>
      <div main-result>
        <p>
          <span class="category">贷款总额：</span><span class="output-numb total-loan">{{loanTotal}}</span>元
        </p>
        <p>
          <span class="category">支付利息：</span><span class="output-numb total-interest-ap">{{totalInterestAp}}</span>元
        </p>
        <p>
          <span class="category">还款总额：</span><span class="output-numb total-repay-ap">{{totalRepayPriceAp}}</span>元
        </p>
        <p>
          <span class="category">月供：</span>第一个月还款<span class="output-numb repay-per-mouth-ap">{{repayPerMouthAp}}</span>元，后逐月递减<span class="output-numb decrease-per-mouth-ap">{{decreasePerMouAp}}</span>元
        </p>
        <button class="detail-btn" @click="displayDetail()">展示明细</button>
        <button class="hide-detail-btn">隐藏明细</button>
      </div>
      <table>
        <thead></thead>
      </table>
    </div>
  </div>
</template>
<script>
  import SideMenu from './SideMenu';
  import RawData from './RawData';

  export default {
    name: 'averageCapital',
    components: {
      SideMenu,
      RawData,
    },
    data() {
      return {
        repayPerMouObj: null,
        loanTotal: 0,
        totalInterestAp: 0,
        totalRepayPriceAp: 0,
        repayPerMouthAp: 0,
        decreasePerMouAp: 0,
      };
    },
    methods: {
      getRepayPerMouObj(childInfo) {
        this.repayPerMouObj = childInfo.repayPerMouObj;
        this.loanTotal = childInfo.loanTotal;
        this.totalInterestAp = childInfo.totalInterestAp;
        this.totalRepayPriceAp = childInfo.totalRepayPriceAp;
        this.repayPerMouthAp = childInfo.repayPerMouthAp;
        this.decreasePerMouAp = childInfo.decreasePerMouAp;
        console.log(childInfo);
      },
      displayDetail() {
        console.log(111, this.repayPerMouObj);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .average-capital {
    display: flex;
    .main {
      display: flex;
      flex-direction: column;
    }
  }
</style>
