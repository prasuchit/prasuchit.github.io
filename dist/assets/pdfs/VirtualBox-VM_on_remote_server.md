# Steps to install, organize and ssh into a VM on a remote Linux server.

## Written by Prasanth Suresh (ps32611@uga.edu) on 06/28/2024.


In this tutorial, I'm going to use Ubuntu 20.04 as a running example. Both the server OS and the VM OS for this example are Ubuntu 20.04, however, the basic concepts apply analogously to all Linux platforms.

To get started, first make sure you are able to access your remote server through ssh. If you are unfamiliar with this, there are a lot of tutorials online walking you though ssh-server installation and setup like [this one](https://gcore.com/learning/how-to-use-ssh-secure-remote-access-ubuntu/).

    ssh USERNAME@SERVER-IP

    PASSWORD

Now you should see your username@servername, this means you are remotely logged into your account and ready to get started with the VM setup. Make sure you have sudo access if not root access since we will need to modify and install many things.

### Installing VirtualBox, Vagrant, and the VM:

This is a straightforward step and can easily be completed by following [this tutorial](https://linuxize.com/post/how-to-install-vagrant-on-ubuntu-20-04/#installing-vagrant-on-ubuntu).

Once you have VirtualBox and Vagrant installed:

    mkdir ~/Ubuntu20 ; cd ~/Ubuntu20

    vagrant init ubuntu/focal64

### Configuring the VM:

Now if you run ls on the terminal, you should see a file by the name Vagrantfile. Open it using your favorite text editor like vim or nano and replace it with these lines:

    Vagrant.configure("2") do |config|
        # The most common configuration options are documented and commented below.
        # For a complete reference, please see the online documentation at
        # https://docs.vagrantup.com.

        # Every Vagrant development environment requires a box. You can search for
        # boxes at https://vagrantcloud.com/search.
        config.vm.box = "ubuntu/focal64"
        config.vm.network "forwarded_port", guest: 22, host: 2200, host_ip: "0.0.0.0", id:"ssh", auto_correct: true
        config.ssh.username = "vagrant"
        config.ssh.password = "vagrant"
        config.ssh.keys_only = false
        config.ssh.insert_key = false
        config.ssh.forward_agent = true
        config.disksize.size = '1000GB'
        config.vm.provider "virtualbox" do |vb|
            vb.name = "ubuntu20"
            # Customize the amount of memory on the VM, currently 100GB given:
            vb.memory = "102400"
            vb.cpus = 8
            vb.customize ["modifyvm", :id, "--vram", "256"]
        end
    end

As you can notice, the config.vm.network line mentions the network settings for remote access through ssh (here the guest is the server and the host is the VM). Meanwhile, the config.ssh lines mention settings specific to ssh.

The config.ssh.username and password lines help to ssh using password authentication and config.ssh.keys_only = false allows usage of keys stored in ssh-agent in addition to Vagrant-provided SSH private keys. 

The config.ssh.insert_key if set to true, allows Vagrant to automatically insert a keypair to use for SSH, replacing Vagrant's default insecure key which **we don't want**.

The config.ssh.forward_agent allows for port forwarding. In case you are new to networking concepts, every device connected to a network needs an IP address and a port number. The IP address is like a street address, while the port number is like an apartment number. Through port forwarding, the server knows that when someone connects to its IP on this specific port number, they have to be redirected to this specific VM.

Feel free to modify config.disksize.size with a value appropriate for your case. This line allocates physical disk storage space for the VM.

The lines vb.memory = "102400", vb.cpus = 8, and vb.customize ["modifyvm", :id, "--vram", "256"] specify the RAM, number of CPU cores and the Video RAM (VRAM) for GPU usage respectively. Due to a [VirtualBox limitation](https://askubuntu.com/a/943140) the max VRAM you can allocate to any one VM is 256MB (which sucks!).

Next, we need to install the following package to allow Vagrant to use the disksize setting we've mentioned above:

    cd ~/Ubuntu20

    vagrant plugin install vagrant-disksize

Now we have the basic settings ready to go. If you face an error with password authentication while starting the VM for the first time, comment out the config.ssh.username and config.ssh.password lines and try again:

    cd ~/Ubuntu20

    vagrant up

Note that you can use "vagrant halt" to shutdown the VM and "vagrant reload" to reboot the VM. Based on my experience, "vagrant reload" doesn't always reload the VM fully to reflect all changes, so I prefer "vagrant halt ; vagrant up". Other Vagrant commands are available on [this cheatsheet](https://gist.github.com/wpscholar/a49594e2e2b918f4d0c4).

### Inside the VM:

You should now be seeing the default user of vagrant@VM-Name on your terminal. Good job on making it so far! 

Now use:

    sudo apt update -y && sudo apt upgrade -y && sudo apt dist-upgrade -y && sudo apt install libgl1 -y

The libgl package helps with graphics dependent packages like OpenCV. Now open this ssh settings file with your favorite editor:

    sudo nano /etc/ssh/sshd_config

Now comment out:

    # Include /etc/ssh/sshd_config.d/*.conf

Uncomment these lines:

    PubkeyAuthentication yes

    PasswordAuthentication yes

    AllowTcpForwarding yes
    
    X11Forwarding yes 

    TCPKeepAlive yes

You're all good to go now. Reboot the VM once:

    vagrant halt ; vagrant up

Reboot the network connection:

    sudo systemctl restart systemd-networkd.service

Now from another machine, run:

    ssh -p 2200 vagrant@SERVER-IP

If you fail while setting up the VM or had to recreate the VM for some reason, the port might be unavailable so you could use a different port like 2222 and restart the VM.

Another potential problem could be that the ssh keygen on the machine you're using to remotely login to the VM may need to be reset. You can do that using:

    ssh-keygen -f "/home/USERNAME/.ssh/known_hosts" -R "[SERVER-IP]:2200"
    sudo systemctl restart systemd-networkd.service

Make sure to change USERNAME and SERVER-IP appropriately. All done! Three cheers!!
