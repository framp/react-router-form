'use strict';

var getFormData = require('get-form-data')
var React = require('react')
var assign = require('react/lib/Object.assign')

/**
 * <Form> components are used to create a <form> element that submits its input
 * data to a route.
 *
 * For example, assuming you have the following route:
 *
 *   <Route name="addPost" path="/topics/:topicID/addPost" handler={AddPost}/>
 *
 * You could use the following component to submit a form's input data to that
 * route:
 *
 *   <Form to="addPost" params={{ topicID: "123" }}>
 */
var Form = React.createClass({

  displayName: 'Form',

  contextTypes: {
    router: React.PropTypes.func
  },

  propTypes: {
    component: React.PropTypes.any,
    to: React.PropTypes.string.isRequired,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    onSubmit: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      component: 'form',
      method: 'GET'
    }
  },

  handleSubmit: function(event) {
    var formData = getFormData(event.target)
    var allowTransition = true
    var submitResult

    if (this.props.onSubmit) {
      submitResult = this.props.onSubmit(event, formData)
    }

    if (submitResult === false || event.defaultPrevented === true) {
      allowTransition = false
    }

    event.preventDefault()

    if (allowTransition) {
      if (this.props.method === 'GET') {
        // GET submissions use the query string, so just marge form data into it
        this.context.router.transitionTo(
          this.props.to,
          this.props.params,
          assign({}, this.props.query, formData)
        )
      }
      else {
        // HACK - add data to the query string along with a dummy method indicator
        this.context.router.transitionTo(
          this.props.to,
          this.props.params,
          assign({}, this.props.query, formData, {_method: this.props.method})
        )
      }
    }
  },

  /**
   * Returns the value of the "action" attribute to use on the DOM element.
   */
  getAction: function() {
    return this.context.router.makeHref(this.props.to, this.props.params, this.props.query)
  },

  render: function() {
    var props = assign({}, this.props, {
      action: this.getAction(),
      onSubmit: this.handleSubmit
    })

    return React.createElement(this.props.component, props, this.props.children)
  }
})

module.exports = Form