'use strict'

angular.module('xoWebApp')
  .controller 'SettingsCtrl', ($scope, xoApi) ->
    $scope.permissions = [
      {
        label: 'None'
        value: 'none'
      }
      {
        label: 'Read'
        value: 'read'
      }
      {
        label: 'Write'
        value: 'write'
      }
      {
        label: 'Admin'
        value: 'admin'
      }
    ]

    # Users
    do ->
      # Fetches them.
      xoApi.call('user.getAll').then (users) ->
        $scope.users = users

      # Which ones are selected?
      selected = $scope.selectedUsers = {}

      # Saves any modifications.
      $scope.saveUsers = ->
        users = $scope.users

        # This will be the new list of users with those marked to
        # delete removed.
        updateUsers = []

        for user in users
          {id} = user
          if selected[id]
            delete selected[id]
            xoApi.call 'user.delete', {id}
          else
            # TODO: only update users which have been modified.
            xoApi.call 'user.set', user
            updateUsers.push user

        $scope.users = updateUsers

        # TODO: Retrieves an up to date users list from the server.

    # Servers
    do ->
      # Fetches them.
      xoApi.call('server.getAll').then (servers) ->
        $scope.servers = servers

      # Which ones are selected?
      selected = $scope.selectedServers = {}

      # Saves any modifications.
      $scope.saveServers = ->
        servers = $scope.servers

        # This will be the new list of servers with those marked to
        # delete removed.
        updateServers = []

        for server in servers
          {id} = server
          if selected[id]
            delete selected[id]
            xoApi.call 'server.remove', {id}
          else
            # TODO: only update servers which have been modified.
            xoApi.call 'server.set', server
            updateServers.push server

        $scope.servers = updateServers

        # TODO: Retrieves an up to date servers list from the server.
