const fs = require("fs");
const glob = require('glob');
const path = require("path")

const defaultOptions = {
    mixManifest: 'public/mix-manifest.json',
    files: ['public/**/*.html'],
}


module.exports = class MixVersionReplace {

    constructor(options = {}) {
        this.options = this.mergeOptions(options, defaultOptions);

    }

    mergeOptions(options, defaults) {
        for (const key in defaults) {
            if (options.hasOwnProperty(key)) {
                defaults[key] = options[key];
            }
        }

        const mixPath = path.resolve(defaults.mixManifest);

        defaults.publicPath = path.dirname(mixPath);

        return defaults;
    }


    apply(compiler) {

        compiler.hooks.done.tap("MixVersionReplace", stats => {

            const {mixManifest, files} = this.options;

            if (!fs.existsSync(mixManifest)) {
                return console.log(`mixManifest "${mixManifest}" not exists `);
            }

            const data = fs.readFileSync(mixManifest, 'utf8');
            const assets = JSON.parse(data);

            files.forEach(filePattern => glob(filePattern, (err, foundFiles) => {

                if (err) {
                    return console.log(err);
                }

                foundFiles.forEach(file => this.replaceAssetsInFile(file, assets))

            }))

        });
    }

    replaceAssetsInFile(file, assets) {

        const {publicPath} = this.options;

        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            let found = false;
            let result = data;

            for (let [key, value] of Object.entries(assets)) {

                if (typeof key !== "string" || typeof value !== "string")
                    return console.log("mix-manifest file has been setup wrong or has unexpected data");

                if (key.charAt(0) === '/')
                    key = key.substring(1);

                const assetPath = publicPath + path.sep + key;

                if (!fs.existsSync(assetPath)) {
                    return console.log(`asset file "${assetPath}" not exists`);
                }

                if (value.charAt(0) === '/')
                    value = value.substring(1);

                const re = new RegExp(key + "\\?id=\\w+", "g");

                if (re.test(result)) {
                    result = result.replace(re, value);
                    found = true;
                }
            }

            if (found) {
                fs.writeFile(file, result, 'utf8', function (err) {
                    if (err)
                        return console.log(err);
                    console.log(file + " mix assets updated");
                });
            }
        });
    }
};
