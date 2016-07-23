import React from 'react'
import ReactDOM from 'react-dom'
var assign = require('object-assign');

var App = React.createClass({
    getInitialState() {
        return { elements: [], components: {} }
    },
    componentWillMount() {
        const DELAY = 50
        var self = this
        let { elements, components } = this.state
        let tree = document.querySelectorAll('[u-component]')

        tree = [].slice.call(tree)
        tree.forEach(function(branch) {
            const component = branch.getAttribute('u-component')
            const id = branch.id

            async function load(component, id) {
                if (!window[component]) {
                    window[component] = 'fetching'
                    const res = await fetch('/components/' + component)
                    const text = await res.text()
                    new Function(text)()
                    elements.push({ component: component, id: id })
                    components[component] = window[component].default
                    self.setState({ elements: elements, component: components })
                }

                else if (window[component] === 'fetching') {
                    setTimeout(function() {
                        load(component, id)
                    }, DELAY)
                }

                else if (window[component].default) {
                    elements.push({ component: component, id: id })
                    self.setState({ elements: elements })
                }
            }

            load(component, id)
        })
    },
    render() {
        const { elements, components } = this.state

        return (
            <div className="root">
                {[...elements].map((element, i) =>
                     <Display key={ i } component={ components[element.component] } id={ element.id } />
                )}
            </div>
        )
    }
})

var Display = React.createClass({
    render() {
        return (
            <Escape id={ this.props.id }>
                <this.props.component />
            </Escape>
        )
    }
})

ReactDOM.render(
    <App />,
    document.getElementById('app')
)

var Escape = React.createClass({
    render: function() {
        this._nodes = this.renderLayer()
        return <noscript ref="from"/>
    },
    renderLayer: function() {
        var { ...props } = this.props
        return <div {...props}>
                {this.props.children}
            </div>
    },
    componentDidMount: function() {
        const { id } = this.props
        this.escapePoint = this.refs.from.parentNode
        var layer = document.createElement('div')
        var parent = document.getElementById(id)
        parent.appendChild(layer);
        this._layer = layer
        ReactDOM.render(
            this._nodes,
            this._layer)
    },
    componentDidUpdate: function() {
        ReactDOM.render(
            this._nodes,
            this._layer)
    },
    componentWillUnmount: function() {
        this.escapePoint = undefined
        ReactDOM.unmountComponentAtNode(this._layer)
        this._layer.parentNode.removeChild(this._layer)
        this._layer = null
    },
});
