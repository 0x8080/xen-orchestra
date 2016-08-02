# XOA

The fastest way to install Xen Orchestra is to use our Appliance. You can [download it from here](https://xen-orchestra.com/) (fill the form and click on "Try Now"). Basically, it's a Debian VM with:

* Xen Orchestra already installed (nothing to do!)
* Tested with all bundled dependencies (QA)
* The web updater (update in one click)
* Support

## Specifications

By default, this VM is configured with:

* 2 vCPUs
* 2GB or RAM
* 8GB of disk

For usage on huge infrastructure (more than 500+ VMs), feel free to raise the RAM.

## Deployment

Once you've got the XVA file, you can import it with `xe vm-import filename=xoa_version_number.xva` or via XenCenter.

After the VM is imported, you just need to start it with a `xe vm-start vm=XOA` or with XenCenter.

### Network configuration

XOA is in **DHCP** by default, so if you need to configure the IP, you need to edit `/etc/network/interfaces` as explained in the [Debian documentation](https://wiki.debian.org/NetworkConfiguration#Configuring_the_interface_manually). You can access the VM console through XenCenter or using VNC through a SSH tunnel.

Xen Orchestra is now accessible in your browser on ` http://your-vm-ip` or in HTTPS on the same URL.

> If you are using a static IP configuration, take care of the `/etc/resolv.conf` file to fit your DNS settings.

### Downloading with wget

If you want to download your XOA with `wget`, you need to provide your cookie generated on https://xen-orchestra.com. See [this documentation](http://askubuntu.com/questions/161778/how-do-i-use-wget-curl-to-download-from-a-site-i-am-logged-into) for further details.

## Default admin account

Default user is **admin@admin.net** with **admin** as a password.

> **SECURITY NOTICE**: create a new admin account and remove this one.

In any case, if you lose your password, you can reset the database and get the default credentials back.

## SSH credentials

By default, system/SSH user and password are **root**/**xoa**. Be smart and change the root password as soon as possible!

## Timezone

You can verify if your time is correctly set with the `date` command. To set XOA to your current timezone, use `dpkg-reconfigure tzdata`.

## Restart the service

You can restart Xen Orchestra by going in XOA on SSH (or console) and type `systemctl restart xo-server.service`.

To check the status of `xo-server`, use `systemctl status xo-server.service`, it should display something like that:

```
xo-server.service - XO Server
   Loaded: loaded (/etc/systemd/system/xo-server.service; enabled)
   Active: active (running) since Thu 2014-08-14 10:59:46 BST; 21min ago
 Main PID: 394 (node)
   CGroup: /system.slice/xo-server.service
           └─394 node /usr/local/bin/xo-server

Aug 14 10:59:46 xoa systemd[1]: Starting XO Server...
Aug 14 10:59:46 xoa systemd[1]: Started XO Server.
Aug 14 10:59:48 xoa xo-server[394]: WebServer listening on http://0.0.0.0:80
```
