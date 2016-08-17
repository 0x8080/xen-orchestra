# Backups

This section is dedicated to any existing means to rollback or backup your VMs in Xen Orchestra.

There is different way to protect your VMs:

* [full backups](full_backups.md)
* [snapshots](rolling_snapshots.md)
* [delta backups](delta_backups.md) (best of both previous ones)
* [disaster recovery](disaster_recovery.md)
* [continuous replication](continuous_replication.md)

## Overview

This is the welcome panel on the backup view. It recaps all existing scheduled jobs. This is also where the backup logs are displayed.

![](https://xen-orchestra.com/blog/content/images/2015/11/backupoverview.png)

## Logs

All the scheduled operations (backup, snapshots and even DR) are displayed in the main backup view.

A successful backup task will be displayed in green, a faulty one in red. You can click on the arrow to see each entry detail:

![](https://xen-orchestra.com/blog/content/images/2015/11/logs_initial.png)

You also have a filter to search anything related to these logs.

## Email notifications

> This feature is available since 4.10

You can now **be notified by emails** after the backup task is finished (scheduled "full backup", "snapshots" or "disaster recovery").

To configure it, 2 steps in the plugin section (in "Settings"). First, add a list of recipient(s) for the notifications (in the plugin "backup-reports"):

![](https://xen-orchestra.com/blog/content/images/2015/11/backup-reports.png)

Then, parameter the SMTP server:

![](https://xen-orchestra.com/blog/content/images/2015/11/emailtransport.png)

That's it: your next scheduled jobs will be recap in a email. It will look like this:

```
Global status: Success

Start time: Fri Nov 27 2015 10:54:00 GMT+0100
End time: Fri Nov 27 2015 10:54:04 GMT+0100
Duration: a few seconds
Successful backed up VM number: 1
Failed backed up VM: 0
VM : miniVM

UUID: 4b85a038-6fd1-30f0-75c6-8440121d8faa
Status: Success
Start time: Fri Nov 27 2015 10:54:00 GMT+0100
End time: Fri Nov 27 2015 10:54:04 GMT+0100
Duration: a few seconds

```

## XMPP nofications

> This feature is available since 4.11

You can now **be notified via XMPP** after the backup task is finished (scheduled "full backup", "snapshots" or "disaster recovery").

To configure it, 2 steps in the plugin section (in "Settings"). First, add a list of recipient(s) for the notifications (in the plugin "backup-reports" and for XMPP):

![](https://xen-orchestra.com/blog/content/images/2015/12/reportsconfig.png)

Then, parameter the XMPP server:

![](https://xen-orchestra.com/blog/content/images/2015/12/xmppconfig.png)

That's it: your next scheduled jobs will be recap in a message:

![](https://xen-orchestra.com/blog/content/images/2015/12/xmpp.png)
