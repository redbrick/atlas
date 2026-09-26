---
title: Linux Shell Access
eleventyNavigation:
  key: services
  order: 2
---

# Linux Shell Access

Redbrick provides members with access to Linux login servers for programming, development, hosting, and general command-line use.

The current login servers are:

```text
europa.redbrick.dcu.ie
```

```text
callisto.redbrick.dcu.ie
```

SSH access uses **public-key authentication**. Password-only SSH login is not supported.

## Set up SSH

### 1. Check for an existing SSH key

On macOS or Linux:

```bash
ls ~/.ssh
```

On Windows PowerShell:

```powershell
Get-ChildItem $env:USERPROFILE\.ssh
```

If you already have:

```text
id_ed25519
id_ed25519.pub
```

you can use that key and skip to the next step.

If not, generate one:

```bash
ssh-keygen -t ed25519
```

Press **Enter** to use the default location.

Your public key will normally be stored at:

```text
~/.ssh/id_ed25519.pub
```

> Keep the private key (`id_ed25519`) private. Only the `.pub` file should be shared.

### 2. Copy your public key

On macOS or Linux:

```bash
cat ~/.ssh/id_ed25519.pub
```

On Windows PowerShell:

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

Your key should look similar to:

```text
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA... user@computer
```

Copy the entire line.

## Add your key to Redbrick

Redbrick uses Blockbot in Discord to manage SSH public keys.

For new Redbrick accounts, your Discord account should already be linked automatically.

If it is not linked, use:

```text
/account link discord <rb username>
```

Then add your public key with:

```text
/account pubkey
```

Paste your complete public key into the **Key** field and submit the command.

Keys added through Blockbot work alongside any existing keys in your account's `authorized_keys` file.

## Connect

Replace `YOUR_USERNAME` with your Redbrick username.

### Europa

```bash
ssh YOUR_USERNAME@europa.redbrick.dcu.ie
```

### Callisto

```bash
ssh YOUR_USERNAME@callisto.redbrick.dcu.ie
```

You can use either login server.

The first time you connect, SSH may ask you to confirm the server's host key.

```text
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

If you are connecting to the correct Redbrick hostname, enter:

```text
yes
```

If you are unsure about the fingerprint being shown, ask the Redbrick admins before accepting it.

## Optional SSH config

If you connect regularly, you can add Redbrick to:

```text
~/.ssh/config
```

For example:

```sshconfig
Host redbrick
    HostName europa.redbrick.dcu.ie
    User YOUR_USERNAME
    IdentityFile ~/.ssh/id_ed25519

Host redbrick-callisto
    HostName callisto.redbrick.dcu.ie
    User YOUR_USERNAME
    IdentityFile ~/.ssh/id_ed25519
```

You can then connect with:

```bash
ssh redbrick
```

or:

```bash
ssh redbrick-callisto
```

## Troubleshooting

### Permission denied

If you see:

```text
Permission denied (publickey)
```

make sure the public key you submitted with:

```text
/account pubkey
```

matches your local key:

```bash
cat ~/.ssh/id_ed25519.pub
```

You can also explicitly select your private key:

```bash
ssh -i ~/.ssh/id_ed25519 YOUR_USERNAME@europa.redbrick.dcu.ie
```

### Check which key SSH is using

Run:

```bash
ssh -v YOUR_USERNAME@europa.redbrick.dcu.ie
```

Look for:

```text
Offering public key:
```

This shows which SSH keys your computer is trying.

### Discord account is not linked

Link it manually with:

```text
/account link discord <rb username>
```

If the command still does not work, contact the Redbrick admins.

### Host key warning

If you see:

```text
WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
```

do not ignore it automatically.

Check with the Redbrick admins before accepting a changed host key.

## Keep your key secure

Never share your private SSH key.

The public key is safe to provide to Redbrick:

```text
id_ed25519.pub
```

The private key must stay on your computer:

```text
id_ed25519
```

Never paste a key beginning with:

```text
-----BEGIN OPENSSH PRIVATE KEY-----
```

into Discord or anywhere public.

## Need help?

If you cannot connect, contact the Redbrick admins through Discord.

When asking for help, the output from:

```bash
ssh -v YOUR_USERNAME@europa.redbrick.dcu.ie
```

can be useful for diagnosing the problem.

Never include your private key when sharing debugging information.

See the **[Links](/links)** page for ways to get in touch.