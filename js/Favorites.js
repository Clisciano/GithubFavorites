import { GithubUser } from "./GithubUser.js"
// classe que vai conter a lógica dos dados
// como  os dados serão estruturados

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

        // GithubUser.search('Clisciano').then(user => console.log(user))
    }

    load() {
               
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
       localStorage.setItem('@github-favorites:', JSON.stringify(this.entries) ) 
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username)
            if(userExists) {
                throw new Error('usuario já cadastrado!')
            }
            const user = await GithubUser.search(username)
            if (user.login === undefined) {
                throw new Error('usuario não encontrado!')
            }            
            
            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        }
        catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
        this.entries = filteredEntries
        this.update()
        this.save()
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
            row.querySelector('.users a').href = `https://github.com/${user.login}`
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