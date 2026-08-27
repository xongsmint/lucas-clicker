export default function Register() {
    return (
        <form>
            <label>
                Primeiro nome: 
                <input
                    type="text"
                    placeholder="Seu nome aqui..."
                    maxLength={24}
                    onChange={(e) => setFirstname(e.target.value)}
                />
            </label>
            <label>
                Sobrenome:
                <input
                    type="text"
                    maxLength={32}
                    placeholder="Seu sobrenome aqui..."
                    onChange={(e) => setLastName(e.target.value)}
                />
            </label>
            <label>
                Nome de usuário *máx 16 caracteres e somente letras:
                <input
                    type="text"
                    maxLength={16}
                    placeholder="Digite seu username..."
                    onChange={(e) => {
                        const novoValor = e.target.value.replace(/[^a-zA-Z]/g, '')
                        setUsername(novoValor)
                    }}
                />
            </label>
            <label>
                Senha *máx 8 caracteres e somente letras e números:
                <input
                    type="text"
                    placeholder="Digite sua senha..."
                    maxLength={8}
                    onChange={(e) => {
                        const novoValor = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                        setPassword(novoValor)
                    }}
                />
            </label>
        </form>
    )
}