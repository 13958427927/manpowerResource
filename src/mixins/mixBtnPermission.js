export default {
  // 可以写Vue里的选项 data methods computed watch
  computed: {
    ishasPermission() {
      return function(permissionID) {
        return !this.$store.state.user.userInfo.roles.points.includes(permissionID)
      }
    }
  }
}
