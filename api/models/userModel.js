'use strict'

var _       = require('lodash');
var uuidv1  = require('uuid/v1');

var User =  function (_node) {    
  _.extend(this, _node.properties);

  console.log('Model: ', _node);
  if(this.createdDate) {
    this.createdDate = new Date(this.createdDate.toString());
  }
  if(this.updatedDate) {
    this.updatedDate = new Date(this.updatedDate.toString());
  }
  if(this.id){
    this.id = uuidv1();
  }
};
module.exports = User;
