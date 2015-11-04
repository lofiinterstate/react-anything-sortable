/*eslint no-unused-expressions:0 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Sortable, {SortableItemMixin} from '../../src/index';
import DemoItem from '../../demo/DemoItem';
import triggerEvent from '../triggerEvent';
import spies from 'chai-spies';
import {moveX, moveY} from '../mouseMove';

chai.use(spies);


//Delay karma test execution
window.__karma__.loaded = () => {};

function init() {
  var link = document.createElement('link');
  link.href = 'base/demo/style.css';
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);

  var div = document.createElement('div');
  div.id = 'test-main';
  document.body.appendChild(div);

  link.onload = () => {
    window.__karma__.start();
  };
}

init();

const expect = chai.expect;


describe('Sortable', () => {
  describe('Default scenario', () => {
    beforeEach(() => {
      ReactDOM.render(<Sortable />, document.getElementById('test-main'));
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(document.getElementById('test-main'));
    });

    it('should render properly without any child', () => {
      var node = document.querySelector('.ui-sortable');
      expect(node).to.exist;
    });
  });

  describe('Provide sortable children', () => {
    beforeEach(() => {
      ReactDOM.render(
        <Sortable>
          <DemoItem sortData="1" key={1} />
          <DemoItem sortData="2" key={2} />
          <DemoItem sortData="3" key={3} />
        </Sortable>
      , document.getElementById('test-main'));
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(document.getElementById('test-main'));
    });

    it('should render 3 children', () => {
      var children = document.querySelectorAll('.ui-sortable-item');
      expect(children.length).to.equal(3);
    });
  });

  describe('Provide sortable child', () => {
    beforeEach(() => {
      ReactDOM.render(
        <Sortable>
          <DemoItem sortData="1" />
        </Sortable>
      , document.getElementById('test-main'));
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(document.getElementById('test-main'));
    });

    it('should render 1 child', () => {
      var children = document.querySelectorAll('.ui-sortable-item');
      expect(children.length).to.equal(1);
    });
  });

  describe('Provide sortable children with nulls', () => {
    beforeEach(() => {

      ReactDOM.render(
        <Sortable>
          {
            ['hello1', 'hello2', ''].map(function(name) {
              if (name) {
                return (<DemoItem sortData={name} />);
              }
              else {
                return null;
              }
            })
          }
        </Sortable>
      , document.getElementById('test-main'));
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(document.getElementById('test-main'));
    });

    it('should render 2 children', () => {
      var children = document.querySelectorAll('.ui-sortable-item');
      expect(children.length).to.equal(2);
    });
  });

  describe('Dragging children', () => {
    var component, target;

    beforeEach(() => {
      component = ReactDOM.render(
        <Sortable className="style-for-test">
          <DemoItem sortData="1" className="item-1" key={1}>1</DemoItem>
          <DemoItem sortData="2" className="item-2" key={2}>2</DemoItem>
          <DemoItem sortData="3" className="item-3" key={3}>3</DemoItem>
        </Sortable>
      , document.getElementById('test-main'));
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(document.getElementById('test-main'));
      component = null;
      target = null;
    });

    it('should add a dragging children', () => {
      target = document.querySelector('.ui-sortable-item');

      triggerEvent(target, 'mousedown', {
        clientX: 11,
        clientY: 11,
        offset: {
          left: 1,
          top: 1
        }
      });

      triggerEvent(target, 'mousemove');

      var children = ReactDOM.findDOMNode(component).querySelectorAll('.ui-sortable-item');
      expect(children.length).to.equal(4);
    });


    it('should switch position when dragging from left to right', () => {
      target = document.querySelector('.ui-sortable-item');
      moveX(target, 25, 210);

      var children = ReactDOM.findDOMNode(component).querySelectorAll('.ui-sortable-item');
      expect(children[children.length - 1].textContent).to.equal('1');
    });


    it('should switch position when dragging from right to left', () => {
      target = document.querySelector('.item-3');
      moveX(target, 210, 25);

      var children = ReactDOM.findDOMNode(component).querySelectorAll('.ui-sortable-item');
      expect(children[0].textContent).to.equal('3');
    });

    it('should remove dragging children when mouseup', () => {
      target = document.querySelector('.ui-sortable-item');

      triggerEvent(target, 'mousedown', {
        clientX: 11,
        clientY: 11,
        offset: {
          left: 1,
          top: 1
        }
      });

      triggerEvent(target, 'mouseup', {
        clientX: 50,
        clientY: 10
      });

      var children = ReactDOM.findDOMNode(component).querySelectorAll('.ui-sortable-item');
      expect(children.length).to.equal(3);
    });

    it('should NOT move item if there is no preceding mousedown event', () => {
      target = document.querySelector('.item-1');

      triggerEvent(target, 'mousedown', {
        clientX: 25,
        clientY: 11,
        offset: {
          left: 1,
          top: 1
        }
      });

      triggerEvent(target, 'mouseup', {
        clientX: 25,
        clientY: 11
      });

      triggerEvent(target, 'mousemove', {
        clientX: 26,
        clientY: 11
      });

      triggerEvent(target, 'mousemove', {
        clientX: 300,
        clientY: 20
      });

      target = document.querySelector('.ui-sortable-dragging');
      expect(target).to.not.exist;
    });
  });

  describe('Dragging children verically', () => {
    var component, target;

    beforeEach(() => {
      component = ReactDOM.render(
        <Sortable className="style-for-test full-width">
          <DemoItem sortData="1" className="item-1" key={1}>1</DemoItem>
          <DemoItem sortData="2" className="item-2" key={2}>2</DemoItem>
          <DemoItem sortData="3" className="item-3" key={3}>3</DemoItem>
        </Sortable>
      , document.getElementById('test-main'));
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(document.getElementById('test-main'));
      component = null;
      target = null;
    });


    it('should switch position when dragging from up to down', () => {
      target = document.querySelector('.ui-sortable-item');

      moveY(target, 25, 180);

      var children = ReactDOM.findDOMNode(component).querySelectorAll('.ui-sortable-item');
      expect(children[children.length - 1].textContent).to.equal('1');
    });


    it('should switch position when dragging from down to up', () => {
      target = document.querySelector('.item-3');
      moveY(target, 180, 25);

      var children = ReactDOM.findDOMNode(component).querySelectorAll('.ui-sortable-item');
      expect(children[0].textContent).to.equal('3');
    });

  });

  describe('onSort Props', () => {
    var callback;

    beforeEach(() => {
      callback = chai.spy();

      ReactDOM.render(
        <Sortable onSort={callback}>
          <DemoItem sortData="1" className="item-1" key={1}>1</DemoItem>
          <DemoItem sortData="2" className="item-2" key={2}>2</DemoItem>
          <DemoItem sortData="3" className="item-3" key={3}>3</DemoItem>
        </Sortable>
      , document.getElementById('test-main'));
    });

    afterEach(() => {
      ReactDOM.unmountComponentAtNode(document.getElementById('test-main'));
      callback = null;
    });

    it('should call onSort when a drag\'n\'drop finished', () => {
      var target = document.querySelector('.item-1');
      moveX(target, 25, 210);
      expect(callback).to.have.been.called.with(['2', '3', '1']);
    });

    it('should call onSort when a opposite drag\'n\'drop finished', () => {
      var target = document.querySelector('.item-3');
      moveX(target, 210, 25);
      expect(callback).to.have.been.called.with(['3', '1', '2']);
    });

    it('should call onSort anytime there is a mouseup fired', () => {
      var target = document.querySelector('.item-1');
      moveX(target, 25, 80);
      moveX(target, 80, 180);
      expect(callback).to.have.been.called.twice;
    });
  });
});
