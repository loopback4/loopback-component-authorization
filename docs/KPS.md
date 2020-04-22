# KPS (KoLiBer Project Standard)

> KPS have five stages of defenitions:

1. Software Development
2. Clean Code and Refactoring
3. Project Structure
4. Git and Versioning
5. Document Files

---

## Software Development

> KPS is a way to make software development even more clear.
> It defines six stages for software development :

1. Planning
2. Cycling
3. Designing
4. Building
5. Testing
6. Deploying

---

### Planning (Planning and Requirement Analytics)

At the first level we should do these items :

1. Determine the **purpose** of the project and doc them into **README.md**
2. Defining **TODO** List and **Backlog** and doc them into **[trello.com](http://trello.com)**
    1. `Bug`
    2. `Feature`
    3. `ToDo`
    4. `Doing`
    5. `Done`

---

### Cycling (Life Cycling - SDLC)

At the second level we should do these items :

1. Determine the type of **SDLC** and doc them into **README.md**
2. Create **Sprints, Epics** at **[trello.com](http://trello.com)** or etc\*\* if SDLC was Agile using Scrum methodology.

---

### Designing (Architecturing and Designing - Code, Export)

At the third level we should do these items :

1. Backend

    1. API: `Loopback, Express`
        1. REST: `OpenAPI`
        2. gRPC: `OpenAPI`
        3. GraphQL: `Apollo Server`
    2. ERD: `ORM, ODM`
        1. Models, Relations: `Tools`

2. Frontend

    1. Wireframe (Low fidelity): `AdobeXD, Sketch`
    2. Prototype (High fidelity): `AdobeXD, Sketch`

Now it's time to **`code`**, write your API endpoints in project and **`export`** your Documentation using toolkits and libraries.

> If your project has UI, you can design your Wireframe and Prototype then export the `React` codes using **Sketch**

---

### Building (Coding using `Clean Code` - Logic)

At the fourth level we must define our application **`Logic`** and connect `API-Logic-ERD` or `UI-Logic` together based on `Clean Code` principles

---

### Testing (Unit Testing)

At the fifth level we must write our application `tests` and `mocks` and `CI/CD` pipeline using `Docker`, `GitlabCI/TravisCI/Jenkins`

---

### Deploying

At the sixth level we should do these items :

1. Creating **release** build of the project and **launch** them
2. **UAT** and analysing user comments

---

## Clean Code and Refactoring

> Some basic and important tips for clean coding

### Folder Structure

1. `docs`
2. `sources`
    1. `build/dist`
    2. `lib`
    3. `public`
    4. `private`
    5. `src`
    6. `test`
    7. `.gitignore`
3. `.gitignore`
4. `README.md`
5. `LICENSE.md`
6. `CHANGELOG.md`

#### Example

React Specific `src`:

1. `src`
    1. `app`
        1. `app.tsx`
        2. `app.context.ts`
        3. `app.service.ts`
        4. `app.props.ts`
        5. `app.styles.ts`
    2. `components`
        1. `my-component`
            1. `my-component.component.tsx`
            2. `my-component.service.ts`
            3. `my-component.props.ts`
            4. `my-component.styles.ts`
    3. `pages`
        1. `my-page`
            1. `my-page.page.tsx`
            2. `my-page.props.ts`
            3. `my-page.styles.ts`
2. `index.ts`

---

### File and Folder

1. File names must be **simple**, **readable**, **consistent**
2. **SQL** commands with Capital characters
3. Consistant **Indention** (space and {} and ...)
4. After finishing every file **refactor** it (check comment, method size, variable naming, SQL, ...)
5. **DRY** principle (Don't Repeat Yourself)

### Naming (File, Folder, Class, Method, Variable, Temp, ID, ...)

1. Names must be **simple**
2. Names must be **readable**
3. Names must be **one word per meat**
4. Names **should'nt be abbrevation** (ksto -> koliber standard orm)
5. Name -> File, Class, Variable, Temp, ID
6. Verb -> Method
7. Fixed naming style (**CamelCase -> AddNumber**, **UnderScore -> add_number**)
8. Variable Naming:
    - Naming by **goal** and **simple**
9. Temps Naming:
    1. **i, j, k, t** -> loops
    2. **cursor** -> important loops
    3. **result** -> method return value
    4. **item** -> foreach or iterator
10. ID Naming:
    - **{base component}\_{view type}[\_{description 1}\_{description 2}\_{description 3}]**

### Classes

1. No GOD class (simple and small)
2. Every class has one goal
3. Every class is a black box (private every unnecessary methods and getter/setter for variables)
4. Every class is a module (no dependency - inteact with other classes using interfaces)
5. No Dead code -> if don't need now the code remove it !
6. For using DBMS, Net, etc create wrapper class (implement logic - them implement low level code (net, file, ...) using other class)

### Methods

1. Methods should be small
2. Methods should have one goal (do only one work)
3. Methods should be blackbox (get params, return result - without side effect !) (side effects using getter, setters (var, file, memory, net, db, ...))
4. Not nested control structures (if{if{...}} -> if{} if{} if{})
5. If control conditions gets bigger (if(a & !c | d & f)) use a method for that (if(cond()){...})
6. Methods should'nt return error codes, throw errors is better !
7. Grouping codes in every method and comment every group
8. DRY principle (don't copy methods - move them into super class)

### Commenting

1. Don't comment bad code, rewrite it !
2. Don't comment big if conditions, move it to new method !
3. Comment descriptions
4. Comment tips
5. Comment alerts
6. Comment XDoc
7. Comment method code groups
8. Other comments are noises !
9. XDoc:
    - File Description
    - Class Description
    - Constructor Description
    - Methods Description
10. XDoc Descriptions:

    ```text
        /**
        * your comments
        * your comments
        * your comments
        * @ xdoc command
        * @ xdoc command
        * @ xdoc command
        */
    ```

### Coding

1. Create File
2. Create Class
3. Create abstract Methods
4. XDoc File
5. Implement Methods
6. Refactor File
7. Goto Next File

### Modularity

> The most important thing in conding stage is relying on **modularity**, so break every project into submodules like **app** (starting main), **ui**, **core**, **db**, **net**, ...
>
> > So at the `Designing` stage of out software development we should design our architecture and **break into layers** (modules - ui, core, net, db, ...)

-   Every module has it's own dependencies (`lib`)
-   Every module has it's own target (UI, Core, DB, User Management, Analyze, Network, ....)
-   Every project has some modules and an `app` module that is the start point of project and create other modules and connects them together
-   Modularity using `modules` path and **multi subprojects** per project (configing CMake or Gradle or Rebar or NPM or etc)

---

## Git and Versioning

> For configuring git we have these level

### SSH Configs

#### SSH Key

1. Generate a `RSA` public/private key pair

```bash
ssh-keygen -t rsa
```

2. Add your public key (`~/.ssh/id_rsa.pub`) to the gitlab `SSH Keys` in your `Account/Settings`

---

### Git Install

```bash
sudo apt install git git-flow

```

---

### Git Project Configs

```bash
git clone {git repository}
cd {git repository}
git flow init
git clone git@gitlab.com:ckoliber/KPS.git

git config user.name "{your name}"
git config user.email "{your email}"
git config core.editor code
git config core.autocrlf input
```

---

### MKdocs

> For configuring mkdocs we have three level

**installing**:

```bash
sudo apt install python3-pip
sudo pip3 install mkdocs mkdocs-material

cd {project name}
mkdocs new docs
```

---

### Git Usage

> This level contains git using level in this level that is a loop until end of project we will use git in our project for version controlling

#### Stage, Commit (To local repository)

> At every quick editing or coding of our project we should save our changes or commit theme
>
> > For example every 10 min we should commit at least one stage to our local repository

#### Push (To remote repository)

> At end of every day we should save our codes in a stable repository such as `gitlab.com` remote repository

#### Pull (From remote repository)

> When ever we coding on two different system or need to rebase our codes from remote repository or etc, we should `pull` and `stage` and `commit` from and to remote and local repositories

#### Commit Messages (Conventional Commits)

> We will use [Conventional Commits Standard](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) for our commit messages for `Human Readability` and `Robot Readability`

```code
<type>[(scope)]: <description>

1. feat     =>  feature
2. fix      =>  bug fix
3. docs     =>  change documents
4. style    =>  linting, formatting
5. build    =>  build, dependency, library
6. test     =>  add, check tests
7. clean    =>  clean project source
8. refactor =>  refactor project source

feat: allow provided config object to extend other configs

docs: correct spelling of CHANGELOG

feat(lang): added polish language

fix: minor typos in code
```

![Conventional Commits](https://media.cheatography.com/storage/thumb/albelop_conventional-commits.750.jpg?last=1525346945)

#### Branching (Git Flow)

> Managing branches is an important part of group/self working, creating standard branches and merging theme based on standard rules
> We use `git-flow` automation toolkit for automating our `Git Flow` and branching management
> You can see more informations about the standard `git-flow` branches and commands to manage `develop`, `hotfix/`, `feature/`, `release/`, `bugfix/`, `master` branches in [this link](https://jeffkreeftmeijer.com/git-flow/) or [this cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)

![Git Flow](https://nvie.com/img/git-model@2x.png)

#### Tagging (Versioning) (Git Flow)

> Managing tags is an important part of releasing project, at the `release` branch we will tag our code versions based on these rules, then we will merge it into `master` branch

> We will use `git-flow` but for versioning our software we use `X.Y.Z` standard

##### X.Y.Z - Major.Minor.Patch

###### X (Major)

> Shows the big release number, not compatible with old versions

###### Y (Minor)

> Shows the `features` that added to this `X` version

###### Z (Patch)

> Shows the `bugs` that fixed from this `X` version

###### Example

-   **0.1.0** (start version)
-   **1.2.1**
-   **2.2.0**
-   **0.5.34**

---

## Document Files

### README.md

1. Project Name
2. Project Description
3. Project Owner
4. Project Author
5. Project Developers
6. Project Start date
7. Project Question
8. Project Goal
9. Project License
10. Project Languages and Frameworks
11. Project SDLC
12. Project links (vivifyscrum, gitlab, npm, etc)

### Summary: (README.md -> Trello -> API(Code-Tool) -> ERD(Code-Tool) -> UI(Code-Tool) -> Logic(Code) -> Test)

1. **Init**: Git
2. **Plan**: README.md -> Trello
3. **Cycle**: README.md -> Trello(release backlogs, sprints, epics)
4. **Design**: API/Code-Tool -> ERD/Code-Tool -> UI/Code-Tool
5. **Build**: Logic/Clean Code
6. **Test**: Unit Testing
7. **Deploy**: Comments (UAT)

### Tips

1. MVP launch
2. quick releases
3. `public`, `src`, `include`, `bin`, `build`, `test` sources folders

```code
--------|-|-|-|-|-|
```
