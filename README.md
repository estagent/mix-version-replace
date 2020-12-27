# 

Webpack plugin to update laravel-mix version ids on static files.

Useful for SPA frontend development with laravel-mix and without platform layout.
  


```bash
#replacement for laravel mix helper function outside of PHP 
<script src="{{ mix("js/app.js") }}"></script>


```

```bash
# install 
$ npm install  --save-dev mix-version-replace


# Usage 

#in webpack.mix.js

const MixVersionReplace = require('@iestagent/mix-version-replace');

mix.webpackConfig({
    ...
    plugins: [
        new MixVersionReplace({
            files: [
                'public/**/*.html',
                'public/**/*.php'
            ],
            mixManifest: 'public/mix-manifest.json',
        })
    ]
})
 
 
# in webpack.config.js

const MixVersionReplace = require('./lib/mix-version-replace');

module.exports = {
    ...
    plugins: [
        new MixVersionReplace({
            files: [
                'public/**/*.html',
                'public/**/*.php'
            ],
            mixManifest: 'public/mix-manifest.json',
        })
    ]
}
