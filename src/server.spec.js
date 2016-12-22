/* eslint-env jest */

// Doc: https://github.com/moll/js-must/blob/master/doc/API.md#must
import expect from 'must'
import {getConfig, getMainConnection} from './util'
import {map, find, assign} from 'lodash'

// ===================================================================

describe('server', () => {
  let xo
  let serverIds = []
  let config

  beforeAll(async () => {
    ;[xo, config] = await Promise.all([
      getMainConnection(),
      getConfig()
    ])
  })

  afterEach(async () => {
    await Promise.all(map(
      serverIds,
      serverId => xo.call('server.remove', {id: serverId})
    ))
    serverIds = []
  })

  async function addServer (params) {
    const serverId = await xo.call('server.add', params)
    serverIds.push(serverId)
    return serverId
  }

  async function getAllServers () {
    return await xo.call('server.getAll')
  }

  async function getServer (id) {
    const servers = await getAllServers()
    return find(servers, {id: id})
  }

  // ==================================================================

  describe('.add()', () => {
    it('add a Xen server and return its id', async () => {
      const serverId = await addServer({
        host: 'xen1.example.org',
        username: 'root',
        password: 'password',
        autoConnect: false
      })

      const server = await getServer(serverId)
      expect(server.id).to.be.a.string()
      expect(server).to.be.eql({
        id: serverId,
        host: 'xen1.example.org',
        username: 'root',
        status: 'disconnected'
      })
    })

    it('does not add two servers with the same host', async () => {
      await addServer({
        host: 'xen1.example.org',
        username: 'root',
        password: 'password',
        autoConnect: false
      })

      await addServer({
        host: 'xen1.example.org',
        username: 'root',
        password: 'password',
        autoConnect: false
      }).then(
        () => {
          throw new Error('addServer() should have thrown')
        },
        function (error) {
          expect(error.message).to.be.equal('unknown error from the peer')
        })
    })

    it('set autoConnect true by default', async () => {
      const serverId = await addServer(config.xenServer1)
      const server = await getServer(serverId)

      expect(server.id).to.be.equal(serverId)
      expect(server.host).to.be.equal('192.168.100.3')
      expect(server.username).to.be.equal('root')
      expect(server.status).to.be.match(/^connect(?:ed|ing)$/)
    })
  })

  // -----------------------------------------------------------------

  describe('.remove()', () => {
    let serverId
    beforeEach(async () => {
      serverId = await addServer({
        host: 'xen1.example.org',
        username: 'root',
        password: 'password',
        autoConnect: false
      })
    })

    it('remove a Xen server', async () => {
      await xo.call('server.remove', {
        id: serverId
      })

      const server = await getServer(serverId)
      expect(server).to.be.undefined()
    })
  })

  // -----------------------------------------------------------------

  describe('.getAll()', () => {
    it('returns an array', async () => {
      const servers = await xo.call('server.getAll')

      expect(servers).to.be.an.array()
    })
  })

  // -----------------------------------------------------------------

  describe('.set()', () => {
    let serverId
    beforeEach(async () => {
      serverId = await addServer({
        host: 'xen1.example.org',
        username: 'root',
        password: 'password',
        autoConnect: false
      })
    })

    it('changes attributes of an existing server', async () => {
      await xo.call('server.set', {
        id: serverId,
        username: 'root2'
      })

      const server = await getServer(serverId)
      expect(server).to.be.eql({
        id: serverId,
        host: 'xen1.example.org',
        username: 'root2',
        status: 'disconnected'
      })
    })
  })

  // -----------------------------------------------------------------

  describe('.connect()', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5e3

    it('connects to a Xen server', async () => {
      const serverId = await addServer(assign(
        {autoConnect: false}, config.xenServer1
      ))

      await xo.call('server.connect', {
        id: serverId
      })

      const server = await getServer(serverId)
      expect(server).to.be.eql({
        id: serverId,
        host: '192.168.100.3',
        username: 'root',
        status: 'connected'
      })
    })

    it.skip('connect to a Xen server on a slave host', async () => {
      const serverId = await addServer(config.slaveServer)
      await xo.call('server.connect', {id: serverId})

      const server = await getServer(serverId)
      expect(server.status).to.be.equal('connected')
    })
  })

  // -----------------------------------------------------------------

  describe('.disconnect()', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5e3
    let serverId
    beforeEach(async () => {
      serverId = await addServer(assign(
        {autoConnect: false}, config.xenServer1
      ))
      await xo.call('server.connect', {
        id: serverId
      })
    })

    it('disconnects to a Xen server', async () => {
      await xo.call('server.disconnect', {
        id: serverId
      })

      const server = await getServer(serverId)
      expect(server).to.be.eql({
        id: serverId,
        host: '192.168.100.3',
        username: 'root',
        status: 'disconnected'
      })
    })
  })
})
