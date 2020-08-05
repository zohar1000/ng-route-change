# ng-route-change
An angular directive which makes it easy to get route data.<br/>
There is no need to subscribe to the router, the directive calls a component function with the route data, the function is called upon component initialization and whenever the route changes.

The route data is an object containing 2 properties:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;state: the current route state (url, params, query params)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;changes: the changes made to the params and query params from the previous route
<br/>  

For example, when a route user/:id changes from user/12 to user/13 then our component function will be called with this object:
```
{
    state: {
        url: 'user/13',
        params: {
            id: 13
        }
    },
    changes: {
        params: {
            id: { value: 13, oldValue: 12 }
        }
    }
```

# 
#### Placing the directive
Place the directive on any template element or in \<ng-container\> and pass it an object.<br/>
Pass your component function to the 'handler' property, leave the second property host:this as is.
```
<ng-container [NgRouteChange]="{ handler: onRouteChange, host: this }"></ng-container>
```
The directive will invoke the function with an object of type RouteChangeData, see below for details.<br/>
# 
#### More examples
An example containing params and query params for a route configured as :categoryId/:productId.<br/>
Navigating from 100/23?name=doll to 170/28?name=brush.
```
{
    state: {
        url: '170/28?name=brush',
        params: {
            categoryId: 170,
            productId: 28
        },
        queryParams: {
            name: 'brush'
        }
    },
    changes: {
        params: {
            categoryId: { value: 170, oldValue: 100 },
            productId: { value: 23, oldValue: 28 }
        },
        queryParams: {
            name: { value: 'brush', oldValue: 'doll' }
        }
    }
}
```
note that when the value is all digits it is returned as an integer.
<br/>

An example of switching between one route to another.<br/>
Navigating from route configured :categoryId/:productId as 100/23 to route configured user/:id as user/13
```
{
    state: {
        url: 'user/13',
        params: {
            id: 13
        }
    },
    changes: {
        params: {
            categoryId: { oldValue: 100 },
            productId: { oldValue: 23 },
            id: { value: 13 }
        }
    }
}
```
# 
#### RouteChangeData
The component function is called with a single parameter having the interface RouteChangeData:
```
import { RouteChangeData } from 'ng-route-change';

onRouteChange(data: RouteChangeData) {
    // ...
}
```

<br/>An explanation of RouteChangeData properties:
```
{
    /*******************************************************************************************************************/
    /*   the 'status' property contains the current values.                                                            */
    /*******************************************************************************************************************/    
    state: {
      url   // the url to navigate to 
      urlAfterRedirects   // if the route config has 'redirectTo', the value is the redirected path
      routeConfigPath   // the route configuration, for example 'todo/:id'
      params   // an objects conatining the params (from the route config) as keys and their values
      queryParams   // an objects conatining the query params (from the url) as keys and their values
    },

    /*******************************************************************************************************************/
    /*   the 'changes' property contains the current values and the previous values.                                   */
    /*   for example, productId: { value: 120, oldValue: 130 }                                                         */
    /*   if the current route does not have :prodctId in its config then the 'value' property will be omitted.         */
    /*   if the previous route did not have :prodctId in its config then the 'oldValue' property will be omitted.      */
    /*******************************************************************************************************************/
    changes: {   
      params   // an objects conatining the params
      queryParams   // an objects conatining the query params
    }
}
```
# 
#### How the directive works
The package contains a service which is provided in the root, this service listens to the router events and saves the
route data.<br/>

The data is shared between all NgRouteChange directives in the app. so for a matter of efficiency, it doesn't matter 
if the app contains a single directive or multiple directives.<br/>

Each directive subscribes to the service on initiation, and unsubscribes on destroy.<br/>
The service emits the data to the directive whenever a route changes, the directive then calls the component function passing it the data.<br/>

In this way the component itself does not need to subscribe/unsubscribe to the router or router events, it receives the data
passively with only the data usually needed.

# 
#### A word of advice
It is recommended to use a meaningful param names on the route config.<br/>
For example, using user/:userId over user/:id may prevents conflicts in the RouteChangeData 'changes' property where other 
route configs use :id as well. 
