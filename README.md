## Use case

Small React component which allows to dynamic change pages

## Instaling

```npm
  npm i react-router
```

## Usage

### Initializing

```JS
    import { lazy } from "react";
    import Router, { A } from "Router"

    // We suggest to import lazy components
    const Component1 = lazy(() => import("./Component1/Component1 "));

    const Component2 = lazy(() => import("./Component2/Component2"));

    const ComponentNotFound = lazy(() => import("./ComponentNotFound/ComponentNotFound"));

    const routing = [
        {
            component: Component1,
            route: "/", // Default (home)
        },
        {
            component: Component2,
            route: "/shop",
        },
        {
            component: ComponentNotFound,
            route: "/404", // When URL doesnt match any route
        },
    ];

    const App = () => {
        return (
            <div className="app">
                <div className="navigation">
                    <A href="/Component1">Component1</A> {/* <- Imported anchor element. Remember to use "/" (slash symbol) */}
                    <A href="/Component2">Component2</A>
                </div>
                <Router routing={routing}></Router>
            </div>
        );
    };
```

And that's it
