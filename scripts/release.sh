git checkout master

# patch to next version
standard-version

# commit
version=$(node -p "const { version } = require('./package.json'); version")
git add -A
standard-version --commit-all --release-as $version

# gh-pages
# git checkout gh-pages
# git merge master
# git checkout master

# push
git push --tags origin
git push --all origin

# publish
npm publish --registry=https://registry.npmjs.org/
