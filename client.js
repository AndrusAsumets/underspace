import React from 'react'
import ReactDOM from 'react-dom'

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
            let component = branch.getAttribute('u-component')

            async function load(component) {
                if (!window[component]) {
                    window[component] = 'fetching'
                    const res = await fetch('/components/' + component)
                    const text = await res.text()
                    new Function(text)()
                    elements.push(component)
                    components[component] = window[component].default
                    self.setState({ elements: elements, component: components })
                }

                else if (window[component] === 'fetching') {
                    setTimeout(function() {
                        load(component)
                    }, DELAY)
                }

                else if (window[component].default) {
                    elements.push(component)
                    self.setState({ elements: elements })
                }
            }

            load(component)
        })
    },
    render() {
        const { elements, components } = this.state

        return (
            <div className="root">
                {[...elements].map((element, i) =>
                     <Display key={ i } component={ components[element] } />
                )}
            </div>
        )
    }
})

var Display = React.createClass({
    render() {
        return (
            <this.props.component />
        )
    }
})

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
