/* eslint-env jest */

// Doc: https://github.com/moll/js-must/blob/master/doc/API.md#must
import expect from 'must'

// ===================================================================

import {getConnection, getMainConnection} from './util.js'
import {map} from 'lodash'

// ===================================================================

describe('token', () => {
  let xo
  let tokens = []
  beforeAll(async () => {
    xo = await getMainConnection()
  })

  afterAll(async () => {
    await Promise.all(map(
      tokens,
      token => xo.call('token.delete', {token})
    ))
  })

  async function createToken () {
    const token = await xo.call('token.create')
    tokens.push(token)
    return token
  }

  // =================================================================

  describe('.create()', () => {
    it('creates a token string which can be used to sign in', async () => {
      const token = await createToken()

      await getConnection({credentials: {token}})
    })
  })

  // -------------------------------------------------------------------

  describe('.delete()', () => {
    it('deletes a token', async () => {
      const token = await createToken()
      const xo2 = await getConnection({credentials: {token}})

      await xo2.call('token.delete', {
        token
      })

      await getConnection({credentials: {token}}).then(
        () => {
          throw new Error('xo2.signIn should have thrown')
        },
        function (error) {
          expect(error.code).to.be.eql(3)
        })
    })
  })
})
