<template>
  <icon-font
    :type="type"
    :style="{ fontSize: fontSize, color: color }"></icon-font>
</template>

<script>
  const Icon = antd.Icon
  const scriptUrl = '//at.alicdn.com/t/font_1722969_0qfwcko2z4bi.js'
  const IconFont = Icon.createFromIconfontCN({
    scriptUrl: scriptUrl,
  });

  export default {
    components: {
      IconFont
    },
    props: {
      type: {
        type: String,
        required: true
      },
      fontSize: String,
      color: String
    }
  }
</script>

<style lang="scss" scoped>

</style>
