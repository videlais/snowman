# Snowman Documentation Site

This is the Jekyll-based documentation site for Snowman, a Twine story format.

## Development

To run the site locally:

```bash
bundle install
bundle exec jekyll serve
```

The site will be available at `http://localhost:4000`.

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` or `jekyll-testing` branches.

**Note**: The `_site` directory is not committed to git and is built automatically during deployment.

## Structure

- `/1/` - Documentation for Snowman v1.x
- `/2/` - Documentation for Snowman v2.x
- `/builds/` - Download links for different versions
- `/_layouts/` - Jekyll templates
- `/_includes/` - Reusable Jekyll components
- `/assets/` - CSS and other static assets

## Configuration

Site configuration is in `_config.yml`. The site uses:

- Jekyll static site generator
- Kramdown for markdown parsing
- Rouge for syntax highlighting
- Jekyll sitemap plugin for SEO