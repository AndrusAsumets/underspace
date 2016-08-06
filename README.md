# underspace


###underspace is a proof of concept demo, which allows for dynamically injecting React components into DOM by writing nothing but pure HTML. In another words, WordPress on React.


##installation:
`npm install`

##run:
`npm run serve`
`npm run watch`

##for building components:
`webpack {{component_name}}`

###Essentially what it does is underspace.min.js looks for all the data attributes containing 'component' in HTML, then queries back-end for the component. Since component has been exposed as global variable in the window scope by webpack, it can now be accessed from there and initiated. After initiation, the component will be injected into React's state, and then added to the DOM element which contained the initial 'component' attribute.


Further goals:
* Implement a process in webpack that splits up files required by component into a single folder by just hash name, so multiple components containing same files would not be included.
* Implement recursion, so components could be injected into components.
