/* eslint-env jest */

// Doc: https://github.com/moll/js-must/blob/master/doc/API.md#must
import expect from 'must'

// ===================================================================

import {createUser, deleteUsers, getConnection, getMainConnection, getUser} from './util'

// ===================================================================

describe('user', () => {
  let xo
  let userIds = []

  beforeAll(async () => {
    xo = await getMainConnection()
  })

  afterEach(async () => {
    await deleteUsers(xo, userIds)
    userIds = []
  })

  // =================================================================

  describe('.create()', () => {
    it.only('creates an user and returns its id', async () => {
      const userId = await createUser(xo, userIds, {
        email: 'wayne@vates.fr',
        password: 'batman'})

      expect(userId).to.be.a.string()

      const user = await getUser(xo, userId)
      expect(user).to.be.eql({
        id: userId,
        email: 'wayne@vates.fr',
        groups: [],
        permission: 'none'
      })
    })

    it.skip('does not create two users with the same email', async () => {
      await createUser(xo, userIds, {
        email: 'wayne@vates.fr',
        password: 'batman'
      })

      await createUser(xo, userIds, {
        email: 'wayne@vates.fr',
        password: 'alfred'
      }).then(
        () => {
          throw new Error('createUser() should have thrown')
        },
        function (error) {
          expect(error.message).to.match(/duplicate user/i)
        }
      )
    })

    it('can set the user permission', async () => {
      const userId = await createUser(xo, userIds, {
        email: 'wayne@vates.fr',
        password: 'batman',
        permission: 'admin'
      })

      const user = await getUser(xo, userId)
      expect(user).to.be.eql({
        id: userId,
        email: 'wayne@vates.fr',
        groups: [],
        permission: 'admin'
      })
    })

    it('allows the user to sign in', async () => {
      await createUser(xo, userIds, {
        email: 'wayne@vates.fr',
        password: 'batman'
      })

      await getConnection({credentials: {
        email: 'wayne@vates.fr',
        password: 'batman'
      }})
    })
  })

  // -----------------------------------------------------------------

  describe('.delete()', () => {
    it('deletes an user', async () => {
      const userId = await createUser(xo, userIds, {
        email: 'wayne@vates.fr',
        password: 'batman'
      })

      await xo.call('user.delete', {
        id: userId
      })
      const user = await getUser(xo, userId)
      expect(user).to.be.undefined()
    })

    it('not allows an user to delete itself', async () => {
      await xo.call('user.delete', {id: xo.user.id}).then(
        () => {
          throw new Error('user.delete() should have thrown')
        },
        function (error) {
          expect(error.data).to.equal('an user cannot delete itself')
        }
      )
    })
  })

  // -----------------------------------------------------------------

  describe('.getAll()', () => {
    it('returns an array', async () => {
      const users = await xo.call('user.getAll')

      expect(users).to.be.an.array()
    })
  })

  // -----------------------------------------------------------------

  describe('.set()', () => {
    let userId
    beforeEach(async () => {
      userId = await createUser(xo, userIds, {
        email: 'wayne@vates.fr',
        password: 'batman'
      })
    })

    it('changes password of an existing user', async () => {
      await xo.call('user.set', {
        id: userId,
        password: 'alfred'
      })

      await getConnection({credentials: {
        email: 'wayne@vates.fr',
        password: 'alfred'
      }})
    })

    it('changes email adress and permission of an existing user', async () => {
      await xo.call('user.set', {
        id: userId,
        email: 'batman@vates.fr',
        permission: 'admin'
      })
      const user = await getUser(xo, userId)
      expect(user).to.be.eql({
        id: userId,
        email: 'batman@vates.fr',
        groups: [],
        permission: 'admin'
      })
    })
  })
})
