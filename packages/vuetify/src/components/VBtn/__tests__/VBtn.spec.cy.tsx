/// <reference types="../../../../types/cypress" />

import { VBtn } from '../VBtn'
import { generate } from '@/../cypress/templates'

const loadingText = 'Loading'
const anchor = {
  href: '#my-anchor',
  hash: 'my-anchor',
}

// TODO: generate these from types
const colors = ['success', 'info', 'warning', 'error', 'invalid']
const sizes = ['x-small', 'small', 'default', 'large', 'x-large'] as const
const densities = ['default', 'comfortable', 'compact'] as const
const variants = ['contained', 'outlined', 'plain', 'text', 'contained-text']
const props = {
  color: colors,
  variant: variants,
  disabled: false,
  // loading: false,
}

const stories = {
  'Default button': <VBtn>Basic button</VBtn>,
  'Small success button': <VBtn color="success" size="small">Completed!</VBtn>,
  'Large, plain button w/ error': <VBtn color="error" variant="plain" size="large">Whoops</VBtn>,
  // 'Loading button': <VBtn loading v-slots={ { loader: <span>Loading...</span> } }></VBtn>,
  Icon: <VBtn icon="mdi-vuetify" color="pink"></VBtn>,
  'Density + size': (
    <div class="d-flex flex-column" style="gap: 0.4rem">
      { densities.map(density => (
        <>
          <h5>{ density }</h5>
          <div class="d-flex" style="gap: 0.8rem">
            { sizes.map(size => <VBtn size={ size } density={ density }>{ size }</VBtn>) }
          </div>
        </>
      )) }
    </div>
  ),
}

