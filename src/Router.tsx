import { signal } from "@preact/signals-react";
import React, { AnchorHTMLAttributes, LazyExoticComponent, ReactElement, Suspense, useEffect, useLayoutEffect, useState } from "react";

type componentType = LazyExoticComponent<() => JSX.Element> | (() => JSX.Element);

const currentRouteSignal = signal<string>(window.location.href)!;

export const getCurrentRoute = () => {
  // Forcing rerender
  currentRouteSignal.value;

  const currentUrlPath = `/${window.location.href
    .split("?")[0]
    .split("/")
    .slice(3)
    .map((path, index, array) => (index < array.length - 1 ? path : path !== "" ? path : undefined))
    .filter((path) => path !== undefined)
    .join("/")}`;

  return currentUrlPath;
};

export const changeRoute = (route: string) => {
  const currentRoute = getCurrentRoute();
  const newRoute = `${window.location.origin}${route}`;

  if (route !== currentRoute) {
    history.pushState({ route: route }, "", new URL(newRoute));
    currentRouteSignal.value = newRoute;
  }
};

const findPageElement = (
  router: {
    component: componentType;
    route: string;
  }[]
) => {
  const currentRoute = getCurrentRoute();

  const foundRoute = router.find((routeData) => routeData.route === currentRoute);

  if (foundRoute) {
    return foundRoute.component;
  } else {
    const foundRoute = router.find((routeData) => routeData.route === "/404")!;
    changeRoute("/404");
    return foundRoute.component;
  }
};

interface aProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  chlidren?: ReactElement;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
}

export const A = ({ href, children, onClick, ...rest }: aProps) => {
  return (
    <a
      href={href}
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        if (onClick) {
          onClick(event);
        }
        changeRoute(href);
      }}>
      {children}
    </a>
  );
};

interface routerProps {
  routing: {
    component: componentType;
    route: string;
  }[];
}

const Router = ({ routing }: routerProps) => {
  const [currentRoute, setCurrentRoute] = useState<componentType>(() => findPageElement(routing));

  useLayoutEffect(() => {
    setCurrentRoute(() => findPageElement(routing));
  }, [currentRouteSignal.value]);

  useEffect(() => {
    const listenerCallback = () => {
      currentRouteSignal.value = window.location.href;
    };
    window.addEventListener("popstate", listenerCallback);

    return () => {
      window.removeEventListener("popstate", listenerCallback);
    };
  }, []);

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
    });
  }, [currentRouteSignal.value]);

  if (currentRoute) {
    const CurrentRoute = currentRoute;

    return <Suspense>{<CurrentRoute></CurrentRoute>}</Suspense>;
  } else {
    <></>;
  }
};

export default Router;
