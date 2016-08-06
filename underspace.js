import React from 'react'
import ReactDOM from 'react-dom'

//create react root
let underspace = document.createElement('div')
underspace.id = 'underspace'
document.getElementsByTagName('body')[0].appendChild(underspace)

var App = React.createClass({
    getInitialState() {
        return { elements: [], components: {} }
    },
    componentWillMount() {
        const DELAY = 50
        var self = this
        let { elements, components } = this.state
        let tree = document.querySelectorAll('[component]')

        tree = [].slice.call(tree)
        tree.forEach(function(branch) {
            const component = branch.getAttribute('component')

            async function load(component, branch) {
                if (!window[component]) {
                    window[component] = 'fetching'
                    const res = await fetch('/components/' + component)
                    const text = await res.text()
                    new Function(text)()
                    elements.push({ component: component, branch: branch })
                    components[component] = window[component].default
                    self.setState({ elements: elements, component: components })
                }

                else if (window[component] === 'fetching') {
                    setTimeout(function() {
                        load(component, branch)
                    }, DELAY)
                }

                else if (window[component].default) {
                    elements.push({ component: component, branch: branch })
                    self.setState({ elements: elements })
                }
            }

            load(component, branch)
        })
    },
    render() {
        const { elements, components } = this.state

        return (
            <div className="root">
                {[...elements].map((element, i) =>
                     <Display key={ i } component={ components[element.component] } branch={ element.branch } />
                )}
            </div>
        )
    }
})

var Display = React.createClass({
    render() {
        return (
            <Escape branch={ this.props.branch }>
                <this.props.component />
            </Escape>
        )
    }
})

ReactDOM.render(
    <App />,
    document.getElementById('underspace')
)

var Escape = React.createClass({
    render: function() {
        this._nodes = this.props.children

        return <noscript ref="from"/>
    },
    componentDidMount: function() {
        this.escapePoint = this.refs.from.parentNode

        ReactDOM.render(
            this._nodes,
            this.props.branch)
    },
    componentDidUpdate: function() {
        ReactDOM.render(
            this._nodes,
            this.props.branch)
    },
    componentWillUnmount: function() {
        this.escapePoint = undefined
        ReactDOM.unmountComponentAtNode(this.props.branch)
    },
});
