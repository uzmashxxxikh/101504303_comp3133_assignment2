import { inject } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../environments/environment';

export function apolloProviders() {
  return [
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      
      return {
        link: httpLink.create({
          uri: environment.graphqlEndpoint
        }),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'network-only'
          },
          query: {
            fetchPolicy: 'network-only'
          }
        }
      };
    })
  ];
}
