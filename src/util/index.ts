import userAgent from "./user-agent"

export default {
  async delay(ms: number): Promise<void> {
    return await new Promise(resolve => {
      window.setTimeout(() => {
        resolve()
      }, ms)
    })
  },
  userAgent
}