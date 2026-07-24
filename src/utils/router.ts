

import { authService } from './auth';

type PageLoader = () => Promise<unknown>;

interface Route {
  path: string;
  loader: PageLoader;
  protected: boolean; 
}


const allRoutes: Route[] = [
  {
    path: '/',
    loader: () => import('../pages/Chat/Chat.ts'),
    protected: true,
  },
  {
    path: '/login',
    loader: () => import('../pages/Login/Login.ts'),
    protected: false,
  },
  {
    path: '/sign-up',
    loader: () => import('../pages/Register/Register.ts'),
    protected: false,
  },
  {
    path: '/profile',
    loader: () => import('../pages/Profile/Profile.ts'),
    protected: true,
  },
  {
    path: '/404',
    loader: () => import('../pages/NotFound/NotFound.ts'),
    protected: false,
  },
  {
    path: '/500',
    loader: () => import('../pages/NotFound/NotFound.ts'),
    protected: false,
  },
];


export async function navigate(pathname: string): Promise<void> {
  const route = allRoutes.find((r) => r.path === pathname);

  
  if (!route) {
    history.replaceState(null, '', '/404');
    const notFoundRoute = allRoutes.find((r) => r.path === '/404')!;
    await notFoundRoute.loader();
    return;
  }

  
  if (route.protected && !authService.isAuthenticated()) {
    history.replaceState(null, '', '/login');
    const loginRoute = allRoutes.find((r) => r.path === '/login')!;
    await loginRoute.loader();
    return;
  }

  
  await route.loader();
}


export function getRoutes(): Route[] {
  return allRoutes;
}
