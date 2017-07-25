<template>
  <div class="average-capital">
    <SideMenu></SideMenu>
    <div main>
      <RawData mes-father="message from father" @repayPerMouObj="getRepayPerMouObj"></RawData>
      <div main-result>
        <p>
          <span class="category">贷款总额：</span><span class="output-numb total-loan">0</span>元
        </p>
        <p>
          <span class="category">支付利息：</span><span class="output-numb total-interest-ap">0</span>元
        </p>
        <p>
          <span class="category">还款总额：</span><span class="output-numb total-repay-ap">0</span>元
        </p>
        <p>
          <span class="category">月供：</span>第一个月还款<span class="output-numb repay-per-mouth-ap">0</span>元，后逐月递减<span class="output-numb decrease-per-mouth-ap">0</span>元
        </p>
        <button class="detail-btn" @click="displayDetail()">展示明细</button>
        <button class="hide-detail-btn">隐藏明细</button>
        <p>{{ testData }}</p>
        <input type="text" v-model="testData">
      </div>
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
        testData: 'anything',
        repayPerMouObj: null,
      };
    },
    methods: {
      getRepayPerMouObj(data) {
        this.repayPerMouObj = data;
        console.log(data);
      },
      displayDetail() {
        console.log(this.repayPerMouObj);
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
