type NavigateHandler = (to: string) => void | Promise<unknown>

let navigateHandler: NavigateHandler | null = null

export function registerNavigator(handler: NavigateHandler) {
  navigateHandler = handler
}

export function navigateTo(to: string) {
  return navigateHandler?.(to)
}
