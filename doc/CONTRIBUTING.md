# Contributing to Lightning Web Runtime Recipes

We want to encourage the developer community to contribute Lightning Web Runtime (LWR) recipes. This guide assumes that you have already met the requirements and installation instructions in the [getting started](./get_started.md) guide.

-   [Prerequisites](#prerequisites)
-   [Testing](#testing)
-   [Git Workflow](#git-workflow)

## Prerequisites

-   [Set up SSH access to Github][setup-github-ssh].
-   Make sure your editor supports [typescript](https://www.typescriptlang.org/).
-   [Configure your editor][eslint-integrations] to use our eslint configurations.

## Testing

The LWR recipes use the UI Testing Automation Model (UTAM) to validate your code. Before committing any changes, run [UTAM](https://pilot.utam.dev/guide/introduction) tests.

```bash
yarn test:e2e
```

For an example of a simple UTAM test using a Chrome driver, see the [utam-js-wdio-boilerplate](https://github.com/salesforce/utam-js-wdio-boilerplate) repo. The repo includes a simple boilerplate UTAM page object and an end-to-end test file. You can configure it to point to your own app instance.

For unit testing, we recommend using [Jest](https://github.com/salesforce/sfdx-lwc-jest). For performance testing, we recommend using [BestJS](https://bestjs.dev).

## Git Workflow

The process of submitting a pull request is fairly straightforward and generally follows the same pattern each time:

1. [Fork the lwr-recipes repo](#fork-the-lwr-repo)
2. [Create a feature branch](#create-a-feature-branch)
3. [Make your changes](#make-your-changes)
4. [Rebase](#rebase)
5. [Check your submission](#check-your-submission)
6. [Create a pull request](#create-a-pull-request)
7. [Update the pull request](#update-the-pull-request)
8. [Commit Message Guidelines](#commit)

### Fork the LWR repo

[Fork][fork-a-repo] the salesforce/lwr-recipes repo. Clone your fork in your local workspace and [configure][configuring-a-remote-for-a-fork] your remote repository settings.

```bash
git clone git@github.com:<YOUR-USERNAME>/lwr-recipes.git
cd lwr-recipes
git remote add upstream git@github.com:salesforce/lwr-recipes.git
```

### Create a feature branch

```bash
git checkout main
git pull origin main
git checkout -b <name-of-the-feature>
```

### Make your changes

1. Modify the files
1. Build, test, and lint by running `yarn ready` from the root directory.
1. Add a README to your recipe using this [template](./README_TEMPLATE.md).
1. Commit your code using the following command, using a descriptive commit message that follows our [Commit Message Guidelines](#commit):

```bash
git add <path/to/file/to/commit>
git commit
git push origin <name-of-the-feature>
```

The above commands will commit the files into your feature branch. You can keep
pushing new changes into the same branch until you are ready to create a pull
request.

### Rebase

Sometimes your feature branch will get stale with respect to the main branch,
and it will require a rebase. The following steps can help:

```bash
git checkout main
git pull upstream main
git checkout <name-of-the-feature>
git rebase upstream/main
```

_note: If no conflicts arise, these commands will ensure that your changes are applied on top of the main branch. Any conflicts will have to be manually resolved._

### Check your submission

#### Format your changes

```bash
yarn format
```

This command uses [Prettier](https://prettier.io/) to automatically format
your changes for code style consistency. Check in any changes output by this command.

#### Test and lint your changes

```bash
yarn ready
```

The above command runs the suite of [tests](#testing).

It also may display lint issues that are unrelated to your changes.
The recommended way to avoid lint issues is to [configure your
editor][eslint-integrations] to warn you in real time as you edit the file.

Fixing all existing lint issues is a tedious task so please pitch in by fixing
the ones related to the files you change!

#### Testing out a new version of LWR with lwr-recipes

You can link to a local version of LWR packages by running the following commands:

From your local LWR directory run:

```
yarn link-lwr
```

From your local lwr-recipes directory run:

```
  // Link LWR packages
  yarn link @lwrjs/diagnostics @lwrjs/label-module-provider @lwrjs/fs-asset-provider @lwrjs/app-service @lwrjs/asset-registry @lwrjs/client-modules @lwrjs/html-view-provider @lwrjs/markdown-view-provider @lwrjs/npm-module-provider @lwrjs/router @lwrjs/view-registry @lwrjs/base-template-engine @lwrjs/compiler @lwrjs/loader @lwrjs/module-bundler @lwrjs/nunjucks-view-provider @lwrjs/shared-utils @lwrjs/base-view-provider @lwrjs/core @lwrjs/lwc-module-provider @lwrjs/module-registry @lwrjs/resource-registry @lwrjs/server @lwrjs/types
```

If you are done testing with LWR from source, you can remove the links by running:

```
  // Unlink LWR packages
  yarn unlink @lwrjs/diagnostics @lwrjs/label-module-provider @lwrjs/fs-asset-provider @lwrjs/app-service @lwrjs/asset-registry @lwrjs/client-modules @lwrjs/html-view-provider @lwrjs/markdown-view-provider @lwrjs/npm-module-provider @lwrjs/router @lwrjs/view-registry @lwrjs/base-template-engine @lwrjs/compiler @lwrjs/loader @lwrjs/module-bundler @lwrjs/nunjucks-view-provider @lwrjs/shared-utils @lwrjs/base-view-provider @lwrjs/core @lwrjs/lwc-module-provider @lwrjs/module-registry @lwrjs/resource-registry @lwrjs/server @lwrjs/types --no-bail

  yarn install --force
```

### Create a pull request

If you've never created a pull request before, follow [these
instructions][creating-a-pull-request]. Pull request samples can be found [here](https://github.com/salesforce/lwr-recipes/pulls)

#### Pull Request Title

A pull request title follows [conventional commit](#commit) format.

```shell
ex:
commit-type(optional scope): commit description. ( NOTE: space between column and the message )

Types: build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test, proposal.
Scope: The scope should be the name of the npm package affected (core, compiler, module-registry, etc.)
```

### Update the pull request

```sh
git fetch origin
git rebase origin/${base_branch}

# If there were no merge conflicts in the rebase
git push origin ${feature_branch}

# If there was a merge conflict that was resolved
git push origin ${feature_branch} --force
```

_note: If more changes are needed as part of the pull request, just keep committing and pushing your feature branch as described above and the pull request will automatically update._

### <a name="commit"></a> Commit Message Conventions

Git commit messages have to be formatted according to a well defined set of rules. This leads to **more
readable messages** that are easy to follow when looking through the **project history**.

#### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

Footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/salesforce/lwr/pulls))

```
docs(changelog): update change log to beta.
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

#### Reverting a commit

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

#### Commit Type

Must be one of the following:

-   **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
-   **chore**: Other changes that don't modify src or test files
-   **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
-   **docs**: Documentation only changes
-   **feat**: A new feature
-   **fix**: A bug fix
-   **perf**: A code change that improves performance
-   **refactor**: A code change that neither fixes a bug nor adds a feature
-   **revert**: Reverts a previous commit
-   **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
-   **test**: Adding missing tests or correcting existing tests

#### Commit Scope

The scope should be the name of the npm package affected, as perceived by the person reading the changelog.

There are currently a few exceptions to the "use package name" rule:

-   **packaging**: used for changes that change the npm package layout in all of our packages, e.g. public path changes, package.json changes done to all packages, d.ts file/format changes, changes to bundles, etc.
-   **changelog**: used for updating the release notes in CHANGELOG.md
-   **lwr docs**: used for docs related changes within the lwr/docs directory of the repo
-   none/empty string: useful for `style`, `test` and `refactor` changes that are done across all packages (e.g. `style: add missing semicolons`)

#### Commit Subject

The subject contains a succinct description of the change:

-   use the imperative, present tense: "change" not "changed" nor "changes"
-   don't capitalize first letter
-   no dot (.) at the end

#### Commit Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

#### Commit Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

[fork-a-repo]: https://help.github.com/en/articles/fork-a-repo
[configuring-a-remote-for-a-fork]: https://help.github.com/en/articles/configuring-a-remote-for-a-fork
[setup-github-ssh]: https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/
[creating-a-pull-request]: https://help.github.com/articles/creating-a-pull-request/
[eslint-integrations]: http://eslint.org/docs/user-guide/integrations
