<template>
  <div class="footer-container">
    <div class="first-line">
      <router-link to="/" class="link">
        版权所有 © 2019-{{currentYear}} {{userInfo.logoName}}
      </router-link>
      <div>| 网站由 React+Node+Ant Desgin驱动</div>
    </div>
    <div class="second-line">
      <img :src="govImage" alt="政府图标" />
      <a
        class="link"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402003243"
        target="_blank">
        粤公网安备 44030402003243号
      </a>
      |
      <a
        class="link"
        href="http://www.beian.miit.gov.cn/"
        target="_blank">
        粤ICP备 19089643 号
      </a>
    </div>
  </div>
</template>

<script>
import govImage from '../assets/images/gov.png'

export default {
  props: {
    userInfo: Object
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      govImage
    }
  },
}
</script>

<style lang="scss" scoped>
.footer-container {
  text-align: center;
  padding-bottom: 2rem;
  .first-line {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #444444;
    font-size: .9rem;
    margin-bottom: .5rem;
  }
  .link {
    color: #444444;
    margin-left: .25rem;
    margin-right: .25rem;
    &:hover {
      color: #40a9ff;
    }
    &:active {
      color: #096dd9;
    }
  }
  .second-line {
    display: flex;
    justify-content: center;
  }
}

</style>
