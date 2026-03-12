const defaultColors = {
  primary: 'green',
  neutral: 'slate'
}
const nomnomColors = {
  primary: 'nomnom-main',
  secondary: 'nomnom-accent',
  neutral: 'nomnom-background',
}

export default defineAppConfig({
  ui: {
    colors: {
      //...defaultColors,
      ...nomnomColors
    },
    container: {
      base: 'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8'
    }
  }
})
