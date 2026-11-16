export const navigate = (pathname: string): void => {
  window.history.pushState(null, '', pathname);
  // Роутер подписан на popstate, а pushState сам это событие не создаёт
  window.dispatchEvent(new PopStateEvent('popstate'));
};
