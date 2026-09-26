---
title: Personal Webspace
eleventyNavigation:
  key: services
  order: 5
---

# Personal Webspace

Every Redbrick member gets personal webspace that can be used to host a website, portfolio, documentation, or other web projects.

Your site is available at:

```text
https://YOUR_USERNAME.redbrick.dcu.ie
```

Replace `YOUR_USERNAME` with your Redbrick username.

## Upload your website

Your website files are stored in the `public_html` directory in your Redbrick account.

Connect to one of the Redbrick login servers using SSH:

```bash
ssh YOUR_USERNAME@europa.redbrick.dcu.ie
```

or:

```bash
ssh YOUR_USERNAME@callisto.redbrick.dcu.ie
```

See the **[Linux Shell Access](/services/ssh)** page if you have not configured SSH yet.

Once connected, move into your webspace:

```bash
cd ~/public_html
```

Your main page should normally be named:

```text
index.html
```

For example:

```text
public_html/
├── index.html
├── style.css
├── about.html
└── images/
```

Anything inside `public_html` can be served through your Redbrick webspace.

## Upload files with SFTP

If you would rather use a graphical application, you can upload files using an SFTP client such as [WinSCP](https://winscp.net/) or [FileZilla](https://filezilla-project.org/).

Use one of the Redbrick login servers:

```text
Host: europa.redbrick.dcu.ie
Port: 22
Protocol: SFTP
Username: YOUR_USERNAME
```

or:

```text
Host: callisto.redbrick.dcu.ie
Port: 22
Protocol: SFTP
Username: YOUR_USERNAME
```

Authenticate using the same SSH key configured for your Redbrick account.

After connecting, upload your website into:

```text
public_html
```

## File permissions

The web server must be able to read your website files.

Set the `public_html` directory permissions with:

```bash
chmod 755 ~/public_html
```

For normal website files, use:

```bash
chmod 644 ~/public_html/*
```

If your website contains subdirectories, make sure those directories are also readable and executable by the web server.

For example:

```bash
find ~/public_html -type d -exec chmod 755 {} \;
```

and:

```bash
find ~/public_html -type f -exec chmod 644 {} \;
```

## View your site

Once your files are uploaded, open:

```text
https://YOUR_USERNAME.redbrick.dcu.ie
```

Changes to files in `public_html` should appear on your website automatically.

## Common problems

### 403 Forbidden

A `403 Forbidden` error usually means the web server cannot read your files or directories.

Check the permissions:

```bash
chmod 755 ~/public_html
```

and:

```bash
find ~/public_html -type d -exec chmod 755 {} \;
find ~/public_html -type f -exec chmod 644 {} \;
```

### 404 Not Found

Make sure your homepage exists at:

```text
~/public_html/index.html
```

and not inside another directory such as:

```text
~/public_html/my-site/index.html
```

unless you intentionally want the site to be available at `/my-site/`.

## Need help?

If your webspace is not working or you need help uploading your site, contact Redbrick through Discord.

See the **[Links](/links)** page for ways to get in touch.