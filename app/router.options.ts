import type { RouterOptions } from "@nuxt/schema";

export default <RouterOptions> {
  scrollBehavior(to, _from, savedPosition) {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve({ ...savedPosition, behavior: "smooth" })
        } else {
          if (to.hash) {
            resolve({
              el: to.hash,
              top: 0,
              behavior: "smooth"
            })
          } else {
            resolve({ top: 0, behavior: "smooth" })
          }
        }
      }, 100)
    })
  }
}