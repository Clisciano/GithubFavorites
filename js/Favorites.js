export class GithubUser {
    static async search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        const data = await fetch(endpoint)
        const { login, name, public_repos, followers } = await data.json()
        return ({
            login,
            name,
            public_repos,
            followers
        })
    }
}


// classe que vai conter a lógica dos dados
// como  os dados serão estruturados

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

        // GithubUser.search('Clisciano').then(user => console.log(user))
    }

    load() {
        // this.entries = []
        // this.entries = [
        //     {
        //         login: 'maykbrito',
        //         name: 'Mayk Brito',
        //         public_repos: '70',
        //         followers: '120000'
        //     },
        //     {
        //         login: 'clisciano',
        //         name: 'Clisciano Souza',
        //         public_repos: '26',
        //         followers: '1200'
        //     }
        // ]
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    }

    async add(username) {
        try {
            const user = await GithubUser.search(username)
            if (user.login === undefined) {
                throw new Error('usuario não encontrado!')
            }
        }
        catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    }
}

// classe que vai criar a visualização e eventos do html
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach((user) => {
            const row = this.createRow()
            row.querySelector('.users img').src = `https://github.com/${user.login}.png`
            row.querySelector('.users img').alt = `Imagem de ${user.name}.png`
            row.querySelector('.users p').textContent = user.name
            row.querySelector('.users span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.follwers').textContent = user.followers
            row.querySelector('.remove').onclick = () => {
                const isConfirm = confirm('Tem certeza que deseja excluir?')
                if (isConfirm) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)

        })

    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <tr>
            <td class="users">
                <img src="http://github.com/clisciano.png" alt="Imagem do clisciano">
                <a href="http://github.com/clisciano" target="_blank">
                    <p>Clisciano</p>
                    <span>clisciano</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="follwers">
                9589
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>
        </tr>
        `
        return tr
    }

    removeAllTr() {

        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}