// Actual tests
describe('VBtn', () => {
  describe('color', () => {
    it('supports default color props', () => {
      cy.mount(() => (
        <>
          {colors.map(color => (
            <VBtn color={ color } class="text-capitalize">
              { color } button
            </VBtn>
          )) }
        </>
      ))
        .get('button')
        .should('have.length', colors.length)
        .then(subjects => {
          Array.from(subjects).forEach((subject, idx) => {
            expect(subject).to.contain(colors[idx])
          })
        })
    })
  })

  describe('icons', () => {
    it('adds the icon class when true', () => {
      cy.mount(<VBtn icon></VBtn>)
        .get('button')
        .should('have.class', 'v-btn--icon')
    })

    it('renders an icon inside', () => {
      // TODO: Render VIcon instead of emoji
      cy.mount(<VBtn icon><span style="font-size: 1.5rem;">🐻</span></VBtn>)
        .get('button')
        .should('have.text', '🐻')
    })
  })

  describe('plain', () => {
    it('should have the plain class when variant is plain', () => {
      cy.mount(<VBtn variant="plain">Plain</VBtn>)
        .get('button')
        .should('have.class', 'v-btn--variant-plain')
    })
  })

  describe('tag', () => {
    it('renders the proper tag instead of a button', () => {
      cy.mount(<VBtn tag="custom-tag">Click me</VBtn>)
        .get('button')
        .should('not.exist')
        .get('custom-tag')
        .should('have.text', 'Click me')
    })
  })

  describe('elevation', () => {
    it('should have the correct elevation', () => {
      cy.mount(<VBtn elevation={ 24 } />)
        .get('button')
        .should('have.class', 'elevation-24')
    })
  })

  describe('events', () => {
    it('emits native click events', () => {
      const click = cy.stub().as('click')
      cy.mount(<VBtn onClick={ click }>Click me</VBtn>)
        .get('button')
        .click()
        .get('@click')
        .should('have.been.called', 1)
        .setProps({ href: undefined, to: '#my-anchor' })
        .get('@click')
        .should('have.been.called', 2)
    })

    // Pending test, is "toggle" even going to be emitted anymore?
    it.skip('emits toggle when used within a button group', () => {
      // const register = jest.fn()
      // const unregister = jest.fn()
      // const toggle = jest.fn()
      // const wrapper = mountFunction({
      //   provide: {
      //     btnToggle: { register, unregister },
      //   },
      //   methods: { toggle },
      // })

      // wrapper.trigger('click')
      // expect(toggle).toHaveBeenCalled()
    })
  })

  // These tests were copied over from the previous Jest tests,
  // but they are breaking because the features have not been implemented

  describe.skip('disabled', () => {
    // The actual behavior here is working, but the color class name isn't being removed
    // We can _technically_ test that the background is NOT the color's background,
    // but it's a bit brittle and I think it'll be better to check against the class name
    it('should not add color classes if disabled', () => {
      cy.mount(<VBtn color="success" disabled></VBtn>)
        .get('button')
        .should('have.class', 'bg-success')
        .get('button')
        .should('have.class', 'v-btn--disabled')
        .should('not.have.class', 'bg-success')
    })
  })

  describe.skip('activeClass', () => {
    it('should use custom active-class', () => {
      cy.mount(<VBtn activeClass="my-active-class">Active Class</VBtn>)
        .get('.my-active-class')
        .should('exist')
    })
  })

  describe.skip('loading', () => {
    it('when using the loader slot, do not show the progress indicator', () => {
      cy.mount(() => (
        <VBtn loading v-slots={ { loader: () => <span>{ loadingText }</span> } } />
      ))
        .get('button')
        .should('contain.text', loadingText)
        .get('role[progressbar]')
        .should('not.exist')
    })

    // custom loaders are not yet implemented
    it('when loading is true, show the progress indicator', () => {
      cy.mount(<VBtn loading>{ loadingText }</VBtn>)
        .get('button')
        .should('contain.text', loadingText)
        .get('role[progressbar]')
        .should('be.visible')
    })
  })

  // v-btn--tile isn't implemented at all
  describe.skip('tile', () => {
    it('applies the tile class when true', () => {
      cy.mount(<VBtn tile />)
        .get('button')
        .should('contain.class', 'v-btn--tile')
    })

    it('does not apply the tile class when false', () => {
      cy.mount(<VBtn tile={ false } />)
        .get('button')
        .should('not.contain.class', 'v-btn--tile')
    })
  })

  describe('href', () => {
    it('should render an <a> tag when using href prop', () => {
      cy.mount(<VBtn href={ anchor.href }>Click me</VBtn>)
        .get('.v-btn')
        .click()
        .get('a') // currently not rendering the <a> tag at all
        .should('contain.text', 'Click me')
        .should('have.focus')
        .hash()
        .should('contain', anchor.hash)
    })
  })

  describe.skip('value', () => {
    // none of the "value" props are implemented yet
    it('should stringify non string|number values', () => {
      const objectValue = { value: { hello: 'world' } }
      const numberValue = { value: 2 }

      cy.mount(<VBtn value={ objectValue }></VBtn>)
        .get('button')
        .should('contain.text', JSON.stringify(objectValue, null, 0))
        .mount(<VBtn value={ numberValue } />)
        .get('button')
        .should('contain.text', numberValue.value)
    })
  })

  describe('Reactivity', () => {
    // tile is not implemented.
    it.skip('tile', () => {
      cy.mount(<VBtn tile>My button</VBtn>)
        .get('button')
        .should('contain.class', 'v-btn--tile')
        .setProps({ tile: false })
        .should('not.contain.class', 'v-btn--tile')
    })

    it('disabled', () => {
      cy.mount(<VBtn color="success" disabled></VBtn>)
        .get('button')
        .should('have.class', 'v-btn--disabled')
        .setProps({ disabled: false })
        .get('button')
        .should('not.have.class', 'v-btn--disabled')
    })

    it('activeClass', () => {
      cy.mount(<VBtn activeClass="my-active-class">Active Class</VBtn>)
        .setProps({ activeClass: 'different-class' })
        .get('.different-class')
        .should('not.exist')
    })

    it('plain', () => {
      cy.mount(<VBtn variant="plain">Plain</VBtn>)
        .get('button')
        .should('have.class', 'v-btn--variant-plain')
        .setProps({ variant: 'default' })
        .get('button')
        .should('not.have.class', 'v-btn--variant-plain')
    })
  })

  describe('Showcase', { viewportHeight: 1130, viewportWidth: 700 }, () => {
    generate({ stories, props, component: VBtn })
  })
})
